import { createTheme, ThemeProvider } from "@mui/material";
import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/global.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const SHBooksApp = ({ Component, pageProps }: AppProps) => {
  const customTheme = createTheme({
    shape: {
      borderRadius: 8,
    },
  });
  return (
    <ThemeProvider theme={customTheme}>
      <div>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
};

export default SHBooksApp;
