import {
  Button,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { NextPage } from "next";
import IllustrationImage from "../../../images/signup-bg.png";
import Link from "next/link";
import AuthLayout from "../../components/AuthLayout";
import GoogleSignInButton from "../../components/buttons/GoogleSignInButton";
import PasswordField from "../../components/inputs/PasswordField";

const SignUp: NextPage = () => {
  const theme = useTheme();
  return (
    <AuthLayout
      title="Welcome"
      subtitle="Sign up to sell and buy the best second hand books"
      illustrationImage={IllustrationImage}
    >
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="First name" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Last name" />
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Email" type="email" />
      </Grid>
      <Grid item xs={12}>
        <PasswordField/>
      </Grid>
      <Grid item xs={12} mt={2}>
        <Button variant="contained" fullWidth style={{ padding: 12 }}>
          Sign up
        </Button>
      </Grid>
      <Grid item xs={12}>
        <GoogleSignInButton/>
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

export default SignUp;
