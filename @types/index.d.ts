type Wallet = {
  provider: ethers.providers.ExternalProvider;
};

type Contracts = {
  nft: {
    address: string;
    abi: ethers.ContractInterface;
  };
};

type ContractName = "nft";

type Release = {
  id: string;
  symbol: string;
  creator: Owner;
  createdAt: number;
  metadata: Metadata[];
  saleData: SaleData;
  stakeholders: [Stakeholder];
  payouts: [Payout];
  owners: [Owner];
};

type Stakeholder = {
  id: string;
  share: string;
  mediaItem: Release;
};

type Payout = {
  id: string;
  account: string;
  amount: string;
  mediaItem: Release;
  createdAt: number;
  transactionHash: string;
};

type Owner = {
  id: string;
  mediaItems: [Release];
};

type OwnerReleases = {
  id: string;
  owner: Owner;
  mediaItem: Release;
};

type Metadata = {
  key: string;
  value: string;
};

type SaleData = {
  maxSupply: number;
  totalEarnings: number;
  totalSold: number;
  totalReleased: number;
  salePrice: number;
  createdAt: number;
  royaltiesPercentage: number;
};
