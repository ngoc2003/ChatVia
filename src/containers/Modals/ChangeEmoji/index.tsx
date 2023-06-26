import Emoji from "@components/Emoji";
import CAModal from "@components/Modal";
import useSocket from "@hooks/useSocket";
import { ModalProps } from "@mui/material";
import { useUpdateConversationMutation } from "@stores/services/conversation";
import React from "react";

interface ChangeEmojiModalProps extends Omit<ModalProps, "children"> {
  setEmoji: React.Dispatch<React.SetStateAction<string>>;
  conversationId: string;
  friendId: string;
}

const ChangeEmojiModal = ({
  conversationId,
  setEmoji,
  friendId,
  ...props
}: ChangeEmojiModalProps) => {
  const socket = useSocket();
  const [updateConversation] = useUpdateConversationMutation();

  const handleChangeEmoji = (input: string) => {
    if (!friendId) {
      return;
    }
    updateConversation({
      emoji: input,
      conversationId,
    });
    props.onClose?.({}, "escapeKeyDown");
    setEmoji(input);
    socket.current.emit("changeIcon", {
      receiverId: friendId,
      icon: input,
      conversationId,
    });
  };

  return (
    <CAModal {...props}>
      <Emoji onClick={handleChangeEmoji} keyName="change-icon-" />
    </CAModal>
  );
};

export default ChangeEmojiModal;
