import { Session, User, JWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      nombre?: string | null;
      apellido?: string | null;
      role?: string | null;
    };
  }

  interface User {
    id: string;
    email?: string | null;
    nombre?: string | null;
    apellido?: string | null;
    role?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    sub?: string;
    email?: string | null;
    nombre?: string | null;
    apellido?: string | null;
    role?: string | null;
  }
}