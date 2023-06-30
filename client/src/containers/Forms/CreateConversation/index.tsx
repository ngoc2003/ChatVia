import MSTextField from "@components/TextField";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { ErrorText } from "@components/TextField/ErrorText";
import { Button, Box, CircularProgress } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateConversationParams } from "@containers/Modals/CreateConversation";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@stores";
import useSocket from "@hooks/useSocket";
import { useCreateConversationMutation } from "@stores/services/conversation";
import { ConversationType } from "@typing/common";
import { useTranslation } from "next-i18next";
import { commonActions } from "@stores/slices/common";

interface CreateConversationFormProps {
  setConversation: React.Dispatch<React.SetStateAction<ConversationType[]>>;
  onCloseModal:
    | ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
    | undefined;
}

const CreateConversationForm = ({
  setConversation,
  onCloseModal,
}: CreateConversationFormProps) => {
  const { t } = useTranslation();
  const socket = useSocket();
  const dispatch = useDispatch();
  const user = useSelector((state: AppState) => state.auth);

  const [createConversation, { isLoading: isCreateConversationLoading }] =
    useCreateConversationMutation();

  const schema = Yup.object({
    email: Yup.string().email(t("error.invalid")).required(t("error.required")),
  }).required();
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateConversationParams>({ resolver: yupResolver(schema) });

  const onSubmit = async (values: CreateConversationParams) => {
    if (!user.id) {
      return;
    }

    createConversation({
      senderId: user.id,
      receiverEmail: values.email,
    })
      .unwrap()
      .then((response) => {
        setConversation((prev) => [response, ...prev]);
        socket.current.emit("createConversation", {
          ...response,
          receiverId: response.members.find((conv: string) => conv !== user.id),
        });

        dispatch(
          commonActions.showAlertMessage({
            type: "success",
            message: "Create conversation successfully!",
          })
        );

        if (onCloseModal) {
          onCloseModal({}, "escapeKeyDown");
        }
      });
  };

  return (
    <Box>
      <Box mb={3}>
        <MSTextField
          disableBorderInput
          inputProps={{ ...register("email") }}
          fullWidth
          placeholder={t("placeholder.typeEmailHere")}
        />
        <ErrorText
          isError={!!errors.email?.message}
          content={errors.email?.message}
        />
      </Box>
      <Button
        disabled={!watch("email")}
        variant="contained"
        fullWidth
        onClick={handleSubmit(onSubmit)}
      >
        {isCreateConversationLoading ? (
          <CircularProgress size={20} />
        ) : (
          t("button.create")
        )}
      </Button>
    </Box>
  );
};

export default CreateConversationForm;
