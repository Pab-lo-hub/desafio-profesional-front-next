"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import HeaderWithSession from "@/app/Components/HeaderWithSession";
import Footer from "@/app/Components/Footer";

interface Reservation {
  id: number;
  product: { nombre: string; descripcion: string };
  startDate: string;
  endDate: string;
  notes?: string;
}

interface ReservaDTO {
  id: number;
  productId: number;
  productoNombre: string;
  userId: number;
  usuarioNombre: string;
  startDate: string;
  endDate: string;
  estado: string;
}

export default function ConfirmationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reservationId = searchParams.get("reservationId");
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/reservations/confirmation?reservationId=${reservationId}`);
      return;
    }

    const fetchReservation = async () => {
      if (!reservationId) {
        setError("No se proporcionó un ID de reserva.");
        return;
      }

      try {
        const response = await axios.get<ReservaDTO>(`${backendUrl}/api/reservas/${reservationId}`);
        const reservaDTO = response.data;
        // Mapear ReservaDTO a Reservation
        setReservation({
          id: reservaDTO.id,
          product: {
            nombre: reservaDTO.productoNombre,
            descripcion: "", // No tenemos descripción en ReservaDTO, usamos vacío
          },
          startDate: reservaDTO.startDate,
          endDate: reservaDTO.endDate,
          notes: reservaDTO.estado === "PENDIENTE" ? "Reserva pendiente de confirmación" : undefined,
        });
      } catch (err: any) {
        setError(err.response?.data?.message || "No se pudo cargar la confirmación de la reserva.");
      }
    };

    fetchReservation();
  }, [reservationId, status, router]);

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <HeaderWithSession className="z-50" />
        <main className="flex-grow container mx-auto px-4 pt-36">
          <div className="text-center py-16 text-red-500">{error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="flex flex-col min-h-screen">
        <HeaderWithSession className="z-50" />
        <main className="flex-grow container mx-auto px-4 pt-36">
          <div className="text-center py-16 text-gray-900">Cargando...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWithSession className="z-50" />
      <main className="flex-grow container mx-auto px-4 pt-36">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Reserva Confirmada</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Detalles de la Reserva</h2>
          <p className="text-gray-900">
            <strong className="text-gray-700">Producto:</strong> {reservation.product.nombre}
          </p>
          <p className="text-gray-900">
            <strong className="text-gray-700">Descripción:</strong>{" "}
            {reservation.product.descripcion || "No disponible"}
          </p>
          <p className="text-gray-900">
            <strong className="text-gray-700">Fecha de Inicio:</strong>{" "}
            {new Date(reservation.startDate).toLocaleDateString()}
          </p>
          <p className="text-gray-900">
            <strong className="text-gray-700">Fecha de Fin:</strong>{" "}
            {new Date(reservation.endDate).toLocaleDateString()}
          </p>
          <button
            onClick={() => router.push("/reservations")}
            className="mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-colors"
          >
            Ver Historial de Reservas
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
