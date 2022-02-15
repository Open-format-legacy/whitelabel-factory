import { useQuery } from "react-query";

import { request, gql } from "graphql-request";

const endpoint =
  "https://api.thegraph.com/subgraphs/name/tinypell3ts/music-factory";

export default function usePosts() {
  return useQuery("release", async () => {
    const {
      release: { data },
    } = await request(
      endpoint,
      gql`
        query {
          release(id: "0xb5c326773ee3d22051ea7a5be415c1c8f2276893") {
            id
            name
            symbol
            totalSold
            creator {
              id
            }
          }
        }
      `
    );
    return data;
  });
}
