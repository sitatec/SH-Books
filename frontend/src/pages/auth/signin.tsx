import { Button, Grid, TextField, Typography, useTheme } from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import IllustrationImage from "../../../images/signin-bg.png";
import Link from "next/link";
import AuthLayout from "../../components/layouts/AuthLayout";
import GoogleSignInButton from "../../components/buttons/GoogleSignInButton";
import PasswordField from "../../components/inputs/PasswordField";
import { AuthService, SignInData } from "../../services/auth-service";
import Router from "next/router";
import { HttpClient } from "../../services/http-client";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext } from "react";
import { UserContext } from "../_app";
import {AuthPagesProps,  getAuthPageServerSideProps } from "./auth-pages-common";

const schema = object({
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

const SignIn: NextPage<AuthPagesProps> = ({ redirectRoute }) => {
  const theme = useTheme();
  // TODO create a custom hook to share below logic with Between Sign-up and Sign-in pages
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>({
    resolver: yupResolver(schema),
  });
  const { currentUser, setCurrentUser } = useContext(UserContext);

  if (currentUser) {
    Router.push(redirectRoute);
  }

  const onSubmit = async (formData: SignInData) => {
    try {
      const response = await AuthService.instance.signIn(formData);
      setCurrentUser(response.data);
    } catch (error) {
      console.log(error);
      if (HttpClient.isHttpError(error)) {
        // setErrors(error?.response?.data?.errors);
      }
    }
  };

  return (
    <AuthLayout
      title="Hello Again"
      subtitle="Sign in to unlock all SH Books' features"
      illustrationImage={IllustrationImage}
    >
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
          Sign in
        </Button>
      </Grid>
      <Grid item xs={12}>
        <GoogleSignInButton />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1" textAlign="center">
          {"Don't have an account yet? "}
          <Link href="/auth/signup">
            <a style={{ color: theme.palette.primary.dark }}>Sign Up</a>
          </Link>
        </Typography>
      </Grid>
    </AuthLayout>
  );
};

export const getServerSideProps = getAuthPageServerSideProps;

export default SignIn;
