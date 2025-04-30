"use client";

// Importaciones necesarias
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Header from "@/app/Components/Header";
import Footer from "@/app/Components/Footer";
import Products from "@/app/Components/Products";

// Interfaz para la estructura de un producto
interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  price: string;
  categoria_id: number;
  imagenes: { id: number; ruta: string }[];
}

export default function FavoritesPage() {
  // Estados para favoritos, carga y errores
  const { data: session, status } = useSession();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  // Efecto para cargar los favoritos del usuario
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const fetchFavorites = async () => {
        try {
          const response = await axios.get<Product[]>(`${backendUrl}/api/favoritos?userId=${session.user.id}`);
          setFavoriteProducts(response.data);
          setLoading(false);
        } catch (err: any) {
          setError(err.message || "No se pudieron cargar los favoritos");
          setLoading(false);
          console.error("Error al cargar favoritos:", err);
        }
      };
      fetchFavorites();
    } else {
      setLoading(false);
      setError("Debes iniciar sesión para ver tus favoritos");
    }
  }, [status, session]);

  // Renderizado para estado de carga
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header className="z-50" />
        <main className="flex-grow pt-36">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 text-center">
            Cargando...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Renderizado para estado de error o usuario no autenticado
  if (error || !session) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header className="z-50" />
        <main className="flex-grow pt-36">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 text-center text-red-500">
            {error || "Por favor, inicia sesión"}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Renderizado principal
  return (
    <div className="flex flex-col min-h-screen">
      <Header className="z-50" />
      <main className="flex-grow pt-36">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Tus Favoritos</h1>
          {favoriteProducts.length > 0 ? (
            <Products categoryId={null} />
          ) : (
            <p className="text-gray-700">No tienes productos favoritos.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}