import React, { useEffect } from "react";
import Conversation from "../Conversation";
import { ConversationType } from "@typing/common";
import { FriendInformationType } from "@pages";
import { Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import { theme } from "@theme";
import { useSelector } from "react-redux";
import { AppState } from "@stores";

interface ConversationListProps {
  conversations: ConversationType[];
  currentConversationId?: string;
  setCurrentConversation: React.Dispatch<
    React.SetStateAction<ConversationType | null>
  >;
  setFriendInformation: React.Dispatch<
    React.SetStateAction<FriendInformationType | null>
  >;
}

const ConversationList = ({
  conversations,
  currentConversationId,
  setCurrentConversation,
  setFriendInformation,
}: ConversationListProps) => {
  const { t } = useTranslation();
  const { darkMode } = useSelector((state: AppState) => state.darkMode);

  useEffect(() => {
    if (
      conversations?.length &&
      currentConversationId &&
      !conversations.map((item) => item._id).includes(currentConversationId)
    ) {
      setCurrentConversation(null);
    }
  }, [conversations, currentConversationId, setCurrentConversation]);

  return (
    <>
      {!conversations?.length ? (
        <Typography
          color={darkMode ? theme.palette.text.secondary : undefined}
          fontStyle="italic"
        >
          {t("noConversationFounded")}
        </Typography>
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
