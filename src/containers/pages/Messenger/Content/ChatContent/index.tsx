import { Avatar, Box, Typography } from "@mui/material";
import { theme } from "@theme";
import React from "react";
interface ChatContentProps {
  me?: boolean;
  text: string;
  createdAt: Date;
}
// eslint-disable-next-line react/display-name
const ChatContent = React.forwardRef<HTMLElement, ChatContentProps>(
  ({ me, text, createdAt }, ref) => {
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
              bgcolor: me ? theme.palette.primary.main : theme.palette.grey[50],
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
                  : theme.palette.text.primary,
              }}
            >
              {text}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
);

export default ChatContent;
