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
  const [categoryIds, setCategoryIds] = useState<number[] | null>(null);
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const handleCategorySelect = (ids: number[]) => {
    setCategoryIds(ids.length > 0 ? ids : null);
    setSearchResults([]); // Limpiar resultados de búsqueda al seleccionar categorías
  };

  const handleSearch = (results: Product[]) => {
    setSearchResults(results);
    setCategoryIds(null); // Limpiar categorías al realizar búsqueda
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderWithSession className="z-50" />
      <main className="flex-grow">
        <Buscador onSearch={handleSearch} />
        <Products categoryIds={categoryIds} favoriteProducts={searchResults.length > 0 ? searchResults : undefined} />
        <Categorias onCategorySelect={handleCategorySelect} />
      </main>
      <Footer />
    </div>
  );
}