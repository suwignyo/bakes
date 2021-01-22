import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  // log: process.env.NODE_ENV === ["query", "info", "warn"] : [],
  log: ["query", "info", "warn"],
});

export { prisma, PrismaClient };
