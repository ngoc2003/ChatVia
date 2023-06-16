import CAModal from "@components/Modal";
import MSTextField from "@components/TextField";
import {
  Box,
  Button,
  CircularProgress,
  ModalProps,
  Typography,
} from "@mui/material";
import { AppState } from "@stores";
import { theme } from "@theme";
import { GenderType, UserType } from "@typing/common";
import React from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import { useUpdateUserMutation } from "@stores/services/user";
import { ErrorText } from "@components/TextField/ErrorText";

interface UpdateProfileProps extends Omit<ModalProps, "children"> {
  user: UserType;
}

interface UpdateProfileParams {
  email: string;
  gender: GenderType;
  username: string;
  facebookLink: string;
  location: string;
  description: string;
}

const UpdateProfile = ({ user, ...props }: UpdateProfileProps) => {
  const { t } = useTranslation();
  const { darkMode } = useSelector((state: AppState) => state.darkMode);

  const schema = Yup.object({
    username: Yup.string().required(t("error.required")),
    email: Yup.string().email(t("error.invalid")),
    gender: Yup.string().oneOf(["Male", "Female"]),
    facebookLink: Yup.string().required(t("error.required")),
    location: Yup.string().required(t("error.required")),
    description: Yup.string().required(t("error.required")),
  }).required();

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<UpdateProfileParams>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (values: UpdateProfileParams) => {
    updateUser({ userId: user._id, ...values })
      .unwrap()
      .then(() => props.onClose?.({}, "escapeKeyDown"));
  };

  if (!user) {
    return <></>;
  }

  return (
    <CAModal {...props}>
      <>
        <Typography
          color={darkMode ? theme.palette.common.white : undefined}
          variant="h6"
          fontWeight={600}
        >
          {t("updateYourProfile")}
        </Typography>
        <MSTextField
          containerProps={{
            sx: {
              mt: 3,
            },
          }}
          defaultValue={user.username}
          inputProps={{ ...register("username") }}
          disableBorderInput
          label={t("field.fullname")}
          fullWidth
        />
        <MSTextField
          containerProps={{
            sx: {
              mt: 3,
            },
          }}
          defaultValue={user?.description}
          inputProps={{ ...register("description") }}
          disableBorderInput
          label={t("field.description")}
          fullWidth
        />
        <ErrorText
          isError={!!errors.description?.message}
          content={errors.description?.message}
        />
        <MSTextField
          containerProps={{
            sx: {
              mt: 3,
            },
          }}
          defaultValue={user?.gender ?? ""}
          inputProps={{ ...register("gender") }}
          disableBorderInput
          label={t("field.gender")}
          fullWidth
        />
        <ErrorText
          isError={!!errors.gender?.message}
          content={errors.gender?.message}
        />
        <MSTextField
          containerProps={{
            sx: {
              mt: 3,
            },
          }}
          defaultValue={user?.location ?? ""}
          disableBorderInput
          inputProps={{ ...register("location") }}
          label={t("field.location")}
          fullWidth
        />
        <ErrorText
          isError={!!errors.location?.message}
          content={errors.location?.message}
        />
        <MSTextField
          containerProps={{
            sx: {
              mt: 3,
            },
          }}
          defaultValue={user?.facebookLink ?? ""}
          disableBorderInput
          inputProps={{ ...register("facebookLink") }}
          label={t("field.facebook")}
          fullWidth
        />
        <ErrorText
          isError={!!errors.facebookLink?.message}
          content={errors.facebookLink?.message}
        />
        <Box display="flex" mt={3}>
          <Button
            variant="text"
            fullWidth
            sx={{ mr: 1, color: theme.palette.primary.main }}
            onClick={() => props.onClose?.({}, "escapeKeyDown")}
          >
            {t("button.cancel")}
          </Button>
          <Button
            disabled={isLoading}
            variant="contained"
            fullWidth
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading ? <CircularProgress size={20} /> : t("button.update")}
          </Button>
        </Box>
      </>
    </CAModal>
  );
};

export default UpdateProfile;
