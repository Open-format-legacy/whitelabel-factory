import { Button, ExplorerLink } from "../components";
import { useWalletStore } from "../stores";
import useTranslation from "next-translate/useTranslation";

export default function Header() {
  const { address, onboard, resetWallet } = useWalletStore();

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">The Factory 🏭</h1>
        <div className="flex items-center">
          {address ? (
            <>
              <ExplorerLink address={address} />
              <Button onClick={handleReset}>
                {t("wallet.disconnect_button")}
              </Button>
            </>
          ) : (
            <Button onClick={connect}>
              {t("wallet.connect_button")}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
