import { Box, BoxProps, Modal, ModalProps, Typography } from "@mui/material";
import { omit } from "lodash";
import React from "react";

import * as Styles from "./Modal.styled";
import { theme } from "@theme";

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
  return (
    <Modal {...props}>
      <Styles.ModalContainer
        sx={{
          width: theme.spacing(30),
          py: theme.spacing(3),
          px: hasPaddingHorizontal ? theme.spacing(3) : 0,
          [theme.breakpoints.up("md")]: {
            width: theme.spacing(75),
          },
          [theme.breakpoints.up("lg")]: {
            width: theme.spacing(90),
          },
          ...containerProps?.sx,
        }}
        {...omit(containerProps, ["sx"])}
      >
        <Box>
          {title && (
            <Box width="100%" pb={3}>
              <Typography
                ml="auto"
                mr="auto"
                variant="title3"
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
