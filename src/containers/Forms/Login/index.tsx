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
const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { setCookieData } = useGetCookieData();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const schema = Yup.object({
    email: Yup.string().email().required(),
    password: Yup.string().min(6, "").max(50, ""),
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
        width={460}
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
            Username and password are invalid. Please enter correct username and
            password
          </Box>
        ) : (
          <></>
        )}
        <MSTextField
          label="Email"
          icon={<PersonIcon fontSize="small" />}
          fullWidth
          inputProps={{ ...register("email") }}
        />
        <MSTextField
          label="Password"
          icon={<LockIcon fontSize="small" />}
          fullWidth
          containerProps={{ sx: { my: 3, mb: 4 } }}
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
            <Typography color={theme.palette.common.white}>Sign in</Typography>
          )}
        </Button>
      </Box>
      <Typography mt={6}>
        Dont have an account?{" "}
        <Link
          fontWeight={500}
          sx={{ textDecoration: "none" }}
          href="/auth/sign-up"
        >
          Sign up now
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;
