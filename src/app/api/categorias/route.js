import { Pool } from "pg";
import { NextResponse } from "next/server";

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  ssl: process.env.DB_HOST !== "localhost" ? { rejectUnauthorized: false } : undefined,
});

export async function GET() {
  const client = await pool.connect();
  try {
    const result = await client.query("SELECT id, titulo, descripcion, imagen FROM categorias");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  } finally {
    client.release();
  }
}