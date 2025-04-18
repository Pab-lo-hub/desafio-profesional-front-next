import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { Pool } from "pg";

// Configure the connection to your local PostgreSQL database
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  ssl: process.env.DB_HOST !== "localhost" ? { rejectUnauthorized: false } : undefined,
});

export async function POST(request: Request) {
  try {
    const { nombre, apellido, email, password } = await request.json();

    // Validación básica
    if (!nombre || !apellido || !email || !password) {
      return NextResponse.json(
        { error: "Nombre, apellido, email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      // Verificar si el email ya existe
      const emailCheck = await client.query("SELECT id FROM users WHERE email = $1", [email]);
      if (emailCheck.rows.length > 0) {
        return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 });
      }

      // Hashear la contraseña
      const hashedPassword = await hash(password, 10);

      // Insertar el nuevo usuario
      const result = await client.query(
        "INSERT INTO users (nombre, apellido, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, nombre, apellido, role",
        [nombre, apellido, email, hashedPassword, "cliente"]
      );

      const newUser = result.rows[0];
      console.log("Usuario registrado:", newUser);

      return NextResponse.json({ message: "Registro exitoso", user: newUser }, { status: 201 });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("Error en registro:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Optional: Clean up the pool when the server shuts down
process.on("SIGTERM", async () => {
  await pool.end();
  console.log("Database connection pool closed");
});