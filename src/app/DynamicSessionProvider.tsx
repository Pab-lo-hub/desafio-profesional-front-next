"use client";

// Importa dynamic de Next.js y SessionProvider de next-auth
import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";

// Define la interfaz para los props del componente
interface DynamicSessionProviderProps {
  children: React.ReactNode;
}

// Crea el componente dinámico con tipos explícitos
const DynamicSessionProvider = dynamic(
  () =>
    Promise.resolve(({ children }: DynamicSessionProviderProps) => (
      <SessionProvider>{children}</SessionProvider>
    )),
  { ssr: false } // Desactiva el renderizado en el servidor
);

export default DynamicSessionProvider;