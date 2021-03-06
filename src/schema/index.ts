import { buildSchemaSync, Resolver, Query } from "type-graphql";
import { ImageResolver } from "./image";
import { authChecker } from "./auth";
import { CakeResolver } from "./cake";

export const schema = buildSchemaSync({
  resolvers: [ImageResolver, CakeResolver],
  emitSchemaFile: process.env.NODE_ENV === "development",
  authChecker,
});
