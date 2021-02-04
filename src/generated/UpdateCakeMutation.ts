/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CakeInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateCakeMutation
// ====================================================

export interface UpdateCakeMutation_updateCake {
  __typename: "Cake";
  id: string;
  image: string;
  publicId: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  address: string;
}

export interface UpdateCakeMutation {
  updateCake: UpdateCakeMutation_updateCake | null;
}

export interface UpdateCakeMutationVariables {
  id: string;
  input: CakeInput;
}
