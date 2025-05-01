"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import HeaderWithSession from "@/app/Components/HeaderWithSession";
import Footer from "@/app/Components/Footer";
import React from "react";

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  imagenes: { id: number; ruta: string }[];
}

interface Availability {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
}

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
        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-3 shadow-sm hover:shadow-md transition-shadow"
        placeholder={placeholder}
      />
    </div>
  )
);
CustomInput.displayName = "CustomInput";

export default function ReservePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const productId = params.id;
  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  const [product, setProduct] = useState<Product | null>(null);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(startDateParam ? new Date(startDateParam) : null);
  const [endDate, setEndDate] = useState<Date | null>(endDateParam ? new Date(endDateParam) : null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/products/${productId}/reserve`);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await axios.get<Product>(`${backendUrl}/api/productos/${productId}`);
        setProduct(response.data);
        const availabilityResponse = await axios.get<Availability[]>(`${backendUrl}/api/productos/${productId}/availability`);
        setAvailabilities(availabilityResponse.data);
        setLoading(false);
      } catch (err: any) {
        setError("No se pudo cargar el producto.");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, status, router]);

  const includeDates = availabilities
    .filter((a) => a.estado === "DISPONIBLE")
    .map((a) => ({
      start: new Date(a.fechaInicio),
      end: new Date(a.fechaFin),
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) {
      setError("Debes estar autenticado para realizar una reserva.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Por favor, selecciona un rango de fechas.");
      return;
    }
    if (endDate <= startDate) {
      setError("La fecha de fin debe ser posterior a la fecha de inicio.");
      return;
    }

    try {
      const response = await axios.post(`${backendUrl}/api/reservas`, {
        userId: session.user.id,
        productId: Number(productId),
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
        notes,
      });
      router.push(`/reservations/confirmation?reservationId=${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al realizar la reserva. Intenta de nuevo.");
    }
  };

  if (loading) {
    return <div className="text-center py-16">Cargando...</div>;
  }

  if (error || !product) {
    return <div className="text-center py-16 text-red-500">{error || "Producto no encontrado."}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWithSession className="z-50" />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Reservar: {product.nombre}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Detalles del Producto</h2>
            <div className="relative h-64 mb-4">
              <Image
                src={product.imagenes[0]?.ruta ? `${backendUrl}${product.imagenes[0].ruta}` : "/placeholder.png"}
                alt={product.nombre}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <p><strong>Nombre:</strong> {product.nombre}</p>
            <p><strong>Descripción:</strong> {product.descripcion}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Formulario de Reserva</h2>
            <div className="mb-4">
              <h3 className="text-lg font-medium">Datos del Usuario</h3>
              <p><strong>Nombre:</strong> {session?.user?.nombre || "No disponible"}</p>
              <p><strong>Apellido:</strong> {session?.user?.apellido || "No disponible"}</p>
              <p><strong>Correo:</strong> {session?.user?.email}</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Selecciona las Fechas</h3>
                <div className="flex gap-4">
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    includeDateIntervals={includeDates}
                    customInput={<CustomInput placeholder="Fecha Inicio" />}
                    minDate={new Date()}
                    isClearable
                  />
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate ?? new Date()}
                    includeDateIntervals={includeDates}
                    customInput={<CustomInput placeholder="Fecha Fin" />}
                    isClearable
                  />
                </div>
              </div>
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notas (opcional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={4}
                />
              </div>
              {error && <div className="text-red-500">{error}</div>}
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-colors"
              >
                Confirmar Reserva
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}