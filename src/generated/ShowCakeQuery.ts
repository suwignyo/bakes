/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ShowCakeQuery
// ====================================================

export interface ShowCakeQuery_cake_nearby {
  __typename: "Cake";
  id: string;
  latitude: number;
  longitude: number;
}

export interface ShowCakeQuery_cake {
  __typename: "Cake";
  id: string;
  userId: string;
  address: string;
  publicId: string;
  bedrooms: number;
  latitude: number;
  longitude: number;
  nearby: ShowCakeQuery_cake_nearby[];
}

export interface ShowCakeQuery {
  cake: ShowCakeQuery_cake | null;
}

export interface ShowCakeQueryVariables {
  id: string;
}
