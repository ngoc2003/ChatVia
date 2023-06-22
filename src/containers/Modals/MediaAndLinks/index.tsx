import CAModal from "@components/Modal";
import { Box, ModalProps, Tab, Tabs } from "@mui/material";
import React from "react";
import TabPanel from "./TabPanel";
import QuiltedImageList from "./MediaCategory";
import useDimensions from "react-cool-dimensions";
import { useTranslation } from "react-i18next";

interface MediaAndLinksModalProps extends Omit<ModalProps, "children"> {
  conversationId: string;
}

const MediaAndLinksModal = ({
  conversationId,
  ...props
}: MediaAndLinksModalProps) => {
  const { t } = useTranslation();
  const [value, setValue] = React.useState(0);
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const headerRef = useDimensions({ useBorderBoxSize: true });
  return (
    <CAModal
      containerProps={{
        sx: {
          overflow: "hidden !important",
        },
      }}
      {...props}
    >
      <Box>
        <Box
          sx={{ borderBottom: 1, borderColor: "divider" }}
          ref={headerRef.observe}
        >
          <Tabs value={value} onChange={handleChange}>
            <Tab key={"tab-" + 1} sx={{ flex: 1 }} label={t("media")} />
            <Tab key={"tab-" + 2} sx={{ flex: 1 }} label={t("links")} />
          </Tabs>
        </Box>
        <Box height={`calc(90vh - ${headerRef.height}px)`} overflow="scroll">
          <TabPanel value={value} index={0}>
            <QuiltedImageList conversationId={conversationId} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            Links
          </TabPanel>
        </Box>
      </Box>
    </CAModal>
  );
};

export default MediaAndLinksModal;
