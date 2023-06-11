import { store } from "../stores";
import { DefaultSeo } from "next-seo";
import { Provider } from "react-redux";
import dynamic from "next/dynamic";
import App, { AppProps } from "next/app";
import cookie from "cookie";
import { CAConnectionInstance } from "./api/hello";
import { appWithTranslation } from "next-i18next";

const ThemeWrapperProvider = dynamic(
  () => import("../containers/layouts/ThemeWrapper"),
  { ssr: true }
);

interface MyAppProps extends AppProps {
  token: string | null;
  id: string | null;
}

const MyApp = ({ Component, pageProps, token, id }: MyAppProps) => {
  return (
    <Provider store={store}>
      <ThemeWrapperProvider token={token} id={id}>
        <DefaultSeo title="Chat via" />
        <Component {...pageProps} />
      </ThemeWrapperProvider>
    </Provider>
  );
};

MyApp.getInitialProps = async (appContext: any) => {
  const ctx = appContext.ctx;
  const appProps = await App.getInitialProps(appContext);
  const { tokenMessage } = cookie.parse(ctx.req?.headers.cookie ?? "");

  try {
    let token: string | null = null;
    let id: string | null = null;
    if (tokenMessage) {
      const data = await CAConnectionInstance.post<any>(
        "/auth/me",
        {},
        {
          headers: {
            token: tokenMessage,
          },
        }
      );
      token = data.data.accessToken;
      id = data.data._id;
    }
    return {
      ...appProps,
      token,
      id,
    };
  } catch (error: any) {
    return { ...appProps };
  }
};

export default appWithTranslation(MyApp);
