import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "src/auth/useAuth";
// import { DeleteCake, DeleteCakeVariables } from "src/generated/DeleteCake";

interface IProps {
  cake: {
    id: string;
    userId: string;
  };
}

export default function cakeNav({ cake }: IProps) {
  const { user } = useAuth();

  const canManage = !!user && user.uid === cake.userId;

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
        </>
      )}
    </>
  );
}
