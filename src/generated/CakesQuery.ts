/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BoundsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: CakesQuery
// ====================================================

export interface CakesQuery_cakes {
  __typename: "Cake";
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  publicId: string;
  bedrooms: number;
}

export interface CakesQuery {
  cakes: CakesQuery_cakes[];
}

export interface CakesQueryVariables {
  bounds: BoundsInput;
}
