import { FaWhatsapp } from 'react-icons/fa';

// Componente que renderiza un botón flotante para contactar al proveedor vía WhatsApp
export default function WhatsAppButton() {
  // Número de teléfono del proveedor (placeholder, reemplazar con número real)
  const phoneNumber = '+1234567890';
  // Mensaje predefinido, codificado para URL
  const message = encodeURIComponent('Hola, quiero consultar sobre el producto.');
  // URL para abrir WhatsApp con el número y mensaje
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    // Enlace que abre WhatsApp en una nueva pestaña
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
      aria-label="Contactar por WhatsApp"
    >
      <FaWhatsapp size={24} />
    </a>
  );
}