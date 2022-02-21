import { ethers } from "ethers";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { FileUpload } from "../components";
import { CreateTrackForm } from "../forms";
import {
  buildMetadata,
  createContract,
  dismissNotification,
  errorNotification,
  loadingNotification,
  successNotification,
  uploadToIPFS
} from "../helpers";
import { useFileDataStore, useWalletStore } from "../stores";

const Home: NextPage = () => {
  const { wallet } = useWalletStore();
  const { image, audio, licence, documents, setImage, setAudio, setLicence } = useFileDataStore();
  const [isLoading, setLoading] = useState<boolean>(false);
  const { push } = useRouter();

  async function handleCreateContract(data: TrackData) {
    setLoading(true);
    const loading = loadingNotification("Uploading files to IPFS...");

    const {
      artist,
      track_name,
      track_description,
      symbol,
      salePrice,
      stakeholders,
      quantity,
      royalitiesPercentage
    } = data;
    const payees = stakeholders.map((stakeholder) => stakeholder.address);
    const shares = stakeholders.map((stakeholder) => stakeholder.share);

    const metadata = buildMetadata(
      artist,
      track_name,
      track_description,
      image,
      audio,
      null,
      licence,
      documents
    );

    const ipfsData = await uploadToIPFS(metadata);

    dismissNotification(loading);

    createContract({
      name: "factory",
      provider: wallet?.provider,
      cb: async (factory) => {
        const awaitingTx = loadingNotification("Review and confirm transaction in Metamask...");
        try {
          const contract = await factory.deploy(
            payees,
            shares,
            salePrice ? ethers.utils.parseEther(salePrice.toString()) : 0,
            name,
            symbol,
            quantity,
            royalitiesPercentage,
            ipfsData.url
          );

          dismissNotification(awaitingTx);

          const pendingTx = loadingNotification("Pending transaction...");
          await contract.deployTransaction.wait();

          dismissNotification(pendingTx);
          successNotification("Preparing your release...", "Infinity");

          push({
            pathname: "/dashboard",
            query: {
              address: contract.address
            }
          });

          localStorage.setItem("release_address", contract.address);
          setLoading(false);
        } catch (e) {
          dismissNotification(awaitingTx);
          errorNotification(`Transaction Error - ${e.message}`);
          setLoading(false);
        }
      }
    });
  }

  function handleFileUpload(e, setter) {
    const files = e.target.files;
    if (files[0]) {
      setter(files[0]);
    }
  }

  const files = [
    {
      name: "audio",
      setter: setAudio,
      label: audio ? audio.name : "Select .mp3",
      text: "Upload audio",
      accept: ".mp3"
    },
    {
      name: "image",
      setter: setImage,
      label: image ? image.name : "Select .png, .jpeg, .jpg",
      text: "Upload artwork",
      accept: ".png, .jpeg, .jpg"
    },
    {
      name: "licence",
      setter: setLicence,
      label: licence ? licence.name : "Select .pdf",
      text: "Upload licence",
      accept: ".pdf"
    }
  ];

  const requiredFilesAdded = Boolean(audio?.name && image?.name);

  return (
    <div>
      {wallet?.provider && (
        <div className="grid grid-rows-2 gap-5 lg:grid-cols-5">
          <div className="flex flex-col lg:col-span-3">
            <CreateTrackForm
              onCreateTrack={(data) => handleCreateContract(data)}
              isLoading={isLoading}
              requiredFilesAdded={requiredFilesAdded}
            />
          </div>
          <div className="col-span-2 flex flex-col space-y-5">
            <div className="gradient-primary rounded-md">
              <ul className="p-5">
                <h2>Assets</h2>
                {files.map(({ name, setter, label, text, accept }, i) => (
                  <li className="my-2">
                    <FileUpload
                      name={name}
                      onFileUpload={(e) => handleFileUpload(e, setter)}
                      label={label}
                      text={text}
                      accept={accept}
                    />
                  </li>
                ))}
              </ul>
            </div>
            {image && (
              <div>
                <div className="gradient-primary flex flex-col items-center justify-center rounded-md">
                  {image ? (
                    <img className="w-full rounded-md" src={URL.createObjectURL(image)} />
                  ) : (
                    <FileUpload
                      name="image"
                      onFileUpload={(e) => handleFileUpload(e, setImage)}
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
