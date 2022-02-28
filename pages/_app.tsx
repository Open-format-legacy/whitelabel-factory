import type { AppProps } from "next/app";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "react-query";
import { Banner, Header } from "../components";
import { addNetwork, NETWORK_ID, readyToTransact } from "../helpers";
import { initOnboard } from "../services";
import { useWalletStore } from "../stores";
import "../styles/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity
    }
  }
});

function MyApp({ Component, pageProps }: AppProps) {
  const { onboard, wallet, setAddress, setNetwork, setBalance, setWallet, setOnboard } =
    useWalletStore();

  useEffect(() => {
    if (wallet?.provider) {
      addNetwork(NETWORK_ID);
    }
  }, [wallet]);

  useEffect(() => {
    const onboard = initOnboard({
      address: setAddress,
      network: setNetwork,
      balance: setBalance,
      wallet: (wallet: any) => {
        if (wallet.provider) {
          setWallet(wallet);
          window.localStorage.setItem("selectedWallet", wallet.name);
        } else {
          setWallet();
        }
      }
    });

    setOnboard(onboard);
  }, []);

  useEffect(() => {
    const previouslySelectedWallet = window.localStorage.getItem("selectedWallet");

    if (previouslySelectedWallet && onboard) {
      readyToTransact(onboard, previouslySelectedWallet);
    }
  }, [onboard]);

  return (
    <QueryClientProvider client={queryClient}>
      <Banner />
      <div className="h-full min-h-screen bg-zinc-900 p-2 md:p-4">
        <Header />
        <Component {...pageProps} />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default MyApp;
