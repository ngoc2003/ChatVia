import { Avatar, Box, Typography } from "@mui/material";
import { theme } from "@theme";
import React from "react";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
interface ChatContentProps {
  me?: boolean;
  text: string;
  createdAt: Date;
}

const handleRenderText = (str: string, me: boolean) => {
  const urlRegex = /(https?:\/\/[^\s]+)/;

  if (urlRegex.test(str)) {
    return parse(
      `<a href=${str} style="color: ${
        me ? theme.palette.common.white : theme.palette.text.primary
      }" target="_blank" rel="noopener noreferrer">${str}</a>`
    );
  }
  return str;
};
// eslint-disable-next-line react/display-name
const ChatContent = React.forwardRef<HTMLElement, ChatContentProps>(
  ({ me, text }, ref) => {
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
            src="/images/avatar-default.svg"
          />
        )}
        <Box>
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
            <Typography
              fontWeight={400}
              variant="body2"
              height="auto"
              width="100%"
              whiteSpace="pre-line"
              sx={{
                color: me
                  ? theme.palette.common.white
                  : darkMode
                  ? theme.palette.common.white
                  : theme.palette.text.primary,
              }}
            >
              {handleRenderText(text, me as boolean)}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
);

export default ChatContent;
