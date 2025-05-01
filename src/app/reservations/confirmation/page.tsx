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
      router.push("/login");
      return;
    }

    const fetchReservation = async () => {
      if (!reservationId) {
        setError("No se proporcionó un ID de reserva.");
        return;
      }

      try {
        const response = await axios.get<Reservation>(`${backendUrl}/api/reservas/${reservationId}`);
        setReservation(response.data);
      } catch (err: any) {
        setError("No se pudo cargar la confirmación de la reserva.");
      }
    };

    fetchReservation();
  }, [reservationId, status, router]);

  if (error) {
    return <div className="text-center py-16 text-red-500">{error}</div>;
  }

  if (!reservation) {
    return <div className="text-center py-16">Cargando...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWithSession className="z-50" />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Reserva Confirmada</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Detalles de la Reserva</h2>
          <p><strong>Producto:</strong> {reservation.product.nombre}</p>
          <p><strong>Descripción:</strong> {reservation.product.descripcion}</p>
          <p><strong>Fecha de Inicio:</strong> {new Date(reservation.startDate).toLocaleDateString()}</p>
          <p><strong>Fecha de Fin:</strong> {new Date(reservation.endDate).toLocaleDateString()}</p>
          {reservation.notes && <p><strong>Notas:</strong> {reservation.notes}</p>}
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