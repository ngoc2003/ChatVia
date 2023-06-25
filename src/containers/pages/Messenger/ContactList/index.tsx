import MSTextField from "@components/TextField";
import { Box, BoxProps, CircularProgress, Typography } from "@mui/material";
import { theme } from "@theme";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector } from "react-redux";
import { AppState } from "@stores";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { useLazyGetUserContactQuery } from "@stores/services/user";
import { useTranslation } from "next-i18next";
import { handleFormatContactListUser } from "@utils/common";
import useCallbackDebounce from "@hooks/useCallbackDebounce";

const ContactList = (props: BoxProps) => {
  const { t } = useTranslation();
  const user = useSelector((state: AppState) => state.auth);
  const { darkMode } = useSelector((state: AppState) => state.darkMode);
  const [friend, setFriend] = useState<any>();
  const [searchValue, setSearchValue] = useState<string>("");

  const [getContact, { isFetching }] = useLazyGetUserContactQuery();

  const handleTextChange = useCallbackDebounce((e) => {
    setSearchValue(e.target.value);
  });

  useEffect(() => {
    getContact({
      userId: user.id,
      searchValue,
    })
      .unwrap()
      .then((response) => {
        setFriend(handleFormatContactListUser(response));
      });
  }, [getContact, searchValue, user.id]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      p={3}
      bgcolor={
        darkMode ? theme.palette.darkTheme.main : theme.palette.primary.light
      }
      {...props}
    >
      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          color={darkMode ? theme.palette.common.white : undefined}
          variant="h5"
          fontWeight={600}
        >
          {t("title.contact")}
        </Typography>
      </Box>
      <MSTextField
        iconProps={{
          sx: {
            bgcolor: "transparent",
            pr: 0,
          },
        }}
        onChange={handleTextChange}
        disableBorderInput
        fullWidth
        placeholder={t("placeholder.searchForUser")}
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
                    color={darkMode ? theme.palette.common.white : undefined}
                  >
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      py={1.5}
                      color="inherit"
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
          <Typography
            fontStyle="italic"
            color={darkMode ? theme.palette.text.secondary : undefined}
          >
            {t("noContact")}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ContactList;
