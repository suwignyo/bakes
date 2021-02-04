import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "src/auth/useAuth";
import { DeleteCake, DeleteCakeVariables } from "src/generated/DeleteCake";

const DELETE_MUTATION = gql`
  mutation DeleteCake($id: String!) {
    deleteCake(id: $id)
  }
`;
interface IProps {
  cake: {
    id: string;
    userId: string;
  };
}

export default function cakeNav({ cake }: IProps) {
  const router = useRouter();
  const { user } = useAuth();

  const canManage = !!user && user.uid === cake.userId;

  const [deleteCake, { loading }] = useMutation<
    DeleteCake,
    DeleteCakeVariables
  >(DELETE_MUTATION);
  return (
    <>
      <Link href="/">
        <a>map</a>
      </Link>
      {canManage && (
        <>
          {" | "}
          <Link href={`/cakes/${cake.id}/edit`}>
            <a>edit</a>
          </Link>
          {" | "}
          <button
            disabled={loading}
            type="button"
            onClick={async () => {
              if (confirm("Are you sure")) {
                await deleteCake({ variables: { id: cake.id } });
                router.push("/");
              }
            }}
          >
            delete
          </button>
        </>
      )}
    </>
  );
}
