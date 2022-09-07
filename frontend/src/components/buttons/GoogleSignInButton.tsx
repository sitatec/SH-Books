import { Button, Box, ButtonProps } from "@mui/material";
import Image from "next/image";
import { FC } from "react";
import GoogleLogo from "../../../public/images/google_logo.png";

const GoogleSignInButton: FC<ButtonProps> = (props) => {
  return (
    <Button variant="outlined" fullWidth style={{ padding: 11 }} {...props}>
      <Box width={25} height={25} mr={2}>
        <Image src={GoogleLogo} alt="Google logo" />
      </Box>
      Sign in With Google
    </Button>
  );
};

export default GoogleSignInButton;
