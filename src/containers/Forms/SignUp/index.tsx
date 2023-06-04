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

const SignUpForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const schema = Yup.object({
    username: Yup.string().required("Required"),
    email: Yup.string().email().required("Required"),
    password: Yup.string()
      .min(6, "Min 6 characters")
      .max(50, "Max 50 characters")
      .required("Required"),
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
        width={460}
      >
        <Box mb={3}>
          <MSTextField
            label="Email"
            icon={<EmailIcon fontSize="small" />}
            fullWidth
            inputProps={{ ...register("email") }}
          />
          <ErrorText isError={!!errors.email} content={errors.email?.message} />
        </Box>

        <Box mb={3}>
          <MSTextField
            label="Fullname"
            icon={<PersonIcon fontSize="small" />}
            fullWidth
            inputProps={{ ...register("username") }}
          />
          <ErrorText
            isError={!!errors.username}
            content={errors.username?.message}
          />
        </Box>
        <Box mb={3}>
          <MSTextField
            label="Password"
            icon={<LockIcon fontSize="small" />}
            fullWidth
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
            <Typography color={theme.palette.common.white}>Sign in</Typography>
          )}
        </Button>
        <Typography
          variant="body2"
          fontWeight={500}
          mt={3}
          color={theme.palette.text.primary}
        >
          By registering you agree to the Chatvia Terms of Use
        </Typography>
      </Box>
      <Typography mt={6}>
        Already have an account ?
        <Link fontWeight={500} sx={{ textDecoration: "none" }} href="/auth">
          Sign in
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
