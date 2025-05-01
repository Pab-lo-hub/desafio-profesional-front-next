import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import axios from "axios";
import Products from "@/app/Components/Products";
import { authOptions } from "@/app/lib/auth";

// Interfaz para los productos (compatible con Products.tsx)
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

  // Redirigir a login si no está autenticado
  if (!session || !session.user.id) {
    redirect("/login");
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
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mis Favoritos</h1>
        {error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : favoriteProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No tienes productos favoritos.</div>
        ) : (
          <Products favoriteProducts={favoriteProducts} categoryId={null} />
        )}
      </main>
    </div>
  );
}