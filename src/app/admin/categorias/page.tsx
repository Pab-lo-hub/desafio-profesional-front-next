"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Categoria {
  id: number;
  titulo: string;
}

export default function ManageCategorias() {
  const [titulo, setTitulo] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const session = await getSession();
        if (!session || session.user.role !== "admin") {
          router.push("/login");
          return;
        }
        const response = await axios.get<Categoria[]>(`${backendUrl}/api/categorias`);
        setCategorias(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar las categorías",
          icon: "error",
        });
      }
    };
    fetchCategorias();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/api/categorias`, { titulo });
      setTitulo("");
      const response = await axios.get<Categoria[]>(`${backendUrl}/api/categorias`);
      setCategorias(response.data);
      Swal.fire({
        title: "Éxito",
        text: "Categoría creada",
        icon: "success",
        timer: 1500,
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "No se pudo crear la categoría",
        icon: "error",
      });
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen p-8 text-black">
      <h1 className="text-3xl font-bold mb-4">Gestionar Categorías</h1>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700">
            Título
          </label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Crear Categoría
        </button>
      </form>
      <h2 className="text-2xl mb-4">Categorías Existentes</h2>
      <ul>
        {categorias.map((cat) => (
          <li key={cat.id}>{cat.titulo}</li>
        ))}
      </ul>
    </div>
  );
}