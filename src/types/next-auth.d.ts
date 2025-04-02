// src/types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "admin" | "cliente";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    role: "admin" | "cliente";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "admin" | "cliente";
  }
}