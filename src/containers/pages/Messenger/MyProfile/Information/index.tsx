import { Box, Typography } from "@mui/material";
import { theme } from "@theme";
import React from "react";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import Link from "next/link";

interface InformationProps {
  title: string;
  content?: string;
  href?: string;
}

// force user pass one of values("content | href")
export type RequiredInformationProps = InformationProps &
  ({ content: string; href?: never } | { content?: never; href: string });

export const Information = ({
  title,
  content,
  href,
}: RequiredInformationProps) => {
  const { darkMode } = useSelector((state: AppState) => state.darkMode);

  return (
    <Box mb={1}>
      <Typography
        sx={{ width: "100%" }}
        variant="body2"
        color={darkMode ? theme.palette.text.primary : theme.palette.grey[600]}
      >
        {title}
      </Typography>
      {href ? (
        <Link href={href} target="_blank" style={{ textDecoration: "none" }}>
          <Typography
            mt={1}
            variant="body2"
            fontStyle="italic"
            sx={{ width: "100%" }}
            color={darkMode ? theme.palette.common.white : undefined}
          >
            {href}
          </Typography>
        </Link>
      ) : (
        <Typography
          sx={{ width: "100%" }}
          mt={1}
          variant="body2"
          color={darkMode ? theme.palette.common.white : undefined}
        >
          {content}
        </Typography>
      )}
    </Box>
  );
};
