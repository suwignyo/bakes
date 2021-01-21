import { AppProps } from "next/app";
import Head from "next/head";
// import { ApolloProvider } from "@apollo/client";
// import { useApollo } from "src/apollo";
// import { AuthProvider } from "src/auth/useAuth";
import "../styles/index.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>MB Bakes</title>
        <link rel="icon" href="/favicon.ico"></link>
      </Head>
      <Component {...pageProps} />
    </>
  );
}