import { prisma } from "./src/lib/prisma";

async function test() {
  try {
    console.log("Testing Prisma connection...");
    const userCount = await prisma.user.count();
    console.log("User count:", userCount);
  } catch (error) {
    console.error("Connection test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
