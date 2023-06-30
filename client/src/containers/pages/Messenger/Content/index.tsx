import ChatContent from "@containers/pages/Messenger/Content/ChatContent";
import { Box, BoxProps, Drawer, IconButton } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import { sayHiSymbol } from "@constants";
import parser from "html-react-parser";
import useSocket from "@hooks/useSocket";
import { useCreateMessageMutation } from "@stores/services/message";
import {
  ConversationStatus,
  ConversationType,
  MessageType,
} from "@typing/common";
import EmojiCategory from "./EmojiCategory";
import { useTranslation } from "next-i18next";
import { theme } from "@theme";
import useResponsive from "@hooks/useResponsive";
import { ArrivalMessageType, FriendInformationType } from "@pages";
import useDimensions from "react-cool-dimensions";
import ContentHeader from "./Header";
import { omit } from "lodash";
import { handleSortConversations } from "@utils/conversations";
import { handleUploadImage } from "@utils/common";
import { useUpdateConversationMutation } from "@stores/services/conversation";
import PendingConversationWarning from "./PendingConversationWarning";
import TextBox from "./TextBox";
import BlockBox from "./BlockBox";

interface CurrentContentProps extends BoxProps {
  blockedByUser?: string;
  createdById?: string;
  messages: MessageType[];
  conversationStatus?: ConversationStatus;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  arrivalMessage: ArrivalMessageType | null;
  receiverId: string;
  emoji: string;
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
  blockedByUser,
  createdById,
  conversationId,
  conversationStatus,
  emoji,
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
  const [pinnedMessage, setPinnedMessage] = useState<string>("");
  const pinnedMessageRef = useRef<HTMLElement | null>(null);
  const uploadImageRef = useRef<HTMLInputElement | null>(null);
  const audio = useMemo(() => new Audio("sound.mp3"), []);
  const [newEmoji, setEmoji] = useState<string>(emoji);
  const [blocked, setBlocked] = useState<string>(blockedByUser ?? "");
  const [isPendingConversation, setIsPendingConversation] = useState<boolean>(
    conversationStatus === ConversationStatus.Pending
  );

  const contentHeader = useDimensions({
    useBorderBoxSize: true,
  });

  const contentFooter = useDimensions({
    useBorderBoxSize: true,
  });

  const contentContainer = useDimensions({
    useBorderBoxSize: true,
  });

  const [createMessage, { isLoading: isCreateMessageLoading }] =
    useCreateMessageMutation();

  const [updateConversation, { isLoading: isUpdateConversationLoading }] =
    useUpdateConversationMutation();

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

    socket.current.emit("sendMessage", {
      conversationId,
      senderId: currentUserId,
      receiverId: receiverId,
      text: input,
      conversationStatus,
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

    if (
      conversationStatus === ConversationStatus.Pending &&
      currentUserId !== createdById
    ) {
      setConversations((prev) =>
        prev.filter((conv) => conv._id !== conversationId)
      );
      updateConversation({
        conversationId,
        status: ConversationStatus.Accept,
      })
        .unwrap()
        .then(() => {
          setIsPendingConversation(false);
        });
    }
  };

  useEffect(() => {
    if (messages?.length && scrollRef?.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      setPinnedMessage("");
    }
  }, [messages?.length, conversationId]);

  useEffect(() => {
    if (emoji) {
      setEmoji(emoji);
    }
    setBlocked(blockedByUser as string);
  }, [blockedByUser, conversationId, emoji]);

  useEffect(() => {
    setIsPendingConversation(conversationStatus === ConversationStatus.Pending);
  }, [conversationStatus, setIsOpenUserDetail]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev: MessageType[]) => [
        ...prev,
        omit(arrivalMessage, [
          "conversationId",
          "conversationType",
        ]) as MessageType,
      ]);
      audio.play();
    }
  }, [arrivalMessage, audio, setMessages]);

  useEffect(() => {
    if (pinnedMessageRef?.current && pinnedMessage) {
      pinnedMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [pinnedMessage]);

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
        isBlock={!!blocked}
        setEmoji={setEmoji}
        setBlocked={setBlocked}
        conversationId={conversationId}
        setIsOpenUserDetail={setIsOpenUserDetail}
        friendInformation={friendInformation}
        ref={contentHeader.observe}
        handleCloseDrawer={handleCloseDrawer}
        setPinnedMessage={setPinnedMessage}
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
              ref={pinnedMessage === message._id ? pinnedMessageRef : null}
              isLast={index === messages.length - 1}
              setMessages={setMessages}
              key={message._id}
              messageId={message._id}
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
      <Box ref={contentFooter.observe}>
        {isPendingConversation && createdById !== currentUserId && (
          <PendingConversationWarning />
        )}
        <Box
          display="flex"
          alignItems="center"
          py={1}
          px={2}
          bgcolor={darkMode ? theme.palette.darkTheme.dark : undefined}
          borderTop={`0.5px solid ${
            darkMode ? theme.palette.darkTheme.light : theme.palette.grey[400]
          }`}
        >
          {!blocked ? (
            <>
              <TextBox
                text={text}
                ref={uploadImageRef}
                handleSubmit={handleSubmit}
                handleImageChange={handleImageChange}
                handleTextChange={handleTextChange}
                imageClick={() => {
                  uploadImageRef.current?.click();
                }}
              />

              <IconButton
                disabled={
                  !text || isCreateMessageLoading || isUpdateConversationLoading
                }
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
                  handleCreateMessage(newEmoji);
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                }}
              >
                {newEmoji}
              </IconButton>
              <Box>
                <EmojiCategory setText={setText} />
              </Box>
            </>
          ) : (
            <BlockBox
              setBlocked={setBlocked}
              userBlockedId={friendInformation?._id ?? ""}
              conversationId={conversationId}
              blockedByUser={blocked}
            />
          )}
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
