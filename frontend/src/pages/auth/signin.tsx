import { Button, Grid, TextField, Typography, useTheme } from "@mui/material";
import { NextPage } from "next";
import IllustrationImage from "../../../images/signin-bg.png";
import Link from "next/link";
import AuthLayout from "../../components/AuthLayout";
import GoogleSignInButton from "../../components/buttons/GoogleSignInButton";
import PasswordField from "../../components/inputs/PasswordField";
import { ChangeEventHandler, useState } from "react";
import { AuthService, SignInData } from "../../services/auth-service";
import Router from "next/router";
import { HttpClient } from "../../services/http-client";

const SignIn: NextPage = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({} as SignInData);
  const [errors, setErrors] = useState({} as Record<string, any>);

  const onFormChanged: ChangeEventHandler = (event) => {
    setFormData((state) => {
      const target = event.target;
      return {
        ...state,
        [target.nodeName]: target.nodeValue,
      };
    });
  };

  const onSubmit = async (event: Event) => {
    event.preventDefault();
    try {
      const { data } = await AuthService.instance.signIn(formData);
      Router.push("/");
    } catch (error) {
      console.error(error);
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
          name="email"
          fullWidth
          label="Email"
          type="email"
          onChange={onFormChanged}
          value={formData.email}
          helperText={errors.email}
          error={!!errors.email}
        />
      </Grid>
      <Grid item xs={12}>
        <PasswordField
          name="password"
          onChange={onFormChanged}
          value={formData.password}
          helperText={errors.email}
          error={!!errors.email}
        />
      </Grid>
      <Grid item xs={12} mt={2}>
        <Button variant="contained" fullWidth style={{ padding: 12 }}>
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

export default SignIn;
