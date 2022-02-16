import { useEffect } from "react";
import { useQueryClient } from "react-query";

export default function useReactQuerySubscription() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const websocket = new WebSocket(
      "wss://api.thegraph.com/subgraphs/name/tinypell3ts/music-factory",
      "graphql-ws"
    );
    websocket.onopen = () => {
      console.log("connected");
    };
    websocket.onmessage = (event) => {
      //@TODO This is not firing. I will revisit.
      console.log({ EVENT: event });
      queryClient.invalidateQueries(["release"]);
    };

    return () => {
      websocket.close();
    };
  }, [queryClient]);
}
