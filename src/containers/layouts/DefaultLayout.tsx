import Topbar from "@containers/pages/Messenger/Topbar";
import { Box, Fade } from "@mui/material";
import { theme } from "@theme";
import React, { ReactNode } from "react";

interface DefaultLayoutProps {
  setTabActive: React.Dispatch<React.SetStateAction<string>>;
  children: ReactNode;
  tabActive: string;
}
const DefaultLayout = ({
  children,
  setTabActive,
  tabActive,
}: DefaultLayoutProps) => {
  return (
    <Fade in>
      <Box height="100vh" display="flex" flexDirection="column">
        <Topbar tabActive={tabActive} setTabActive={setTabActive} />
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
