import Content from "@containers/pages/Messenger/Content";
import MenuChat from "@containers/pages/Messenger/MenuChat";
import Online from "@containers/pages/Messenger/Online";
import { Box } from "@mui/material";
import { theme } from "@theme";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import cookie from "cookie";
import { NextSeo } from "next-seo";
import { Socket, io } from "socket.io-client";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import Topbar from "@containers/pages/Messenger/Topbar";
import CreateConversationModal from "@containers/Modals/CreateConversation";

const Messenger = () => {
  const [friendInformation, setFriendInformation] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState<any>([]);
  const [arrivalMessage, setArrivalMessage] = useState<any>(null);
  const [isOpenAddConversationModal, setIsOpenAddConversationModal] =
    useState<boolean>(true);

  const user = useSelector((state: AppState) => state.auth);

  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    if (user.id && socket?.current) {
      socket.current.emit("addUser", user.id);
      socket.current.on("getUsers ", (users) => {
        console.log(users);
      });
    }
  }, [user.id]);

  const handleOpenAddConversationModal = () => {
    setIsOpenAddConversationModal(true);
  };
  const handleCloseAddConversationModal = () => {
    setIsOpenAddConversationModal(false);
  };

  useEffect(() => {
    socket.current = io("localhost:5000", {
      transports: ["websocket"],
    });
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: new Date(),
      });
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

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Topbar />
      <CreateConversationModal
        open={isOpenAddConversationModal}
        onClose={handleCloseAddConversationModal}
      />
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
          setOpenAddConversationModal={handleOpenAddConversationModal}
          currentConversationId={currentConversation?._id ?? ""}
          setCurrentConversation={setCurrentConversation}
          setFriendInformation={setFriendInformation}
          flex={1.2}
          minWidth={380}
        />
        <Content
          conversationId={currentConversation?._id ?? ""}
          arrivalMessage={arrivalMessage}
          socket={socket}
          receiverId={
            currentConversation?.members.find((member) => member !== user.id) ??
            ""
          }
          setMessages={setMessages}
          messages={messages}
          flex={3}
        />
        <Online flex={1} />
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
