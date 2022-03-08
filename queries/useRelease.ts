import { gql, request } from "graphql-request";
import { useQuery } from "react-query";

const endpoint = "https://api.thegraph.com/subgraphs/name/tinypell3ts/music-factory";

export default function useRelease(address: string, refetchInterval = 0) {
  return useQuery(
    ["release", address],
    async () => {
      const { mediaItem } = await request(
        endpoint,
        gql`
			query {
				mediaItem(id: "${address}") {
					id
					symbol
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
					metadata {
						key
						value
					}
					saleData {
						totalSold
						maxSupply
						totalEarnings
						totalReleased
						royaltiesPercentage
						salePrice
					}
				}
			}
			`
      );
      return mediaItem;
    },
    { refetchInterval }
  );
}
