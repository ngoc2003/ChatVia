import { Box, BoxProps, IconButton, Typography } from "@mui/material";
import { theme } from "@theme";
import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import MSTextField from "@components/TextField";
import SearchIcon from "@mui/icons-material/Search";
import Conversation from "./Conversation";
import axios from "axios";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import CreateConversationModal from "@containers/Modals/CreateConversation";
import useSocket from "@hooks/useSocket";

interface MenuChatProps extends BoxProps {
  messages: any;
  arrivalMessage: any;
  arrivalConversation: any;
  setCurrentConversation: (conversation: any) => void;
  setFriendInformation: (friendInformation: any) => void;
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
  const [isOpenAddConversationModal, setIsOpenAddConversationModal] =
    useState<boolean>(false);
  const [conversations, setConversations] = useState<any>([]);

  const user = useSelector((state: AppState) => state.auth);

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

  useEffect(() => {
    const getConversation = async () => {
      const response = await axios.get(
        `http://localhost:4000/conversations/${user.id}`
      );
      setConversations(response.data);
    };
    if (user.id) {
      getConversation();
    }
  }, [setConversations, user.id, arrivalMessage]);

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
      {conversations.map((conversation: any) => (
        <Conversation
          isActive={currentConversationId === conversation._id}
          onClick={() => setCurrentConversation(conversation)}
          setFriendInformation={setFriendInformation}
          conversation={conversation}
          key={"conversation" + conversation._id}
        />
      ))}
    </Box>
  );
};

export default MenuChat;
