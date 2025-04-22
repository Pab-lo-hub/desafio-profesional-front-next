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

interface Categoria {
  id: number;
  titulo: string;
}

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  categoria?: { id: number; titulo: string };
  features?: Feature[];
}

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoriaId: "",
  });
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const session = await getSession();
        if (!session || session.user.role !== "admin") {
          router.push("/login");
          return;
        }

        const resolvedParams = await params;
        const id = resolvedParams.id;

        const [productResponse, featuresResponse, categoriasResponse] = await Promise.all([
          axios.get<Producto>(`${backendUrl}/api/productos/${id}`),
          axios.get<Feature[]>(`${backendUrl}/api/features`),
          axios.get<Categoria[]>(`${backendUrl}/api/categorias`),
        ]);

        const product = productResponse.data;
        setFormData({
          nombre: product.nombre,
          descripcion: product.descripcion || "",
          categoriaId: product.categoria ? product.categoria.id.toString() : "",
        });
        setSelectedFeatures(product.features?.map((f) => f.id) || []);
        setFeatures(featuresResponse.data);
        setCategorias(categoriasResponse.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "No se pudo cargar la información");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [router, params]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const session = await getSession();
      if (!session || session.user.role !== "admin") {
        throw new Error("No tienes permisos para realizar esta acción");
      }

      const resolvedParams = await params;
      const id = resolvedParams.id;

      const formDataToSend = new FormData();
      formDataToSend.append("producto", JSON.stringify({
        nombre: formData.nombre,
        descripcion: formData.descripcion,
      }));
      if (formData.categoriaId) {
        formDataToSend.append("categoriaId", formData.categoriaId);
      }
      images.forEach((image) => formDataToSend.append("imagenes", image));
      selectedFeatures.forEach((id) => formDataToSend.append("featureIds", id.toString()));

      await axios.put(`${backendUrl}/api/productos/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        title: "Éxito",
        text: "Producto actualizado correctamente",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      router.push("/admin/products?refresh=true");
    } catch (err: any) {
      Swal.fire({
        title: "Error",
        text: err.message || "No se pudo actualizar el producto",
        icon: "error",
      });
      console.error("Error updating product:", err);
    }
  };

  const handleFeatureToggle = (id: number) => {
    setSelectedFeatures((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-4">Editar Producto</h1>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold mb-4">Editar Producto</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Editar Producto</h1>
          <Link
            href="/admin/products"
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <ArrowLeftIcon className="h-6 w-6 mr-2" />
            Volver
          </Link>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="mt-1 block w-full border rounded-lg p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="mt-1 block w-full border rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Categoría</label>
              <select
                value={formData.categoriaId}
                onChange={(e) => setFormData({ ...formData, categoriaId: e.target.value })}
                className="mt-1 block w-full border rounded-lg p-2"
              >
                <option value="">Sin categoría</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.titulo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Imágenes</label>
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Características</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {features.map((feature) => (
                  <label key={feature.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(feature.id)}
                      onChange={() => handleFeatureToggle(feature.id)}
                      className="h-4 w-4"
                    />
                    <span>{feature.nombre}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Guardar Cambios
              </button>
              <Link
                href="/admin/products"
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}