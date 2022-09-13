import { createTheme, ThemeProvider } from "@mui/material";
import App, { AppContext, AppProps } from "next/app";
import Head from "next/head";
import "../styles/global.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import MainLayout from "../components/layouts/MainLayout";
import React, { useContext, useState } from "react";
import User from "../models/user";
import { AuthService } from "../services/auth-service";
import { HttpHeaders } from "../services/http-client";

const customTheme = createTheme({
  shape: {
    borderRadius: 8,
  },
});

interface Props {
  currentUser?: User;
}

interface UserContextType extends Props {
  setCurrentUser: (user?: User) => void;
}

export const UserContext = React.createContext<UserContextType>({
  setCurrentUser: (user) => {},
});

const SHBooksApp = ({
  Component,
  pageProps,
  router,
  currentUser,
}: AppProps & Props) => {
  const {currentUser: userFromContext} = useContext(UserContext);
  const [loggedInUser, setLoggedInUser] = useState(currentUser || userFromContext);

  let pageComponent = <Component {...pageProps} />;
  if (!router.asPath.startsWith("/auth/")) {
    pageComponent = <MainLayout>{pageComponent}</MainLayout>;
  }

  return (
    <ThemeProvider theme={customTheme}>
      <div>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <UserContext.Provider
          value={{ currentUser: loggedInUser, setCurrentUser: setLoggedInUser }}
        >
          {pageComponent}
        </UserContext.Provider>
      </div>
    </ThemeProvider>
  );
};

SHBooksApp.getInitialProps = async (context: AppContext) => {
  try {
    const response = await AuthService.instance.currentUser(
      context.ctx?.req?.headers as HttpHeaders
    );
    const appProps = await App.getInitialProps(context);
    return {
      currentUser: response.data.currentUser,
      ...appProps,
    };
  } catch (error) {
    console.error("Getting App initial props failed", error);
    return {
      currentUser: null,
    };
  }
};

export default SHBooksApp;
