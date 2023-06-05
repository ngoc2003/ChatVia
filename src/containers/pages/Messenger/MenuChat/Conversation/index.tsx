import styled from "@emotion/styled";
import { Avatar, Badge, Box, BoxProps, Typography } from "@mui/material";
import { AppState } from "@stores";
import { theme } from "@theme";
import { getLastWordOfString } from "@utils/common";
import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const StyledBadge = styled(Badge)(() => ({
  "& .MuiBadge-badge": {
    width: 10,
    height: 10,
    borderRadius: 9999,
    backgroundColor: "#44b700",
    color: "#44b700",
    border: "2px solid #fff",
  },
}));

interface ConversationProps extends BoxProps {
  conversation: any;
  setFriendInformation: (friendInformation: any) => void;
  onClick: () => void;
  isActive: boolean;
}

const Conversation = ({
  conversation,
  setFriendInformation,
  onClick,
  isActive,
  ...props
}: ConversationProps) => {
  const [friend, setFriend] = useState<any>();
  const currentUserId = useSelector((state: AppState) => state.auth.id);

  useEffect(() => {
    const friendId = conversation.members?.find(
      (conv: string) => conv !== currentUserId
    );

    const getUser = async () => {
      const response = await axios.get("http://localhost:4000/users", {
        params: {
          userId: friendId,
        },
      });
      setFriend(response.data);
    };
    getUser();
  }, [conversation.members, currentUserId]);

  console.log(conversation);

  return (
    <Box
      {...props}
      onClick={() => {
        onClick();
        setFriendInformation({ name: friend.username });
      }}
      sx={{
        p: 1.5,
        cursor: "pointer",
        transitionDuration: "0.3s",
        "&:hover": {
          bgcolor: theme.palette.grey[400],
          borderRadius: 0.5,
        },
        ...(isActive && {
          bgcolor: theme.palette.grey[400],
          borderRadius: 0.5,
        }),
      }}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
    >
      <Box mr={2}>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <Avatar
            sx={{ width: 36, height: 36 }}
            src={friend?.avatar ?? "/images/avatar-default.svg"}
          />
        </StyledBadge>
      </Box>
      <Box flex={1}>
        <Typography fontWeight={600}>{friend?.username ?? ""}</Typography>
        {!!conversation?.lastMessage && (
          <Typography variant="caption" color={theme.palette.grey[600]}>
            {(conversation.lastMessage.sender !== currentUserId
              ? "Bạn: "
              : `${getLastWordOfString(friend?.username)}: `) +
              conversation.lastMessage.text}
          </Typography>
        )}
      </Box>
      {!!conversation?.lastMessage && (
        <Box alignSelf="flex-start">
          <Typography variant="caption" color={theme.palette.grey[600]}>
            {format(new Date(conversation.lastMessage.createdAt), "HH:mm")}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Conversation;
