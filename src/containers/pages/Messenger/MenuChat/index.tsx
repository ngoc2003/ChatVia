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

interface MenuChatProps extends BoxProps {
  arrivalConversation: any;
  setCurrentConversation: (conversation: any) => void;
  setFriendInformation: (friendInformation: any) => void;
  currentConversationId: string;
}

const MenuChat: React.FC<MenuChatProps> = ({
  setCurrentConversation,
  setFriendInformation,
  currentConversationId,
  arrivalConversation,
  ...props
}: MenuChatProps) => {
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
    const getConversation = async () => {
      const response = await axios.get(
        `http://localhost:4000/conversations/${user.id}`
      );
      setConversations(response.data);
    };
    if (user.id) {
      getConversation();
    }
  }, [setConversations, user.id]);

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
          key={"conversation" + conversation.id}
        />
      ))}
    </Box>
  );
};

export default MenuChat;
