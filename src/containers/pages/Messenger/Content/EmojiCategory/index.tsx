import { Box, IconButton, Popover } from "@mui/material";
import React, { useState } from "react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Emoji from "@components/Emoji";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import { theme } from "@theme";

interface EmojiCategoryProps {
  setText: React.Dispatch<React.SetStateAction<string>>;
}

const EmojiCategory = ({ setText }: EmojiCategoryProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { darkMode } = useSelector((state: AppState) => state.darkMode);
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
    <Box>
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
          p={1}
          width="100vw"
          maxWidth={300}
          maxHeight={300}
          overflow="scroll"
          borderRadius={1}
          bgcolor={darkMode ? theme.palette.darkTheme.light : undefined}
        >
          <Emoji onClick={handleAddIcon} />
        </Box>
      </Popover>
    </Box>
  );
};

export default EmojiCategory;
