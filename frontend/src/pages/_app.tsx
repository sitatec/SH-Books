import { AppProps } from "next/app";
import Head from "next/head";
import "../styles/global.css";

const SHBooksApp = ({ Component, pageProps }: AppProps) => {
  return (
    <div>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Component {...pageProps}/>
    </div>
  );
};

export default SHBooksApp;
