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
  name: string;
  symbol: string;
  stakeholders: Stakeholder[];
  royalitiesPercentage: number;
  salePrice: number;
  quantity: number;
};
