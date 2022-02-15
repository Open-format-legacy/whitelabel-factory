import { useEffect } from "react";
import { useQueryClient } from "react-query";

export default function useReactQuerySubscription() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const websocket = new WebSocket(
      "wss://api.thegraph.com/subgraphs/name/tinypell3ts/music-factory"
    );
    websocket.onopen = () => {
      console.log("connected");
    };
    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const queryKey = [...data.entity, data.id].filter(Boolean);
      queryClient.invalidateQueries(queryKey);
    };

    return () => {
      websocket.close();
    };
  }, [queryClient]);
}
