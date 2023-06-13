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
    // <FBModal
    //   hasCancelButton={false}
    //   hasPaddingHorizontal={false}
    //   onClose={onClose}
    //   open={showSignUpForm}
    // >
    //   <>
    //     <Box position="relative" mx={3}>
    //       <Typography fontWeight={700} variant="h4">
    //         Sign up
    //       </Typography>
    //       <Typography color={theme.palette.grey[800]} variant="subtitle1">
    //         It is quick and easy.
    //       </Typography>
    //       <IconButton
    //         sx={{ position: "absolute", right: "0", top: "0" }}
    //         onClick={onClose}
    //       >
    //         <CloseOutlinedIcon />
    //       </IconButton>
    //     </Box>
    //     <Divider sx={{ my: 1 }} />
    //     <Box px={3} pt={1} gap={2} display="flex" flexDirection="column" mb={2}>
    //       <TextField
    //         sx={{
    //           borderRadius: 2,
    //         }}
    //         size="small"
    //         fullWidth
    //         placeholder="Full name"
    // inputProps={{ ...register("username") }}
    // error={!!errors.username}
    // helperText={errors.username?.message}
    //       />
    //       <TextField
    //         sx={{
    //           borderRadius: 2,
    //         }}
    //         size="small"
    //         fullWidth
    //         placeholder="Your email"
    //         inputProps={{ ...register("email") }}
    //         error={!!errors.email}
    //         helperText={errors.email?.message}
    //       />
    //       <TextField
    //         sx={{
    //           borderRadius: 2,
    //         }}
    //         type="password"
    //         size="small"
    //         fullWidth
    //         placeholder="Password"
    //         inputProps={{ ...register("password") }}
    //         error={!!errors.password}
    //         helperText={errors.password?.message}
    //       />
    //     </Box>
    //     <Box textAlign="center" pt={2}>
    //       <Button
    //         disabled={isLoading}
    //         color="secondary"
    //         variant="contained"
    //         onClick={handleSubmit(onSubmit)}
    //       >
    //         <Typography variant="h6">
    //           {isLoading ? (
    //             <CircularProgress size={20} />
    //           ) : (
    //             <Typography variant="h6">Create new account</Typography>
    //           )}
    //         </Typography>
    //       </Button>
    //     </Box>
    //   </>
    // </FBModal>
  );
};

export default SignUpForm;
