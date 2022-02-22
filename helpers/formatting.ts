import { ethers } from "ethers";

export function fromWei(amount: string) {
  return ethers.utils.formatEther(amount);
}
