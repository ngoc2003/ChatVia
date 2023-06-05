import CAModal from "@components/Modal";
import CreateConversationForm from "@containers/Forms/CreateConversation";
import { ModalProps, Typography } from "@mui/material";
import React from "react";

export interface CreateConversationParams {
  email: string;
}

interface CreateConversationModalProps extends Omit<ModalProps, "children"> {
  setConversation: any;
}

const CreateConversationModal = ({
  setConversation,
  ...props
}: CreateConversationModalProps) => {
  return (
    <CAModal {...props}>
      <>
        <Typography mb={2} variant="h6">
          Create new conversation
        </Typography>
        <CreateConversationForm onCloseModal={props.onClose} setConversation={setConversation} />
      </>
    </CAModal>
  );
};

export default CreateConversationModal;
