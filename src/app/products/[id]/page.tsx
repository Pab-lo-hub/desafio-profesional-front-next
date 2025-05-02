"use client";

// Importaciones de dependencias y componentes
import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogPanel } from "@headlessui/react";
import {
  FaWifi,
  FaTv,
  FaCar,
  FaSwimmingPool,
  FaPaw,
  FaSnowflake,
  FaWhatsapp,
  FaTwitter,
  FaTelegramPlane,
  FaFacebook,
  FaStar,
  FaArrowLeft,
  FaArrowRight,
  FaBluetooth,
  FaBatteryFull,
  FaQuestion,
  FaParking,
} from "react-icons/fa";
import { TbAirConditioning } from "react-icons/tb";
import { IconType } from "react-icons";
import HeaderWithSession from "@/app/Components/HeaderWithSession";
import Footer from "@/app/Components/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import WhatsAppButton from "@/app/Components/WhatsAppButton";

// Definición de interfaces para tipado de datos
interface Feature {
  id: number;
  nombre: string;
  icono: string;
}

interface ProductImage {
  id: number;
  ruta: string;
}

interface Availability {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
}

interface Reservation {
  id: number;
  startDate: string | null;
  endDate: string | null;
}

interface Politica {
  id: number;
  titulo: string;
  descripcion: string;
}

interface Puntuacion {
  id: number;
  productoId: number;
  usuarioId: number;
  estrellas: number;
}

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  imagenes: ProductImage[];
  features: Feature[];
}

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Lista de íconos disponibles para las características
const availableIcons: { name: string; icon: IconType }[] = [
  { name: "FaWifi", icon: FaWifi },
  { name: "FaTv", icon: FaTv },
  { name: "FaCar", icon: FaCar },
  { name: "FaSwimmingPool", icon: FaSwimmingPool },
  { name: "FaPaw", icon: FaPaw },
  { name: "FaSnowflake", icon: FaSnowflake },
  { name: "FaBluetooth", icon: FaBluetooth },
  { name: "FaBatteryFull", icon: FaBatteryFull },
  { name: "FaParking", icon: FaParking },
  { name: "TbAirConditioning", icon: TbAirConditioning },
];

// Componente para mostrar la galería de imágenes del producto
function ProductImageGallery({
  imagenes,
  backendUrl,
}: {
  imagenes: ProductImage[];
  backendUrl: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openModal = () => {
    setCurrentImageIndex(0);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };

  const displayImages = imagenes.slice(0, 5);
  const mainImage = displayImages[0] || null;
  const gridImages = displayImages.slice(1, 5);

  const gridConfig = gridImages.length > 0 ? (
    gridImages.length === 1 ? "grid-cols-1 grid-rows-1" :
    gridImages.length === 2 ? "grid-cols-1 sm:grid-cols-2 grid-rows-2 sm:grid-rows-1" :
    gridImages.length === 3 ? "grid-cols-2 grid-rows-2" :
    "grid-cols-2 grid-rows-2"
  ) : "";

  return (
    <>
      <div className="w-full mt-6">
        {displayImages.length === 0 ? (
          <p className="text-gray-500 text-center">No hay imágenes disponibles</p>
        ) : (
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative h-96">
                {mainImage ? (
                  <Image
                    src={`${backendUrl}${mainImage.ruta}`}
                    alt="Imagen principal"
                    fill
                    className="object-cover rounded-lg shadow-sm"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    onError={() => console.error(`Error cargando imagen: ${mainImage.ruta}`)}
                  />
                ) : (
                  <div className="h-full rounded-lg flex items-center justify-center bg-gray-100">
                    <p className="text-gray-500">Sin imagen principal</p>
                  </div>
                )}
              </div>
              {gridImages.length > 0 && (
                <div className={`grid ${gridConfig} gap-4`}>
                  {gridImages.map((img, index) => (
                    <div key={img.id} className="relative h-44">
                      <Image
                        src={`${backendUrl}${img.ruta}`}
                        alt={`Imagen secundaria ${index + 1}`}
                        fill
                        className="object-cover rounded-lg shadow-sm"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        onError={() => console.error(`Error cargando imagen: ${img.ruta}`)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="absolute bottom-4 right-4">
              <button
                onClick={openModal}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Ver más
              </button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="max-w-5xl w-full bg-white rounded-lg p-6 max-h-[90vh] flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Vista de Imagen</h2>
            {imagenes.length > 0 ? (
              <div className="relative flex-grow flex items-center justify-center">
                <div className="relative w-full h-[60vh] max-h-[600px]">
                  <Image
                    src={`${backendUrl}${imagenes[currentImageIndex].ruta}`}
                    alt={`Imagen ${currentImageIndex + 1}`}
                    fill
                    className="object-contain rounded-lg"
                    sizes="(max-width: 768px) 100vw, 80vw"
                    onError={() => console.error(`Error cargando imagen: ${imagenes[currentImageIndex].ruta}`)}
                  />
                </div>
                {imagenes.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-900 focus:outline-none"
                    >
                      <FaArrowLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-900 focus:outline-none"
                    >
                      <FaArrowRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center">No hay imágenes disponibles</p>
            )}
            <button
              onClick={closeModal}
              className="mt-4 w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cerrar
            </button>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

// Componente para mostrar las características del producto
function ProductFeatures({ features }: { features: Feature[] }) {
  const renderIcon = (icono: string) => {
    const iconObj = availableIcons.find((i) => i.name === icono);
    const IconComponent = iconObj ? iconObj.icon : FaQuestion;
    return <IconComponent className="text-indigo-600 h-6 w-6" title={icono} />;
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

// Componente para mostrar la disponibilidad y permitir reservas
function ProductAvailability({ productId, backendUrl }: { productId: number; backendUrl: string }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Obtener disponibilidades y reservas al cargar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener disponibilidades
        const availabilityResponse = await axios.get<Availability[]>(
          `${backendUrl}/api/productos/${productId}/availability`
        );
        console.log("Disponibilidades obtenidas:", availabilityResponse.data);
        setAvailabilities(availabilityResponse.data);

        // Obtener reservas existentes
        const reservationsResponse = await axios.get<Reservation[]>(
          `${backendUrl}/api/reservas/producto/${productId}`
        );
        console.log("Respuesta cruda de la API de reservas:", reservationsResponse.data);
        setReservations(reservationsResponse.data);
      } catch (error: any) {
        setError(error.response?.data?.message || "Error al cargar disponibilidad o reservas");
        console.error("Error al obtener disponibilidad o reservas:", error);
      }
    };
    fetchData();
  }, [productId, backendUrl]);

  // Función para parsear fechas de forma segura
  const parseDate = (dateString: string | null | undefined): Date | null => {
    if (!dateString || typeof dateString !== "string") {
      console.warn(`Fecha inválida recibida: ${dateString}`);
      return null;
    }
    const dateParts = dateString.split("T")[0]; // Tomamos solo la parte yyyy-MM-dd
    const date = new Date(dateParts);
    if (isNaN(date.getTime())) {
      console.warn(`Fecha no válida: ${dateString}`);
      return null;
    }
    // Establecer al inicio del día en la zona horaria local
    date.setHours(0, 0, 0, 0);
    console.log(`Fecha parseada: ${dateString} -> ${date.toLocaleDateString("es-AR")} (${date.toISOString()})`);
    return date;
  };

  // Normalizar fecha a local sin hora
  const normalizeToLocalDate = (date: Date): Date => {
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    localDate.setHours(0, 0, 0, 0); // Asegurar inicio del día
    return localDate;
  };

  // Generar todas las fechas en un rango
  const getDatesInRange = (start: Date, end: Date): Date[] => {
    const dates: Date[] = [];
    let currentDate = new Date(start);
    currentDate.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  // Parsear fechas para incluir (disponibilidades)
  const includeDates: { start: Date; end: Date }[] = availabilities
    .filter((a) => a.estado === "DISPONIBLE" && a.fechaInicio && a.fechaFin)
    .map((a) => {
      const start = parseDate(a.fechaInicio);
      const end = parseDate(a.fechaFin);
      return { start, end };
    })
    .filter((interval): interval is { start: Date; end: Date } => interval.start !== null && interval.end !== null);

  // Generar fechas individuales para excluir (reservas y prueba)
  const excludeDates: Date[] = [
    // Fechas de prueba
    normalizeToLocalDate(new Date("2025-05-02")),
    normalizeToLocalDate(new Date("2025-05-03")),
    ...reservations
      .filter((r) => {
        const isValid = r.startDate && r.endDate;
        if (!isValid) {
          console.warn(`Reserva inválida descartada:`, r);
        }
        return isValid;
      })
      .flatMap((r) => {
        const start = parseDate(r.startDate);
        const end = parseDate(r.endDate);
        if (!start || !end) return [];
        const datesInRange = getDatesInRange(start, end);
        console.log(
          `Reserva procesada: ${r.startDate} a ${r.endDate} ->`,
          datesInRange.map((d) => d.toLocaleDateString("es-AR")).join(", ")
        );
        return datesInRange;
      })
      .filter((date): date is Date => date !== null),
  ];

  // Depuración: Imprimir los intervalos procesados
  useEffect(() => {
    console.log("Intervalos incluidos (disponibles):", includeDates);
    console.log(
      "Fechas excluidas (reservadas):",
      excludeDates.map((d) => `${d.toLocaleDateString("es-AR")} (${d.toISOString()})`)
    );
    console.log(
      "excludeDates antes de renderizar DatePicker:",
      excludeDates.map((d) => ({
        local: d.toLocaleDateString("es-AR"),
        iso: d.toISOString(),
        raw: d,
      }))
    );
  }, [availabilities, reservations]);

  // Validar el rango seleccionado en el frontend
  const isDateRangeValid = (start: Date | null, end: Date | null): boolean => {
    if (!start || !end) return false;
    const startTime = start.setHours(0, 0, 0, 0);
    const endTime = end.setHours(0, 0, 0, 0);
    for (const excluded of excludeDates) {
      const excludedTime = excluded.getTime();
      if (excludedTime >= startTime && excludedTime <= endTime) {
        console.warn(`Rango inválido: incluye fecha reservada ${excluded.toLocaleDateString("es-AR")}`);
        return false;
      }
    }
    return true;
  };

  // Interfaz para el componente de entrada personalizado del DatePicker
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
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-64 pl-10 p-3 shadow-sm hover:shadow-md transition-shadow"
          placeholder={placeholder}
        />
      </div>
    )
  );

  CustomInput.displayName = "CustomInput";

  // Manejar la acción de reservar
  const handleReserve = () => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/products/${productId}/reserve`);
      return;
    }
    if (!startDate || !endDate) {
      alert("Por favor, selecciona un rango de fechas");
      return;
    }
    if (!isDateRangeValid(startDate, endDate)) {
      alert("El rango seleccionado incluye fechas reservadas. Por favor, elige otro rango.");
      return;
    }
    router.push(`/products/${productId}/reserve?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disponibilidad</h2>
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex gap-3">
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={(update: [Date | null, Date | null]) => {
                  setStartDate(update[0]);
                  setEndDate(update[1]);
                }}
                // includeDateIntervals={includeDates} // Comentado para pruebas
                excludeDates={excludeDates}
                minDate={new Date()}
                customInput={<CustomInput />}
                placeholderText="Selecciona fechas"
                isClearable
                showPopperArrow={false}
                monthsShown={2}
                dateFormat="yyyy-MM-dd"
              />
            </div>
            <button
              onClick={handleReserve}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-colors"
            >
              Reservar
            </button>
          </div>
          <p className="text-gray-700 mt-2 text-sm">Las fechas en gris están reservadas.</p>
        </>
      )}
    </div>
  );
}

// Componente para mostrar las políticas del producto
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

// Componente para mostrar y gestionar valoraciones del producto
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
    fetchPuntuaciones();
  }, [productId, backendUrl]);

  useEffect(() => {
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
    checkCanRate();
  }, [productId, usuarioId, backendUrl, puntuaciones]);

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

// Componente para compartir el producto en redes sociales
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

// Componente principal para la página de detalles del producto
export default function ProductDetailPage({ params }: ProductPageProps) {
  const { data: session } = useSession();
  const [product, setProduct] = useState<Product | null>(null);
  const [politicas, setPoliticas] = useState<Politica[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await params;
        const id = resolvedParams.id;

        if (!/^\d+$/.test(id)) {
          throw new Error("El ID del producto debe ser un número");
        }

        const productResponse = await axios.get<Product>(`${backendUrl}/api/productos/${id}`, {
          headers: { "Content-Type": "application/json" },
        });
        setProduct(productResponse.data);

        const politicasResponse = await axios.get<Politica[]>(`${backendUrl}/api/productos/${id}/politicas`);
        setPoliticas(politicasResponse.data);

        setLoading(false);
      } catch (err: any) {
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

  const usuarioId = session?.user?.id ? parseInt(session.user.id, 10) : null;

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
      <WhatsAppButton />
    </div>
  );
}