import { useQuery } from "react-query";

import { request, gql } from "graphql-request";

const endpoint = "https://api.thegraph.com/subgraphs/name/tinypell3ts/music-factory";

export default function useRelease(address: string) {
	return useQuery(["release", address], async () => {
		const { release } = await request(
			endpoint,
			gql`
				query {
					release(id: "${address}") {
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
							createdAtTimestamp
						}
						creator {
							id
						}
					}
				}
			`
		);
		return release;
	});
}
