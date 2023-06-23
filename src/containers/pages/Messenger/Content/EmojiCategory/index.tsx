import { Box, IconButton, Popover } from "@mui/material";
import React, { useState } from "react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Emoji from "@components/Emoji";

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
          <Emoji onClick={handleAddIcon} />
        </Box>
      </Popover>
    </div>
  );
};

export default EmojiCategory;
