import Topbar from "@containers/pages/Messenger/Topbar";
import { Box, Fade } from "@mui/material";
import { theme } from "@theme";
import React, { ReactNode } from "react";

interface DefaultLayoutProps {
  children: ReactNode;
}
const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <Fade in>
      <Box height="100vh" display="flex" flexDirection="column">
        <Topbar />
        <Box
          display="flex"
          overflow="hidden"
          flex={1}
          bgcolor={theme.palette.common.white}
        >
          {children}
        </Box>
      </Box>
    </Fade>
  );
};

export default DefaultLayout;
