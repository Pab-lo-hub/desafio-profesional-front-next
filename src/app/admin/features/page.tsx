"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

interface Feature {
  id: number;
  nombre: string;
  icono: string;
}

export default function FeatureListPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState({ nombre: "", icono: "" });
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const session = await getSession();
        if (!session || session.user.role !== "admin") {
          router.push("/login");
          return;
        }

        const response = await axios.get<Feature[]>(`${backendUrl}/api/features`, {
          headers: { "Content-Type": "application/json" },
        });

        setFeatures(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "No se pudo cargar la lista de características");
        setLoading(false);
        console.error("Error fetching features:", err);
      }
    };

    fetchFeatures();
  }, [router]);

  const handleAddFeature = async () => {
    if (!newFeature.nombre || !newFeature.icono) {
      Swal.fire({
        title: "Error",
        text: "Por favor, completa todos los campos",
        icon: "error",
      });
      return;
    }

    try {
      const response = await axios.post<Feature>(
        `${backendUrl}/api/features`,
        newFeature,
        { headers: { "Content-Type": "application/json" } }
      );

      setFeatures([...features, response.data]);
      setNewFeature({ nombre: "", icono: "" });

      Swal.fire({
        title: "Éxito",
        text: "Característica añadida",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text: err.message || "No se pudo añadir la característica",
        icon: "error",
      });
      console.error("Error adding feature:", err);
    }
  };

  const handleEditFeature = async () => {
    if (!editingFeature || !editingFeature.nombre || !editingFeature.icono) {
      Swal.fire({
        title: "Error",
        text: "Por favor, completa todos los campos",
        icon: "error",
      });
      return;
    }

    try {
      const response = await axios.put<Feature>(
        `${backendUrl}/api/features/${editingFeature.id}`,
        editingFeature,
        { headers: { "Content-Type": "application/json" } }
      );

      setFeatures(features.map((f) => (f.id === editingFeature.id ? response.data : f)));
      setEditingFeature(null);

      Swal.fire({
        title: "Éxito",
        text: "Característica actualizada",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text: err.message || "No se pudo actualizar la característica",
        icon: "error",
      });
      console.error("Error updating feature:", err);
    }
  };

  const handleDeleteFeature = async (id: number) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la característica permanentemente",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${backendUrl}/api/features/${id}`, {
        headers: { "Content-Type": "application/json" },
      });

      setFeatures(features.filter((f) => f.id !== id));

      Swal.fire({
        title: "Éxito",
        text: "Característica eliminada",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text: err.message || "No se pudo eliminar la característica",
        icon: "error",
      });
      console.error("Error deleting feature:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-4">Lista de Características</h1>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-4">Lista de Características</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Lista de Características</h1>
          <Link
            href="/admin"
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <ArrowLeftIcon className="h-6 w-6 mr-2" />
            Volver al Panel
          </Link>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Añadir Nueva Característica</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nombre"
              value={newFeature.nombre}
              onChange={(e) => setNewFeature({ ...newFeature, nombre: e.target.value })}
              className="border rounded-lg p-2"
            />
            <input
              type="text"
              placeholder="Ícono (e.g., FaWifi)"
              value={newFeature.icono}
              onChange={(e) => setNewFeature({ ...newFeature, icono: e.target.value })}
              className="border rounded-lg p-2"
            />
            <button
              onClick={handleAddFeature}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Añadir Característica
            </button>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ícono</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {features.map((feature) => (
                    <tr key={feature.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feature.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feature.nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feature.icono}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setEditingFeature(feature)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteFeature(feature.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {editingFeature && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">Editar Característica</h2>
              <input
                type="text"
                placeholder="Nombre"
                value={editingFeature.nombre}
                onChange={(e) => setEditingFeature({ ...editingFeature, nombre: e.target.value })}
                className="border rounded-lg p-2 w-full mb-4"
              />
              <input
                type="text"
                placeholder="Ícono"
                value={editingFeature.icono}
                onChange={(e) => setEditingFeature({ ...editingFeature, icono: e.target.value })}
                className="border rounded-lg p-2 w-full mb-4"
              />
              <div className="flex gap-4">
                <button
                  onClick={handleEditFeature}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditingFeature(null)}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}