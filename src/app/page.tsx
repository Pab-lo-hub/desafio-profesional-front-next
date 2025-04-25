"use client";

import React, { useState } from "react";
import HeaderWithSession from "./Components/HeaderWithSession";
import Buscador from "./Components/Buscador";
import Categorias from "./Components/Categorias";
import Products from "./Components/Products";
import Footer from "./Components/Footer";

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  price?: string;
  categoria_id?: number;
  imagenes: { id: number; ruta: string }[];
}

export default function Home() {
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const handleCategorySelect = (id: number) => {
    setCategoryId(id);
    setSearchResults([]); // Limpiar resultados de búsqueda al seleccionar categoría
  };

  const handleSearch = (results: Product[]) => {
    setSearchResults(results);
    setCategoryId(null); // Limpiar categoría al realizar búsqueda
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWithSession className="z-50" />
      <main className="flex-grow">
        <Buscador onSearch={handleSearch} />
        <Products categoryId={categoryId} />
        <Categorias onCategorySelect={handleCategorySelect} />
      </main>
      <Footer />
    </div>
  );
}