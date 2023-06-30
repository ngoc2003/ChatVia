import useSocket from "@hooks/useSocket";
import { Box, Typography } from "@mui/material";
import { AppState } from "@stores";
import { useUnBlockConversationMutation } from "@stores/services/conversation";
import { theme } from "@theme";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

interface BlockBoxProps {
  blockedByUser: string;
  conversationId: string;
  userBlockedId: string;
  setBlocked: React.Dispatch<React.SetStateAction<string>>;
}

const BlockBox = ({
  blockedByUser,
  conversationId,
  setBlocked,
  userBlockedId,
}: BlockBoxProps) => {
  const { t } = useTranslation();
  const socket = useSocket();
  const currentUserId = useSelector((state: AppState) => state.auth.id);
  const { darkMode } = useSelector((state: AppState) => state.darkMode);

  const [unBlock] = useUnBlockConversationMutation();

  const handleUnblock = () => {
    if (!userBlockedId) {
      return;
    }
    unBlock({ conversationId })
      .unwrap()
      .then(() => {
        setBlocked("");
      });
    socket.current.emit("unBlockConversation", {
      conversationId,
      receiverId: userBlockedId,
    });
  };
  return (
    <Box textAlign="center" width="100%">
      <Typography
        color={darkMode ? theme.palette.text.secondary : undefined}
        variant="body2"
        fontWeight={600}
      >
        {blockedByUser == currentUserId ? (
          <>{t("blockUser.blocking")}</>
        ) : (
          <>{t("blockUser.blocked")}</>
        )}
      </Typography>
      <Typography
        color={darkMode ? theme.palette.text.secondary : undefined}
        variant="body2"
        sx={{ display: "inline" }}
      >
        {t("blockUser.sub")}
      </Typography>
      {blockedByUser == currentUserId && (
        <Typography
          variant="body2"
          fontStyle="italic"
          color={theme.palette.primary.main}
          onClick={handleUnblock}
          sx={{
            textDecoration: "underline",
            cursor: "pointer",
            ml: 1,
            display: "inline-block",
          }}
        >
          {t('button.unBlock')}
        </Typography>
      )}
    </Box>
  );
};

export default BlockBox;
