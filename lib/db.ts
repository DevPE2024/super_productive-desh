import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma: PrismaClient = (() => {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  return global.prisma;
})();

export const db = prisma;


