import MSTextField from "@components/TextField";
import { Box, CircularProgress, Typography } from "@mui/material";
import { theme } from "@theme";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { useGetUserContactQuery } from "@stores/services/user";

const handleFormat = (input) => {
  if (!input) {
    return null;
  }
  const separatedNames = {};

  for (const user of input) {
    const arrayOfName = user.username.split(" ");
    const lastWord = arrayOfName?.[arrayOfName?.length - 1];
    const firstChar = lastWord?.charAt(0)?.toUpperCase();

    if (!separatedNames[firstChar]) {
      separatedNames[firstChar] = [];
    }

    separatedNames[firstChar].push(user);
  }

  const result = Object.entries(separatedNames)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([character, names]) => ({ character, names }));

  return result;
};

const ContactList = () => {
  const user = useSelector((state: AppState) => state.auth);
  const [friend, setFriend] = useState<any>();
  const { data, isFetching } = useGetUserContactQuery({ userId: user.id });

  useEffect(() => {
    if (data) {
      setFriend(handleFormat(data));
    }
  }, [data]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      width={380}
      p={3}
      bgcolor={theme.palette.primary.light}
    >
      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h5" fontWeight={600}>
          Contacts
        </Typography>
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
      <Box my={3}>
        {isFetching ? (
          <Box
            flex={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <CircularProgress size={20} />
          </Box>
        ) : friend?.length ? (
          friend?.map((data) => (
            <Box key={data.character}>
              <Typography
                color={theme.palette.primary.main}
                variant="body2"
                fontWeight={600}
                p={2}
              >
                {data.character}
              </Typography>
              <Box>
                {data.names?.map((item) => (
                  <Box
                    display="flex"
                    alignItems="center"
                    key={item.username}
                    justifyContent="space-between"
                  >
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      py={1.5}
                      px={2}
                    >
                      {item.username}
                    </Typography>
                    <MoreVertOutlinedIcon fontSize="small" />
                  </Box>
                ))}
              </Box>
            </Box>
          ))
        ) : (
          <Typography fontStyle="italic">
            You dont have any friend contact
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ContactList;
