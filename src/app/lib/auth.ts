import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

// Configuración de NextAuth
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son requeridos");
        }

        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
          const response = await axios.post(`${backendUrl}/api/users/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          console.log("Respuesta de login:", response.data);

          const user = response.data;
          if (user && user.id) {
            return {
              id: user.id.toString(),
              email: user.email,
              nombre: user.nombre,
              apellido: user.apellido,
              role: user.role,
            };
          }
          throw new Error("No se encontró ID de usuario en la respuesta");
        } catch (error: any) {
          console.error("Error en authorize:", error);
          throw new Error(error.response?.data?.message || "Error al autenticar");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.nombre = user.nombre;
        token.apellido = user.apellido;
        token.role = user.role;
      }
      // Mapear sub a id si sub existe
      if (token.sub && !token.id) {
        token.id = token.sub;
      }
      console.log("JWT callback:", { token, user });
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
        session.user.email = token.email ?? null;
        session.user.nombre = token.nombre ?? null;
        session.user.apellido = token.apellido ?? null;
        session.user.role = token.role ?? null;
      }
      console.log("Session callback:", { session, token });
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NEXTAUTH_DEBUG === "true",
};

export default NextAuth(authOptions);