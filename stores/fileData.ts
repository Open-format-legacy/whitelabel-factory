import create from "zustand";

type FileDataState = {
  image?: File;
  audio?: File;
  documents?: File[];
  licence?: File;
  setImage: (image: File) => void;
  setAudio: (audio: File) => void;
  setDocuments: (documents: File[]) => void;
  setLicence: (licence: File) => void;
};

export default create<FileDataState>((set: any) => ({
  image: null,
  audio: null,
  documents: null,
  licence: null,
  setImage: (image) => set({ image }),
  setAudio: (audio) => set({ audio }),
  setDocuments: (documents) => set({ documents }),
  setLicence: (licence) => set({ licence }),
}));
