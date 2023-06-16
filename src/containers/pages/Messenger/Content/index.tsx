import MSTextField from "@components/TextField";
import ChatContent from "@containers/pages/Messenger/Content/ChatContent";
import { Box, BoxProps, Drawer, IconButton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import { sayHiSymbol } from "@constants";
import parser from "html-react-parser";
import useSocket from "@hooks/useSocket";
import { useCreateMessageMutation } from "@stores/services/message";
import { ConversationType, MessageType } from "@typing/common";
import HeartIcon from "@icons/HeartIcon";
import EmojiCategory from "./EmojiCategory";
import { useTranslation } from "next-i18next";
import { theme } from "@theme";
import useResponsive from "@hooks/useResponsive";
import { FriendInformationType } from "@pages";
import useDimensions from "react-cool-dimensions";
import ContentHeader from "./Header";

interface CurrentContentProps extends BoxProps {
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  arrivalMessage: MessageType;
  receiverId: string;
  conversationId: string;
  friendInformation: FriendInformationType | null;
  setIsOpenUserDetail: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ContentProps extends CurrentContentProps {
  handleCloseDrawer?: () => void;
}

interface WrapperContentProps extends CurrentContentProps {
  setCurrentConversation: React.Dispatch<
    React.SetStateAction<ConversationType | null>
  >;
}

const DefaultContent = ({
  conversationId,
  setMessages,
  messages,
  arrivalMessage,
  receiverId,
  friendInformation,
  handleCloseDrawer,
  setIsOpenUserDetail,
  ...props
}: ContentProps) => {
  const { t } = useTranslation();
  const socket = useSocket();
  const [text, setText] = useState<string>("");
  const scrollRef = useRef<HTMLElement | null>(null);
  const currentUserId = useSelector((state: AppState) => state.auth.id);
  const { darkMode } = useSelector((state: AppState) => state.darkMode);

  const contentHeader = useDimensions({
    useBorderBoxSize: true,
  });

  const contentFooter = useDimensions({
    useBorderBoxSize: true,
  });

  const contentContainer = useDimensions({
    useBorderBoxSize: true,
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const [createMessage, { isLoading }] = useCreateMessageMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!currentUserId || !text.trim()) {
      return;
    }

    const message = {
      sender: currentUserId,
      text: text.trim(),
      conversationId,
    };

    createMessage(message)
      .unwrap()
      .then((response) => {
        setMessages([...messages, response]);
        setText("");

        socket.current.emit("sendMessage", {
          conversationId,
          senderId: currentUserId,
          receiverId: receiverId,
          text,
        });
      });
  };

  useEffect(() => {
    scrollRef?.current?.scrollIntoView();
  }, [messages?.length]);

  useEffect(() => {
    arrivalMessage &&
      setMessages((prev: MessageType[]) => [...prev, arrivalMessage]);
  }, [arrivalMessage, setMessages]);

  if (!receiverId) {
    return (
      <Box
        height="100%"
        display="grid"
        sx={{
          placeItems: "center",
          ...(darkMode && {
            bgcolor: theme.palette.darkTheme.dark,
            color: theme.palette.text.secondary,
          }),
        }}
        pb={7.2}
        {...props}
      >
        {t("openConversation")}
      </Box>
    );
  }

  return (
    <Box
      position="relative"
      pb={7.2}
      bgcolor={darkMode ? theme.palette.darkTheme.dark : undefined}
      {...props}
      ref={contentContainer.observe}
    >
      <ContentHeader
        setIsOpenUserDetail={setIsOpenUserDetail}
        friendInformation={friendInformation}
        ref={contentHeader.observe}
        handleCloseDrawer={handleCloseDrawer}
      />

      <Box
        width="100%"
        height={
          contentContainer.height - contentHeader.height - contentFooter.height
        }
        display="flex"
        flexDirection="column"
        p={2}
        pt={0}
        sx={{ overflowY: "auto" }}
      >
        {messages?.length ? (
          messages.map((message: MessageType) => (
            <ChatContent
              ref={scrollRef}
              key={message._id}
              me={currentUserId === message.sender}
              createdAt={message.createdAt}
              text={message.text}
              avatar={friendInformation?.avatar ?? ""}
            />
          ))
        ) : (
          <Box display="grid" height="100%" sx={{ placeItems: "center" }}>
            {t("startMessage")} {parser(sayHiSymbol)}
          </Box>
        )}
      </Box>
      <Box
        display="flex"
        py={1}
        px={2}
        ref={contentFooter.observe}
        bgcolor={darkMode ? theme.palette.darkTheme.dark : undefined}
        borderTop={`0.5px solid ${
          darkMode ? theme.palette.darkTheme.light : theme.palette.grey[400]
        }`}
      >
        <MSTextField
          placeholder="Aa"
          containerProps={{
            sx: {
              height: 40,
            },
          }}
          disableBorderInput
          fullWidth
          value={text}
          onChange={handleTextChange}
          onKeyDown={(e) => {
            if (e.code === "Enter") {
              handleSubmit(e);
            }
          }}
        />
        <IconButton
          disabled={!text || isLoading}
          onClick={handleSubmit}
          sx={{
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <SendIcon color={text ? "primary" : "disabled"} />
        </IconButton>
        <IconButton
          sx={{
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <HeartIcon />
        </IconButton>
        <Box>
          <EmojiCategory setText={setText} />
        </Box>
      </Box>
    </Box>
  );
};

const Content = ({ setCurrentConversation, ...props }: WrapperContentProps) => {
  const { isDesktopLg } = useResponsive();
  const [isOpen, setIsOpen] = useState(!!props.conversationId);

  const handleCloseDrawer = () => {
    setIsOpen(false);
    setCurrentConversation(null);
  };

  useEffect(() => {
    setIsOpen(!!props.conversationId);
  }, [props.conversationId]);

  if (isDesktopLg) {
    return <DefaultContent {...props} />;
  }

  return (
    <Drawer
      sx={{
        ".MuiPaper-root": {
          width: "100vw",
        },
      }}
      anchor="right"
      open={isOpen}
      onClose={handleCloseDrawer}
    >
      <Box sx={{ height: "100vh", display: "flex", overflow: "hidden" }}>
        <DefaultContent handleCloseDrawer={handleCloseDrawer} {...props} />
      </Box>
    </Drawer>
  );
};

export default Content;
