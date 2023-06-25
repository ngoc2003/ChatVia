import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React, { ReactNode } from "react";
import { theme } from "@theme";
interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subTitle: string;
}
const AuthLayout = ({ title, subTitle, children }: AuthLayoutProps) => {
  return (
    <Box
      bgcolor={theme.palette.primary.light}
      py={6}
      minHeight="100vh"
      display="grid"
      width="100%"
      sx={{ placeItems: "center" }}
    >
      <Box textAlign="center">
        <Box py={6} display="flex" alignItems="center" justifyContent="center">
          <Image
            style={{ borderRadius: 9999 }}
            src="/images/Logo.png"
            width={30}
            height={30}
            alt="logo"
            priority={true}
          />
          <Typography variant="h5" ml={2}>
            Chatvia
          </Typography>
        </Box>
        <Typography variant="h6">{title}</Typography>
        <Typography mt={1} mb={3}>
          {subTitle}
        </Typography>
        {children}
        <Typography mt={2} color={theme.palette.grey[700]}>
          © {new Date().getFullYear()} Chatvia. Crafted with love by Bui Ngoc
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthLayout;
