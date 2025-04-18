"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  ChartPieIcon,
  CursorArrowRaysIcon,
  FingerPrintIcon,
  SquaresPlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@headlessui/react";

// Lista de productos para el menú desplegable
const products = [
  { name: "Categorías", description: "Get a better understanding of your traffic", href: "/categorias", icon: ChartPieIcon },
  { name: "Productos", description: "Speak directly to your customers", href: "/productos", icon: CursorArrowRaysIcon },
  { name: "Security", description: "Your customers’ data will be safe and secure", href: "#", icon: FingerPrintIcon },
  { name: "Integrations", description: "Connect with third-party tools", href: "#", icon: SquaresPlusIcon },
  { name: "Automations", description: "Build strategic funnels that will convert", href: "#", icon: ArrowPathIcon },
];

// Llamadas a la acción para el menú desplegable
const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

// Interfaz para los props del componente Header
interface HeaderProps {
  className?: string; // Clases CSS opcionales para personalizar el estilo
}

// Función para obtener las iniciales del usuario
const getInitials = (nombre?: string, apellido?: string, email?: string): string => {
  if (nombre && apellido) {
    return `${nombre[0] || ""}${apellido[0] || ""}`.toUpperCase();
  }
  if (email) {
    const emailPrefix = email.split("@")[0];
    return emailPrefix.slice(0, 2).toUpperCase();
  }
  return "??";
};

// Componente principal del header
const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  // Estado para controlar si el menú móvil está abierto
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Obtener la sesión del usuario
  const { data: session, status } = useSession();

  // Determinar si el usuario está logueado y si es admin
  const isLoggedIn = status === "authenticated";
  const isAdmin = isLoggedIn && session?.user?.role === "admin";

  // Obtener datos del usuario
  const userNombre = session?.user?.nombre || undefined;
  const userApellido = session?.user?.apellido || undefined;
  const userEmail = session?.user?.email || undefined;
  const displayName = userNombre && userApellido ? `${userNombre} ${userApellido}` : userEmail || "Usuario";
  const initials = getInitials(userNombre, userApellido, userEmail);

  return (
    <header className={`fixed top-0 left-0 w-full bg-white shadow-md z-50 ${className}`}>
      {/* Barra de navegación principal */}
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-1 lg:px-4">
        {/* Logo y enlace a la página principal */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1 p-1">
            <span className="sr-only">Rent</span>
            <Image
              src="/travel-nest-logo.png"
              alt="Logo de Travel Nest"
              width={128}
              height={128}
              className="h-32 w-auto object-contain"
              priority
            />
          </Link>
        </div>
        {/* Botón para abrir el menú móvil (visible en pantallas pequeñas) */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        {/* Menú de navegación para pantallas grandes */}
        <PopoverGroup className="hidden lg:flex lg:gap-x-12 pr-20">
          {/* <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900">
              Panel
              <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
            </PopoverButton>
            <PopoverPanel
              transition
              className="absolute top-full -left-8 z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white ring-1 shadow-lg ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
            >
              <div className="p-4">
                {products.map((item) => (
                  <div
                    key={item.name}
                    className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                  >
                    <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                      <item.icon
                        aria-hidden="true"
                        className="size-6 text-gray-600 group-hover:text-indigo-600"
                      />
                    </div>
                    <div className="flex-auto">
                      <Link href={item.href} className="block font-semibold text-gray-900">
                        {item.name}
                        <span className="absolute inset-0" />
                      </Link>
                      <p className="mt-1 text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                {callsToAction.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100"
                  >
                    <item.icon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </PopoverPanel>
          </Popover> */}
          <Link href="/productos" className="text-sm/6 font-semibold text-gray-900">
            Productos
          </Link>
          <Link href="/categorias" className="text-sm/6 font-semibold text-gray-900">
            Categorias
          </Link>
          <Link href="/contacto" className="text-sm/6 font-semibold text-gray-900">
            Contacto
          </Link>
        </PopoverGroup>
        {/* Botones de acción para pantallas grandes */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-x-4">

              <div className="flex items-center gap-x-2">
                <div className="flex size-10 items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                  {initials}
                </div>
                <span className="text-sm font-semibold text-gray-900">{displayName}</span>
              </div>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="bg-transparent hover:bg-blue-400 text-blue-400 font-semibold hover:text-white py-1 px-2 border border-blue-300 hover:border-transparent rounded mx-2 text-sm"
                >
                  Panel Admin
                </Link>
              )}
              <Button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-transparent hover:bg-red-400 text-red-400 font-semibold hover:text-white py-1 px-2 border border-red-300 hover:border-transparent rounded text-sm"
              >
                Cerrar Sesión
              </Button>
            </div>
          ) : (
            <>
              <Link
                href="/register"
                className="bg-transparent hover:bg-blue-400 text-blue-400 font-semibold hover:text-white py-1 px-2 border border-blue-300 hover:border-transparent rounded text-sm"
              >
                Crear Cuenta
              </Link>
              <Link
                href="/login"
                className="bg-transparent hover:bg-blue-400 text-blue-400 font-semibold hover:text-white py-1 px-2 border border-blue-300 hover:border-transparent rounded text-sm"
              >
                Iniciar Sesión
              </Link>
            </>
          )}
        </div>
      </nav>
      {/* Menú móvil (visible en pantallas pequeñas) */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Rent</span>
              <Image
                src="/travel-nest-logo.png"
                alt="Logo de Travel Nest"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold text-gray-900 hover:bg-gray-50">
                    Panel
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="size-5 flex-none text-gray-400 group-data-open:-rotate-180"
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {products.map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as={Link}
                        href={item.href}
                        className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>
                <Link
                  href="/productos"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Productos
                </Link>
                <Link
                  href="/categorias"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Categorias
                </Link>
                <Link
                  href="/contacto"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Contacto
                </Link>
              </div>
              <div className="py-6">
                {isLoggedIn ? (
                  <>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        Panel Admin
                      </Link>
                    )}
                    <div className="-mx-3 flex items-center gap-x-2 rounded-lg px-3 py-2.5">
                      <div className="flex size-8 items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                        {initials}
                      </div>
                      <span className="text-base font-semibold text-gray-900">{displayName}</span>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-red-600 hover:bg-gray-50"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Crear Cuenta
                    </Link>
                    <Link
                      href="/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Iniciar Sesión
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};

export default Header;