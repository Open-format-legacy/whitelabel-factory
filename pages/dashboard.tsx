import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWalletStore } from "../stores";
import { ethers } from "ethers";
import { abi } from "../abis/theFactory.json";

export default function DashboardPage() {
  const { query } = useRouter();
  const { wallet } = useWalletStore();
  const [balance, setBalance] = useState<string>();
  const [maxSupply, setMaxSupply] = useState<string>();
  const [totalSupply, setTotalSupply] = useState<string>();
  const [salePrice, setSalePrice] = useState<string>();
  const [symbol, setSymbol] = useState<string>();
  const [metadataURI, setMetadataURI] = useState<string>();
  const [audio, setAudio] = useState();
  const [image, setImage] = useState();

  useEffect(() => fetchData(), [wallet]);

  // @dev if contract address doesn't exist, display error
  if (!query.address) return <div>Invalid contract address</div>;

  async function fetchData() {
    if (window?.ethereum && wallet?.provider) {
      const web3Provider = new ethers.providers.Web3Provider(
        wallet.provider
      );
      const signer = web3Provider.getSigner();

      const contract = new ethers.Contract(
        query.address,
        abi,
        signer
      );

      try {
        const maxSupply = await contract.maxSupply();
        const symbol = await contract.symbol();
        const balanceOf = await contract.provider.getBalance(
          contract.address
        );
        const totalSupply = await contract.totalSupply();
        const salePrice = await contract.releaseSalePrice();
        const metadataURI = await contract.metadataURI();

        setBalance(ethers.utils.formatEther(balanceOf.toString()));
        setMaxSupply(maxSupply.toString());
        setTotalSupply(totalSupply.toString());
        setSalePrice(ethers.utils.formatEther(salePrice.toString()));
        setSymbol(symbol);
        setMetadataURI(metadataURI);
      } catch (e) {
        console.log({ e });
      }
    }

    if (query.metadata) {
      const URL = transformURL(query.metadata);
      const result = await fetch(URL).then((res) => res.json());

      const fetchAudio = await fetch(transformURL(result?.audio));

      setAudio(fetchAudio);
      setImage(transformURL(result.image));

      console.log(result);
    }
  }

  const data = balance && maxSupply && totalSupply && salePrice;

  return data ? (
    <ul className="grid grid-rows-3 md:grid-rows-none md:grid-cols-3 gap-5">
      <li className="flex justify-center py-20 rounded-lg shadow">
        <div className="flex flex-col items-center justify-center space-x-2">
          <p>Total Earnings:</p>
          <p className="text-5xl font-semibold">
            {salePrice * totalSupply}
          </p>
          <p className="text-sm font-semibold text-gray-500">MATIC</p>
        </div>
      </li>
      <li className="flex justify-center py-20 rounded-lg shadow">
        <div className="flex flex-col items-center justify-center space-x-2">
          <p>Current balance:</p>
          <p className="text-5xl font-semibold">{balance}</p>
          <p className="text-sm font-semibold text-gray-500">MATIC</p>
        </div>
      </li>
      <li className="flex justify-center py-20 rounded-lg shadow">
        <div className="flex flex-col items-center justify-center space-x-2">
          <p>Total sold:</p>
          <p className="text-5xl font-semibold">{totalSupply}</p>
          <p className="text-sm font-semibold text-gray-500">
            {symbol}
          </p>
        </div>
      </li>
      <li className="flex flex-col justify-center p-5 rounded-lg shadow">
        <audio className="w-full" id="audio" controls>
          <source src={audio} id="src" />
        </audio>

        <div className="space-y-2 my-2">
          <p>Artist: </p>
          <p>Track Name: </p>
          <p>Track Description: </p>
        </div>
      </li>
      <li className="flex justify-center rounded-lg shadow">
        <img src={image} className="rounded-md" />
      </li>
      <li className="flex justify-center rounded-lg shadow">
        View licence
      </li>
    </ul>
  ) : (
    <div>Loading data...</div>
  );
}

function transformURL(url: string) {
  return url.replace("ipfs://", "https://ipfs.infura.io/ipfs/");
}
