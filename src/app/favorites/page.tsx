"use client";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import axios from "axios";
import HeaderWithSession from "@/app/Components/HeaderWithSession";
import Footer from "@/app/Components/Footer";
import Products from "@/app/Components/Products";
import { authOptions } from "@/app/lib/auth";

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  price: string;
  categoria_id: number;
  imagenes: { id: number; ruta: string }[];
}

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.id) {
    redirect("/login?callbackUrl=/favorites");
  }

  let favoriteProducts: Product[] = [];
  let error: string | null = null;

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    const response = await axios.get<Product[]>(`${backendUrl}/api/favoritos?userId=${session.user.id}`, {
      headers: { "Content-Type": "application/json" },
    });
    favoriteProducts = Array.isArray(response.data) ? response.data : [];
  } catch (err: any) {
    console.error("Error al cargar favoritos:", err);
    error = "No se pudieron cargar los favoritos. Intenta de nuevo más tarde.";
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWithSession className="z-50" />
      <main className="flex-grow pt-36">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Favoritos</h1>
              {error ? (
                <div className="text-center py-16 text-red-500">{error}</div>
              ) : favoriteProducts.length === 0 ? (
                <div className="text-center py-16 text-gray-500">No tienes productos favoritos.</div>
              ) : (
                <Products favoriteProducts={favoriteProducts} categoryIds={null} />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}