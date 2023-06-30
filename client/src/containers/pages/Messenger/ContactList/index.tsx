import { Box, BoxProps, CircularProgress, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SearchIcon from "@mui/icons-material/Search";
import { AppState } from "@stores";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import { useLazyGetUserContactQuery } from "@stores/services/user";
import { handleFormatContactListUser } from "@utils/common";
import useCallbackDebounce from "@hooks/useCallbackDebounce";
import { theme } from "@theme";
import LeftSideContainer from "@containers/layouts/LeftSideContainer";

const ContactList = (props: BoxProps) => {
  const { t } = useTranslation();
  const user = useSelector((state: AppState) => state.auth);
  const { darkMode } = useSelector((state: AppState) => state.darkMode);
  const [friend, setFriend] = useState<any>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const [getContact, { isFetching }] = useLazyGetUserContactQuery();

  const handleTextChange = useCallbackDebounce((e) => {
    setSearchValue(e.target.value);
  });

  useEffect(() => {
    if (user?.id) {
      getContact({
        userId: user.id,
        searchValue,
      })
        .unwrap()
        .then((response) => {
          setFriend(handleFormatContactListUser(response));
        });
    }
  }, [getContact, searchValue, user.id]);

  return (
    <LeftSideContainer
      title={t("title.contact")}
      iconInput={<SearchIcon fontSize="small" />}
      onChangeInput={handleTextChange}
      {...props}
    >
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
    </LeftSideContainer>
  );
};

export default ContactList;
