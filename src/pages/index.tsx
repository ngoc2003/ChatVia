import Content from "@containers/pages/Messenger/Content";
import MenuChat from "@containers/pages/Messenger/MenuChat";
import Online from "@containers/pages/Messenger/Online";
import { Box } from "@mui/material";
import { theme } from "@theme";
import { useEffect, useState } from "react";
import cookie from "cookie";
import { NextSeo } from "next-seo";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import Topbar from "@containers/pages/Messenger/Topbar";
import useSocket from "@hooks/useSocket";
import { useLazyGetMessageListByConversationIdQuery } from "@stores/services/message";
import { ConversationType, MessageType } from "@typing/common";

export interface FriendInformationType {
  name: string;
}

export interface ArrivalMessageType
  extends Pick<MessageType, "sender" | "text" | "createdAt"> {}

const Messenger = () => {
  const socket = useSocket();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [arrivalMessage, setArrivalMessage] = useState<any>(null);
  const [friendInformation, setFriendInformation] =
    useState<FriendInformationType | null>(null);
  const [currentConversation, setCurrentConversation] =
    useState<ConversationType | null>(null);
  const [arrivalConversation, setArrivalConversation] = useState<any>(null);

  const user = useSelector((state: AppState) => state.auth);

  useEffect(() => {
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: new Date(),
      });
    });
    socket.current.on("getConversation", (data) => {
      setArrivalConversation(data);
    });
  }, []);

  const [getMessage] = useLazyGetMessageListByConversationIdQuery();

  useEffect(() => {
    if (!currentConversation?._id) {
      return;
    }
    getMessage({ conversationId: currentConversation?._id })
      .unwrap()
      .then((response) => {
        setMessages(response);
      });
  }, [currentConversation?._id, getMessage]);

  if (!socket) {
    return;
  }

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Topbar />
      <NextSeo
        {...(friendInformation
          ? { title: "Chat via - " + friendInformation.name }
          : { title: "Chat via" })}
      />
      <Box
        display="flex"
        overflow="hidden"
        flex={1}
        bgcolor={theme.palette.common.white}
      >
        <MenuChat
          messages={messages}
          arrivalMessage={arrivalMessage}
          arrivalConversation={arrivalConversation}
          currentConversationId={currentConversation?._id ?? ""}
          setCurrentConversation={setCurrentConversation}
          setFriendInformation={setFriendInformation}
          flex={1.2}
          minWidth={380}
        />
        <Content
          conversationId={currentConversation?._id ?? ""}
          arrivalMessage={arrivalMessage}
          receiverId={
            currentConversation?.members.find((member) => member !== user.id) ??
            ""
          }
          setMessages={setMessages}
          messages={messages}
          flex={3}
        />
        <Online friendInformation={friendInformation} flex={1} />
      </Box>
    </Box>
  );
};

export default Messenger;

export async function getServerSideProps(ctx) {
  const { tokenMessage } = cookie.parse(ctx.req.headers.cookie ?? "");

  if (!tokenMessage) {
    return {
      redirect: {
        destination: "/auth",
        permanent: true,
      },
    };
  }

  return { props: {} };
}
