import {
  FormControl,
  FormControlProps,
  Select,
  SelectChangeEvent,
  SelectProps,
  Typography,
} from "@mui/material";
import { AppState } from "@stores";
import { theme } from "@theme";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux";

interface CASelectProps {
  value: string;
  children: ReactNode;
  handleChange: (event: SelectChangeEvent<any>) => void;
  containerProps?: FormControlProps;
  selectProps?: SelectProps;
}

const CASelect = ({
  value,
  handleChange,
  children,
  containerProps,
  selectProps,
}: CASelectProps) => {
  const { darkMode } = useSelector((state: AppState) => state.darkMode);
  return (
    <FormControl
      variant="filled"
      sx={{
        m: 1,
        flex: 1,
        ".MuiSelect-select": {
          p: 1.5,
        },
        ".MuiSelect-icon": {
          color: `${theme.palette.primary.main} !important`,
        },
      }}
      {...containerProps}
    >
      <Select
        size="small"
        value={darkMode ? "Dark" : "Light"}
        onChange={handleChange}
        renderValue={() => (
          <Typography color={darkMode ? theme.palette.common.white : undefined}>
            {value}
          </Typography>
        )}
        MenuProps={{
          MenuListProps: {
            sx: {
              ...(darkMode && {
                bgcolor: theme.palette.darkTheme.dark,
                "*": {
                  color: theme.palette.text.secondary,
                },
              }),
            },
          },
        }}
        {...selectProps}
      >
        {children}
      </Select>
    </FormControl>
  );
};

export default CASelect;
