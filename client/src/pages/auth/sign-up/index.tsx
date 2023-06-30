import SignUpForm from "@containers/Forms/SignUp";
import AuthLayout from "@containers/layouts/AuthLayout";
import React from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const SignUpPage = () => {
  const { t } = useTranslation();
  return (
    <AuthLayout title={t("signUp")} subTitle={t("signUpSubtitle")}>
      <SignUpForm />
    </AuthLayout>
  );
};

export async function getServerSideProps(ctx) {
  const { locale } = ctx;

  return {
    props: { ...(await serverSideTranslations(locale, ["common"])), locale },
  };
}

export default SignUpPage;
