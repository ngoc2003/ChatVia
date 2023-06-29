import { Box, BoxProps, CircularProgress, Typography } from "@mui/material";
import { theme } from "@theme";
import React, { useState, useEffect, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import CreateConversationModal from "@containers/Modals/CreateConversation";
import { useLazyGetConversationListByUserIdQuery } from "@stores/services/conversation";
import { ConversationStatus, ConversationType } from "@typing/common";
import { ArrivalMessageType, FriendInformationType } from "@pages";
import useCallbackDebounce from "@hooks/useCallbackDebounce";
import ConversationList from "./ConversationList";
import { useTranslation } from "next-i18next";
import { handleSortConversations } from "@utils/conversations";
import LeftSideContainer from "@containers/layouts/LeftSideContainer";

interface MenuChatProps extends BoxProps {
  tabActive: string;
  arrivalMessage: ArrivalMessageType | null;
  setCurrentConversation: React.Dispatch<
    React.SetStateAction<ConversationType | null>
  >;
  setFriendInformation: React.Dispatch<
    React.SetStateAction<FriendInformationType | null>
  >;
  currentConversationId: string;
  conversations: ConversationType[];
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[]>>;
}

const MenuChat: React.FC<MenuChatProps> = ({
  tabActive,
  arrivalMessage,
  setCurrentConversation,
  setFriendInformation,
  currentConversationId,
  conversations,
  setConversations,
  ...props
}: MenuChatProps) => {
  const { t } = useTranslation();
  const user = useSelector((state: AppState) => state.auth);
  const { darkMode } = useSelector((state: AppState) => state.darkMode);

  const [searchValue, setSearchValue] = useState<string>("");
  const [isOpenAddConversationModal, setIsOpenAddConversationModal] =
    useState<boolean>(false);

  const [getConversation, { isFetching: isGetConversationFetching }] =
    useLazyGetConversationListByUserIdQuery();

  const handleFetchConversation = useCallback(() => {
    if (user?.id) {
      getConversation({
        userId: user.id,
        query: { searchValue, status: ConversationStatus.Accept },
      })
        .unwrap()
        .then((response) => setConversations(response));
    }
  }, [getConversation, searchValue, setConversations, user.id]);

  const handleOpenAddConversationModal = () => {
    setIsOpenAddConversationModal(true);
  };

  const handleCloseAddConversationModal = () => {
    setIsOpenAddConversationModal(false);
  };

  const handleChangeText = useCallbackDebounce((e) => {
    setSearchValue(e.target.value);
  });

  useEffect(() => {
    handleFetchConversation();
  }, [handleFetchConversation, tabActive]);

  useEffect(() => {
    if (arrivalMessage) {
      setConversations(
        handleSortConversations(
          conversations.map((conv) => {
            if (conv._id !== arrivalMessage.conversationId) {
              return conv;
            }
            return {
              ...conv,
              lastMessage: {
                id: arrivalMessage?.sender,
                text: arrivalMessage?.text,
                createdAt: arrivalMessage?.createdAt,
              },
            };
          })
        )
      );
    }

    if (
      arrivalMessage &&
      conversations?.some(
        (item) =>
          item._id !== arrivalMessage.conversationId &&
          arrivalMessage.conversationStatus !== ConversationStatus.Pending
      )
    ) {
      handleFetchConversation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrivalMessage?.createdAt]);

  useEffect(() => {
    if (conversations?.length) {
      setConversations(handleSortConversations(conversations));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations?.length]);

  return (
    <LeftSideContainer
      title="Chat"
      icon={<AddIcon color="primary" />}
      iconInput={<SearchIcon fontSize="small" />}
      onClickIcon={handleOpenAddConversationModal}
      onChangeInput={handleChangeText}
      {...props}
    >
      <CreateConversationModal
        open={isOpenAddConversationModal}
        setConversation={setConversations}
        onClose={handleCloseAddConversationModal}
      />
      <Typography
        variant="subtitle2"
        fontWeight={600}
        my={3}
        color={darkMode ? theme.palette.common.white : undefined}
      >
        {t("title.recent")}
      </Typography>
      {isGetConversationFetching ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          width="100%"
          flex={1}
        >
          <CircularProgress size={20} />
        </Box>
      ) : (
        <ConversationList
          conversations={conversations}
          setCurrentConversation={setCurrentConversation}
          setFriendInformation={setFriendInformation}
          currentConversationId={currentConversationId}
        />
      )}
    </LeftSideContainer>
  );
};

export default MenuChat;
