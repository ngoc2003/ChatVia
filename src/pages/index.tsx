/* eslint-disable react-hooks/exhaustive-deps */
import Content from "@containers/pages/Messenger/Content";
import MenuChat from "@containers/pages/Messenger/MenuChat";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect, useState } from "react";
import cookie from "cookie";
import { NextSeo } from "next-seo";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import useSocket from "@hooks/useSocket";
import { useLazyGetMessageListByConversationIdQuery } from "@stores/services/message";
import { ConversationType, MessageType, UserType } from "@typing/common";
import DefaultLayout from "@containers/layouts/DefaultLayout";
import { useRouter } from "next/router";
import ContactList from "@containers/pages/Messenger/ContactList";
import useResponsive from "@hooks/useResponsive";
import Online from "@containers/pages/Messenger/Online";
import MyProfile from "@containers/pages/Messenger/MyProfile";

export interface FriendInformationType extends Omit<UserType, "username"> {
  name: string;
}

export interface ArrivalMessageType
  extends Pick<MessageType, "sender" | "text" | "createdAt"> {
  conversationId: string;
}

const Messenger = () => {
  const socket = useSocket();
  const router = useRouter();
  const user = useSelector((state: AppState) => state.auth);
  const { isDesktopLg } = useResponsive();
  const [tabActive, setTabActive] = useState<string>(router.pathname);
  const [isInitialization, setIsInitialization] = useState<boolean>(false);

  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<ConversationType | null>(null);

  const [isOpenUserDetail, setIsOpenUserDetail] = useState<boolean>(false);
  const [friendInformation, setFriendInformation] =
    useState<FriendInformationType | null>(null);

  const [arrivalMessage, setArrivalMessage] =
    useState<ArrivalMessageType | null>(null);
  const [arrivalConversation, setArrivalConversation] = useState<any>(null);

  const [getMessage] = useLazyGetMessageListByConversationIdQuery();

  useEffect(() => {
    setIsInitialization(true);
  }, []);

  useEffect(() => {
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        conversationId: data.conversationId,
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
    if (!currentConversation?._id || !user?.id) {
      return;
    }

    getMessage({ conversationId: currentConversation?._id, userId: user.id })
      .unwrap()
      .then((response) => {
        setMessages(response);
      });
  }, [currentConversation?._id, getMessage]);

  if (!socket) {
    return;
  }

  return (
    <>
      {isInitialization && (
        <DefaultLayout tabActive={tabActive} setTabActive={setTabActive}>
          <NextSeo
            {...(friendInformation
              ? { title: "Chat via - " + friendInformation.name }
              : { title: "Chat via" })}
          />

          {tabActive === "/" && (
            <MenuChat
              conversations={conversations}
              setConversations={setConversations}
              lastMessages={messages[messages.length - 1] || null}
              arrivalMessage={arrivalMessage}
              arrivalConversation={arrivalConversation}
              currentConversationId={currentConversation?._id ?? ""}
              setCurrentConversation={setCurrentConversation}
              setFriendInformation={setFriendInformation}
              {...(isDesktopLg ? { width: 380 } : { flex: 1 })}
            />
          )}
          {tabActive === "/contact" && (
            <ContactList {...(isDesktopLg ? { width: 380 } : { flex: 1 })} />
          )}
          {tabActive === "/me" && (
            <MyProfile {...(isDesktopLg ? { width: 380 } : { flex: 1 })} />
          )}
          <Content
            emoji={currentConversation?.emoji ?? ""}
            setConversations={setConversations}
            conversationId={currentConversation?._id ?? ""}
            setCurrentConversation={setCurrentConversation}
            arrivalMessage={arrivalMessage}
            setMessages={setMessages}
            messages={messages}
            flex={3}
            friendInformation={friendInformation}
            setIsOpenUserDetail={setIsOpenUserDetail}
            receiverId={
              currentConversation?.members.find(
                (member) => member !== user.id
              ) ?? ""
            }
          />
          <Online
            isOpenUserDetail={isOpenUserDetail}
            setIsOpenUserDetail={setIsOpenUserDetail}
            friendInformation={friendInformation}
            flex={1}
          />
        </DefaultLayout>
      )}
    </>
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
