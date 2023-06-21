import { Avatar, Box } from "@mui/material";
import { theme } from "@theme";
import React from "react";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import ChatOption from "./ChatOption";
import { MessageType } from "@typing/common";
import { isImageLink } from "@utils/common";
import CATypography from "@components/Typography";
interface ChatContentProps {
  me?: boolean;
  text: string;
  createdAt: Date;
  avatar?: string;
  messageId: string;
  isLast: boolean;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
}

const handleRenderText = (str: string, me: boolean) => {
  const urlRegex = /(https?:\/\/[^\s]+)/;

  if (urlRegex.test(str)) {
    return parse(`
          <a href="${str}" target="_blank" rel="noopener noreferrer" style="color: ${
      me ? theme.palette.common.white : theme.palette.text.primary
    }">
            ${
              isImageLink(str)
                ? `<img src="${str}" style="width:100%; max-width: 400px" alt="" />`
                : str
            }
          </a>
        `);
  }
  return str;
};

// eslint-disable-next-line react/display-name
const ChatContent = React.forwardRef<HTMLElement, ChatContentProps>(
  ({ me, text, avatar, messageId, setMessages, isLast }, ref) => {
    const { darkMode } = useSelector((state: AppState) => state.darkMode);

    return (
      <Box
        ref={ref}
        display="flex"
        alignItems="end"
        maxWidth="70%"
        mt={0.5}
        {...(me ? { alignSelf: "end" } : { alignSelf: "start" })}
      >
        {!me && (
          <Avatar
            sx={{ width: 30, height: 30, mr: 1 }}
            src={avatar || "/images/avatar-default.svg"}
          />
        )}
        <Box
          display="flex"
          flexDirection={me ? "row-reverse" : "row"}
          sx={{
            "&:hover": {
              ".MuiSvgIcon-root": {
                display: "block",
              },
            },
          }}
        >
          <Box
            p={1}
            px={2}
            borderRadius={5}
            overflow="hidden"
            sx={{
              wordWrap: "break-word",
              whiteSpace: "normal",
              bgcolor: me
                ? theme.palette.primary.main
                : darkMode
                ? theme.palette.darkTheme.lighter
                : theme.palette.grey[50],
            }}
          >
            <CATypography
              fontWeight={400}
              variant="body2"
              height="auto"
              width="100%"
              sx={{
                color: me
                  ? theme.palette.common.white
                  : darkMode
                  ? theme.palette.common.white
                  : theme.palette.text.primary,
              }}
            >
              {handleRenderText(text, me as boolean)}
            </CATypography>
          </Box>
          <ChatOption
            canDelete={!isLast}
            setMessages={setMessages}
            messageId={messageId}
          />
        </Box>
      </Box>
    );
  }
);

export default ChatContent;
