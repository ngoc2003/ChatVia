import MSTextField from "@components/TextField";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { ErrorText } from "@components/TextField/ErrorText";
import { Button, Box } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateConversationParams } from "@containers/Modals/CreateConversation";
import { CAConnectionInstance } from "@pages/api/hello";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import useSocket from "@hooks/useSocket";

interface CreateConversationFormProps {
  setConversation: (conversations: any) => void;
  onCloseModal: () => void;
}

const CreateConversationForm = ({
  setConversation,
  onCloseModal,
}: CreateConversationFormProps) => {
  const socket = useSocket();
  const user = useSelector((state: AppState) => state.auth);
  const schema = Yup.object({
    email: Yup.string().email("Must be valid email").required("Required"),
  }).required();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateConversationParams>({ resolver: yupResolver(schema) });

  const onSubmit = async (values: CreateConversationParams) => {
    const response = await CAConnectionInstance.post(
      "http://localhost:4000/conversations",
      {
        senderId: user.id,
        receiverEmail: values.email,
      }
    );

    setConversation((prev) => [response.data, ...prev]);

    socket.current.emit("createConversation", {
      ...response.data,
      receiverId: response.data.members.find(
        (conv: string) => conv !== user.id
      ),
    });
    onCloseModal();
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
      <Button variant="contained" fullWidth onClick={handleSubmit(onSubmit)}>
        Create
      </Button>
    </>
  );
};

export default CreateConversationForm;
