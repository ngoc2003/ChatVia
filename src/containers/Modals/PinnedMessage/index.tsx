import CAModal from "@components/Modal";
import {
  Box,
  BoxProps,
  CircularProgress,
  IconButton,
  ModalProps,
  Typography,
} from "@mui/material";
import { AppState } from "@stores";
import {
  useGetMessageListByConversationIdQuery,
  useUnPinMessageMutation,
} from "@stores/services/message";
import { theme } from "@theme";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import format from "date-fns/format";
import { useTranslation } from "react-i18next";
import DeleteIcon from "@mui/icons-material/Delete";

interface PinnedMessageModalProps extends Omit<ModalProps, "children"> {
  conversationId: string;
  friendName: string;
  setPinnedMessage: React.Dispatch<React.SetStateAction<string>>;
}

interface MessagePinProps extends BoxProps {
  text: string;
  name: string;
  createdAt: Date;
}

const MessagePin = ({ text, name, createdAt, ...props }: MessagePinProps) => {
  const { darkMode } = useSelector((state: AppState) => state.darkMode);
  return (
    <Box
      p={2}
      sx={{
        width: "100%",
        borderRadius: 0.5,
        cursor: "pointer",
        transitionDuration: "0.3s",
        ":hover": {
          bgcolor: darkMode
            ? theme.palette.darkTheme.light
            : theme.palette.grey[400],
        },
      }}
      {...props}
    >
      <Typography
        color={darkMode ? theme.palette.common.white : undefined}
        variant="body2"
        fontWeight={600}
      >
        {name}
      </Typography>
      <Typography
        variant="body2"
        fontStyle="italic"
        color={
          darkMode ? theme.palette.text.secondary : theme.palette.grey[600]
        }
      >
        {format(new Date(createdAt), "HH:MM dd/MM/yyyy")}
      </Typography>
      <Typography
        color={darkMode ? theme.palette.common.white : undefined}
        variant="body2"
      >
        {text}
      </Typography>
    </Box>
  );
};

const PinnedMessageModal = ({
  conversationId,
  friendName,
  setPinnedMessage,
  ...props
}: PinnedMessageModalProps) => {
  const { t } = useTranslation();
  const user = useSelector((state: AppState) => state.auth);

  const { data, refetch, isFetching } = useGetMessageListByConversationIdQuery({
    conversationId,
    userId: user.id as string,
    isPin: true,
  });

  const [unPin, { isLoading }] = useUnPinMessageMutation();

  const handleUnpin = (id: string) => {
    unPin({ messageId: id })
      .unwrap()
      .then(() => {
        props.onClose?.({}, "escapeKeyDown");
      });
  };

  useEffect(() => {
    refetch();
  }, [props.open, refetch]);

  return (
    <CAModal {...props}>
      <>
        {isFetching && (
          <Box display="grid" sx={{ placeItems: "center" }}>
            <CircularProgress size={20} />
          </Box>
        )}
        {!isFetching &&
          data?.length &&
          data
            ?.map((item) => {
              return (
                <Box
                  display="flex"
                  width="100%"
                  alignItems="center"
                  key={"Pin-" + item._id}
                >
                  <MessagePin
                    onClick={() => {
                      setPinnedMessage(item._id);
                      props.onClose?.({}, "escapeKeyDown");
                    }}
                    text={item.text}
                    name={
                      item.sender === user.id ? t("you") : `${friendName}: `
                    }
                    createdAt={item.createdAt}
                  />
                  <IconButton
                    disabled={isLoading}
                    onClick={() => handleUnpin(item._id)}
                  >
                    <DeleteIcon color="primary" fontSize="small" />
                  </IconButton>
                </Box>
              );
            })
            .reverse()}
      </>
    </CAModal>
  );
};

export default PinnedMessageModal;
