import CAModal from "@components/Modal";
import CreateConversationForm from "@containers/Forms/CreateConversation";
import { ModalProps, Typography } from "@mui/material";
import { ConversationType } from "@typing/common";
import React from "react";
import { useTranslation } from "next-i18next";

export interface CreateConversationParams {
  email: string;
}

interface CreateConversationModalProps extends Omit<ModalProps, "children"> {
  setConversation: React.Dispatch<React.SetStateAction<ConversationType[]>>;
}

const CreateConversationModal = ({
  setConversation,
  ...props
}: CreateConversationModalProps) => {
  const { t } = useTranslation();
  return (
    <CAModal {...props}>
      <>
        <Typography mb={2} variant="h6">
          {t("createNewConversation")}
        </Typography>
        <CreateConversationForm
          onCloseModal={props.onClose}
          setConversation={setConversation}
        />
      </>
    </CAModal>
  );
};

export default CreateConversationModal;
