"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const bcrypt_1 = __importDefault(require("bcrypt"));
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: process.env.DATABASE_URL
});
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const emailAdmin = "admin@inventario.com";
    const passwordPlana = "Vivita123#";
    console.log("Iniciando creación del administrador...");
    const hashedPassword = await bcrypt_1.default.hash(passwordPlana, 10);
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
