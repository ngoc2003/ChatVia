import axios from "axios";
import { useState } from "react";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { Box, CircularProgress, Typography } from "@mui/material";
import { theme } from "@theme";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import { useTranslation } from "react-i18next";

interface ImageUploadProps {
  onChange: (url: string) => void;
  defaultValue?: string;
}

function ImageUpload({ onChange = () => {}, defaultValue }: ImageUploadProps) {
  const { t } = useTranslation();
  const { darkMode } = useSelector((state: AppState) => state.darkMode);

  const [imagePreview, setImagePreview] = useState<string>(defaultValue || "");

  const [loading, setIsLoading] = useState<boolean>(false);

  const handleChange = async (e) => {
    setIsLoading(true);
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const image = new Image();
      image.onload = function () {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800; // Maximum width for the resized image
        const MAX_HEIGHT = 600; // Maximum height for the resized image
        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(image, 0, 0, width, height);

          canvas.toBlob(async (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
              });

              const bodyFormData = new FormData();
              bodyFormData.append("image", resizedFile);
              const response = await axios({
                method: "POST",
                url: publicRuntimeConfig.IMGBB_API,
                data: bodyFormData,
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              });

              if (response.data.data.url) {
                setIsLoading(false);
              }
              setImagePreview(response.data.data.url);
              onChange(response.data.data.url);
            }
          }, file.type);
        }
      };
      if (typeof event?.target?.result === "string") {
        image.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
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
        {loading && (
          <Box
            minHeight={200}
            display="grid"
            sx={{
              placeItems: "center",
              pointerEvents: "none",
            }}
          >
            <CircularProgress size={20} />
          </Box>
        )}
        {!loading && imagePreview && (
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
