"use client";

import { SessionProvider } from "next-auth/react";
import Header from "./Header";

export default function HeaderWithSession() {
  return (
    <SessionProvider>
      <Header />
    </SessionProvider>
  );
}