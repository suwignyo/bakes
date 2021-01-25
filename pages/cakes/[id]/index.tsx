import { Image } from "cloudinary-react";
import { useQuery, gql } from "@apollo/client";
import Layout from "src/components/layout";
import { useRouter } from "next/router";
// import CakeNav from "src/components/cakeNav";
import SingleMap from "src/components/singleMap";
// import {
import {
  ShowCakeQuery,
  ShowCakeQueryVariables,
} from "src/generated/ShowCakeQuery";

const SHOW_CAKE_QUERY = gql`
  query ShowCakeQuery($id: String!) {
    cake(id: $id) {
      id
      userId
      address
      publicId
      bedrooms
      latitude
      longitude
    }
  }
`;

export default function ShowCake() {
  const {
    query: { id },
  } = useRouter();

  if (!id) return null;
  return <CakeData id={id as string} />;
}

function CakeData({ id }: { id: string }) {
  const { data, loading } = useQuery<ShowCakeQuery, ShowCakeQueryVariables>(
    SHOW_CAKE_QUERY,
    { variables: { id } }
  );

  // add spinner here
  if (loading || !data) return <Layout main={<div>Loading...</div>} />;

  // error page
  if (!data.cake) return <Layout main={<div>Unable to load cake {id}</div>} />;

  const { cake } = data;

  return (
    <Layout
      main={
        <div className="sm:block md:flex">
          <div className="sm:w-full md:w-1/2 p-4">
            <h1 className="text-3xl my-2">{cake.address}</h1>

            <Image
              className="pb-2"
              cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
              publicId={cake.publicId}
              alt={cake.address}
              secure
              dpr="auto"
              quality="auto"
              width={900}
              height={Math.floor((9 / 16) * 900)}
              crop="fill"
              gravity="auto"
            />

            <p>{cake.bedrooms} 🛌🎂 house</p>
          </div>
          <div className="sm:w-full md:w-1/2">
            <SingleMap cake={cake}></SingleMap>
          </div>
        </div>
      }
    />
  );
}
