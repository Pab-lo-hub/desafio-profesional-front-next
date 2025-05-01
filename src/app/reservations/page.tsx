'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Interfaz para la reserva (ajusta según la estructura de tu backend)
interface Reservation {
  id: number;
  producto: { id: number; nombre: string };
  usuario: { id: number; nombre: string };
  fechaInicio: string;
  fechaFin: string;
  estado: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const userId = 1; // TODO: Obtener dinámicamente desde el contexto de autenticación
        const response = await fetch(`http://localhost:8080/api/reservas/usuarios/${userId}/reservas`, {
          headers: {
            'Content-Type': 'application/json',
            // TODO: Agregar token de autenticación si es necesario
            // 'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error al cargar las reservas: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setReservations(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Mis Reservas</h1>
        {loading ? (
          <div className="text-center text-gray-600">Cargando reservas...</div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center text-gray-600">No tienes reservas actualmente.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800">{reservation.producto.nombre}</h2>
                <p className="text-gray-600">Reserva ID: {reservation.id}</p>
                <p className="text-gray-600">Usuario: {reservation.usuario.nombre}</p>
                <p className="text-gray-600">
                  Fecha Inicio: {new Date(reservation.fechaInicio).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Fecha Fin: {new Date(reservation.fechaFin).toLocaleDateString()}
                </p>
                <p className="text-gray-600">Estado: {reservation.estado}</p>
                <Link href={`/products/${reservation.producto.id}`}>
                  <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Ver Producto
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}