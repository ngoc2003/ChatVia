import LoginForm from "@containers/Forms/Login";
import cookie from "cookie";
import AuthLayout from "@containers/layouts/AuthLayout";
const Auth = () => {
  return (
    <AuthLayout title="Sign in" subTitle="Sign in to continue to Chhatvia">
      <LoginForm />
    </AuthLayout>
  );
};

export async function getServerSideProps(ctx) {
  const { tokenMessage } = cookie.parse(ctx.req?.headers.cookie ?? "");

  if (tokenMessage) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  return { props: {} };
}

export default Auth;
