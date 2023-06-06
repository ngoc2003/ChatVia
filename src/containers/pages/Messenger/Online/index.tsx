import { Box, Typography } from "@mui/material";
import { BoxProps } from "@mui/system";
import { theme } from "@theme";
import Image from "next/image";
import React from "react";

interface OnlineProps extends BoxProps {
  friendInformation: any;
}

const Online = ({ friendInformation, ...props }: OnlineProps) => {
  if (!friendInformation) {
    return <></>;
  }

  return (
    <Box
      {...props}
      p={3}
      borderLeft={`1px solid ${theme.palette.grey[100]}`}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Image
        src="/images/avatar-default.svg"
        height={80}
        width={80}
        alt={friendInformation?.name}
      />
      <Typography mt={3}>{friendInformation?.name}</Typography>
    </Box>
  );
};

export default Online;
