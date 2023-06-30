/* eslint-disable no-unused-vars */
import { useMediaQuery } from '@mui/material';
import { theme } from '@theme';

export enum Breakpoints {
  Mobile = 'mobile',
  Tablet = 'tablet',
  Desktop = 'desktop',
  DesktopLg = 'desktop-lg',
  DesktopXl = 'desktop-xl',
}

const useResponsive = () => {
  const isTablet = useMediaQuery(theme.breakpoints.up('sm'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isDesktopLg = useMediaQuery(theme.breakpoints.up('lg'));
  const isDesktopXl = useMediaQuery(theme.breakpoints.up('xl'));

  const getBreakpoint = () => {
    if (isDesktopXl) {
      return Breakpoints.DesktopXl;
    }

    if (isDesktopLg) {
      return Breakpoints.DesktopLg;
    }

    if (isDesktop) {
      return Breakpoints.Desktop;
    }

    if (isTablet) {
      return Breakpoints.Tablet;
    }

    return Breakpoints.Mobile;
  };

  const breakpointCallback = ({
    xs,
    sm,
    md,
    lg,
    xl,
  }: {
    readonly xs?: Record<string, any>;
    readonly sm?: Record<string, any>;
    readonly md?: Record<string, any>;
    readonly lg?: Record<string, any>;
    readonly xl?: Record<string, any>;
  }) => {
    if (isDesktopXl) {
      return xl ?? lg ?? md ?? sm ?? xs;
    }

    if (isDesktopLg) {
      return lg ?? md ?? sm ?? xs;
    }

    if (isDesktop) {
      return md ?? sm ?? xs;
    }

    if (isTablet) {
      return sm ?? xs;
    }

    return xs ?? {};
  };

  return {
    matched: getBreakpoint(),
    breakpointCallback,
    isDesktop,
    isTablet,
    isDesktopLg,
    isDesktopXl,
  };
};

export default useResponsive;
