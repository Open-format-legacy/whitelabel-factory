enum APIResponseStatus {
  LOADING = "loading",
  ERROR = "error"
}

type Wallet = {
  provider: ethers.providers.ExternalProvider;
};

type Contracts = {
  factory: {
    bytecode: ethers.ContractBytecode;
    abi: ethers.ContractInterface;
  };
};

type ContractName = "factory";

type TrackData = {
  artist: string;
  track_name: string;
  track_description: string;
  symbol: string;
  stakeholders: Stakeholder[];
  royalitiesPercentage: number;
  salePrice: number;
  quantity: number;
  attributes: Attribute[];
  license: string;
  documents: string[];
};

type Attribute = {
  trait_type: string;
  value: string;
};

type Release = {
  id: string;
  name: string;
  symbol: string;
  creator: string;
  artist: Artist;
  maxSupply: string;
  totalEarnings: string;
  totalSold: string;
  totalReleased: string;
  salePrice: string;
  createdAt: number;
  royaltiesPercentage: string;
  image: string;
  description: string;
  audio: string;
  licence: string;
  stakeholders: [Stakeholder];
  payouts: [Payout];
  owners: [Owner];
};

type Stakeholder = {
  id: string;
  share: string;
  release: Release;
};

type Payout = {
  id: string;
  account: string;
  amount: string;
  release: Release;
  createdAt: number;
  transactionHash: string;
};

type Owner = {
  id: string;
  releases: [Release];
};

type OwnerReleases = {
  id: string;
  owner: Owner;
  release: Release;
};

type Artist = {
  id: string;
  name: string;
};
