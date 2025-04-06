// src/middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => token?.role === "admin",
  },
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/admin/:path*"], // Protege todas las rutas bajo /admin
};