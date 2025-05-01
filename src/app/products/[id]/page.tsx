"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogPanel } from "@headlessui/react";
import { FaWifi, FaTv, FaCar, FaSwimmingPool, FaPaw, FaSnowflake, FaWhatsapp, FaTwitter, FaTelegramPlane, FaFacebook, FaStar } from "react-icons/fa";
import { IconType } from "react-icons";
import HeaderWithSession from "@/app/Components/HeaderWithSession";
import Footer from "@/app/Components/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Interfaz para una característica
interface Feature {
  id: number;
  nombre: string;
  icono: string;
}

// Interfaz para una imagen
interface ProductImage {
  id: number;
  ruta: string;
}

// Interfaz para disponibilidad
interface Availability {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
}

// Interfaz para una política
interface Politica {
  id: number;
  titulo: string;
  descripcion: string;
}

// Interfaz para una puntuación
interface Puntuacion {
  id: number;
  productoId: number;
  usuarioId: number;
  estrellas: number;
}

// Interfaz para un producto
interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  imagenes: ProductImage[];
  features: Feature[];
}

// Interfaz para los props del componente
interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Lista de iconos disponibles para características
const availableIcons: { name: string; icon: IconType }[] = [
  { name: "FaWifi", icon: FaWifi },
  { name: "FaTv", icon: FaTv },
  { name: "FaCar", icon: FaCar },
  { name: "FaSwimmingPool", icon: FaSwimmingPool },
  { name: "FaPaw", icon: FaPaw },
  { name: "FaSnowflake", icon: FaSnowflake },
];

// Componente para la galería de imágenes del producto
function ProductImageGallery({
  imagenes,
  backendUrl,
}: {
  imagenes: ProductImage[];
  backendUrl: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const displayImages = imagenes.slice(0, 5);
  const mainImage = displayImages[0] || { id: 0, ruta: "/placeholder.png" };
  const gridImages = displayImages.slice(1, 5);

  return (
    <>
      <div className="w-full">
        <div className="md:grid md:grid-cols-2 md:gap-4 flex flex-col gap-4">
          <div className="relative h-96">
            <Image
              src={`${backendUrl}${mainImage.ruta}`}
              alt="Imagen principal del producto"
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
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

      <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-w-3xl w-full bg-white rounded-lg p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Todas las imágenes</h2>
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

// Componente para el bloque de características
function ProductFeatures({ features }: { features: Feature[] }) {
  const renderIcon = (icono: string) => {
    const iconObj = availableIcons.find((i) => i.name === icono);
    if (!iconObj) return <span className="text-gray-700">Icono no encontrado</span>;
    const IconComponent = iconObj.icon;
    return <IconComponent className="text-indigo-600 h-6 w-6" />;
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Características</h2>
      {features.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature) => (
            <li
              key={feature.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              {renderIcon(feature.icono)}
              <span className="text-gray-700">{feature.nombre}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">No hay características disponibles</p>
      )}
    </div>
  );
}

// Componente para disponibilidad
function ProductAvailability({ productId, backendUrl }: { productId: number; backendUrl: string }) {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.get<Availability[]>(`${backendUrl}/api/productos/${productId}/availability`);
        setAvailabilities(response.data);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };
    fetchAvailability();
  }, [productId, backendUrl]);

  const includeDates = availabilities
    .filter((a) => a.estado === "DISPONIBLE")
    .map((a) => ({
      start: new Date(a.fechaInicio),
      end: new Date(a.fechaFin),
    }));

  interface CustomInputProps {
    value?: string;
    onClick?: () => void;
    placeholder?: string;
  }

  const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
    ({ value = "", onClick = () => {}, placeholder = "" }, ref) => (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
          </svg>
        </div>
        <input
          value={value}
          onClick={onClick}
          ref={ref}
          readOnly
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-40 pl-10 p-3 shadow-sm hover:shadow-md transition-shadow"
          placeholder={placeholder}
        />
      </div>
    )
  );

  CustomInput.displayName = "CustomInput";

  const handleReserve = () => {
    if (startDate && endDate) {
      console.log("Reserving:", { productId, startDate, endDate });
      // Navigate to reservation page or open modal
    } else {
      alert("Por favor, selecciona un rango de fechas");
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disponibilidad</h2>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <div className="flex gap-3">
          <DatePicker
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            includeDateIntervals={includeDates}
            customInput={<CustomInput />}
            placeholderText="Fecha Inicio"
            isClearable
          />
          <DatePicker
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate ?? undefined}
            includeDateIntervals={includeDates}
            customInput={<CustomInput />}
            placeholderText="Fecha Fin"
            isClearable
          />
        </div>
        <button
          onClick={handleReserve}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-colors"
        >
          Reservar
        </button>
      </div>
    </div>
  );
}

// Componente para políticas
function ProductPolicies({ politicas }: { politicas: Politica[] }) {
  return (
    <div className="mt-8 w-full">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Políticas</h2>
      {politicas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {politicas.map((politica) => (
            <div key={politica.id} className="border p-4 rounded-lg bg-gray-50">
              <h3 className="font-semibold text-gray-900">{politica.titulo}</h3>
              <p className="text-gray-700">{politica.descripcion}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700">No hay políticas disponibles para este producto.</p>
      )}
    </div>
  );
}

// Componente para puntuaciones
function ProductRatings({ productId, usuarioId, backendUrl }: { productId: number; usuarioId: number | null; backendUrl: string }) {
  const [puntuaciones, setPuntuaciones] = useState<Puntuacion[]>([]);
  const [canRate, setCanRate] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    const fetchPuntuaciones = async () => {
      try {
        const response = await axios.get<Puntuacion[]>(`${backendUrl}/api/productos/${productId}/puntuaciones`);
        setPuntuaciones(response.data);
      } catch (error) {
        console.error("Error fetching puntuaciones:", error);
      }
    };

    const checkCanRate = async () => {
      if (usuarioId) {
        try {
          const response = await axios.get<boolean>(`${backendUrl}/api/productos/${productId}/can-rate?usuarioId=${usuarioId}`);
          setCanRate(response.data);
          const userPuntuacion = puntuaciones.find(p => p.usuarioId === usuarioId);
          if (userPuntuacion) {
            setUserRating(userPuntuacion.estrellas);
          }
        } catch (error) {
          console.error("Error checking can rate:", error);
        }
      }
    };

    fetchPuntuaciones();
    checkCanRate();
  }, [productId, usuarioId, backendUrl]);

  const handleRating = async (estrellas: number) => {
    if (!usuarioId) {
      alert("Debes iniciar sesión para puntuar");
      return;
    }
    if (!canRate) {
      alert("No puedes puntuar este producto porque no tienes una reserva finalizada");
      return;
    }
    try {
      const response = await axios.post<Puntuacion>(`${backendUrl}/api/productos/${productId}/puntuaciones`, {
        productId,
        usuarioId,
        estrellas,
      });
      setPuntuaciones([...puntuaciones, response.data]);
      setUserRating(estrellas);
      setCanRate(false);
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Error al enviar la puntuación");
    }
  };

  const averageRating = puntuaciones.length > 0
    ? (puntuaciones.reduce((sum, p) => sum + p.estrellas, 0) / puntuaciones.length).toFixed(1)
    : "0.0";

  return (
    <div className="mt-8 w-full">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Valoraciones</h2>
      <div className="mb-4">
        <p className="text-gray-700">Promedio: {averageRating} / 5 ({puntuaciones.length} valoraciones)</p>
      </div>
      {usuarioId && (
        <div className="mb-4">
          <p className="text-gray-700 mb-2">Tu puntuación:</p>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`h-6 w-6 cursor-pointer ${
                  (hoverRating ?? userRating ?? 0) >= star ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
              />
            ))}
          </div>
        </div>
      )}
      {puntuaciones.length > 0 ? (
        <div className="space-y-2">
          {puntuaciones.map((puntuacion) => (
            <div key={puntuacion.id} className="flex items-center">
              <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`h-5 w-5 ${puntuacion.estrellas >= star ? "text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-gray-700">{puntuacion.estrellas} estrellas</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700">No hay valoraciones para este producto.</p>
      )}
    </div>
  );
}

// Componente para compartir
function ShareProduct({
  isOpen,
  onClose,
  productName,
  productId,
}: {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productId: string;
}) {
  const shareText = `Mira este increíble producto: ${productName}`;
  const shareUrl = `http://localhost:3000/products/${productId}`;

  const shareOptions = [
    { name: "WhatsApp", icon: FaWhatsapp, url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shareUrl)}` },
    { name: "X", icon: FaTwitter, url: `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` },
    { name: "Telegram", icon: FaTelegramPlane, url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}` },
    { name: "Facebook", icon: FaFacebook, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="max-w-sm w-full bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Compartir Producto</h2>
          <div className="space-y-2">
            {shareOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <a
                  key={option.name}
                  href={option.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-2 hover:bg-gray-100 rounded"
                >
                  <IconComponent className="h-6 w-6 text-gray-700 mr-2" />
                  <span className="text-gray-700">{option.name}</span>
                </a>
              );
            })}
          </div>
          <button
            onClick={onClose}
            className="mt-4 w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Cerrar
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

// Componente principal
export default function ProductDetailPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [politicas, setPoliticas] = useState<Politica[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [usuarioId, setUsuarioId] = useState<number | null>(null); // Simulación, ajustar según autenticación
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params;
        const id = resolvedParams.id;

        if (!/^\d+$/.test(id)) {
          throw new Error("El ID del producto debe ser un número");
        }

        console.log("Fetching product ID:", id);
        const productResponse = await axios.get<Product>(`${backendUrl}/api/productos/${id}`, {
          headers: { "Content-Type": "application/json" },
        });
        console.log("Product fetched:", productResponse.data);
        setProduct(productResponse.data);

        console.log("Fetching politicas for ID:", id);
        const politicasResponse = await axios.get<Politica[]>(`${backendUrl}/api/productos/${id}/politicas`);
        console.log("Politicas fetched:", politicasResponse.data);
        setPoliticas(politicasResponse.data);

        // Simulación: Obtener usuarioId desde la sesión (ajustar según tu sistema de autenticación)
        setUsuarioId(1); // Reemplazar con lógica real, ej: obtener desde JWT o contexto de autenticación

        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching data:", err.response?.data, err.response?.status);
        setError(err.response?.data?.message || "No se pudo cargar el producto");
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <HeaderWithSession className="z-50" />
        <main className="flex-grow pt-36">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 text-center">
            Cargando...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <HeaderWithSession className="z-50" />
        <main className="flex-grow pt-36">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8 text-center text-red-500">
            {error || "Producto no encontrado"}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWithSession className="z-50" />
      <main className="flex-grow pt-36">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 text-left">{product.nombre}</h1>
                <div className="flex items-center space-x-4">
                  <Link
                    href="/"
                    className="text-gray-600 hover:text-gray-900 flex items-center"
                  >
                    <ArrowLeftIcon className="h-6 w-6 mr-2" />
                    Volver
                  </Link>
                  <button
                    onClick={() => setIsShareOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    Compartir
                  </button>
                </div>
              </div>
              <div>
                <p className="text-gray-700 mb-6">{product.descripcion}</p>
                <ProductImageGallery imagenes={product.imagenes} backendUrl={backendUrl} />
                <ProductFeatures features={product.features || []} />
                <ProductAvailability productId={product.id} backendUrl={backendUrl} />
                <ProductPolicies politicas={politicas} />
                <ProductRatings productId={product.id} usuarioId={usuarioId} backendUrl={backendUrl} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <ShareProduct
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        productName={product.nombre}
        productId={product.id.toString()}
      />
    </div>
  );
}