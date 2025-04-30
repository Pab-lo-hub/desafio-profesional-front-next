// Importa fuentes y el proveedor dinámico de sesión
import { Geist, Geist_Mono } from "next/font/google";
import DynamicSessionProvider from "./DynamicSessionProvider";
import "./globals.css";

// Configura las fuentes Geist
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadatos para SEO
export const metadata = {
  title: "Travel Nest",
  description: "A booking site for DH",
};

// Componente de layout raíz
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <DynamicSessionProvider>{children}</DynamicSessionProvider>
      </body>
    </html>
  );
}