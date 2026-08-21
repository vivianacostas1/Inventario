import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({ 
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const emailAdmin = "admin@inventario.com";
  const passwordPlana = "Vivita123#";

  console.log("Iniciando creación del administrador...");

  const hashedPassword = await bcrypt.hash(passwordPlana, 10);

  const admin = await prisma.user.upsert({
    where: { email: emailAdmin },
    update: {
      passwordHash: hashedPassword,
    },
    create: {
      name: "Administrador Principal",
      email: emailAdmin,
      passwordHash: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`¡Administrador listo con el correo: ${admin.email}!`);
}

main()
  .catch((e) => {
    console.error("Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });