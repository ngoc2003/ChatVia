import SignUpForm from "@containers/Forms/SignUp";
import AuthLayout from "@containers/layouts/AuthLayout";
import React from "react";

const SignUpPage = () => {
  return (
    <AuthLayout title="Sign up" subTitle="Get your Chatvia account now.">
      <SignUpForm />
    </AuthLayout>
  );
};

export default SignUpPage;
