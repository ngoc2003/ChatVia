import React from "react";
import Conversation from "../Conversation";
import { ConversationType } from "@typing/common";
import { FriendInformationType } from "@pages";
import { Typography } from "@mui/material";
import { useTranslation } from "next-i18next";

interface ConversationListProps {
  conversations: ConversationType[];
  currentConversationId?: string;
  setCurrentConversation: React.Dispatch<
    React.SetStateAction<ConversationType | null>
  >;
  setFriendInformation: React.Dispatch<
    React.SetStateAction<FriendInformationType>
  >;
}

const ConversationList = ({
  conversations,
  currentConversationId,
  setCurrentConversation,
  setFriendInformation,
}: ConversationListProps) => {
  const { t } = useTranslation();
  return (
    <>
      {!conversations.length ? (
        <Typography fontStyle="italic">{t("noConversationFounded")}</Typography>
      ) : (
        conversations.map((conversation: ConversationType) => (
          <Conversation
            isActive={currentConversationId === conversation._id}
            onClick={() => setCurrentConversation(conversation)}
            setFriendInformation={setFriendInformation}
            conversation={conversation}
            key={"conversation" + conversation._id}
          />
        ))
      )}
    </>
  );
};

export default ConversationList;
