import React, { useMemo } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useGetImageQuery } from "@stores/services/conversation";
import Link from "next/link";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import { theme } from "@theme";
import { useTranslation } from "react-i18next";
import { ImageWithUserInformation } from "@stores/services/conversation/typing";

interface QuiltedImageListProps {
  conversationId: string;
}

interface ExtendedImageWithUserInformation extends ImageWithUserInformation {
  cols?: number;
  rows?: number;
}

export default function QuiltedImageList({
  conversationId,
}: QuiltedImageListProps) {
  const { t } = useTranslation();
  const { data, isFetching } = useGetImageQuery({ conversationId });
  const { darkMode } = useSelector((state: AppState) => state.darkMode);

  const images = useMemo<ExtendedImageWithUserInformation[]>(() => {
    if (data?.length) {
      return data.map((item, index: number) => {
        let indexToCheck = index % 8;
        let x: number | null = null;
        let y: number | null = null;

        if (indexToCheck === 3 || indexToCheck === 4) {
          x = 2;
        } else if (indexToCheck === 0 || indexToCheck === 5) {
          x = 2;
          y = 2;
        }

        return {
          ...item,
          ...(x && {
            cols: x,
          }),
          ...(y && {
            rows: y,
          }),
        };
      });
    }

    return [];
  }, [data]);

  if (isFetching) {
    return (
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
    );
  }

  if (!data?.length) {
    return (
      <Typography
        mt={3}
        color={darkMode ? theme.palette.common.white : undefined}
        fontStyle="italic"
      >
        {t("noImageFounded")}
      </Typography>
    );
  }

  return (
    <ImageList
      sx={{ width: "100%", overflow: "hidden" }}
      variant="quilted"
      cols={4}
      rowHeight={110}
    >
      {images.map((item) => (
        <ImageListItem key={item.text} cols={item.cols} rows={item.rows}>
          <Link href={item.text} target="_blank">
            <Box
              component="img"
              src={item.text}
              width="100%"
              height="100%"
              alt="image"
              sx={{ objectFit: "cover" }}
            />
          </Link>
        </ImageListItem>
      ))}
    </ImageList>
  );
}
