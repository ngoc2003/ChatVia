import { AppState } from "@stores";
import { theme } from "@theme";
import React from "react";
import { useSelector } from "react-redux";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Information,
  RequiredInformationProps,
} from "@containers/pages/Messenger/MyProfile/Information";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { EMPTY_VALUE } from "@constants";

interface CAAccordionItem {
  title: string;
  details: RequiredInformationProps[];
}

export interface CAAccordionProps {
  list: CAAccordionItem[];
}

export const CAAccordion = ({ list }: CAAccordionProps) => {
  const [expanded, setExpanded] = React.useState<string | false>("panel-1");
  const { darkMode } = useSelector((state: AppState) => state.darkMode);
  const handleChange =
    (panel: string) => (_: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <>
      {list.map((item, index) => (
        <Accordion
          key={item.title}
          expanded={expanded === `panel-${index + 1}`}
          onChange={handleChange(`panel-${index + 1}`)}
        >
          <AccordionSummary
            sx={{
              bgcolor: darkMode
                ? theme.palette.darkTheme.light
                : theme.palette.grey[100],
            }}
            expandIcon={<ExpandMoreIcon color="primary" />}
          >
            <Typography
              color={darkMode ? theme.palette.common.white : undefined}
            >
              {item.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {item.details.map((detail) => (
              <Information
                key={detail.title}
                title={detail.title}
                {...(detail?.href
                  ? { href: detail.href }
                  : { content: detail.content ?? EMPTY_VALUE })}
              />
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};
