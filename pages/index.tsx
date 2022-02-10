import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { Button, FileUpload } from "../components";
import { ExternalLinkIcon } from "@heroicons/react/outline";
import {
  createContract,
  uploadToIPFS,
  buildMetadata,
} from "../helpers";
import { useFileDataStore, useWalletStore } from "../stores";
import { CreateTrackForm } from "../forms";
import { ethers } from "ethers";

const Home: NextPage = () => {
  const { wallet } = useWalletStore();
  const {
    image,
    audio,
    licence,
    documents,
    setImage,
    setAudio,
    setLicence,
    setDocuments,
  } = useFileDataStore();
  const [transaction, setTransaction] = useState();
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log({ image, audio });
  }, [image, audio]);

  async function handleCreateContract(data: TrackData) {
    setLoading(true);

    const {
      name,
      description,
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

    const metadata = buildMetadata(
      name,
      description,
      image,
      audio,
      [],
      licence,
      documents
    );

    const ipfsData = await uploadToIPFS(metadata);

    console.log("IPFS", ipfsData.url);

    createContract({
      name: "factory",
      provider: wallet?.provider,
      cb: async (factory) => {
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
            royalitiesPercentage,
            ipfsData.url
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

  async function handleFileUpload(e, setter) {
    const files = e.target.files;
    setter(files[0]);
  }

  return (
    <div>
      {wallet?.provider && (
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col">
            {!transaction ? (
              <>
                <FileUpload
                  name="audio"
                  onFileUpload={(e) => handleFileUpload(e, setAudio)}
                  label="Select .mp3"
                  text="Upload Track"
                  accept=".mp3"
                />
                <CreateTrackForm
                  onCreateTrack={(data) => handleCreateContract(data)}
                  isLoading={isLoading}
                />
              </>
            ) : (
              <div className="my-2">
                <Button>
                  <span>View Deployed Contract</span>
                  <ExternalLinkIcon className="h-6 w-6" />
                </Button>
              </div>
            )}
          </div>
          <div className="grid grid-rows-2 gap-5">
            {!transaction && (
              <div className="row-span-3">
                <div className="border-0 h-full bg-indigo-500 flex flex-col justify-center items-center">
                  {image ? (
                    <img
                      className="w-full h-full"
                      src={URL.createObjectURL(image)}
                    />
                  ) : (
                    <FileUpload
                      name="image"
                      onFileUpload={(e) =>
                        handleFileUpload(e, setImage)
                      }
                      label="Select .mp3"
                      text="Upload Track Artwork"
                      accept=".jpg, .png, .jpeg"
                    />
                  )}
                </div>
              </div>
            )}
            <div>
              {audio && (
                <audio className="w-full" id="audio" controls>
                  <source src={URL.createObjectURL(audio)} id="src" />
                </audio>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
