import { gql, request } from "graphql-request";
import { useQuery } from "react-query";

const endpoint = "https://api.thegraph.com/subgraphs/name/tinypell3ts/music-factory";

export default function useRelease(address: string, refetchInterval = 0) {
  return useQuery(
    ["creatorReleases", address],
    async () => {
      const { mediaItems } = await request(
        endpoint,
        gql`
			query {
					mediaItems(where: {creator: "${address}"}, orderBy: createdAt, orderDirection: desc) {
						id				
						symbol
						createdAt
						saleData {
							totalSold
							maxSupply
							totalEarnings
							totalReleased
							royaltiesPercentage
							salePrice
						}
						metadata {
							key
							value
						}
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
					}
				}
			`
      );
      return mediaItems;
    },
    { refetchInterval }
  );
}
