import DefaultLayout from "@containers/layouts/DefaultLayout";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import { theme } from "@theme";
import Image from "next/image";
import React from "react";
import { parse } from "cookie";
import { UserType } from "@typing/common";
import { CAConnectionInstance } from "./api/hello";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
interface MePageProp {
  user: UserType;
}
const MePage = ({ user }: MePageProp) => {
  return (
    <DefaultLayout>
      <Box p={2} bgcolor={theme.palette.primary.light}>
        <Box px={2} textAlign="center">
          <Image
            src="/images/avatar-default.svg"
            height={200}
            width={200}
            alt="avatar"
          />
          <Typography variant="h6" mt={2}>
            {user.username}
          </Typography>
          <Typography fontWeight={200} mt={2} fontStyle="italic">
            {user?.description || "No description yet"}
          </Typography>
        </Box>
      </Box>
      <Box p={3}>
        <Box border={1} borderTop={0} borderColor="divider">
          <Accordion
            disableGutters
            sx={{
              "&:before": {
                display: "none",
              },
              boxShadow: "none",
            }}
            elevation={0}
            square
          >
            <AccordionSummary
              sx={{
                borderTop: 1,
                borderColor: "divider",
                "&.Mui-expanded": {
                  bgcolor: theme.palette.grey[200],
                },
                "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                  transform: "rotate(180deg)",
                },
              }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>Basic informaiton</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: 1, borderColor: "divider" }}>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            disableGutters
            sx={{
              "&:before": {
                display: "none",
              },
              boxShadow: "none",
            }}
            elevation={0}
            square
          >
            <AccordionSummary
              sx={{
                borderTop: 1,
                borderColor: "divider",
                "&.Mui-expanded": {
                  bgcolor: theme.palette.grey[200],
                },
                "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                  transform: "rotate(180deg)",
                },
              }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>Social</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: 1, borderColor: "divider" }}>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            disableGutters
            sx={{
              "&:before": {
                display: "none",
              },
              boxShadow: "none",
            }}
            elevation={0}
            square
          >
            <AccordionSummary
              sx={{
                borderTop: 1,
                borderColor: "divider",
                "&.Mui-expanded": {
                  bgcolor: theme.palette.grey[200],
                },
                "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                  transform: "rotate(180deg)",
                },
              }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>My intereset</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: 1, borderColor: "divider" }}>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
      <Box>
        <Typography>Privacy</Typography>
        
      </Box>
    </DefaultLayout>
  );
};

export default MePage;

export async function getServerSideProps(ctx: any) {
  const cookies = parse(ctx.req?.headers.cookie || "");
  const tokenMessage = cookies?.tokenMessage;

  if (!tokenMessage) {
    return {
      redirect: {
        destination: "/auth",
        permanent: true,
      },
    };
  } else {
    try {
      const { data: user } = await CAConnectionInstance.post(
        "/auth/me",
        {},
        {
          headers: {
            token: tokenMessage,
          },
        }
      );

      return {
        props: {
          user,
        },
      };
    } catch (error) {
      console.error("Error fetching user data:", error);
      return {
        props: {
          user: null,
        },
      };
    }
  }
}
