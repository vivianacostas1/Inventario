import prisma from "./src/config/prisma";

async function test() {
  try {
    const products = await prisma.product.findMany({ take: 5 });
    console.log("PRODUCTOS ENCONTRADOS:");
    console.log(products);
  } catch (error) {
    console.error("ERROR:");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

test();
