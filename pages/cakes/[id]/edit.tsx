import { GetServerSideProps, NextApiRequest } from "next";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import { loadIdToken } from "src/auth/firebaseAdmin";
import Layout from "src/components/layout";
import CakeForm from "src/components/cakeForm";
import { useAuth } from "src/auth/useAuth";
import {
  EditCakeQuery,
  EditCakeQueryVariables,
} from "src/generated/EditCakeQuery";

const EDIT_CAKE_QUERY = gql`
  query EditCakeQuery($id: String!) {
    cake(id: $id) {
      id
      userId
      address
      publicId
      bedrooms
      image
      latitude
      longitude
    }
  }
`;

export default function EditCake() {
  const {
    query: { id },
  } = useRouter();
  if (!id) return null;
  return <CakeData id={id as string}></CakeData>;
}

function CakeData({ id }: { id: string }) {
  const { user } = useAuth();
  const { data, loading } = useQuery<EditCakeQuery, EditCakeQueryVariables>(
    EDIT_CAKE_QUERY,
    {
      variables: {
        id: id,
      },
    }
  );

  if (!user) return <Layout main={<div>Please login</div>}></Layout>;
  if (loading) return <Layout main={<div>loading...</div>}></Layout>;
  if (data && !data.cake)
    return <Layout main={<div>Unable to load house</div>}></Layout>;
  if (user.uid !== data?.cake?.userId)
    return <Layout main={<div>You don't have permission</div>}></Layout>;

  return <Layout main={<CakeForm cake={data.cake}></CakeForm>}></Layout>;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const uid = await loadIdToken(req as NextApiRequest);

  if (!uid) {
    res.setHeader("location", "/auth");
    res.statusCode = 302;
    res.end();
  }
  return { props: {} };
};
