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
import { useRouter } from "next/router";

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
  const { push } = useRouter();

  async function handleCreateContract(data: TrackData) {
    console.log({ data });
    setLoading(true);

    const {
      track_name,
      track_description,
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
      track_name,
      track_description,
      image,
      audio,
      null,
      licence,
      documents
    );

    console.log(metadata);

    const ipfsData = await uploadToIPFS(metadata);

    console.log({ ipfsData });

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
          push({
            pathname: "/dashboard",
            query: {
              address: contract.address,
              metadata: ipfsData.url,
            },
          });

          console.log(await contract.name());

          setLoading(false);
        } catch (e) {
          setLoading(false);
          console.log({ e });
        }
      },
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
      accept: ".mp3",
    },
    {
      name: "image",
      setter: setImage,
      label: image ? image.name : "Select .png, .jpeg, .jpg",
      text: "Upload artwork",
      accept: ".png, .jpeg, .jpg",
    },
    {
      name: "licence",
      setter: setLicence,
      label: licence ? licence.name : "Select .pdf",
      text: "Upload licence",
      accept: ".pdf",
    },
  ];

  const requiredFilesAdded = Boolean(audio?.name && image?.name);

  return (
    <div>
      {wallet?.provider && (
        <div className="grid grid-cols-5 gap-5">
          <div className="flex flex-col col-span-3">
            <CreateTrackForm
              onCreateTrack={(data) => handleCreateContract(data)}
              isLoading={isLoading}
              requiredFilesAdded={requiredFilesAdded}
            />
          </div>
          <div className="flex flex-col space-y-5 col-span-2">
            <div className="bg-indigo-300 rounded-md">
              <ul className="p-5">
                <h2>Assets</h2>
                {files.map(
                  ({ name, setter, label, text, accept }, i) => (
                    <li className="my-2">
                      <FileUpload
                        name={name}
                        onFileUpload={(e) =>
                          handleFileUpload(e, setter)
                        }
                        label={label}
                        text={text}
                        accept={accept}
                      />
                    </li>
                  )
                )}
              </ul>
            </div>
            {image && (
              <div>
                <div className="rounded-md bg-indigo-500 flex flex-col justify-center items-center">
                  {image ? (
                    <img
                      className="w-full rounded-md"
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
