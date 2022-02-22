import { gql, request } from "graphql-request";
import { useQuery } from "react-query";

const endpoint = "https://api.thegraph.com/subgraphs/name/tinypell3ts/music-factory";

export default function useRelease(address: string, refetchInterval = 0) {
  return useQuery(
    ["creatorReleases", address],
    async () => {
      const { releases } = await request(
        endpoint,
        gql`
				query {
					releases(where: {creator: "${address}"}) {
						id
						name
						symbol
						totalSold
						maxSupply
						totalEarnings
						totalReleased
						royaltiesPercentage
						salePrice
						image
						audio
						description
						licence
						stakeholders {
							id
							share
						}
						payouts {
							id
							amount
							createdAt
							transactionHash
						}
						creator {
							id
						}
					}
				}
			`
      );
      return releases;
    },
    { refetchInterval }
  );
}
