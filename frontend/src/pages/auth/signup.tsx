import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { NextPage } from "next";
import Image from "next/image";
import BackgroundImage from "../../../public/images/signup-bg.png";
import Logo from "../../../public/images/logo.png";
import GoogleLogo from "../../../public/images/google_logo.png";
import Link from "next/link";

const SignUp: NextPage = () => {
  const theme = useTheme();
  return (
    <Grid container>
      <Grid
        item
        display={{ xs: "none", lg: "block" }}
        lg={6}
        style={{
          height: "100vh",
          backgroundColor: theme.palette.primary.dark,
          padding: 50,
        }}
      >
        <Box position="relative" height="100%">
          <Image
            src={BackgroundImage}
            alt="Books"
            layout="fill"
            objectFit="contain"
          />
        </Box>
      </Grid>
      <Grid xs lg={6} container alignItems="center" style={{ height: "100vh" }}>
        <Container maxWidth="sm">
          <Grid container spacing={3} px={{ md: 5 }}>
            <Grid container direction="column" alignItems="center" pb={5}>
              <Box width={110} height={110}>
                <Image src={Logo} alt="Shbooks Logo" />
              </Box>
              <Typography variant="h3">Welcome!</Typography>
            </Grid>
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
              <TextField fullWidth label="Password" type="password" />
            </Grid>
            <Grid item xs={12} mt={2}>
              <Button variant="contained" fullWidth style={{ padding: 12 }}>
                Sign up
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant="outlined" fullWidth style={{ padding: 11 }}>
                <Box width={25} height={25} mr={2}>
                  <Image src={GoogleLogo} alt="Google logo" />
                </Box>
                Sign in With Google
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" textAlign="center">
                Already have an account?{" "}
                <Link href="/auth/signin">
                  <a style={{ color: theme.palette.primary.dark }}>Sign In</a>
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </Grid>
  );
};

export default SignUp;
