import MSTextField from "@components/TextField";
import ChatContent from "@containers/pages/Messenger/Content/ChatContent";
import {
  Box,
  BoxProps,
  Drawer,
  IconButton,
  InputAdornment,
} from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import { sayHiSymbol } from "@constants";
import parser from "html-react-parser";
import useSocket from "@hooks/useSocket";
import { useCreateMessageMutation } from "@stores/services/message";
import { ConversationType, MessageType } from "@typing/common";
import EmojiCategory from "./EmojiCategory";
import { useTranslation } from "next-i18next";
import { theme } from "@theme";
import useResponsive from "@hooks/useResponsive";
import { ArrivalMessageType, FriendInformationType } from "@pages";
import useDimensions from "react-cool-dimensions";
import ContentHeader from "./Header";
import { omit } from "lodash";
import { handleSortConversations } from "@utils/conversations";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { handleUploadImage } from "@utils/common";

interface CurrentContentProps extends BoxProps {
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  arrivalMessage: ArrivalMessageType | null;
  receiverId: string;
  conversationId: string;
  friendInformation: FriendInformationType | null;
  setIsOpenUserDetail: React.Dispatch<React.SetStateAction<boolean>>;
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[]>>;
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
  setConversations,
  ...props
}: ContentProps) => {
  const { t } = useTranslation();
  const socket = useSocket();
  const currentUserId = useSelector((state: AppState) => state.auth.id);
  const { darkMode } = useSelector((state: AppState) => state.darkMode);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [text, setText] = useState<string>("");
  const uploadImageRef = useRef<HTMLInputElement | null>(null);
  const audio = useMemo(() => new Audio("sound.mp3"), []);
  
  const contentHeader = useDimensions({
    useBorderBoxSize: true,
  });
  
  const contentFooter = useDimensions({
    useBorderBoxSize: true,
  });
  
  const contentContainer = useDimensions({
    useBorderBoxSize: true,
  });
  
  const [createMessage, { isLoading }] = useCreateMessageMutation();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleCreateMessage = (input: string) => {
    if (!currentUserId || !input.trim()) {
      return;
    }
    const message = {
      sender: currentUserId,
      text: input.trim(),
      conversationId,
    };

    createMessage(message)
      .unwrap()
      .then((response) => {
        setMessages([...messages, response]);

        setConversations((prev: ConversationType[]) =>
          handleSortConversations(
            prev.map((conv: any) => {
              if (conv._id !== response.conversationId) {
                return conv;
              }
              return {
                ...conv,
                lastMessage: {
                  id: currentUserId,
                  text,
                  createdAt: response.createdAt,
                },
              };
            })
          )
        );
      });
  };

  const handleImageChange = (e) => {
    handleUploadImage(e, handleCreateMessage);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!currentUserId || !text.trim()) {
      return;
    }

    handleCreateMessage(text);
    setText("");

    socket.current.emit("sendMessage", {
      conversationId,
      senderId: currentUserId,
      receiverId: receiverId,
      text,
    });
  };

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ block: "end", inline: "nearest" });
  }, [messages?.length, conversationId]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev: MessageType[]) => [
        ...prev,
        omit(arrivalMessage, ["conversationId"]) as MessageType,
      ]);
      audio.play();
    }
  }, [arrivalMessage, audio, setMessages]);

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
        conversationId={conversationId}
        setIsOpenUserDetail={setIsOpenUserDetail}
        friendInformation={friendInformation}
        ref={contentHeader.observe}
        handleCloseDrawer={handleCloseDrawer}
      />

      <Box
        ref={scrollRef}
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
          messages.map((message: MessageType, index: number) => (
            <ChatContent
              isLast={index === messages.length - 1}
              setMessages={setMessages}
              key={message._id}
              messageId={message._id}
              me={currentUserId === message.sender}
              createdAt={message.createdAt}
              text={message.text}
              avatar={friendInformation?.avatar || ""}
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
        alignItems="center"
        py={1}
        px={2}
        ref={contentFooter.observe}
        bgcolor={darkMode ? theme.palette.darkTheme.dark : undefined}
        borderTop={`0.5px solid ${
          darkMode ? theme.palette.darkTheme.light : theme.palette.grey[400]
        }`}
      >
        <MSTextField
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    uploadImageRef.current?.click();
                  }}
                >
                  <>
                    <input
                      ref={uploadImageRef}
                      type="file"
                      style={{ display: "none" }}
                      onChange={handleImageChange}
                    />
                    <InsertPhotoIcon color="primary" />
                  </>
                </IconButton>
              </InputAdornment>
            ),
          }}
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
          onClick={() => {
            handleCreateMessage("❤️");
          }}
          sx={{
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          ❤️
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
