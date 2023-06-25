import React from "react";
import { Typography, TypographyProps } from "@mui/material";
import { omit } from "lodash";

interface CATypographyProps extends TypographyProps {
  lineClamp?: number;
}

const CATypography = ({ lineClamp, ...props }: CATypographyProps) => {
  return (
    <Typography
      sx={{
        ...(lineClamp === 1
          ? {
              display: "inline-block",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }
          : {}),
        ...(!!lineClamp && lineClamp
          ? {
              whiteSpace: "pre-line",
              WebkitLineClamp: lineClamp,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordBreak: "break-all",
            }
          : {}),
        ...props?.sx,
      }}
      {...omit(props, ["sx", "lineClamp"])}
    />
  );
};

export default CATypography;
