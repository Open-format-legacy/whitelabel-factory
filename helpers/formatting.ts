import { ethers } from "ethers";

export function fromWei(amount: string) {
  return ethers.utils.formatEther(amount);
}

export function getMetadataValue(metadata: Metadata[], key: string) {
  if (!key) return new Error("formatMetadata: key not set");
  return metadata.find((m) => m.key === key)?.value;
}
