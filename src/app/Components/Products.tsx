"use client";

// Importaciones necesarias
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

// Interfaz para definir la estructura de un producto
interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  price: string;
  categoria_id: number;
  imagenes: { id: number; ruta: string }[];
}

// Props del componente
interface ProductsProps {
  categoryId: number | null; // ID de la categoría (puede ser nulo)
  favoriteProducts?: Product[]; // Productos favoritos opcionales
}

// Componente principal para mostrar productos
const Products = ({ categoryId, favoriteProducts }: ProductsProps) => {
  // Obtiene la sesión del usuario
  const { data: session, status } = useSession();
  // Estados para productos, favoritos, carrusel, carga, errores y paginación
  const [products, setProducts] = useState<Product[]>([]);
  const [randomProducts, setRandomProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]); // IDs de productos favoritos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlides, setCurrentSlides] = useState<{ [key: number]: number }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10; // Máximo de productos por página
  // URL del backend desde variables de entorno
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  // Imagen de respaldo para errores
  const fallbackImage = "https://tailwindui.com/plus-assets/img/ecommerce-images/category-page-04-image-card-01.jpg";

  // Efecto para cargar productos y favoritos
  useEffect(() => {
    // Función para cargar productos
    const fetchProducts = async () => {
      try {
        if (!backendUrl) {
          throw new Error("NEXT_PUBLIC_BACKEND_URL no está definido en .env");
        }

        // Si se proporcionan favoriteProducts, usarlos directamente
        if (favoriteProducts && favoriteProducts.length > 0) {
          setProducts(favoriteProducts);
          setRandomProducts(getRandomUniqueProducts(favoriteProducts));
          setLoading(false);
          return;
        }

        // Construir la URL según si hay categoría
        const url = categoryId
          ? `${backendUrl}/api/productos?categoria_id=${categoryId}`
          : `${backendUrl}/api/productos`;

        // Obtener productos del backend
        const response = await axios.get<Product[]>(url, {
          headers: { "Content-Type": "application/json" },
        });

        console.log("Respuesta del backend:", response.data);
        const data = Array.isArray(response.data) ? response.data : [];
        setProducts(data);
        setRandomProducts(getRandomUniqueProducts(data));
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "No se pudieron cargar los productos");
        setLoading(false);
        console.error("Error al cargar productos:", err);
      }
    };

    // Función para cargar favoritos
    const fetchFavorites = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          console.log("Cargando favoritos para userId:", session.user.id);
          const response = await axios.get<Product[]>(`${backendUrl}/api/favoritos?userId=${session.user.id}`);
          setFavorites(response.data.map((product) => product.id));
        } catch (err: any) {
          console.error("Error al cargar favoritos:", err.message);
        }
      }
    };

    fetchProducts();
    fetchFavorites();
  }, [categoryId, status, session, favoriteProducts, backendUrl]);

  // Función para obtener productos aleatorios únicos
  const getRandomUniqueProducts = (allProducts: Product[]): Product[] => {
    if (allProducts.length === 0) return [];

    const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
    return shuffled;
  };

  // Calcular el número total de páginas
  const totalPages = Math.ceil(randomProducts.length / productsPerPage);

  // Obtener los productos para la página actual
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = randomProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Funciones para la navegación de páginas
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Funciones para el carrusel de imágenes
  const prevSlide = (productId: number, totalImages: number) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [productId]: prev[productId] === 0 ? totalImages - 1 : (prev[productId] || 0) - 1,
    }));
  };

  const nextSlide = (productId: number, totalImages: number) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) === totalImages - 1 ? 0 : (prev[productId] || 0) + 1,
    }));
  };

  const goToSlide = (productId: number, index: number) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [productId]: index,
    }));
  };

  // Función para marcar/desmarcar un producto como favorito
  const toggleFavorite = async (productId: number, e: React.MouseEvent) => {
    e.preventDefault(); // Evita que el clic en el botón active el enlace
    if (status !== "authenticated" || !session?.user?.id) {
      console.error("No se puede marcar favorito, estado de sesión:", { status, userId: session?.user?.id });
      alert("Debes iniciar sesión para marcar favoritos");
      return;
    }

    const userId = session.user.id;
    const isFavorite = favorites.includes(productId);
    try {
      console.log(`Intentando ${isFavorite ? "quitar" : "agregar"} favorito: userId=${userId}, productId=${productId}`);
      if (isFavorite) {
        await axios.delete(`${backendUrl}/api/favoritos/${productId}`, {
          data: { userId }, // Enviar userId en el cuerpo
        });
        setFavorites(favorites.filter((id) => id !== productId));
        console.log(`Favorito eliminado: productId=${productId}`);
      } else {
        const response = await axios.post(`${backendUrl}/api/favoritos`, {
          userId,
          productId,
        });
        setFavorites([...favorites, productId]);
        console.log(`Favorito agregado: productId=${productId}`, response.data);
      }
    } catch (err: any) {
      console.error("Error en toggleFavorite:", err.response?.data || err.message);
      alert(`Error al ${isFavorite ? "quitar" : "agregar"} favorito: ${err.message}`);
    }
  };

  // Manejo de estados de carga y error
  if (loading) {
    return (
      <div className="text-center py-16 bg-gradient-to-r from-indigo-50 to-blue-50">
        Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-red-500 bg-gradient-to-r from-indigo-50 to-blue-50">
        {error}
      </div>
    );
  }

  if (!Array.isArray(randomProducts)) {
    return (
      <div className="text-center py-16 text-red-500 bg-gradient-to-r from-indigo-50 to-blue-50">
        Error: Los datos de productos no son un arreglo
      </div>
    );
  }

  // Renderizado del componente
  return (
    // Contenedor con fondo degradado
    <div className="pt-2 bg-gradient-to-r from-indigo-50 to-blue-50">
      {/* Contenedor responsivo */}
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
        {/* Título principal */}
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Productos</h2>
        {/* Cuadrícula de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-10">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => {
              const currentSlide = currentSlides[product.id] || 0;
              const totalImages = product.imagenes?.length || 0;
              const imageUrl =
                product.imagenes && product.imagenes.length > 0 && product.imagenes[currentSlide]?.ruta
                  ? product.imagenes[currentSlide].ruta.startsWith("http")
                    ? product.imagenes[currentSlide].ruta
                    : `${backendUrl}${product.imagenes[currentSlide].ruta}`
                  : fallbackImage;

              return (
                <div key={product.id} className="group relative">
                  <Link href={`/products/${product.id}`} className="block">
                    {/* Contenedor de imagen */}
                    <div className="relative aspect-square w-full rounded-lg bg-gray-200 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={product.descripcion || "Producto sin descripción"}
                        fill
                        className="object-cover group-hover:opacity-75"
                        sizes="(max-width: 640px) 100vw, 50vw"
                        priority
                        onError={(e) => {
                          console.log(`No se pudo cargar la imagen: ${imageUrl}`);
                          e.currentTarget.src = fallbackImage;
                        }}
                      />
                      {/* Controles del carrusel */}
                      {totalImages > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              prevSlide(product.id, totalImages);
                            }}
                            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 focus:outline-none"
                          >
                            ❮
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              nextSlide(product.id, totalImages);
                            }}
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 focus:outline-none"
                          >
                            ❯
                          </button>
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                            {product.imagenes.map((_, index) => (
                              <button
                                key={index}
                                onClick={(e) => {
                                  e.preventDefault();
                                  goToSlide(product.id, index);
                                }}
                                className={`w-2 h-2 rounded-full ${
                                  index === currentSlide ? "bg-indigo-600" : "bg-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    {/* Descripción del producto */}
                    <h3 className="mt-4 text-lg font-semibold text-gray-800">{product.descripcion}</h3>
                    {/* Nombre del producto */}
                    <p className="mt-1 text-xl font-medium text-gray-900">{product.nombre || "Nombre no disponible"}</p>
                  </Link>
                  {/* Botón de favorito */}
                  <button
                    onClick={(e) => toggleFavorite(product.id, e)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    aria-label={favorites.includes(product.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                  >
                    <svg
                      className={`w-6 h-6 ${favorites.includes(product.id) ? "text-red-500" : "text-gray-400"}`}
                      fill={favorites.includes(product.id) ? "currentColor" : "none"}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
              );
            })
          ) : (
            <p className="text-gray-700 col-span-2">No hay productos disponibles en esta página.</p>
          )}
        </div>
        {/* Controles de paginación */}
        {randomProducts.length > 0 && (
          <div className="mt-8 flex items-center justify-center space-x-4">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              Anterior
            </button>
            <span className="text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-medium ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;