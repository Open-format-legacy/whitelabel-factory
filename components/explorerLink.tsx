import { ExternalLinkIcon } from "@heroicons/react/outline";
import { BLOCK_EXPLORER_URL } from "../helpers";
import { Button } from "../components";

interface ExplorerLinkProps {
  address: string;
  isTx?: boolean;
  truncate?: boolean;
}

export default function ExplorerLink({
  address,
  isTx = false,
  truncate = true
}: ExplorerLinkProps) {
  return (
    <a target="_blank" rel="noreferrer" href={BLOCK_EXPLORER_URL(address, isTx)}>
      {isTx ? (
        <div className="mx-2 flex hover:text-indigo-800">
          <span>View Transaction</span>
          <ExternalLinkIcon className="h-6 w-6" />
        </div>
      ) : (
        <div className="mx-2 flex hover:text-indigo-800">
          <span>{truncate ? `${address.slice(0, 4)}...${address.slice(-4)}` : address}</span>
          <ExternalLinkIcon className="h-6 w-6" />
        </div>
      )}
    </a>
  );
}
