import { createTheme, ThemeProvider } from "@mui/material";
import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/global.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import MainLayout from "../components/layouts/MainLayout";
import React from "react";
import User from "../models/user";

  const customTheme = createTheme({
    shape: {
      borderRadius: 8,
    },
  });
  
export const UserContext = React.createContext<User | null>(null)

const SHBooksApp = ({ Component, pageProps, router }: AppProps) => {

  let pageComponent = <Component {...pageProps} />;
  if(!router.asPath.startsWith("/auth/")){
    pageComponent = <MainLayout>
      {pageComponent}
    </MainLayout>
  }

  return (
    <ThemeProvider theme={customTheme}>
      <div>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        {pageComponent}
      </div>
    </ThemeProvider>
  );
};

export default SHBooksApp;
