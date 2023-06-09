import React from "react";
import Conversation from "../Conversation";
import { ConversationType } from "@typing/common";
import { FriendInformationType } from "@pages";
import { Typography } from "@mui/material";

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
  return (
    <>
      {!conversations.length ? (
        <Typography fontStyle="italic">No conversations founded!</Typography>
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
