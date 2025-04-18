"use client";

import { SessionProvider } from "next-auth/react";
import Header from "./Header";
import { ComponentProps } from "react";

type HeaderProps = ComponentProps<typeof Header>;

export default function HeaderWithSession(props: HeaderProps) {
  return (
    <SessionProvider>
      <Header {...props} />
    </SessionProvider>
  );
}