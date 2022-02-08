import { ethers } from "ethers";
import { contracts } from "../constants";

interface CallContractProps {
  name: ContractName;
  provider: ethers.providers.ExternalProvider;
  cb: (contract: ethers.Contract | ethers.ContractFactory) => void;
}

function callContract({ name, provider, cb }: CallContractProps) {
  if (!name || !provider || !cb) {
    throw Error("Name, provider or callback is null.");
  }

  const contract = contracts[name];

  if (!contract) throw Error("Contract address and abi are invalid.");

  const { address, abi } = contract;

  if (address === "0x") throw Error("Invalid address");

  const web3Provider = new ethers.providers.Web3Provider(provider);
  const signer = web3Provider.getSigner();

  const nftContract = new ethers.Contract(address, abi, signer);
  return cb(nftContract);
}

function createContract({ name, provider, cb }: CallContractProps) {
  if (!name || !provider || !cb) {
    throw Error("Name, provider or callback is null.");
  }

  const contract = contracts[name];

  if (!contract) throw Error("Contract address and abi are invalid.");

  const { abi, bytecode } = contract;

  const web3Provider = new ethers.providers.Web3Provider(provider);
  const signer = web3Provider.getSigner();

  const factory = new ethers.ContractFactory(abi, bytecode, signer);

  return cb(factory);
}

export { callContract, createContract };
