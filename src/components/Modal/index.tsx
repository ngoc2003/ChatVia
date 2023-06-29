import {
  Box,
  BoxProps,
  IconButton,
  Modal,
  ModalProps,
  Typography,
} from "@mui/material";
import { omit } from "lodash";
import React from "react";

import * as Styles from "./Modal.styled";
import { theme } from "@theme";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import CloseIcon from "@mui/icons-material/Close";
export interface CAModalButtonProps {
  color?: string;
  label: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface CAModalProps extends ModalProps {
  title?: string;
  containerProps?: BoxProps;
  hasPaddingHorizontal?: boolean;
}

const CAModal = ({
  title,
  children,
  containerProps,
  hasPaddingHorizontal = true,
  ...props
}: CAModalProps) => {
  const { darkMode } = useSelector((state: AppState) => state.darkMode);

  return (
    <Modal {...props}>
      <Styles.ModalContainer
        sx={{
          bgcolor: darkMode
            ? theme.palette.darkTheme.main
            : theme.palette.common.white,
          width: theme.spacing(50),
          py: theme.spacing(3),
          px: hasPaddingHorizontal ? theme.spacing(3) : 0,
          [theme.breakpoints.up("md")]: {
            width: theme.spacing(70),
          },
          [theme.breakpoints.up("lg")]: {
            width: theme.spacing(80),
          },
          ...containerProps?.sx,
        }}
        {...omit(containerProps, ["sx"])}
      >
        <Box textAlign="right">
          <IconButton
            size="small"
            onClick={() => props.onClose?.({}, "escapeKeyDown")}
          >
            <CloseIcon color="primary" fontSize="small" />
          </IconButton>
        </Box>
        <Box>
          {title && (
            <Box width="100%" pb={3}>
              <Typography
                ml="auto"
                mr="auto"
                fontWeight={600}
                lineHeight={theme.spacing(4)}
                minWidth={0}
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {title}
              </Typography>
            </Box>
          )}
          <Box>{children}</Box>
        </Box>
      </Styles.ModalContainer>
    </Modal>
  );
};

export default CAModal;
