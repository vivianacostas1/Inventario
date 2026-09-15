import "dotenv/config";
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // =========================================================
  // ADMINISTRADOR
  // =========================================================

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

  // =========================================================
  // ZONAS Y TARIFAS DE ENTREGA
  // =========================================================

  console.log("Iniciando configuración de tarifas de entrega...");

  const deliveryZones = [
    {
      name: "Centro - Camacho / Obelisco",
      description:
        "Entrega gratuita en el sector de Camacho y Obelisco.",
      price: 0,
      priority: 100,
      zoneType: "POLYGON",
    },
    {
      name: "Centro - Otros lugares",
      description:
        "Entrega dentro del Centro, fuera del sector Camacho / Obelisco.",
      price: 5,
      priority: 90,
      zoneType: "POLYGON",
    },
    {
      name: "Calacoto - Hasta Calle 13",
      description:
        "Entrega en Calacoto hasta Calle 13.",
      price: 7,
      priority: 80,
      zoneType: "POLYGON",
    },
    {
      name: "Otras zonas - Zona Sur",
      description:
        "Entrega en otras zonas de la Zona Sur.",
      price: 15,
      priority: 70,
      zoneType: "POLYGON",
    },
    {
      name: "El Alto - Teleférico Morado",
      description:
        "Entrega en el sector del Teleférico Morado de El Alto.",
      price: 6,
      priority: 60,
      zoneType: "POLYGON",
    },
    {
      name: "Depósito Villa Copacabana",
      description:
        "Punto de entrega en el depósito de Villa Copacabana.",
      price: 0,
      priority: 50,
      zoneType: "PICKUP",
    },
  ];

  for (const zone of deliveryZones) {
    const existingZone = await prisma.deliveryZone.findFirst({
      where: {
        name: zone.name,
      },
    });

    if (existingZone) {
      await prisma.deliveryZone.update({
        where: {
          id: existingZone.id,
        },
        data: {
          description: zone.description,
          price: zone.price,
          isActive: true,
          priority: zone.priority,
          zoneType: zone.zoneType,
        },
      });

      console.log(`Tarifa actualizada: ${zone.name}`);
    } else {
      await prisma.deliveryZone.create({
        data: {
          name: zone.name,
          description: zone.description,
          price: zone.price,
          isActive: true,
          priority: zone.priority,
          zoneType: zone.zoneType,
          coordinates: Prisma.JsonNull,
        },
      });

      console.log(`Tarifa creada: ${zone.name}`);
    }
  }

  console.log("¡Tarifas de entrega configuradas correctamente!");
}

main()
  .catch((e) => {
    console.error("Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });