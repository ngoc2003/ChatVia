import { Box, Menu, MenuItem, Typography } from "@mui/material";
import React from "react";
import { IconWrapper } from "..";
import LanguageIcon from "@mui/icons-material/Language";
import { useRouter } from "next/router";
import Image from "next/image";

const SwitchLanguage = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const switchToEnglish = () => {
    router.push(router.pathname, router.asPath, { locale: "en" });
  };

  const switchToVietnamese = () => {
    router.push(router.pathname, router.asPath, { locale: "vi" });
  };

  return (
    <Box>
      <IconWrapper onClick={handleClick} ml={3}>
        <LanguageIcon />
      </IconWrapper>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
        <MenuItem onClick={switchToEnglish}>
          <Image src="/images/eng.jpeg" width={16} height={10} alt="english" />
          <Typography ml={1}>English</Typography>
        </MenuItem>
        <MenuItem onClick={switchToVietnamese}>
          <Image
            src="/images/vietnam.png"
            width={16}
            height={10}
            alt="vietnam"
          />
          <Typography ml={1}>Tiếng Việt</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default SwitchLanguage;
