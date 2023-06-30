import { Box, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import ConversationList from "../MenuChat/ConversationList";
import { ConversationType } from "@typing/common";
import { FriendInformationType } from "@pages";
import LeftSideContainer from "@containers/layouts/LeftSideContainer";

interface PendingConversationProps {
  isFetching: boolean;
  conversations: ConversationType[];
  arrivalConversation: any;
  currentConversationId: string;
  setCurrentConversation: React.Dispatch<
    React.SetStateAction<ConversationType | null>
  >;
  setFriendInformation: React.Dispatch<
    React.SetStateAction<FriendInformationType | null>
  >;
  setConversations: React.Dispatch<React.SetStateAction<ConversationType[]>>;
}

const PendingConversation = ({
  isFetching,
  conversations,
  setConversations,
  currentConversationId,
  setCurrentConversation,
  setFriendInformation,
  arrivalConversation,
  ...props
}: PendingConversationProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (arrivalConversation) {
      setConversations((prev) => [arrivalConversation, ...prev]);
    }
  }, [arrivalConversation, setConversations]);

  return (
    <LeftSideContainer title={t("title.pendingConversation")} {...props}>
      <Box flex={1}>
        {isFetching ? (
          <Box
            display="grid"
            sx={{
              placeItems: "center",
            }}
            width="100%"
            flex={1}
          >
            <CircularProgress size={20} />
          </Box>
        ) : (
          <ConversationList
            conversations={conversations}
            setCurrentConversation={setCurrentConversation}
            setFriendInformation={setFriendInformation}
            currentConversationId={currentConversationId}
          />
        )}
      </Box>
    </LeftSideContainer>
  );
};

export default PendingConversation;
