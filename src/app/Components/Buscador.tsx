"use client";

// Importaciones de dependencias
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

// Interfaz para las props del componente
interface BuscadorProps {
  onSearch: (results: any[]) => void; // Función para manejar los resultados de búsqueda
}

// Componente principal del buscador
const Buscador = ({ onSearch }: BuscadorProps) => {
  // Estados para las fechas y la búsqueda
  const [startDate, setStartDate] = useState<Date | null>(null); // Fecha de inicio
  const [endDate, setEndDate] = useState<Date | null>(null); // Fecha de fin
  const [searchQuery, setSearchQuery] = useState(""); // Término de búsqueda
  const [suggestions, setSuggestions] = useState<string[]>([]); // Sugerencias de búsqueda
  const [showSuggestions, setShowSuggestions] = useState(false); // Controla visibilidad de sugerencias
  // URL del backend desde variables de entorno
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

  // Efecto para obtener sugerencias de búsqueda
  useEffect(() => {
    // No buscar si la consulta es corta
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Función para obtener sugerencias
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get<string[]>(`${backendUrl}/api/productos/suggest`, {
          params: { query: searchQuery },
        });
        setSuggestions(response.data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error al obtener sugerencias:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    // Aplicar debounce para evitar múltiples solicitudes
    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, backendUrl]);

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${backendUrl}/api/productos/search`, {
        params: {
          query: searchQuery,
          startDate: startDate?.toISOString().split("T")[0],
          endDate: endDate?.toISOString().split("T")[0],
        },
      });
      console.log("Resultados de búsqueda:", response.data);
      onSearch(response.data);
    } catch (error) {
      console.error("Error al buscar productos:", error);
      onSearch([]);
    }
  };

  // Maneja la selección de una sugerencia
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  // Interfaz para las props del input personalizado
  interface CustomInputProps {
    value?: string;
    onClick?: () => void;
    placeholder?: string;
  }

  // Componente de input personalizado para el DatePicker
  const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
    ({ value = "", onClick = () => {}, placeholder = "" }, ref) => (
      <div className="relative">
        {/* Icono de calendario */}
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
        {/* Input para el rango de fechas */}
        <input
          value={value}
          onClick={onClick}
          ref={ref}
          readOnly
          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:w-64 pl-10 p-3 shadow-sm hover:shadow-md transition-shadow"
          placeholder={placeholder}
        />
      </div>
    )
  );

  CustomInput.displayName = "CustomInput";

  return (
    // Contenedor con fondo degradado
    <div className="pt-20 pb-2 bg-gradient-to-r from-indigo-50 to-blue-50">
      {/* Contenedor responsivo */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Título principal */}
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Encuentra tu Producto Ideal
        </h2>
        {/* Formulario de búsqueda */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-white p-6 rounded-lg shadow-lg"
        >
          {/* Campo de búsqueda de texto */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow-md transition-shadow"
              placeholder="Buscar productos..."
              required
            />
            {/* Lista de sugerencias */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 cursor-pointer"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Selector de rango de fechas */}
          <div className="flex items-center">
            <DatePicker
              selected={startDate}
              onChange={(dates: [Date | null, Date | null]) => {
                const [start, end] = dates;
                setStartDate(start);
                setEndDate(end);
              }}
              startDate={startDate}
              endDate={endDate}
              selectsRange
              customInput={<CustomInput placeholder="Fecha Inicio - Fecha Fin" />}
              className="rounded-lg"
              calendarClassName="border border-gray-200 shadow-lg rounded-lg bg-white"
              popperClassName="z-50"
            />
          </div>

          {/* Botón de búsqueda */}
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-colors"
          >
            Buscar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Buscador;