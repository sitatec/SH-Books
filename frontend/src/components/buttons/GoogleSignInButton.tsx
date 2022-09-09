import { Button, Box, ButtonProps, Snackbar, IconButton, colors } from "@mui/material";
import Image from "next/image";
import { FC, SyntheticEvent, useState } from "react";
import GoogleLogo from "../../../images/google_logo.png";
import CloseIcon from '@mui/icons-material/Close';

const GoogleSignInButton: FC<ButtonProps> = (props) => {
  const [isSnackbarVisible, setSnackbarVisibility] = useState(false);

  const onCloseSnackbar = (_: Event | SyntheticEvent, reason?: string) => {
    if(reason != "clickaway"){
      setSnackbarVisibility(false);
    }
  }

  return (
    <>
      <Button
        variant="outlined"
        fullWidth
        style={{ padding: 11 }}
        onClick={() => setSnackbarVisibility(true)}
        {...props}
      >
        <Box width={25} height={25} mr={2}>
          <Image src={GoogleLogo} alt="Google logo" />
        </Box>
        Sign in With Google
      </Button>

      <Snackbar
        open={isSnackbarVisible}
        onClose={onCloseSnackbar}
        autoHideDuration={4000}
        anchorOrigin={{vertical: "bottom", horizontal: "center"}}
        color={colors.blue[400]}
        message="Coming soon!"
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={onCloseSnackbar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

export default GoogleSignInButton;
