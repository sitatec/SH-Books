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

const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField(props, ref) {
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
          ref={ref}
          {...props}
        />
        <FormControlLabel
          control={<Checkbox onChange={onShowPasswordChanged} />}
          label="Show Password"
          style={{ color: colors.grey[700] }}
        />
      </Box>
    );
  }
);

export default PasswordField;
