import { Avatar, Box } from "@mui/material";
import { theme } from "@theme";
import React, { useState } from "react";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import ChatOption from "./ChatOption";
import { MessageType } from "@typing/common";
import { isImageLink } from "@utils/common";
import CATypography from "@components/Typography";
import { isSpecialText as checkSpecialText } from "@utils/common";

interface ChatContentProps {
  me?: boolean;
  text: string;
  createdAt: Date;
  avatar?: string;
  messageId: string;
  isLast: boolean;
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
}

const handleRenderText = (str: string, me: boolean, isSpecialText: boolean) => {
  const urlRegex = /(https?:\/\/[^\s]+)/;

  if (urlRegex.test(str)) {
    return parse(`
          <a href="${str}" target="_blank" rel="noopener noreferrer" style="color: ${
      me ? theme.palette.common.white : theme.palette.text.primary
    }">
            ${
              isImageLink(str)
                ? `<img src="${str}" style="width:100%; max-width: 400px" alt="" />`
                : isSpecialText
                ? str.replace(/^> /, "c")
                : str
            }
          </a>
        `);
  }
  return isSpecialText ? str.replace(/^> /, "") : str;
};

// eslint-disable-next-line react/display-name
const ChatContent = React.forwardRef<HTMLElement, ChatContentProps>(
  ({ me, text, avatar, messageId, setMessages, isLast }, ref) => {
    const { darkMode } = useSelector((state: AppState) => state.darkMode);
    const [isSpecialText] = useState(checkSpecialText(text));

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
                opacity: 1,
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
            <Box
              sx={{
                ...(isSpecialText && {
                  borderLeft: `3px solid ${theme.palette.grey[500]} `,
                  borderRadius: 0.5,
                  px: 1,
                }),
              }}
            >
              <CATypography
                fontWeight={400}
                variant="body2"
                height="auto"
                width="100%"
                fontStyle={isSpecialText ? "italic" : "unset"}
                sx={{
                  color: isSpecialText
                    ? theme.palette.grey[500]
                    : me
                    ? theme.palette.common.white
                    : darkMode
                    ? theme.palette.common.white
                    : theme.palette.text.primary,
                }}
              >
                {handleRenderText(text, me as boolean, isSpecialText)}
              </CATypography>
            </Box>
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
