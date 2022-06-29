import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import StateManager from "../context/StateManager";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider
      serverUrl={process.env.NEXT_PUBLIC_SERVER_URL!}
      appId={process.env.NEXT_PUBLIC_APP_ID!}
    >
      <NotificationProvider>
        <StateManager>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </StateManager>
      </NotificationProvider>
    </MoralisProvider>
  );
}

export default MyApp;
