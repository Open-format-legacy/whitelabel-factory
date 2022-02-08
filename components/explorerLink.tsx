import { ExternalLinkIcon } from "@heroicons/react/outline";
import { BLOCK_EXPLORER_URL } from "../helpers";
import { Button } from "../components";

interface ExplorerLinkProps {
  address: string;
  isTx?: boolean;
}

export default function ExplorerLink({
  address,
  isTx = false,
}: ExplorerLinkProps) {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      href={BLOCK_EXPLORER_URL(address, isTx)}
    >
      {isTx ? (
        <Button>
          <span>View Transaction</span>
          <ExternalLinkIcon className="h-6 w-6" />
        </Button>
      ) : (
        <div className="flex mx-2 hover:text-indigo-800">
          <span>
            {address.slice(0, 4)}...{address.slice(-4)}
          </span>
          <ExternalLinkIcon className="h-6 w-6" />
        </div>
      )}
    </a>
  );
}
