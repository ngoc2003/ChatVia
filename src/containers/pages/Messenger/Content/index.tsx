import MSTextField from "@components/TextField";
import ChatContent from "@containers/pages/Messenger/Content/ChatContent";
import { Box, BoxProps, IconButton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import { sayHiSymbol } from "@constants";
import parser from "html-react-parser";
import useSocket from "@hooks/useSocket";
import { io } from "socket.io-client";

interface ContentProps extends BoxProps {
  messages: any;
  setMessages: (conversation: any) => void;
  arrivalMessage: any;
  receiverId: string;
  conversationId: string;
}

const Content = ({
  conversationId,
  setMessages,
  messages,
  arrivalMessage,
  receiverId,
  ...props
}: ContentProps) => {
  const currentUserId = useSelector((state: AppState) => state.auth.id);
  const [text, setText] = useState<string>("");
  const scrollRef = useRef<HTMLElement | null>(null);
  const socket = useSocket();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const message = {
      sender: currentUserId,
      text,
      conversationId,
    };
    const response = await axios.post(
      `http://localhost:4000/messages`,
      message
    );
    setMessages([...messages, response.data]);
    setText("");

    socket.current.emit("sendMessage", {
      senderId: currentUserId,
      receiverId: receiverId,
      text,
    });
  };

  useEffect(() => {
    scrollRef?.current?.scrollIntoView();
  }, [messages?.length]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, setMessages]);

  if (!receiverId) {
    return (
      <Box
        height="100%"
        display="grid"
        sx={{ placeItems: "center" }}
        pb={7.2}
        {...props}
      >
        Open a conversation to chat with your friend now!
      </Box>
    );
  }

  return (
    <Box position="relative" pb={7.2} {...props}>
      <Box
        width="100%"
        height="100%"
        display="flex"
        flexDirection="column"
        px={2}
        sx={{ overflowY: "auto" }}
      >
        {messages?.length ? (
          messages.map((message: any) => (
            <ChatContent
              ref={scrollRef}
              key={message._id}
              me={currentUserId === message.sender}
              createdAt={message.createdAt}
              text={message.text}
            />
          ))
        ) : (
          <Box display="grid" height="100%" sx={{ placeItems: "center" }}>
            You havent had any messages yet. Say hi {parser(sayHiSymbol)}
          </Box>
        )}
      </Box>
      <Box
        display="flex"
        py={1}
        px={2}
        position="absolute"
        bottom={0}
        right={0}
        left={0}
      >
        <MSTextField
          placeholder="Aa"
          containerProps={{
            sx: {
              height: 40,
            },
          }}
          fullWidth
          value={text}
          onChange={handleTextChange}
        />
        <IconButton
          disabled={!text}
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
          <FavoriteIcon color="error" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Content;
