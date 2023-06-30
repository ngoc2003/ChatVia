import MSTextField from "@components/TextField";
import { IconButton, InputAdornment } from "@mui/material";
import React from "react";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";

interface TextBoxProps {
  text: string;
  imageClick: () => void;
  handleImageChange: (e: any) => void;
  handleSubmit: (e: any) => void;
  handleTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// eslint-disable-next-line react/display-name
const TextBox = React.forwardRef<HTMLInputElement, TextBoxProps>(
  (
    { imageClick, handleImageChange, handleTextChange, text, handleSubmit },
    ref
  ) => {
    return (
      <MSTextField
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={imageClick}>
                <input
                  ref={ref}
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <InsertPhotoIcon color="primary" />
              </IconButton>
            </InputAdornment>
          ),
        }}
        placeholder="Aa"
        containerProps={{
          sx: {
            height: 40,
          },
        }}
        disableBorderInput
        fullWidth
        value={text}
        onChange={handleTextChange}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            handleSubmit(e);
          }
        }}
      />
    );
  }
);

export default TextBox;
