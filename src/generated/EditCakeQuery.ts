/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: EditCakeQuery
// ====================================================

export interface EditCakeQuery_cake {
  __typename: "Cake";
  id: string;
  userId: string;
  address: string;
  publicId: string;
  bedrooms: number;
  image: string;
  latitude: number;
  longitude: number;
}

export interface EditCakeQuery {
  cake: EditCakeQuery_cake | null;
}

export interface EditCakeQueryVariables {
  id: string;
}
