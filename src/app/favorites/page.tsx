// Importaciones de dependencias y componentes
import { getServerSession } from "next-auth"; // Función para obtener la sesión en el servidor
import { redirect } from "next/navigation"; // Función para redirecciones en el servidor
import axios from "axios"; // Cliente HTTP para solicitudes al backend
import HeaderWithSession from "@/app/Components/HeaderWithSession"; // Componente de encabezado con soporte para sesión
import Footer from "@/app/Components/Footer"; // Componente de pie de página
import Products from "@/app/Components/Products"; // Componente para mostrar productos
import { authOptions } from "@/app/lib/auth"; // Opciones de autenticación de NextAuth

// Interfaz para los productos (compatible con Products.tsx)
interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  price: string;
  categoria_id: number;
  imagenes: { id: number; ruta: string }[];
}

// Componente principal para la página de favoritos
export default async function FavoritesPage() {
  // Obtiene la sesión del usuario en el servidor
  const session = await getServerSession(authOptions);

  // Redirige a login si no está autenticado
  if (!session || !session.user.id) {
    redirect("/login?callbackUrl=/favorites");
  }

  // Inicializa la lista de productos favoritos
  let favoriteProducts: Product[] = [];
  // Inicializa el estado de error
  let error: string | null = null;

  try {
    // URL del backend desde variables de entorno
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
    // Realiza la solicitud al backend para obtener los favoritos
    const response = await axios.get<Product[]>(`${backendUrl}/api/favoritos?userId=${session.user.id}`, {
      headers: { "Content-Type": "application/json" },
    });
    // Asegura que la respuesta sea un arreglo
    favoriteProducts = Array.isArray(response.data) ? response.data : [];
  } catch (err: any) {
    // Maneja errores de la solicitud
    console.error("Error al cargar favoritos:", err);
    error = "No se pudieron cargar los favoritos. Intenta de nuevo más tarde.";
  }

  // Renderiza la página
  return (
    // Contenedor principal con diseño de columna flexible para altura completa
    <div className="flex flex-col min-h-screen">
      {/* Encabezado con soporte para sesión */}
      <HeaderWithSession className="z-50" />
      {/* Contenido principal con padding superior para el encabezado */}
      <main className="flex-grow pt-36">
        {/* Contenedor responsivo para el contenido */}
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
          {/* Tarjeta con sombra para el contenido */}
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              {/* Título de la página */}
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Favoritos</h1>
              {/* Muestra un mensaje de error si ocurrió un error */}
              {error ? (
                <div className="text-center py-16 text-red-500">{error}</div>
              ) : // Muestra un mensaje si no hay favoritos
              favoriteProducts.length === 0 ? (
                <div className="text-center py-16 text-gray-500">No tienes productos favoritos.</div>
              ) : (
                // Renderiza el componente Products con los favoritos
                <Products favoriteProducts={favoriteProducts} categoryId={null} />
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Pie de página */}
      <Footer />
    </div>
  );
}