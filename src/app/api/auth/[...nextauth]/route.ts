import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Pool } from "pg";
import { compare } from "bcrypt";

// Log environment variables for debugging
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_NAME:", process.env.DB_NAME);

// Database connection pool
const pool = new Pool({
  connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
});

export const authOptions = {
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };