import "dotenv/config";
import { Pool } from "pg";
import bcrypt from "bcrypt";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  const emailAdmin = "admin@inventario.com";
  const passwordPlana = "Vivita123#";

  console.log("Iniciando creación del administrador...");

  const hashedPassword = await bcrypt.hash(passwordPlana, 10);

  // Apuntamos a la tabla mapeada "usuarios" y usamos el tipo casteado de rol "rol"
  const query = `
    INSERT INTO "usuarios" (id, nombre, correo, password_hash, rol, esta_activo, creado_en, actualizado_en)
    VALUES (gen_random_uuid(), $1, $2, $3, $4::"rol", true, NOW(), NOW())
    ON CONFLICT (correo) 
    DO UPDATE SET password_hash = EXCLUDED.password_hash
    RETURNING correo;
  `;

  const values = ["Administrador Principal", emailAdmin, hashedPassword, "ADMIN"];
  
  const result = await pool.query(query, values);
  console.log(`¡Administrador listo con el correo: ${result.rows[0].correo}!`);
}

main()
  .catch((e) => {
    console.error("--- ERROR REAL DE POSTGRES ---");
    console.error("Mensaje:", e.message);
    console.error("Detalle:", e.detail);
    console.error("Código:", e.code);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });