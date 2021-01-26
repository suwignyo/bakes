import Link from "next/link";
import { Image } from "cloudinary-react";
import { CakesQuery_cakes } from "src/generated/CakesQuery";

interface IProps {
  cakes: CakesQuery_cakes[];
  setHighlightedId: (id: string | null) => void;
}

export default function HouseList({ cakes, setHighlightedId }: IProps) {
  return (
    <>
      {cakes.map((cake) => (
        <Link key={cake.id} href={`/cakes/${cake.id}`}>
          <div
            className="px-6 pt-4 cursor-pointer flex flex-wrap"
            onMouseEnter={() => setHighlightedId(cake.id)}
            onMouseLeave={() => setHighlightedId(null)}
          >
            <div className="sm:w-full md:w-1/2">
              <Image
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={cake.publicId}
                alt={cake.address}
                secure
                dpr="auto"
                quality="auto"
                width={350}
                height={Math.floor((9 / 16) * 350)}
                crop="fill"
                gravity="auto"
              />
            </div>
            <div className="sm:w-full md:w-1/2 sm:pl-0 md:pl-4">
              <h2 className="text-lg">{cake.address}</h2>
              <p>{cake.bedrooms} 🛌 cake</p>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
