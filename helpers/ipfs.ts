import { NFTStorage, File } from "nft.storage";

const client = new NFTStorage({
  token: process.env.NEXT_PUBLIC_NFT_STORAGE_TOKEN,
});

export async function uploadToIPFS(data: any) {
  if (!data) throw Error("Data is invalid");
  return await client.store(data);
}

export function buildMetadata(
  name: string,
  description: string,
  image: File,
  audio: File,
  attributes: Attribute[],
  licence: File,
  documents: File[]
) {
  const data = {
    name,
    description,
    image: new File([image], image.name, {
      type: image.type,
    }),
    audio: new File([audio], audio.name, {
      type: audio.type,
    }),
    attributes,
    licence: licence
      ? new File([licence], licence.name, {
          type: licence.type,
        })
      : null,
    documents: documents
      ? documents.map(
          (document, i) =>
            new File([document], `${document.name}`, {
              type: document.type,
            })
        )
      : [],
  };

  return data;
}
