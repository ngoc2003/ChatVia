import styled from "@emotion/styled";
import useSocket from "@hooks/useSocket";
import { Avatar, Badge, Box, BoxProps, Typography } from "@mui/material";
import { FriendInformationType } from "@pages";
import { AppState } from "@stores";
import { useLazyGetUserByIdQuery } from "@stores/services/user";
import { theme } from "@theme";
import { ConversationType, UserType } from "@typing/common";
import { getLastWordOfString } from "@utils/common";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";

const StyledBadge = styled(Badge)<{ isOnline: boolean }>(({ isOnline }) => ({
  "& .MuiBadge-badge": {
    width: 10,
    height: 10,
    borderRadius: 9999,
    border: "2px solid #fff",
    backgroundColor: isOnline ? "#44b700" : theme.palette.grey[700],
  },
}));

interface ConversationProps extends BoxProps {
  conversation: ConversationType;
  setFriendInformation: React.Dispatch<
    React.SetStateAction<FriendInformationType>
  >;
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
  const socket = useSocket();
  const { t } = useTranslation();
  const [friend, setFriend] = useState<UserType | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const currentUserId = useSelector((state: AppState) => state.auth.id);

  useEffect(() => {
    const friendId = conversation.members?.find(
      (conv: string) => conv !== currentUserId
    );

    socket?.current.on("getUsers", (users) => {
      console.log(users);
      setIsOnline(users.some((user) => user.userId === friendId));
    });
  }, []);

  const [getUserById] = useLazyGetUserByIdQuery();

  useEffect(() => {
    const friendId = conversation.members?.find(
      (conv: string) => conv !== currentUserId
    );

    if (!friendId) {
      return;
    }

    getUserById({
      userId: friendId,
    })
      .unwrap()
      .then((response) => {
        setFriend(response);
      });
  }, [conversation.members, currentUserId, getUserById]);

  if (!friend) {
    return <></>;
  }

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
          isOnline={isOnline}
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
            {(conversation.lastMessage.id === currentUserId
              ? t("you")
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
