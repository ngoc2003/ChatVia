import React, { useState } from "react";
import { Typography, TypographyProps } from "@mui/material";
import { omit } from "lodash";
import { theme } from "@theme";
import { useTranslation } from "react-i18next";

interface CATypographyProps extends TypographyProps {
  lineClamp?: number;
  showAllOption?: boolean;
}

const CATypography = ({
  showAllOption,
  lineClamp,
  ...props
}: CATypographyProps) => {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  
  return (
    <Typography>
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
          ...(!!lineClamp && lineClamp !== 1 && !showAll
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
      {showAllOption && (
        <Typography
          ml={0.5}
          variant="body2"
          fontWeight={600}
          fontStyle="italic"
          onClick={() => setShowAll((prev) => !prev)}
          color={theme.palette.common.white}
          sx={{ cursor: "pointer" }}
        >
          {showAll ? t("hide") : t("all")}
        </Typography>
      )}
    </Typography>
  );
};

export default CATypography;
