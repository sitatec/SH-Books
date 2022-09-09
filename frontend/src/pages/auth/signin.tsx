import {
  Button,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { NextPage } from "next";
import IllustrationImage from "../../../images/signin-bg.png";
import Link from "next/link";
import AuthLayout from "../../components/AuthLayout";
import GoogleSignInButton from "../../components/buttons/GoogleSignInButton";
import PasswordField from "../../components/inputs/PasswordField";

const SignIn: NextPage = () => {
  const theme = useTheme();
  return (
    <AuthLayout
      title="Hello Again"
      subtitle="Sign in to unlock all SH Books' features"
      illustrationImage={IllustrationImage}
    >
      <Grid item xs={12}>
        <TextField fullWidth label="Email" type="email" />
      </Grid>
      <Grid item xs={12}>
        <PasswordField/>
      </Grid>
      <Grid item xs={12} mt={2}>
        <Button variant="contained" fullWidth style={{ padding: 12 }}>
          Sign in
        </Button>
      </Grid>
      <Grid item xs={12}>
        <GoogleSignInButton/>
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
