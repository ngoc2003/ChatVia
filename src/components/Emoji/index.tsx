import { iconsLibrary } from "@constants";
import { Box, Typography } from "@mui/material";
import { theme } from "@theme";
import React from "react";

interface EmojiProps {
  onClick: (emofi: string) => void;
  keyName?: string;
}

const Emoji = ({ keyName, onClick }: EmojiProps) => {
  const handleClick = (item: string) => {
    onClick(item);
  };
  return (
    <>
      {iconsLibrary.map((icons) => (
        <Box key={icons.name}>
          <Typography mx={1} variant="body3" fontWeight={600}>
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
                key={(keyName || "") + item}
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
