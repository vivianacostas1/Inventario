"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const config_1 = require("prisma/config");
exports.default = (0, config_1.defineConfig)({
    schema: "prisma/schema.prisma",
    migrations: {
        path: "prisma/migrations",
        seed: "npx tsx src/seed.ts", // O la ruta donde tengas tu archivo seed
    },
    datasource: {
        url: (0, config_1.env)("DATABASE_URL"),
    },
});
