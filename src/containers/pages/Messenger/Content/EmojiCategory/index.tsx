import { iconsLibrary } from "@constants";
import { Box, IconButton, Popover, Typography } from "@mui/material";
import React, { useState } from "react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { theme } from "@theme";

interface EmojiCategoryProps {
  setText: React.Dispatch<React.SetStateAction<string>>;
}

const EmojiCategory = ({ setText }: EmojiCategoryProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleAddIcon = (icon: string) => {
    setText((prev) => prev + icon);
  };

  return (
    <div>
      <IconButton color="primary" onClick={handleClick}>
        <EmojiEmotionsIcon />
      </IconButton>
      <Popover
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Box
          width="100vw"
          maxWidth={300}
          maxHeight={300}
          overflow="scroll"
          p={1}
          borderRadius={1}
        >
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
                    onClick={() => handleAddIcon(item)}
                    sx={{
                      cursor: "pointer",

                      "&:hover": {
                        bgcolor: theme.palette.primary.light,
                      },
                    }}
                    key={item}
                  >
                    {item}
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Popover>
    </div>
  );
};

export default EmojiCategory;
