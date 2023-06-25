import { Box, CircularProgress, Typography } from "@mui/material";
import { AppState } from "@stores";
import { theme } from "@theme";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ConversationList from "../MenuChat/ConversationList";
import { ConversationType } from "@typing/common";
import { FriendInformationType } from "@pages";

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
  const { darkMode } = useSelector((state: AppState) => state.darkMode);

  useEffect(() => {
    if (arrivalConversation) {
      setConversations((prev) => [arrivalConversation, ...prev]);
    }
  }, [arrivalConversation, setConversations]);

  return (
    <Box
      p={3}
      bgcolor={
        darkMode ? theme.palette.darkTheme.main : theme.palette.primary.light
      }
      sx={{
        overflowY: "scroll",
      }}
      {...props}
    >
      <Box mb={3}>
        <Typography
          color={darkMode ? theme.palette.common.white : undefined}
          variant="h5"
          fontWeight={600}
        >
          {t("title.pendingConversation")}
        </Typography>
      </Box>
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
    </Box>
  );
};

export default PendingConversation;
