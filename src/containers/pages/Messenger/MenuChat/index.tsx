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
import Conversation from "./Conversation";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import CreateConversationModal from "@containers/Modals/CreateConversation";
import useSocket from "@hooks/useSocket";
import { useLazyGetConversationListByUserIdQuery } from "@stores/services/conversation";
import { ConversationType, MessageType } from "@typing/common";
import { ArrivalMessageType, FriendInformationType } from "@pages";

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
  const socket = useSocket();
  const user = useSelector((state: AppState) => state.auth);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [isOpenAddConversationModal, setIsOpenAddConversationModal] =
    useState<boolean>(false);

  const handleOpenAddConversationModal = () => {
    setIsOpenAddConversationModal(true);
  };

  const handleCloseAddConversationModal = () => {
    setIsOpenAddConversationModal(false);
  };

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
  }, [messages.length]);

  const [getConversation, { isFetching: isGetConversationFetching }] =
    useLazyGetConversationListByUserIdQuery();

  useEffect(() => {
    if (user.id) {
      getConversation({ userId: user.id })
        .unwrap()
        .then((response) => setConversations(response));
    }
  }, [setConversations, user.id, arrivalMessage, getConversation]);

  useEffect(() => {
    arrivalConversation &&
      setConversations((prev) => [arrivalConversation, ...prev]);
  }, [arrivalConversation]);

  return (
    <Box
      {...props}
      bgcolor={theme.palette.primary.light}
      sx={{ overflowY: "hidden" }}
      p={3}
      borderRight={`1px solid ${theme.palette.grey[100]}`}
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
        <Typography variant="h5" fontWeight={600}>
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
        containerProps={{
          sx: {
            bgcolor: theme.palette.grey[400],
          },
        }}
        fullWidth
        placeholder="Search messages or users"
        icon={<SearchIcon fontSize="small" />}
      />
      <Typography variant="subtitle2" fontWeight={600} my={3}>
        Recent
      </Typography>
      {isGetConversationFetching ? (
        <Box>
          <CircularProgress size={20} />
        </Box>
      ) : (
        conversations.map((conversation: ConversationType) => (
          <Conversation
            isActive={currentConversationId === conversation._id}
            onClick={() => setCurrentConversation(conversation)}
            setFriendInformation={setFriendInformation}
            conversation={conversation}
            key={"conversation" + conversation._id}
          />
        ))
      )}
    </Box>
  );
};

export default MenuChat;
