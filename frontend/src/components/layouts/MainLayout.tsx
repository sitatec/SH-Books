import {
  Box,
  Container,
  Toolbar,
} from "@mui/material";
import React from "react";
import ShbAppBar from "../ShbAppBar";

export interface MainLayoutProps {
  children: React.ReactNode;
}


const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {

  return (
    <Box sx={{ display: "flex" }}>
      <ShbAppBar/>
      <Container component="main">
        <Toolbar />
        {children}
      </Container>
    </Box>
  );
};

export default MainLayout;
