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
});

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    console.log({ email, password });

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Insert into the database using parameterized query to prevent SQL injection
    const queryText = "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *";
    const values = [email, hashedPassword];
    
    const client = await pool.connect();
    try {
      const response = await client.query(queryText, values);
      console.log("User created:", response.rows[0]);
    } finally {
      client.release(); // Release the client back to the pool
    }

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Failed to register user", details: error.message },
      { status: 500 }
    );
  }
}

// Optional: Clean up the pool when the server shuts down
process.on("SIGTERM", async () => {
  await pool.end();
  console.log("Database connection pool closed");
});