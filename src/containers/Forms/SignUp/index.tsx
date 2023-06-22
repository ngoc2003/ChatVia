import { Box, Button, Typography, CircularProgress, Link } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import { useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../stores";
import { SignUpParams } from "../../../typing/auth";
import { handleSignUp } from "../../../stores/slices/auth";
import { theme } from "@theme";
import LockIcon from "@mui/icons-material/Lock";

import MSTextField from "@components/TextField";
import { useRouter } from "next/router";
import { ErrorText } from "@components/TextField/ErrorText";
import { useTranslation } from "next-i18next";

const SignUpForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const schema = Yup.object({
    username: Yup.string().required(t("error.required")),
    email: Yup.string().email().required(t("error.required")),
    password: Yup.string()
      .min(6, t("error.min"))
      .max(50, t("error.max"))
      .required(t("error.required")),
  }).required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpParams>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (values: SignUpParams) => {
    setIsLoading(true);
    dispatch(handleSignUp(values))
      .unwrap()
      .then(() => {
        router.push("/auth");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Box>
      <Box
        p={4}
        borderRadius={0.5}
        bgcolor={theme.palette.common.white}
        width="100%"
        maxWidth={460}
      >
        <Box mb={3}>
          <MSTextField
            label="Email"
            icon={<EmailIcon fontSize="small" />}
            fullWidth
            preventDarkMode
            inputProps={{ ...register("email") }}
            containerProps={{
              sx: {
                bgcolor: theme.palette.common.white,
              },
            }}
          />
          <ErrorText isError={!!errors.email} content={errors.email?.message} />
        </Box>

        <Box mb={3}>
          <MSTextField
            label={t("fullname")}
            icon={<PersonIcon fontSize="small" />}
            fullWidth
            preventDarkMode
            inputProps={{ ...register("username") }}
            containerProps={{
              sx: {
                bgcolor: theme.palette.common.white,
              },
            }}
          />
          <ErrorText
            isError={!!errors.username}
            content={errors.username?.message}
          />
        </Box>
        <Box mb={3}>
          <MSTextField
            label={t("password")}
            icon={<LockIcon fontSize="small" />}
            fullWidth
            preventDarkMode
            containerProps={{
              sx: {
                bgcolor: theme.palette.common.white,
              },
            }}
            inputProps={{ ...register("password") }}
          />
          <ErrorText
            isError={!!errors.password}
            content={errors.password?.message}
          />
        </Box>

        <Button
          disabled={isLoading}
          fullWidth
          variant="contained"
          onClick={handleSubmit(onSubmit)}
        >
          {isLoading ? (
            <CircularProgress size={20} />
          ) : (
            <Typography color={theme.palette.common.white}>
              {t("signIn")}
            </Typography>
          )}
        </Button>
        <Typography
          variant="body2"
          fontWeight={500}
          mt={3}
          color={theme.palette.text.primary}
        >
          {t("acceptTermOfUse")}
        </Typography>
      </Box>
      <Typography mt={6}>
        {t("question.alreadyHaveAnAccount")}
        <Link fontWeight={500} sx={{ textDecoration: "none" }} href="/auth">
          {t("signIn")}
        </Link>
      </Typography>
    </Box>
  );
};

export default SignUpForm;
