import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { theme } from "@theme";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import { useTranslation } from "react-i18next";
import { handleUploadImage } from "@utils/common";

interface ImageUploadProps {
  onChange: (url: string) => void;
  defaultValue?: string;
}

function ImageUpload({ onChange = () => {}, defaultValue }: ImageUploadProps) {
  const { t } = useTranslation();
  const { darkMode } = useSelector((state: AppState) => state.darkMode);

  const [imagePreview, setImagePreview] = useState<string>(defaultValue ?? "");

  const handleChange = async (e) => {
    handleUploadImage(e, setImagePreview, onChange);
  };

  return (
    <>
      <Box mt={3}>
        <Typography
          fontWeight={500}
          color={
            darkMode ? theme.palette.text.secondary : theme.palette.grey[700]
          }
          mb={1}
        >
          {t("field.avatar")}
        </Typography>{" "}
        <input type="file" onChange={handleChange} />
        {imagePreview && (
          <Box
            mt={2}
            component="img"
            src={imagePreview}
            alt="img"
            width="100%"
          />
        )}
      </Box>
    </>
  );
}

export default ImageUpload;
