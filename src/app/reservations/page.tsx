"use client";

// Importaciones de dependencias y componentes
import { useState, useEffect } from "react"; // React y hooks para estado y efectos
import Link from "next/link"; // Componente de Next.js para navegación
import { useSession } from "next-auth/react"; // Hook para manejar sesiones de autenticación
import { useRouter } from "next/navigation"; // Hook para navegación programática
import axios from "axios"; // Cliente HTTP para solicitudes al backend
import HeaderWithSession from "@/app/Components/HeaderWithSession"; // Componente de encabezado con soporte para sesión
import Footer from "@/app/Components/Footer"; // Componente de pie de página

// Interfaz para la reserva (compatible con el backend)
interface Reservation {
  id: number;
  producto: { id: number; nombre: string };
  usuario: { id: number; nombre: string };
  fechaInicio: string;
  fechaFin: string;
  estado: string;
}

// Componente principal para la página de reservas
export default function ReservationsPage() {
  // Obtiene la sesión del usuario
  const { data: session, status } = useSession();
  // Hook para navegación programática
  const router = useRouter();
  // Estado para almacenar las reservas
  const [reservations, setReservations] = useState<Reservation[]>([]);
  // Estado para indicar si se está cargando
  const [loading, setLoading] = useState(true);
  // Estado para almacenar errores
  const [error, setError] = useState<string | null>(null);
  // URL del backend desde variables de entorno
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  // Efecto para cargar las reservas al montar el componente o al cambiar la sesión
  useEffect(() => {
    // Redirige a login si el usuario no está autenticado
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/reservations");
      return;
    }

    // Función para obtener las reservas del usuario
    const fetchReservations = async () => {
      // Solo ejecuta si hay un ID de usuario
      if (!session?.user?.id) return;

      try {
        // Realiza la solicitud al backend para obtener las reservas
        const response = await axios.get<Reservation[]>(
          `${backendUrl}/api/reservas/usuarios/${session.user.id}/reservas`,
          {
            headers: {
              "Content-Type": "application/json",
              // TODO: Agregar token de autenticación si el backend lo requiere
              // Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        // Actualiza el estado con las reservas obtenidas
        setReservations(response.data);
        // Indica que la carga ha finalizado
        setLoading(false);
      } catch (err: any) {
        // Maneja errores de la solicitud
        setError(err.response?.data?.message || "Error al cargar las reservas");
        setLoading(false);
      }
    };

    // Ejecuta la función solo si el usuario está autenticado
    if (status === "authenticated") {
      fetchReservations();
    }
  }, [session, status, router, backendUrl]);

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
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Reservas</h1>
              {/* Muestra un mensaje de carga si está cargando */}
              {loading ? (
                <div className="text-center text-gray-600">Cargando reservas...</div>
              ) : // Muestra un mensaje de error si ocurrió un error
              error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <strong>Error:</strong> {error}
                </div>
              ) : // Muestra un mensaje si no hay reservas
              reservations.length === 0 ? (
                <div className="text-center text-gray-600">No tienes reservas actualmente.</div>
              ) : (
                // Muestra una cuadrícula de reservas
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {reservations.map((reservation) => (
                    // Tarjeta para cada reserva
                    <div key={reservation.id} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                      {/* Nombre del producto */}
                      <h2 className="text-xl font-semibold text-gray-800">{reservation.producto.nombre}</h2>
                      {/* ID de la reserva */}
                      <p className="text-gray-600">Reserva ID: {reservation.id}</p>
                      {/* Nombre del usuario */}
                      <p className="text-gray-600">Usuario: {reservation.usuario.nombre}</p>
                      {/* Fecha de inicio formateada */}
                      <p className="text-gray-600">
                        Fecha Inicio: {new Date(reservation.fechaInicio).toLocaleDateString()}
                      </p>
                      {/* Fecha de fin formateada */}
                      <p className="text-gray-600">
                        Fecha Fin: {new Date(reservation.fechaFin).toLocaleDateString()}
                      </p>
                      {/* Estado de la reserva */}
                      <p className="text-gray-600">Estado: {reservation.estado}</p>
                      {/* Botón para ver el producto */}
                      <Link href={`/products/${reservation.producto.id}`}>
                        <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                          Ver Producto
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
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