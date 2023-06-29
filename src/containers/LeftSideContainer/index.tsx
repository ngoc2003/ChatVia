import MSTextField from "@components/TextField";
import { Box, BoxProps, IconButton, Typography } from "@mui/material";
import { AppState } from "@stores";
import { theme } from "@theme";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

interface LeftSideContainerProps extends BoxProps {
  icon?: ReactNode;
  iconInput?: ReactNode;
  onClickIcon?: () => void;
  onChangeInput?: (e: any) => void;
  title: string;
}

const LeftSideContainer = ({
  children,
  icon,
  title,
  iconInput,
  onClickIcon,
  onChangeInput,
  ...props
}: LeftSideContainerProps) => {
  const { t } = useTranslation();
  const { darkMode } = useSelector((state: AppState) => state.darkMode);
  return (
    <Box
      display="flex"
      flexDirection="column"
      p={3}
      bgcolor={
        darkMode ? theme.palette.darkTheme.main : theme.palette.primary.light
      }
      sx={{
        overflowY: "scroll",
      }}
      {...props}
    >
      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          variant="h5"
          fontWeight={600}
          color={darkMode ? theme.palette.common.white : undefined}
        >
          {title}
        </Typography>
        {icon && onClickIcon && (
          <IconButton size="small" onClick={onClickIcon}>
            {icon}
          </IconButton>
        )}
      </Box>
      {iconInput && onChangeInput && (
        <MSTextField
          iconProps={{
            sx: {
              bgcolor: "transparent",
              pr: 0,
            },
          }}
          disableBorderInput
          fullWidth
          placeholder={t("placeholder.searchForMessageOrUser")}
          icon={iconInput}
          onChange={onChangeInput}
        />
      )}

      {children}
    </Box>
  );
};

export default LeftSideContainer;
