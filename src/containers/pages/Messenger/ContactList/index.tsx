import MSTextField from "@components/TextField";
import { Box, IconButton, Typography } from "@mui/material";
import { theme } from "@theme";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

const ContactList = () => {
  return (
    <Box width={380} p={3} bgcolor={theme.palette.primary.light}>
      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h5" fontWeight={600}>
          Contacts
        </Typography>
        <IconButton size="small">
          <AddIcon color="primary" />
        </IconButton>
      </Box>
      <MSTextField
        iconProps={{
          sx: {
            bgcolor: "transparent",
            pr: 0,
          },
        }}
        containerProps={{
          sx: {
            bgcolor: theme.palette.grey[400],
          },
        }}
        fullWidth
        placeholder="Search users"
        icon={<SearchIcon fontSize="small" />}
      />
    </Box>
  );
};

export default ContactList;
