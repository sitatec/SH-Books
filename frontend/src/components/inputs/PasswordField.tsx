import {
  Box,
  Checkbox,
  colors,
  FormControlLabel,
  TextField,
  TextFieldProps,
} from "@mui/material";
import React, { useState } from "react";

export type PasswordFieldProps = TextFieldProps & {
  allowShowPassword?: boolean;
};

const PasswordField: React.FC<PasswordFieldProps> = (props) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const onShowPasswordChanged = (_: any, checked: boolean) => {
    setPasswordVisible(checked);
  };

  return (
    <Box>
      <TextField
        fullWidth
        label="Password"
        type={isPasswordVisible ? "text" : "password"}
        {...props}
      />
      <FormControlLabel
        control={<Checkbox onChange={onShowPasswordChanged} />}
        label="Show Password"
        style={{color: colors.grey[700]}}
      />
    </Box>
  );
};

export default PasswordField;
