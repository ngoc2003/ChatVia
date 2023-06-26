import { iconsLibrary } from "@constants";
import { Box, Typography } from "@mui/material";
import { AppState } from "@stores";
import { theme } from "@theme";
import React from "react";
import { useSelector } from "react-redux";

interface EmojiProps {
  onClick: (emofi: string) => void;
  keyName?: string;
}

const Emoji = ({ keyName, onClick }: EmojiProps) => {
  const { darkMode } = useSelector((state: AppState) => state.darkMode);
  const handleClick = (item: string) => {
    onClick(item);
  };
  return (
    <>
      {iconsLibrary.map((icons) => (
        <Box key={icons.name}>
          <Typography
            color={darkMode ? theme.palette.common.white : undefined}
            mx={1}
            variant="body3"
            fontWeight={600}
          >
            {icons.name}
          </Typography>
          <Box display="flex" flexWrap="wrap">
            {icons.icons.map((item) => (
              <Box
                p={0.5}
                borderRadius={0.5}
                onClick={() => handleClick(item)}
                sx={{
                  cursor: "pointer",

                  "&:hover": {
                    bgcolor: theme.palette.primary.light,
                  },
                }}
                key={(keyName ?? "") + item}
              >
                {item}
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </>
  );
};

export default Emoji;
