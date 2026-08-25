"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
// Cargar variables de entorno 
dotenv_1.default.config();
// Crear pool de conexiones a PostgreSQL 
// Un Pool reutiliza conexiones en lugar de crear una nueva por cada consulta 
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
// Verificar conexión al iniciar la aplicación 
pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error al conectar a PostgreSQL:', err.message);
        return;
    }
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
    release(); // Liberar el cliente de vuelta al pool 
});
// Exportar el pool para usarlo en otras partes de la app 
exports.default = pool;
