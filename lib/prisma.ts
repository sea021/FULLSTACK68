import { PrismaClient } from "@/app/generated/prisma";
const grobalForprisma = global as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    grobalForprisma.prisma ??
    new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["error" , "warn"] : ["error"],
    });

if (process.env.NODE_ENV !== "production") grobalForprisma.prisma = prisma;