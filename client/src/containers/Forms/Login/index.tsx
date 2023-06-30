import { Box, Button, CircularProgress, Link, Typography } from "@mui/material";
import React, { useState } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import useGetCookieData from "@hooks/useGetCookieData";
import { LoginParams } from "@typing/auth";
import { AppDispatch } from "@stores";
import { useRouter } from "next/router";
import { handleLogin } from "@stores/slices/auth";
import { theme } from "@theme";
import MSTextField from "@components/TextField";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { useTranslation } from "next-i18next";
import { commonActions } from "@stores/slices/common";
const LoginForm = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { setCookieData } = useGetCookieData();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().min(6, t("error.min")).max(50, t("error.max")),
  }).required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginParams>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (values: LoginParams) => {
    setIsLoading(true);
    dispatch(handleLogin(values))
      .unwrap()
      .then((response) => {
        setCookieData("tokenMessage", response.token);
        router.push("/");
        dispatch(
          commonActions.showAlertMessage({
            type: "success",
            message: "Sign in successfully",
          })
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Box px={1}>
      <Box
        p={4}
        borderRadius={0.5}
        bgcolor={theme.palette.common.white}
        width="100%"
        maxWidth={460}
      >
        {errors.email || errors.password ? (
          <Box
            mb={2}
            border={1}
            p="12px 20px"
            borderRadius={0.5}
            color={theme.palette.warning.dark}
            bgcolor={theme.palette.warning.light}
            borderColor={theme.palette.warning.main}
          >
            {t("error.invalid")}
          </Box>
        ) : (
          <></>
        )}
        <MSTextField
          label="Email"
          icon={<PersonIcon fontSize="small" />}
          fullWidth
          preventDarkMode
          inputProps={{ ...register("email") }}
          containerProps={{
            sx: {
              bgcolor: theme.palette.common.white,
            },
          }}
        />
        <MSTextField
          label={t("password")}
          icon={<LockIcon fontSize="small" />}
          preventDarkMode
          fullWidth
          containerProps={{
            sx: { my: 3, mb: 4, bgcolor: theme.palette.common.white },
          }}
          inputProps={{ ...register("password") }}
        />
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
      </Box>
      <Typography mt={6}>
        {t("question.dontHaveAnAccount")}{" "}
        <Link
          fontWeight={500}
          sx={{ textDecoration: "none" }}
          href="/auth/sign-up"
        >
          {t("signUpNow")}
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;
