import CredentialsProvider from "next-auth/providers/credentials";
import { Pool } from "pg";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        const client = await pool.connect();
        try {
          const result = await client.query(
            "SELECT * FROM users WHERE email = $1",
            [credentials.email]
          );
          const user = result.rows[0];

          if (!user) {
            console.log("No user found with email:", credentials.email);
            return null;
          }

          const passwordMatch = await compare(credentials.password, user.password);
          if (!passwordMatch) {
            console.log("Password mismatch for email:", credentials.email);
            return null;
          }

          return { id: user.id.toString(), email: user.email };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        } finally {
          client.release();
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};