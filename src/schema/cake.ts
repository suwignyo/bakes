import {
  ObjectType,
  InputType,
  Field,
  ID,
  Float,
  Int,
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  Authorized,
} from "type-graphql";
import { Min, Max } from "class-validator";
import { getBoundsOfDistance } from "geolib";
import { Context, AuthorizedContext } from "./context";

@InputType()
class CoordinatesInput {
  @Min(-90)
  @Max(90)
  @Field((_type) => Float)
  latitude!: number;

  @Min(-180)
  @Max(180)
  @Field((_type) => Float)
  longitude!: number;
}

@InputType()
class BoundsInput {
  @Field((_type) => CoordinatesInput)
  sw!: CoordinatesInput;

  @Field((_type) => CoordinatesInput)
  ne!: CoordinatesInput;
}

@InputType()
class CakeInput {
  @Field((_type) => String)
  address!: string;

  @Field((_type) => String)
  image!: string;

  @Field((_type) => CoordinatesInput)
  coordinates!: CoordinatesInput;

  @Field((_type) => Int)
  bedrooms!: number;
}

@ObjectType()
class Cake {
  @Field((_type) => ID)
  id!: number;

  @Field((_type) => String)
  userId!: string;

  @Field((_type) => Float)
  latitude!: number;

  @Field((_type) => Float)
  longitude!: number;

  @Field((_type) => String)
  address!: string;

  @Field((_type) => String)
  image!: string;

  @Field((_type) => String)
  publicId(): string {
    const parts = this.image.split("/");
    return parts[parts.length - 1];
  }

  @Field((_type) => Int)
  bedrooms!: number;

  @Field((_type) => [Cake])
  async nearby(@Ctx() ctx: Context) {
    const bounds = getBoundsOfDistance(
      {
        latitude: this.latitude,
        longitude: this.longitude,
      },
      10000
    );
    return ctx.prisma.cake.findMany({
      where: {
        latitude: { gte: bounds[0].latitude, lte: bounds[1].latitude },
        longitude: { gte: bounds[0].longitude, lte: bounds[1].longitude },
        id: { not: { equals: this.id } },
      },
      take: 25,
    });
  }

  //create tags later for similar cakes
}

@Resolver()
export class CakeResolver {
  @Query((_returns) => Cake, { nullable: true })
  async cake(@Arg("id") id: string, @Ctx() ctx: Context) {
    return ctx.prisma.cake.findOne({ where: { id: parseInt(id, 10) } });
  }

  @Query((_returns) => [Cake], { nullable: false })
  async cakes(@Arg("bounds") bounds: BoundsInput, @Ctx() ctx: Context) {
    return ctx.prisma.cake.findMany({
      where: {
        latitude: { gte: bounds.sw.latitude, lte: bounds.ne.latitude },
        longitude: { gte: bounds.sw.longitude, lte: bounds.ne.longitude },
      },
      take: 50,
    });
  }

  @Authorized()
  @Mutation((_returns) => Cake, { nullable: true })
  async createCake(
    @Arg("input") input: CakeInput,
    @Ctx() ctx: AuthorizedContext
  ) {
    return await ctx.prisma.cake.create({
      data: {
        userId: ctx.uid,
        image: input.image,
        address: input.address,
        latitude: input.coordinates.latitude,
        longitude: input.coordinates.longitude,
        bedrooms: input.bedrooms,
      },
    });
  }

  @Authorized()
  @Mutation((_returns) => Cake, { nullable: true })
  async updateCake(
    @Arg("id") id: string,
    @Arg("input") input: CakeInput,
    @Ctx() ctx: AuthorizedContext
  ) {
    const cakeId = parseInt(id, 10);
    const cake = await ctx.prisma.cake.findOne({ where: { id: cakeId } });

    if (!cake || cake.userId !== ctx.uid) return null;

    return await ctx.prisma.cake.update({
      where: { id: cakeId },
      data: {
        image: input.image,
        address: input.address,
        latitude: input.coordinates.latitude,
        longitude: input.coordinates.longitude,
        bedrooms: input.bedrooms,
      },
    });
  }
}
