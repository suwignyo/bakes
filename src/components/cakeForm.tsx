import { useState, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";
import { Router, useRouter } from "next/router";
import Link from "next/link";
import { Image } from "cloudinary-react";
import { SearchBox } from "./searchBox";
import {
  CreateCakeMutation,
  CreateCakeMutationVariables,
} from "src/generated/CreateCakeMutation";
import {
  UpdateCakeMutation,
  UpdateCakeMutationVariables,
} from "src/generated/UpdateCakeMutation";
import { CreateSignatureMutation } from "src/generated/CreateSignatureMutation";

interface IFormData {
  address: string;
  latitude: number;
  longitude: number;
  bedrooms: string;
  image: FileList;
}

const SIGNATURE_MUTATION = gql`
  mutation CreateSignatureMutation {
    createImageSignature {
      signature
      timestamp
    }
  }
`;

const CREATE_CAKE_MUTATION = gql`
  mutation CreateCakeMutation($input: CakeInput!) {
    createCake(input: $input) {
      id
    }
  }
`;

const UPDATE_CAKE_MUTATION = gql`
  mutation UpdateCakeMutation($id: String!, $input: CakeInput!) {
    updateCake(id: $id, input: $input) {
      id
      image
      publicId
      latitude
      longitude
      bedrooms
      address
    }
  }
`;

interface ICake {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  image: string;
  publicId: string;
}
interface IProps {
  cake?: ICake;
}

interface IUploadImageResponse {
  secure_url: string;
}

async function uploadImage(
  image: File,
  signature: string,
  timestamp: number
): Promise<IUploadImageResponse> {
  const url = `	https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
  const formData = new FormData();
  formData.append("file", image);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp.toString());
  formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_KEY ?? "");

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });
  return response.json();
}

export default function CakeForm({ cake }: IProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>();
  const {
    register,
    errors,
    handleSubmit,
    setValue,
    watch,
  } = useForm<IFormData>({
    defaultValues: cake
      ? {
          address: cake?.address,
          latitude: cake?.latitude,
          longitude: cake?.longitude,
          bedrooms: cake?.bedrooms.toString(),
        }
      : {},
  });

  const address = watch("address");

  const [createSignature] = useMutation<CreateSignatureMutation>(
    SIGNATURE_MUTATION
  );
  const [createCake] = useMutation<
    CreateCakeMutation,
    CreateCakeMutationVariables
  >(CREATE_CAKE_MUTATION);

  const [updateCake] = useMutation<
    UpdateCakeMutation,
    UpdateCakeMutationVariables
  >(UPDATE_CAKE_MUTATION);

  useEffect(() => {
    register({ name: "address" }, { required: "Please enter your address" });
    register({ name: "latitude" }, { required: true, min: -90, max: 90 });
    register({ name: "longitude" }, { required: true, min: -180, max: 180 });
  }, [register]);

  const handleCreate = async (data: IFormData) => {
    // console.log(data, "data");
    const { data: signatureData } = await createSignature();
    if (signatureData) {
      const { signature, timestamp } = signatureData.createImageSignature;
      const imageData = await uploadImage(data.image[0], signature, timestamp);

      const { data: cakeData } = await createCake({
        variables: {
          input: {
            address: data.address,
            bedrooms: parseInt(data.bedrooms, 10),
            image: imageData.secure_url,
            coordinates: {
              latitude: data.latitude,
              longitude: data.longitude,
            },
          },
        },
      });
      if (cakeData?.createCake) {
        router.push(`/cakes/${cakeData.createCake.id}`);
      } else {
        // put a toast later
        alert("Fail to add item");
      }
    }
  };

  const handleUpdate = async (currentCake: ICake, data: IFormData) => {
    let image = currentCake.image;

    if (data.image[0]) {
      const { data: signatureData } = await createSignature();
      if (signatureData) {
        const { signature, timestamp } = signatureData.createImageSignature;
        const imageData = await uploadImage(
          data.image[0],
          signature,
          timestamp
        );
        image = imageData.secure_url;
      }
    }
    const { data: cakeData } = await updateCake({
      variables: {
        id: currentCake.id,
        input: {
          address: data.address,
          bedrooms: parseInt(data.bedrooms, 10),
          image: image,
          coordinates: {
            latitude: data.latitude,
            longitude: data.longitude,
          },
        },
      },
    });
    // if success go back to show
    if (cakeData?.updateCake) {
      router.push(`/cakes/${currentCake.id}`);
    }
  };

  const onSubmit = (data: IFormData) => {
    setSubmitting(true);
    if (!!cake) {
      handleUpdate(cake, data);
    } else {
      handleCreate(data);
    }
  };

  return (
    <form className="mx-auto max-w-xl py-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl">
        {cake ? `Editing ${cake.address}` : "Adding a new cake"}
      </h1>
      <div className="mt-4">
        <label htmlFor="search" className="block">
          Search for your address
        </label>
        {/* Search field */}
        <SearchBox
          onSelectAddress={(address, latitude, longitude) => {
            setValue("address", address);
            setValue("longitude", longitude);
            setValue("latitude", latitude);
          }}
          defaultValue={cake ? cake.address : ""}
        />
        {errors.address && <p>{errors.address.message}</p>}
      </div>
      {address && (
        <>
          <div className="mt-4">
            <label
              htmlFor="image"
              className="p-4 border-dashed border-4 border-gray-600 block cursor-pointer"
            >
              Click to add image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={register({
                validate: (fileList: FileList) => {
                  if (cake || fileList.length >= 0) return true;
                  return "Please upload a file";
                },
              })}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (event?.target?.files?.[0]) {
                  const file = event.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewImage(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            ></input>
            {previewImage ? (
              <img
                src={previewImage}
                className="mt-4 object-cover"
                style={{ width: "576px", height: `${(9 / 16) * 576}px` }}
              ></img>
            ) : cake ? (
              <Image
                className="mt-4"
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={cake.publicId}
                alt={cake.address}
                secure
                dpr="auto"
                quality="auto"
                width={576}
                height={Math.floor((9 / 16) * 576)}
                gravity="auto"
                crop="fill"
              ></Image>
            ) : null}
            {errors.image && <p>{errors.image.message}</p>}
            <div className="mt-4">
              <label htmlFor="bedrooms" className="block">
                Beds
              </label>
              <input
                id="bedrooms"
                name="bedrooms"
                type="number"
                className="p-2"
                ref={register({
                  required: "Please enter a number",
                  max: {
                    value: 10,
                    message: "too big",
                  },
                  min: { value: 1, message: "must have a bedroom" },
                })}
              ></input>
              {errors.bedrooms && <p>{errors.bedrooms.message}</p>}
            </div>
            <div className="mt-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
                type="submit"
                disabled={submitting}
              >
                Save
              </button>
              <Link href={cake ? `/cake/${cake.id}` : "/"}>
                <a className="p-2">Cancel</a>
              </Link>
            </div>
          </div>
        </>
      )}
    </form>
  );
}
