import type { NextPage } from "next";
import { useState } from "react";
import { Button, FileUpload } from "../components";
import { createContract } from "../helpers";
import { useWalletStore } from "../stores";
import { CreateTrackForm } from "../forms";
import { ethers } from "ethers";
import ReactAudioPlayer from "react-audio-player";

const Home: NextPage = () => {
  const { wallet } = useWalletStore();
  const [transaction, setTransaction] = useState();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [audioFile, setAudioFile] = useState();

  async function handleCreateContract(data: TrackData) {
    const {
      name,
      symbol,
      salePrice,
      stakeholders,
      quantity,
      royalitiesPercentage,
    } = data;
    const payees = stakeholders.map(
      (stakeholder) => stakeholder.address
    );
    const shares = stakeholders.map(
      (stakeholder) => stakeholder.share
    );

    createContract({
      name: "factory",
      provider: wallet?.provider,
      cb: async (factory) => {
        setLoading(true);
        try {
          const contract = await factory.deploy(
            payees,
            shares,
            salePrice
              ? ethers.utils.parseEther(salePrice.toString())
              : 0,
            name,
            symbol,
            quantity,
            royalitiesPercentage
          );

          console.log("ADDRESS", contract.address);

          const receipt = await contract.deployTransaction.wait();

          setTransaction(receipt.transactionHash);

          console.log(await contract.name());
          setLoading(false);
        } catch (e) {
          setLoading(false);
          console.log({ e });
        }
      },
    });
  }

  return (
    <div>
      {wallet?.provider && (
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col">
            <FileUpload onFileUpload={(file) => setAudioFile(file)} />
            <CreateTrackForm
              onCreateTrack={(data) => handleCreateContract(data)}
              isLoading={isLoading}
            />
          </div>
          <div className="grid grid-rows-2 gap-5">
            <div className="row-span-3">
              <img
                className="w-full"
                src="https://placedog.net/500"
              />
            </div>
            <div>
              {audioFile && (
                <ReactAudioPlayer
                  className="w-full"
                  src={audioFile}
                  controls
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
