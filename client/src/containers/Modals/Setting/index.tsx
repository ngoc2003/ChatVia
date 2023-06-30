import CAModal from "@components/Modal";
import SwitchLanguage from "@containers/Modals/Setting/SwitchLanguage";
import { ModalProps, Typography } from "@mui/material";
import { AppState } from "@stores";
import { theme } from "@theme";
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import SwitchTheme from "./SwitchTheme";

const SettingModal = (props: Omit<ModalProps, "children">) => {
  const { t } = useTranslation();
  const { darkMode } = useSelector((state: AppState) => state.darkMode);

  return (
    <CAModal {...props}>
      <>
        <Typography
          color={darkMode ? theme.palette.common.white : undefined}
          variant="h6"
          fontWeight={600}
        >
          {t("setting")}
        </Typography>
        <SwitchLanguage />
        <SwitchTheme />
      </>
    </CAModal>
  );
};

export default SettingModal;
