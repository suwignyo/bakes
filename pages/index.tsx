// import { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useDebounce } from "use-debounce";
import Layout from "src/components/layout";
import Map from "src/components/map";
// import CakeList from "src/components/cakeList";
// import { useLastData } from "src/utils/useLastData";
import { useLocalState } from "src/utils/useLocalState";
// import { CakesQuery, CakesQueryVariables } from "src/generated/CakesQuery";

type BoundsArray = [[number, number], [number, number]];

export default function Home() {
  const [dataBounds, setDataBounds] = useLocalState<string>(
    "bounds",
    "[[0,0],[0,0]]"
  );

  const [debouncedDataBounds] = useDebounce(dataBounds, 500);
  console.log(debouncedDataBounds, "debouncedDataBounds");

  return (
    <Layout
      main={
        <div className="flex">
          <div
            className="w-1/2 pb-4"
            style={{ maxHeight: "calc(100vh - 64px)", overflowX: "scroll" }}
          >
            CakeList
          </div>
          <div className="w-1/2">
            <Map setDataBounds={setDataBounds} />
          </div>
        </div>
      }
    />
  );
}
