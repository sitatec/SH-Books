import { Box, Container, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { NextPage } from "next";
import Image, { StaticImageData } from "next/image";
import Logo from "../../images/logo.png";

export interface AuthLayoutProps {
  title: string;
  subtitle: string;
  illustrationImage: StaticImageData | string;
  illustrationBackgroundColor?: string;
  children: React.ReactNode;
}

// TODO separate style from component code
const AuthLayout: NextPage<AuthLayoutProps> = ({
  title,
  subtitle,
  illustrationImage,
  children,
  illustrationBackgroundColor,
}) => {
  const theme = useTheme();
  const isSmallScreenHeight = useMediaQuery("(max-height: 800px)");

  return (
    <Grid container>
      <Grid
        item
        display={{ xs: "none", lg: "block" }}
        lg={6}
        style={{
          height: "100vh",
          backgroundColor:
            illustrationBackgroundColor || theme.palette.primary.main,
          padding: 40,
        }}
      >
        <Box position="relative" height="100%">
          <Image
            src={illustrationImage}
            alt="Books"
            layout="fill"
            objectFit="contain"
          />
        </Box>
      </Grid>
      <Grid item xs lg={6} container alignItems="center" style={{ height: "100vh" }}>
        <Container maxWidth="sm">
          <Grid container spacing={3} px={{ md: 5 }}>
            <Grid
              container
              direction="column"
              alignItems="center"
              pb={{xs:2, md:5}}
              display={isSmallScreenHeight ? "none" : "flex"}
            >
              <Box width={{md:100, xs: 80}} height={{md:100, xs: 80}}>
                <Image src={Logo} alt="Shbooks Logo" />
              </Box>
              <Typography variant={"h3"} mt={1.5} mb={1} fontSize={{xs: 28, md: 35}}>
                {title}
              </Typography>
              <Typography variant="body2" color="gray" >
                {subtitle}
              </Typography>
            </Grid>
            {children}
          </Grid>
        </Container>
      </Grid>
    </Grid>
  );
};

const Styles = {

};

export default AuthLayout;
