import { useQuery } from "react-query";

import { request, gql } from "graphql-request";

const endpoint =
  "https://api.thegraph.com/subgraphs/name/tinypell3ts/music-factory";

export default function useRelease() {
  return useQuery("release", async () => {
    const { release } = await request(
      endpoint,
      gql`
        query {
          release(id: "0xb5c326773ee3d22051ea7a5be415c1c8f2276893") {
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
