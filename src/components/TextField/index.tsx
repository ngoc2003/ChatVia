import {
  Box,
  BoxProps,
  FormControl,
  FormControlProps,
  IconButton,
  IconButtonProps,
  InputAdornment,
  StandardTextFieldProps,
  TextField,
  Typography,
} from "@mui/material";
import { theme } from "@theme";
import { omit } from "lodash";
import { ReactNode } from "react";
interface MSTextFieldProps extends StandardTextFieldProps {
  containerProps?: FormControlProps;
  iconProps?: BoxProps;
  icon?: ReactNode;
}
const MSTextField = ({
  fullWidth,
  label,
  containerProps,
  iconProps,
  icon,
  ...props
}: MSTextFieldProps) => {
  return (
    <FormControl
      fullWidth={fullWidth}
      sx={{
        overflow: "hidden",
        textAlign: "left",
        ...containerProps?.sx,
      }}
      {...omit(containerProps, ["sx"])}
    >
      {!!label && (
        <Typography fontWeight={500} color={theme.palette.grey[700]} mb={1}>
          {label}
        </Typography>
      )}
      <Box display="flex" borderRadius={0.5} overflow="hidden">
        {icon && (
          <Box
            {...omit(iconProps, ["sx"])}
            sx={{
              p: 1.2,
              display: "grid",
              bgcolor: theme.palette.grey[200],
              placeItems: "center",
              border: `1px solid ${theme.palette.grey[400]}`,
              borderRight: 0,
              "& .MuiSvgIcon-root ": {
                color: theme.palette.text.primary,
              },
              ...iconProps?.sx,
            }}
          >
            {icon}
          </Box>
        )}
        <TextField
          {...omit(props, ["sx", "InputProps", "containerProps"])}
          sx={{
            ...props?.sx,
            width: "100%",
            border: `1px solid ${theme.palette.grey[400]}`,
            input: { py: 1, px: 2, color: theme.palette.grey[700] },
            "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button":
              {
                WebkitAppearance: "none",
                margin: 0,
              },
          }}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            ...props.InputProps,
          }}
        />
      </Box>
    </FormControl>
  );
};

export default MSTextField;
