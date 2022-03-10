import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { Button, ExplorerLink } from "../components";
import { useWalletStore } from "../stores";

export default function Header() {
  const { address, onboard, resetWallet } = useWalletStore();
  const { push } = useRouter();
  const { t } = useTranslation("common");

  async function connect() {
    try {
      if (onboard) {
        await onboard.walletSelect();
        await onboard.walletCheck();
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleReset() {
    window.localStorage.removeItem("selectedWallet");
    resetWallet();

    await onboard.walletReset();
  }

  return (
    <header className="w-full py-2 px-2">
      <div className="flex flex-col items-center justify-between md:flex-row">
        <div>
          <a className="flex" href="/">
            <h1 className=" text-5xl font-bold leading-none tracking-tighter text-white hover:text-pink-500">
              {t("header.name")}
            </h1>
            <p className="text-sm font-bold">{t("header.product")}</p>
          </a>
          <p className="text-center font-bold text-pink-500 md:text-left">{t("header.tagline")}</p>
        </div>
        <div className="flex items-center space-x-3">
          {address ? (
            <div className="flex flex-col items-center space-y-5 py-2 md:flex-row md:space-x-3 md:space-y-0 md:py-0">
              <ExplorerLink address={address} />
              <Button onClick={handleReset}>{t("wallet.disconnect_button")}</Button>
              <Button onClick={() => push(`/user/${address}`)}>{t("header.user_releases")}</Button>
            </div>
          ) : (
            <Button onClick={connect}>{t("wallet.connect_button")}</Button>
          )}
          <a
            className="rounded-md bg-white px-5 py-2 font-semibold text-black ring-2 ring-pink-500"
            href="https://whitelabel-market.netlify.app"
          >
            {t("header.navigate_to_market")}
          </a>
        </div>
      </div>
    </header>
  );
}
