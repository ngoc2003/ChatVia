import Content from "@containers/pages/Messenger/Content";
import MenuChat from "@containers/pages/Messenger/MenuChat";
import Online from "@containers/pages/Messenger/Online";
import { Box } from "@mui/material";
import { theme } from "@theme";
import axios from "axios";
import { useEffect, useState } from "react";
import cookie from "cookie";
import { NextSeo } from "next-seo";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import Topbar from "@containers/pages/Messenger/Topbar";
import useSocket from "@hooks/useSocket";

const Messenger = () => {
  const socket = useSocket();
  const [messages, setMessages] = useState<any>([]);
  const [arrivalMessage, setArrivalMessage] = useState<any>(null);
  const [friendInformation, setFriendInformation] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
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

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/messages/${currentConversation?._id}`
        );
        setMessages(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentConversation?._id]);

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
