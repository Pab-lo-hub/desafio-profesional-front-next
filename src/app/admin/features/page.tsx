"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import {
  FaWifi,
  FaTv,
  FaCar,
  FaSwimmingPool,
  FaPaw,
  FaSnowflake,
  FaBluetooth,
  FaBatteryFull,
  FaParking,
  FaQuestion,
} from "react-icons/fa";
import { TbAirConditioning } from "react-icons/tb";
import { IconType } from "react-icons";

// Lista de iconos disponibles desde react-icons
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
    console.log("backendUrl:", backendUrl);
    const fetchFeatures = async () => {
      try {
        const session = await getSession();
        console.log("Session:", session);
        if (!session || session.user.role !== "admin") {
          router.push("/login");
          return;
        }

        console.log("Fetching features from:", `${backendUrl}/api/features`);
        const response = await axios.get<Feature[]>(`${backendUrl}/api/features`, {
          headers: { "Content-Type": "application/json" },
        });

        console.log("Features fetched:", response.data);
        setFeatures(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching features:", err.response?.data, err.response?.status);
        setError(err.message || "No se pudo cargar la lista de características");
        setLoading(false);
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
      console.log("Adding feature:", newFeature);
      const response = await axios.post<Feature>(
        `${backendUrl}/api/features`,
        newFeature,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Feature added:", response.data);
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
      console.error("Error adding feature:", err.response?.data, err.response?.status);
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "No se pudo añadir la característica",
        icon: "error",
      });
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
      console.log("Updating feature:", editingFeature);
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
      console.error("Error updating feature:", err.response?.data, err.response?.status);
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "No se pudo actualizar la característica",
        icon: "error",
      });
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
      console.log("Deleting feature ID:", id);
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
      console.error("Error deleting feature:", err.response?.data, err.response?.status);
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "No se pudo eliminar la característica",
        icon: "error",
      });
    }
  };

  // Función para renderizar el icono dinámicamente
  const renderIcon = (icono: string) => {
    const iconObj = availableIcons.find((i) => i.name === icono);
    const IconComponent = iconObj ? iconObj.icon : FaQuestion;
    return <IconComponent className="text-indigo-600 h-6 w-6" title={icono} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50 pt-16">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Lista de Características</h1>
          <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <p className="text-gray-900">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50 pt-16">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Lista de Características</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50 pt-16">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Lista de Características</h1>
          <Link
            href="/admin"
            className="text-gray-600 hover:text-gray-900 flex items-center transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6 mr-2" />
            Volver al Panel
          </Link>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Añadir Nueva Característica</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Nombre de la característica"
              value={newFeature.nombre}
              onChange={(e) => setNewFeature({ ...newFeature, nombre: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 hover:shadow-md transition-shadow placeholder:text-gray-400"
            />
            <select
              value={newFeature.icono}
              onChange={(e) => setNewFeature({ ...newFeature, icono: e.target.value })}
              className="border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 hover:shadow-md transition-shadow text-gray-900"
            >
              <option value="">Selecciona un ícono</option>
              {availableIcons.map((icon) => (
                <option key={icon.name} value={icon.name}>
                  {icon.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddFeature}
              className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-colors"
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center space-x-2">
                        {renderIcon(feature.icono)}
                        <span>{feature.icono}</span>
                      </td>
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
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Editar Característica</h2>
              <input
                type="text"
                placeholder="Nombre de la característica"
                value={editingFeature.nombre}
                onChange={(e) => setEditingFeature({ ...editingFeature, nombre: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 hover:shadow-md transition-shadow placeholder:text-gray-400 w-full mb-4"
              />
              <select
                value={editingFeature.icono}
                onChange={(e) => setEditingFeature({ ...editingFeature, icono: e.target.value })}
                className="border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 hover:shadow-md transition-shadow text-gray-900 w-full mb-4"
              >
                <option value="">Selecciona un ícono</option>
                {availableIcons.map((icon) => (
                  <option key={icon.name} value={icon.name}>
                    {icon.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleEditFeature}
                  className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-colors"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditingFeature(null)}
                  className="bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 transition-colors"
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