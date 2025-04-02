// src/app/lib/auth.ts
import CredentialsProvider from "next-auth/providers/credentials";
import { Pool } from "pg";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  ssl: process.env.DB_HOST !== "localhost" ? { rejectUnauthorized: false } : undefined,
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
        console.log("Credentials received:", credentials);

        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        const client = await pool.connect();
        console.log("Database connection established");

        try {
          const result = await client.query("SELECT * FROM users WHERE email = $1", [
            credentials.email,
          ]);
          const user = result.rows[0];
          if (!user) {
            console.log("No user found for email:", credentials.email);
            return null;
          }

          console.log("User from DB:", user);

          if (typeof user.password !== "string") {
            console.error("Database password is not a string:", user.password);
            return null;
          }

          const passwordMatch = await compare(credentials.password, user.password);
          if (!passwordMatch) {
            console.log("Password mismatch for:", credentials.email);
            return null;
          }

          return {
            id: user.id.toString(),
            email: user.email,
            role: user.role || "cliente",
          };
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
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      console.log("JWT Token:", token);
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as "admin" | "cliente";
      }
      console.log("Session:", session);
      return session;
    },
  },
};