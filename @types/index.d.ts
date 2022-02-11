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

type Stakeholder = {
  address: string;
  share: number;
};
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
