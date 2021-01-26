import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useDebounce } from "use-debounce";
import Layout from "src/components/layout";
import Map from "src/components/map";
import CakeList from "src/components/cakeList";
import { useLastData } from "src/utils/useLastData";
import { useLocalState } from "src/utils/useLocalState";
import { CakesQuery, CakesQueryVariables } from "src/generated/CakesQuery";

const CAKES_QUERY = gql`
  query CakesQuery($bounds: BoundsInput!) {
    cakes(bounds: $bounds) {
      id
      latitude
      longitude
      address
      publicId
      bedrooms
    }
  }
`;

type BoundsArray = [[number, number], [number, number]];

const parseBounds = (boundsString: string) => {
  const bounds = JSON.parse(boundsString) as BoundsArray;
  return {
    sw: {
      latitude: bounds[0][1],
      longitude: bounds[0][0],
    },
    ne: {
      latitude: bounds[1][1],
      longitude: bounds[1][0],
    },
  };
};
export default function Home() {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [dataBounds, setDataBounds] = useLocalState<string>(
    "bounds",
    "[[0,0],[0,0]]"
  );

  const [debouncedDataBounds] = useDebounce(dataBounds, 500);
  // console.log(debouncedDataBounds, "debouncedDataBounds");

  const { data, error } = useQuery<CakesQuery, CakesQueryVariables>(
    CAKES_QUERY,
    {
      variables: {
        bounds: parseBounds(debouncedDataBounds),
      },
    }
  );
  const lastData = useLastData(data);

  if (error) return <Layout main={<div>Error loading content</div>} />;

  return (
    <Layout
      main={
        <div className="flex">
          <div
            className="w-1/2 pb-4"
            style={{ maxHeight: "calc(100vh - 64px)", overflowX: "scroll" }}
          >
            <CakeList
              cakes={lastData?.cakes ? lastData.cakes : []}
              setHighlightedId={setHighlightedId}
            />
          </div>
          <div className="w-1/2">
            <Map
              setDataBounds={setDataBounds}
              cakes={lastData?.cakes ? lastData.cakes : []}
              highlightedId={highlightedId}
            />
          </div>
        </div>
      }
    />
  );
}
