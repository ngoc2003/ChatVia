import { createTheme, ThemeOptions } from "@mui/material/styles";
import React from "react";

const colors = {
  primary: { main: "#7269ef", light: "#f7f7fe", dark: "#5b54bf" },
  secondary: {
    main: "#42b72a",
    light: "",
  },
  grey: {
    0: "#FBFBFC",
    50: "#F2F2F2",
    100: "#f8f9fa",
    150: "#a6b0cf",
    200: "#f5f7fb",
    300: "#f0eff5",
    400: "#e6ebf5",
    500: "#adb5bd",
    600: "#7a7f9a",
    700: "#495057",
    800: "#343a40",
    900: "#212529",
  },
  darkTheme: {
    main: "#303841",
    light: "#36404a",
    dark: "#262e35",
    lighter: "#3e4a56",
  },
  error: { main: "#ef476f" },
  success: { main: "rgb(46, 125, 50)" },
  warning: { main: "#f9b5c5", light: "#fcdae2", dark: "#601c2c" },
  text: { primary: "#7a7f9a", secondary: "#a6b0cf" },
};

const typography = {
  allVariants: {
    fontFamily: `'Roboto', sans-serif`,
    WebkitFontSmoothing: "antialiased",
    color: colors.grey[700],
  },
  h1: {
    fontSize: "96px",
    fontWeight: 600,
    lineHeight: "104px",
  },
  h2: {
    fontSize: "60px",
    fontWeight: 600,
    lineHeight: "68px",
  },
  h3: {
    fontSize: "48px",
    fontWeight: 600,
    lineHeight: "52px",
  },
  h4: {
    fontSize: "34px",
    fontWeight: 600,
    lineHeight: "40px",
  },
  h5: {
    fontSize: "26px",
    fontWeight: 600,
    lineHeight: "32px",
  },
  h6: {
    fontSize: "20px",
    fontWeight: 600,
    lineHeight: "24px",
  },
  subtitle1: {
    fontSize: "20px",
    fontWeight: 500,
    lineHeight: "24px",
  },
  subtitle2: {
    fontSize: "18px",
    fontWeight: 500,
    lineHeight: "22px",
  },
  body1: {
    fontSize: "16px",
    lineHeight: "24px",
  },
  body2: {
    fontSize: "14px",
    lineHeight: "20px",
  },
  body3: {
    fontSize: "12px",
    lineHeight: "16px",
    fontWeight: 500,
  },
  caption: {
    fontSize: "12px",
    lineHeight: "16px",
  },
  overline: {
    fontSize: "10px",
    lineHeight: "14px",
  },
};

const themeOptionCommon: ThemeOptions = {
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 990,
      xl: 1200,
    },
  },
  typography,
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: "noStyle" },
          style: {
            color: colors.text.primary,
          },
        },
      ],
      styleOverrides: {
        root: {
          backgroundColor: colors.primary.main,
          color: "#ffffff",
          fontSize: "16px",
          fontWeight: 500,
          lineHeight: "24px",
          padding: "8px 16px",
          textTransform: "none",
          minHeight: "auto",
        },
        sizeLarge: {
          padding: "10px 18px",
          fontSize: "16px",
          lineHeight: "24px",
        },
        sizeSmall: {
          padding: "8px 16px",
          fontSize: "14px",
          lineHeight: "20px",
        },
        contained: {
          color: "#FFFFFF",
          "&.Mui-disabled": {
            backgroundColor: colors.grey[600],
            color: "#FFFFFF",
          },
        },
        containedInherit: {
          "&.Mui-disabled": {
            backgroundColor: colors.primary.light,
            color: colors.grey[500],
          },
        },
        containedSecondary: {
          backgroundColor: colors.secondary.main,
          color: "#fff",

          "&.Mui-disabled": {
            backgroundColor: colors.secondary.light,
            color: "#FFFFFF",
          },
        },
        outlinedInherit: {
          color: colors.grey[400],
          borderColor: colors.primary[200],
        },
        outlined: {
          "&.Mui-disabled": {
            color: colors.primary[500],
            borderColor: colors.primary[500],
          },
        },
        textError: {
          color: colors.error.main,
        },
        text: {
          backgroundColor: "transparent",
          color: colors.primary.main,
          "&.Mui-disabled": {
            color: colors.primary[500],
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 5px 10px rgba(0,0,0,0.175)",
        },
      },
    },
  },
};

const light = {
  type: "light",
  ...colors,
};

export let theme = createTheme();

const themeOptions: ThemeOptions = {
  palette: light,
  ...themeOptionCommon,
};

theme = createTheme(themeOptions);

export type CustomizedTheme = typeof theme;

declare module "@mui/material/styles" {
  interface TypographyVariants {
    body3: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    body3: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    body3: true;
  }
}

declare module "@mui/material" {
  interface Palette {
    darkTheme: {
      main: string;
      dark: string;
      light: string;
      lighter: string;
    };
  }

  interface Color {
    0: string;
    50: string;
    100: string;
    200: string;
    300: string;
    350: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    A100: string;
    A200: string;
    A400: string;
    A700: string;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides {
    noStyle: true;
  }
}

declare module "@emotion/react" {
  export interface Theme extends CustomizedTheme {}
}
