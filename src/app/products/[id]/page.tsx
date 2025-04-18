// src/app/products/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogPanel } from "@headlessui/react";
import Header from "../../Components/Header"; // Importa el componente Header
import Footer from "../../Components/Footer"; // Importa el componente Footer
import HeaderWithSession from "@/app/Components/HeaderWithSession";

// Interfaz que define la estructura de una imagen
interface ProductImage {
  id: number; // Identificador único de la imagen
  ruta: string; // Ruta de la imagen en el backend
}

// Interfaz que define la estructura de un producto
interface Product {
  id: number; // Identificador único del producto
  nombre: string; // Nombre del producto
  descripcion: string; // Descripción del producto
  imagenes: ProductImage[]; // Lista de imágenes asociadas
}

// Interfaz para los props del componente, que incluye los parámetros de la ruta
interface ProductPageProps {
  params: Promise<{ id: string }>; // params es un Promise en rutas dinámicas
}

// Componente para la galería de imágenes del producto
function ProductImageGallery({
  imagenes,
  backendUrl,
}: {
  imagenes: ProductImage[]; // Imágenes del producto
  backendUrl: string; // URL base del backend
}) {
  // Estado para controlar si el modal está abierto
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Abre el modal para ver todas las imágenes
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Cierra el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Obtiene las primeras 5 imágenes (o menos si no hay suficientes)
  const displayImages = imagenes.slice(0, 5);
  // Imagen principal (primera imagen o placeholder)
  const mainImage = displayImages[0] || { id: 0, ruta: "/placeholder.png" };
  // Imágenes secundarias para la grilla (siguientes 4)
  const gridImages = displayImages.slice(1, 5);

  return (
    <>
      {/* Contenedor de la galería, ocupa el 100% del ancho */}
      <div className="w-full">
        {/* Layout para desktop: imagen principal a la izquierda, grilla a la derecha */}
        <div className="md:grid md:grid-cols-2 md:gap-4 flex flex-col gap-4">
          {/* Imagen principal (mitad izquierda en desktop, completa en móvil) */}
          <div className="relative h-96">
            <Image
              src={`${backendUrl}${mainImage.ruta}`}
              alt="Imagen principal del producto"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {/* Grilla 2x2 para las imágenes secundarias (mitad derecha en desktop) */}
          <div className="grid grid-cols-2 grid-rows-2 gap-4 relative">
            {gridImages.map((img, index) => (
              <div key={img.id} className="relative h-44">
                <Image
                  src={`${backendUrl}${img.ruta}`}
                  alt={`Imagen secundaria ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}
            {/* Rellena la grilla con placeholders si hay menos de 4 imágenes */}
            {gridImages.length < 4 &&
              Array.from({ length: 4 - gridImages.length }).map((_, index) => (
                <div key={`placeholder-${index}`} className="relative h-44">
                  <Image
                    src="/placeholder.png"
                    alt="Placeholder"
                    fill
                    className="object-cover rounded-lg opacity-50"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
              ))}
            {/* Botón "Ver más" en la esquina inferior derecha */}
            {imagenes.length > 5 && (
              <button
                onClick={openModal}
                className="absolute bottom-2 right-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none"
              >
                Ver más
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal para ver todas las imágenes */}
      <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
        {/* Fondo oscuro del modal */}
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        {/* Contenedor del modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-w-3xl w-full bg-white rounded-lg p-6 max-h-[80vh] overflow-y-auto">
            {/* Título del modal */}
            <h2 className="text-xl font-semibold mb-4">Todas las imágenes</h2>
            {/* Lista de todas las imágenes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {imagenes.map((img) => (
                <div key={img.id} className="relative h-64">
                  <Image
                    src={`${backendUrl}${img.ruta}`}
                    alt={`Imagen ${img.id}`}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ))}
            </div>
            {/* Botón para cerrar el modal */}
            <button
              onClick={closeModal}
              className="mt-4 w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none"
            >
              Cerrar
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

// Componente principal para la página de detalles del producto
export default function ProductDetailPage({ params }: ProductPageProps) {
  // Estado para almacenar el producto obtenido del backend
  const [product, setProduct] = useState<Product | null>(null);
  // Estado para indicar si los datos están cargando
  const [loading, setLoading] = useState(true);
  // Estado para almacenar errores durante la carga
  const [error, setError] = useState<string | null>(null);
  // URL del backend, con un fallback si no está definida en .env
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  // Efecto para cargar los detalles del producto al montar el componente
  useEffect(() => {
    // Función asíncrona para obtener el producto
    const fetchProduct = async () => {
      try {
        // Resuelve el Promise de params para obtener el id
        const resolvedParams = await params;
        const id = resolvedParams.id;

        // Valida que el id sea un número
        if (!/^\d+$/.test(id)) {
          throw new Error("El ID del producto debe ser un número");
        }

        // Realiza la solicitud GET al endpoint del producto
        const response = await axios.get<Product>(`${backendUrl}/api/productos/${id}`, {
          headers: { "Content-Type": "application/json" },
        });

        // Almacena el producto en el estado
        setProduct(response.data);
        // Finaliza la carga
        setLoading(false);
      } catch (err: any) {
        // Almacena el mensaje de error
        setError(err.message || "No se pudo cargar el producto");
        // Finaliza la carga
        setLoading(false);
        // Loguea el error para depuración
        console.error("Error fetching product:", err);
      }
    };

    // Ejecuta la función de carga
    fetchProduct();
  }, [params]); // Dependencia en params para manejar cambios en la ruta

  // Muestra un indicador de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Componente Header compartido */}
        <HeaderWithSession className="z-50" />
        {/* Contenedor principal con espacio para evitar solapamiento */}
        <main className="flex-grow pt-36">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 text-center">
            Cargando...
          </div>
        </main>
        {/* Componente Footer compartido */}
        <Footer />
      </div>
    );
  }

  // Muestra un mensaje de error si falla la carga o no hay producto
  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        {/* Componente Header compartido */}
        <HeaderWithSession className="z-50" />
        {/* Contenedor principal con espacio para evitar solapamiento */}
        <main className="flex-grow pt-36">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 text-center text-red-500">
            {error || "Producto no encontrado"}
          </div>
        </main>
        {/* Componente Footer compartido */}
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Componente Header compartido, con z-index para asegurar visibilidad */}
      <HeaderWithSession className="z-50" />
      {/* Contenedor principal con espacio para evitar solapamiento con el header */}
      <main className="flex-grow pt-36">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              {/* Encabezado con título y botón de retroceso */}
              <div className="flex justify-between items-center mb-6">
                {/* Título del producto alineado a la izquierda */}
                <h1 className="text-3xl font-bold text-gray-900 text-left">{product.nombre}</h1>
                {/* Botón para volver atrás */}
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-900 flex items-center"
                >
                  <ArrowLeftIcon className="h-6 w-6 mr-2" />
                  Volver
                </Link>
              </div>
              {/* Cuerpo con descripción y galería */}
              <div>
                {/* Descripción del producto */}
                <p className="text-gray-700 mb-6">{product.descripcion}</p>
                {/* Galería de imágenes del producto */}
                <ProductImageGallery imagenes={product.imagenes} backendUrl={backendUrl} />
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Componente Footer compartido */}
      <Footer />
    </div>
  );
}