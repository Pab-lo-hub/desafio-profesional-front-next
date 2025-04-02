// src/app/admin/LogoutButton.tsx
"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
    >
      Cerrar Sesión
    </button>
  );
}