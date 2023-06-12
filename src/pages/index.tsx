import Content from "@containers/pages/Messenger/Content";
import MenuChat from "@containers/pages/Messenger/MenuChat";
import Online from "@containers/pages/Messenger/Online";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import cookie from "cookie";
import { NextSeo } from "next-seo";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import useSocket from "@hooks/useSocket";
import { useLazyGetMessageListByConversationIdQuery } from "@stores/services/message";
import { ConversationType, MessageType } from "@typing/common";
import DefaultLayout from "@containers/layouts/DefaultLayout";
import { useRouter } from "next/router";
import ContactList from "@containers/pages/Messenger/ContactList";

export interface FriendInformationType {
  name: string;
}

export interface ArrivalMessageType
  extends Pick<MessageType, "sender" | "text" | "createdAt"> {}

const Messenger = () => {
  const socket = useSocket();
  const router = useRouter();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [tabActive, setTabActive] = useState<any>(router.pathname);
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
    <DefaultLayout tabActive={tabActive} setTabActive={setTabActive}>
      <NextSeo
        {...(friendInformation
          ? { title: "Chat via - " + friendInformation.name }
          : { title: "Chat via" })}
      />

      {tabActive === "/" && (
        <MenuChat
          messages={messages}
          arrivalMessage={arrivalMessage}
          arrivalConversation={arrivalConversation}
          currentConversationId={currentConversation?._id ?? ""}
          setCurrentConversation={setCurrentConversation}
          setFriendInformation={setFriendInformation}
          width={380}
        />
      )}
      {tabActive === "/contact" && <ContactList />}
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
      {/* <Online friendInformation={friendInformation} flex={1} /> */}
    </DefaultLayout>
  );
};

export default Messenger;

export async function getServerSideProps(ctx) {
  const { locale, ...rest } = ctx;
  const { tokenMessage } = cookie.parse(rest.req.headers.cookie ?? "");

  if (!tokenMessage) {
    return {
      redirect: {
        destination: "/auth",
        permanent: true,
      },
    };
  }

  return {
    props: { ...(await serverSideTranslations(locale, ["common"])), locale },
  };
}
