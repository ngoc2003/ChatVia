import {
  Box,
  BoxProps,
  FormControl,
  FormControlProps,
  StandardTextFieldProps,
  TextField,
  Typography,
} from "@mui/material";
import { AppState } from "@stores";
import { theme } from "@theme";
import { omit } from "lodash";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
interface MSTextFieldProps extends StandardTextFieldProps {
  containerProps?: FormControlProps;
  iconProps?: BoxProps;
  icon?: ReactNode;
  preventDarkMode?: boolean;
  disableBorderInput?: boolean;
}
const MSTextField = ({
  fullWidth,
  label,
  containerProps,
  iconProps,
  icon,
  preventDarkMode,
  disableBorderInput,
  ...props
}: MSTextFieldProps) => {
  const { darkMode } = useSelector((state: AppState) => state.darkMode);

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
        <Typography
          fontWeight={500}
          color={
            !preventDarkMode && darkMode
              ? theme.palette.text.secondary
              : theme.palette.grey[700]
          }
          mb={1}
        >
          {label}
        </Typography>
      )}
      <Box
        display="flex"
        borderRadius={0.5}
        overflow="hidden"
        alignItems="center"
        sx={{
          bgcolor:
            !preventDarkMode && darkMode
              ? theme.palette.darkTheme.light
              : theme.palette.grey[400],
        }}
        {...(!disableBorderInput && {
          border: `1px solid ${theme.palette.grey[300]}`,
        })}
      >
        {icon && (
          <Box
            {...omit(iconProps, ["sx"])}
            sx={{
              p: 1.2,
              display: "grid",
              bgcolor: theme.palette.grey[200],
              placeItems: "center",
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
            flex: 1,
            input: {
              py: 0.8,
              px: 2,
              color:
                !preventDarkMode && darkMode
                  ? theme.palette.text.secondary
                  : theme.palette.grey[700],
              "::placeholder": {
                color:
                  !preventDarkMode && darkMode
                    ? theme.palette.text.secondary
                    : undefined,
              },
            },
            "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button":
              {
                WebkitAppearance: "none",
                margin: 0,
              },
            ...props?.sx,
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
