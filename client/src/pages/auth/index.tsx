import LoginForm from "@containers/Forms/Login";
import cookie from "cookie";
import AuthLayout from "@containers/layouts/AuthLayout";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
const Auth = () => {
  const { t } = useTranslation();
  return (
    <AuthLayout title={t("signIn")} subTitle={t("signInSubTitle")}>
      <LoginForm />
    </AuthLayout>
  );
};

export async function getServerSideProps(ctx) {
  const { locale, ...rest } = ctx;
  const { tokenMessage } = cookie.parse(rest.req?.headers.cookie ?? "");

  if (tokenMessage) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  return {
    props: { ...(await serverSideTranslations(locale, ["common"])), locale },
  };
}

export default Auth;
