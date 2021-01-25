import { buildSchemaSync, Resolver, Query } from "type-graphql";
import { ImageResolver } from "./image";
import { authChecker } from "./auth";
import { CakeResolver } from "./cake";

@Resolver()
class DummyResolver {
  @Query((_returns) => String)
  hello() {
    return "Nicd to meet you!";
  }
}

export const schema = buildSchemaSync({
  resolvers: [DummyResolver, ImageResolver, CakeResolver],
  emitSchemaFile: process.env.NODE_ENV === "development",
  authChecker,
});
