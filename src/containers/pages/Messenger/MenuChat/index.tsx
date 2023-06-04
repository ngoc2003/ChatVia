import { Box, BoxProps, IconButton, Typography } from "@mui/material";
import { theme } from "@theme";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import MSTextField from "@components/TextField";
import SearchIcon from "@mui/icons-material/Search";
import Conversation from "./Conversation";
import axios from "axios";
import { useSelector } from "react-redux";
import { AppState } from "@stores";

interface MenuChatProps extends BoxProps {
  setCurrentConversation: (conversation: any) => void;
  setFriendInformation: (friendInformation: any) => void;
  currentConversationId: string;
  setOpenAddConversationModal;
}

const MenuChat = ({
  setOpenAddConversationModal,
  setCurrentConversation,
  setFriendInformation,
  currentConversationId,
  ...props
}: MenuChatProps) => {
  const [conversation, setConversation] = useState([]);
  const user = useSelector((state: AppState) => state.auth);

  useEffect(() => {
    const getConversation = async () => {
      const response = await axios.get(
        `http://localhost:4000/conversations/${user.id}`
      );
      setConversation(response.data);
    };
    if (user.id) {
      getConversation();
    }
  }, [user.id]);

  return (
    <Box
      {...props}
      bgcolor={theme.palette.primary.light}
      sx={{ overflowY: "hidden" }}
      p={3}
      borderRight={`1px solid ${theme.palette.grey[100]}`}
    >
      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h5" fontWeight={600}>
          Chat
        </Typography>
        <IconButton size="small" onClick={setOpenAddConversationModal}>
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
      {conversation.map((conversation: any) => (
        <Conversation
          isActive={currentConversationId === conversation._id}
          onClick={() => setCurrentConversation(conversation)}
          setFriendInformation={setFriendInformation}
          conversation={conversation}
          key={"conversation" + conversation.id}
        />
      ))}
    </Box>
  );
};

export default MenuChat;
