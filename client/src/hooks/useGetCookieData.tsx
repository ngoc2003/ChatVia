import cookie from "cookie";
import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const cookieName = publicRuntimeConfig.ACCESS_TOKEN_SECRET;

export type CookieKeys = typeof cookieName;

const useGetCookieData = () => {
  const dispatch = useDispatch();

  const [currentToken, setCurrentToken] = React.useState<string>();
  const [currentUser, setCurrentUser] = React.useState<number>();
  const [loaded, setLoaded] = React.useState<boolean>(false);

  const setCookieData = useCallback(
    (
      key: CookieKeys,
      value: string,
      options?: cookie.CookieSerializeOptions
    ) => {
      const setCookie = cookie.serialize(key as string, value, {
        path: "/",
        ...options,
      });
      document.cookie = setCookie;
    },
    []
  );

  const getCookieData = useCallback(() => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${cookieName}=`);
    if (parts.length === 2) {
      return (parts.pop() as string).split(";").shift();
    }
    return "";
  }, []);

  const clearCookieData = useCallback(
    (key: CookieKeys, options?: cookie.CookieSerializeOptions) => {
      const clearCookie = cookie.serialize(key as string, "", {
        expires: new Date(1970),
        path: "/",
        ...options,
      });
      document.cookie = clearCookie;
    },
    []
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const { token: idToken } = cookie.parse(document.cookie);
      setCurrentToken(idToken);
      setCurrentUser(currentUser ? currentUser : undefined);
      setLoaded(true);
    }, 500);

    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return {
    token: currentToken,
    loaded,
    setCookieData,
    clearCookieData,
    getCookieData,
  };
};

export default useGetCookieData;
