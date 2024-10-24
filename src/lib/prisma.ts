import { PrismaClient } from "@prisma/client";

type ConnectionObject = { isConnected: boolean };
const connection: ConnectionObject = { isConnected: false };

let prisma: PrismaClient | undefined;

export async function dbconnect(): Promise<PrismaClient> {
  if (connection.isConnected && prisma) {
    return prisma;
  }

  try {
    prisma = new PrismaClient();
    connection.isConnected = true;
    return prisma;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}
