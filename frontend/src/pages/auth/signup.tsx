import { Button, Grid, TextField, Typography, useTheme } from "@mui/material";
import { NextPage } from "next";
import IllustrationImage from "../../../images/signup-bg.png";
import Link from "next/link";
import AuthLayout from "../../components/layouts/AuthLayout";
import GoogleSignInButton from "../../components/buttons/GoogleSignInButton";
import PasswordField from "../../components/inputs/PasswordField";
import { AuthService, SignUpData } from "../../services/auth-service";
import Router from "next/router";
import { HttpClient } from "../../services/http-client";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { UserContext } from "../_app";
import {AuthPagesProps,  getAuthPageServerSideProps } from "./auth-pages-common";

const schema = object({
  firstName: string().required("Please enter your first name"),
  lastName: string().required("Please enter your last name"),
  email: string()
    .required("Please enter your email address")
    .email("Invalid email"),
  password: string()
    .required("Please enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.\-\_\)\(])(?=.{6,})/,
      "Must contain at least 6 characters with at least 1 lowercase, 1 uppercase, 1 number and 1 special character"
    ),
});

const SignUp: NextPage<AuthPagesProps> = ({ redirectRoute }) => {
  const theme = useTheme();

  // TODO create a custom hook to share below logic with Between Sign-up and Sign-in pages

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>({
    resolver: yupResolver(schema),
  });

  const { currentUser, setCurrentUser } = useContext(UserContext);

  if (currentUser) {
    Router.push(redirectRoute);
  }

  const onSubmit = async (formData: SignUpData) => {
    try {
      console.log("Form data befor submit", formData);
      const response = await AuthService.instance.signUp(formData);
      setCurrentUser(response.data);
    } catch (error) {
      console.error(error);
      if (HttpClient.isHttpError(error)) {
        console.log(error);
        // setErrors(error?.response?.data?.errors);
      }
    }
  };

  return (
    <AuthLayout
      title="Welcome"
      subtitle="Sign up to sell and buy the best second hand books"
      illustrationImage={IllustrationImage}
    >
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="First name"
          {...register("firstName")}
          error={!!errors.firstName}
          helperText={errors.firstName?.message}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Last name"
          {...register("lastName")}
          error={!!errors.lastName}
          helperText={errors.lastName?.message}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      </Grid>
      <Grid item xs={12}>
        <PasswordField
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
      </Grid>
      <Grid item xs={12} mt={2}>
        <Button
          variant="contained"
          fullWidth
          style={{ padding: 12 }}
          onClick={handleSubmit(onSubmit)}
        >
          Sign up
        </Button>
      </Grid>
      <Grid item xs={12}>
        <GoogleSignInButton />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" textAlign="center">
          Already have an account?{" "}
          <Link href="/auth/signin">
            <a style={{ color: theme.palette.primary.main }}>Sign In</a>
          </Link>
        </Typography>
      </Grid>
    </AuthLayout>
  );
};

export const getServerSideProps = getAuthPageServerSideProps;

export default SignUp;
