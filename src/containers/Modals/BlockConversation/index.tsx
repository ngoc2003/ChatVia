import CAModal from "@components/Modal";
import useSocket from "@hooks/useSocket";
import { Box, Button, ModalProps, Typography } from "@mui/material";
import { AppState } from "@stores";
import { useBlockConversationMutation } from "@stores/services/conversation";
import { theme } from "@theme";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

interface BlockConversationModalProps extends Omit<ModalProps, "children"> {
  conversationId: string;
  userBlockedId: string;
  setBlocked: React.Dispatch<React.SetStateAction<string>>;
}

const BlockConversationModal = ({
  conversationId,
  userBlockedId,
  setBlocked,
  ...props
}: BlockConversationModalProps) => {
  const { t } = useTranslation();
  const socket = useSocket();
  const user = useSelector((state: AppState) => state.auth);
  const { darkMode } = useSelector((state: AppState) => state.darkMode);
  const [blockConversation, { isLoading }] = useBlockConversationMutation();

  const handleBlockConversation = () => {
    if (!userBlockedId || !user.id) {
      return;
    }
    blockConversation({
      conversationId,
      userId: user.id,
    })
      .unwrap()
      .then(() => {
        props.onClose?.({}, "escapeKeyDown");
        setBlocked(user.id as string);
      });
    socket.current.emit("blockConversation", {
      conversationId,
      senderId: user.id,
      receiverId: userBlockedId,
    });
  };

  return (
    <CAModal {...props}>
      <>
        <Typography
          mb={2}
          variant="h6"
          color={darkMode ? theme.palette.common.white : undefined}
        >
          {t("question.areYouSureToBlockThisConversation")}
        </Typography>
        <Box display="flex">
          <Button
            variant="text"
            sx={{ mr: 1 }}
            fullWidth
            disabled={isLoading}
            onClick={handleBlockConversation}
          >
            {t("button.block")}
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              props.onClose?.({}, "escapeKeyDown");
            }}
          >
            {t("button.cancel")}
          </Button>
        </Box>
      </>
    </CAModal>
  );
};

export default BlockConversationModal;
