import {
  Box,
  BoxProps,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import { theme } from "@theme";
import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import MSTextField from "@components/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import CreateConversationModal from "@containers/Modals/CreateConversation";
import useSocket from "@hooks/useSocket";
import { useLazyGetConversationListByUserIdQuery } from "@stores/services/conversation";
import { ConversationType, MessageType } from "@typing/common";
import { ArrivalMessageType, FriendInformationType } from "@pages";
import useCallbackDebounce from "@hooks/useCallbackDebounce";
import ConversationList from "./ConversationList";
import { useTranslation } from "next-i18next";

interface MenuChatProps extends BoxProps {
  messages: MessageType[];
  arrivalMessage: ArrivalMessageType;
  arrivalConversation: ConversationType;
  setCurrentConversation: React.Dispatch<
    React.SetStateAction<ConversationType | null>
  >;
  setFriendInformation: React.Dispatch<
    React.SetStateAction<FriendInformationType>
  >;
  currentConversationId: string;
}

const MenuChat: React.FC<MenuChatProps> = ({
  messages,
  arrivalMessage,
  setCurrentConversation,
  setFriendInformation,
  currentConversationId,
  arrivalConversation,
  ...props
}: MenuChatProps) => {
  const { t } = useTranslation();
  const socket = useSocket();
  const user = useSelector((state: AppState) => state.auth);
  const { darkMode } = useSelector((state: AppState) => state.darkMode);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isOpenAddConversationModal, setIsOpenAddConversationModal] =
    useState<boolean>(false);

  const [getConversation, { isFetching: isGetConversationFetching }] =
    useLazyGetConversationListByUserIdQuery();

  const handleOpenAddConversationModal = () => {
    setIsOpenAddConversationModal(true);
  };

  const handleCloseAddConversationModal = () => {
    setIsOpenAddConversationModal(false);
  };

  const handleChangeText = useCallbackDebounce((e) => {
    setSearchValue(e.target.value);
  });

  console.log(darkMode);

  useEffect(() => {
    if (arrivalMessage) {
      const handleUpdateMessage = () => {
        setConversations(
          conversations.map((conv) => {
            if (conv._id !== currentConversationId) {
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
        );
      };

      socket.current.on("getMessage", () => {
        handleUpdateMessage();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrivalMessage?.text]);

  useEffect(() => {
    if (messages.length) {
      const lastMessages = messages[messages.length - 1];

      if (!currentConversationId || !lastMessages) {
        return;
      }

      setConversations(
        conversations.map((conv) => {
          if (conv._id !== currentConversationId) {
            return conv;
          }
          return {
            ...conv,
            lastMessage: {
              id: lastMessages?.sender,
              text: lastMessages?.text,
              createdAt: lastMessages?.createdAt,
            },
          };
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  useEffect(() => {
    if (user.id) {
      getConversation({ userId: user.id, query: { searchValue } })
        .unwrap()
        .then((response) => setConversations(response));
    }
  }, [setConversations, user.id, arrivalMessage, getConversation, searchValue]);

  useEffect(() => {
    arrivalConversation &&
      setConversations((prev) => [arrivalConversation, ...prev]);
  }, [arrivalConversation]);

  return (
    <Box
      {...props}
      bgcolor={
        darkMode ? theme.palette.darkTheme.main : theme.palette.primary.light
      }
      sx={{ overflowY: "hidden" }}
      p={3}
      display="flex"
      flexDirection="column"
    >
      <CreateConversationModal
        open={isOpenAddConversationModal}
        setConversation={setConversations}
        onClose={handleCloseAddConversationModal}
      />
      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          variant="h5"
          fontWeight={600}
          color={darkMode ? theme.palette.common.white : undefined}
        >
          Chat
        </Typography>
        <IconButton size="small" onClick={handleOpenAddConversationModal}>
          <AddIcon color="primary" />
        </IconButton>
      </Box>
      <MSTextField
        iconProps={{
          sx: {
            bgcolor: "transparent",
            pr: 0,
          },
        }}
        disableBorderInput
        fullWidth
        placeholder={t("placeholder.searchForMessageOrUser")}
        icon={<SearchIcon fontSize="small" />}
        onChange={handleChangeText}
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
    </Box>
  );
};

export default MenuChat;
