import MSTextField from "@components/TextField";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { ErrorText } from "@components/TextField/ErrorText";
import { Button, Box, CircularProgress } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateConversationParams } from "@containers/Modals/CreateConversation";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import useSocket from "@hooks/useSocket";
import { useCreateConversationMutation } from "@stores/services/conversation";
import { ConversationType } from "@typing/common";

interface CreateConversationFormProps {
  setConversation: React.Dispatch<React.SetStateAction<ConversationType[]>>;
  onCloseModal?:
    | ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
    | undefined;
}

const CreateConversationForm = ({
  setConversation,
  onCloseModal,
}: CreateConversationFormProps) => {
  const socket = useSocket();
  const user = useSelector((state: AppState) => state.auth);

  const [createConversation, { isLoading: isCreateConversationLoading }] =
    useCreateConversationMutation();

  const schema = Yup.object({
    email: Yup.string().email("Must be valid email").required("Required"),
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
        if (onCloseModal) {
          onCloseModal({}, "escapeKeyDown");
        }
      });
  };

  return (
    <>
      <Box mb={3}>
        <MSTextField
          inputProps={{ ...register("email") }}
          fullWidth
          placeholder="Type email here"
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
          <>Create</>
        )}
      </Button>
    </>
  );
};

export default CreateConversationForm;
