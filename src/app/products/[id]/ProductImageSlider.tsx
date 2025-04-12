// src/app/products/[id]/ProductImageSlider.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

interface Imagen {
  id: number;
  ruta: string;
}

interface ProductImageSliderProps {
  imagenes: Imagen[];
  backendUrl: string;
}

export default function ProductImageSlider({ imagenes, backendUrl }: ProductImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (imagenes.length === 0) {
    return <p className="text-gray-500">No hay imágenes disponibles</p>;
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Imagen Actual */}
      <div className="relative h-96 overflow-hidden rounded-lg">
        <Image
          src={`${backendUrl}${imagenes[currentIndex].ruta}`}
          alt={`Imagen ${currentIndex + 1}`}
          fill
          className="object-cover w-full h-full"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Botones de Navegación */}
      {imagenes.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
          >
            &#10094; {/* Flecha izquierda */}
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 focus:outline-none"
          >
            &#10095; {/* Flecha derecha */}
          </button>

          {/* Indicadores de Puntos */}
          <div className="flex justify-center mt-4 space-x-2">
            {imagenes.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? "bg-indigo-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}