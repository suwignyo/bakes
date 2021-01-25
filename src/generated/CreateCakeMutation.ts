/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CakeInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateCakeMutation
// ====================================================

export interface CreateCakeMutation_createCake {
  __typename: "Cake";
  id: string;
}

export interface CreateCakeMutation {
  createCake: CreateCakeMutation_createCake | null;
}

export interface CreateCakeMutationVariables {
  input: CakeInput;
}
