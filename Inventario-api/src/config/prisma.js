"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
var client_1 = require("@prisma/client");
var adapter_pg_1 = require("@prisma/adapter-pg");
var adapter = new adapter_pg_1.PrismaPg({
    connectionString: process.env.DATABASE_URL
});
var globalForPrisma = global;
exports.prisma = globalForPrisma.prisma ||
    new client_1.PrismaClient({
        adapter: adapter,
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = exports.prisma;
}
exports.default = exports.prisma;
