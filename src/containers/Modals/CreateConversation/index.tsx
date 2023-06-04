import CAModal from "@components/Modal";
import CreateConversationForm from "@containers/Forms/CreateConversation";
import { ModalProps, Typography } from "@mui/material";
import React from "react";

export interface CreateConversationParams {
  email: string;
}

const CreateConversationModal = (props: Omit<ModalProps, "children">) => {
  return (
    <CAModal {...props}>
      <>
        <Typography mb={2} variant="h6">
          Create new conversation
        </Typography>
        <CreateConversationForm />
      </>
    </CAModal>
  );
};

export default CreateConversationModal;
