import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const ModalContainer = styled(Box)`
  border-radius: ${({ theme }) => theme.spacing(0.5)};
  margin-left: auto;
  margin-right: auto;
  max-height: 90vh;
  max-width: 95vw;
  min-width: 320px;
  overflow-y: auto;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12);
`;
