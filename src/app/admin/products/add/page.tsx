// src/app/admin/products/add/page.tsx
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/productos`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status !== 201) throw new Error("Failed to add product");
      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
      console.error("Error adding product:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <input name="nombre" type="text" required />
      <textarea name="descripcion" required />
      <input name="imagenes" type="file" multiple />
      <button type="submit">Guardar Producto</button>
      {error && <p>{error}</p>}
    </form>
  );
}