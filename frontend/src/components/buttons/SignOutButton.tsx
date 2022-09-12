import {  MenuItem } from "@mui/material";
import React, {useContext, useState } from "react";
import { UserContext } from "../../pages/_app";
import { AuthService } from "../../services/auth-service";

const SignOutButton: React.FC = React.memo(function SignOutButton() {
  const { setCurrentUser } = useContext(UserContext);
  const [isLoading, setLoading] = useState(false);

  const onClick = async () => {
    try{
      setLoading(true);
      await AuthService.instance.signOut();
      setCurrentUser(undefined);
      setLoading(false);
    }catch (error){
      console.log(error);
    }
  };

  return <MenuItem onClick={onClick}>{isLoading ? "Signing Out..." : "Sign Out"}</MenuItem>;
});

export default SignOutButton;
