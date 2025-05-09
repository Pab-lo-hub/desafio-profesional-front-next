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
  HeartIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon, PhoneIcon, PlayCircleIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@headlessui/react";

const products = [
  { name: "Categorías", description: "Get a better understanding of your traffic", href: "/categorias", icon: ChartPieIcon },
  { name: "Productos", description: "Speak directly to your customers", href: "/productos", icon: CursorArrowRaysIcon },
  { name: "Security", description: "Your customers’ data will be safe and secure", href: "#", icon: FingerPrintIcon },
  { name: "Integrations", description: "Connect with third-party tools", href: "#", icon: SquaresPlusIcon },
  { name: "Automations", description: "Build strategic funnels that will convert", href: "#", icon: ArrowPathIcon },
];

const callsToAction = [
  { name: "Watch demo", href: "#", icon: PlayCircleIcon },
  { name: "Contact sales", href: "#", icon: PhoneIcon },
];

interface HeaderProps {
  className?: string;
}

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

const Header: React.FC<HeaderProps> = ({ className = "" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated";
  const isAdmin = isLoggedIn && session?.user?.role === "admin";

  const userNombre = session?.user?.nombre || undefined;
  const userApellido = session?.user?.apellido || undefined;
  const userEmail = session?.user?.email || undefined;
  const displayName = userNombre && userApellido ? `${userNombre} ${userApellido}` : userEmail || "Usuario";
  const initials = getInitials(userNombre, userApellido, userEmail);

  return (
    <header className={`fixed top-0 left-0 w-full bg-white shadow-md z-50 ${className}`}>
      <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-1 lg:px-4">
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
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-x-4">
              <div className="flex items-center gap-x-2">
                <div className="flex size-10 items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                  {initials}
                </div>
                <span className="text-sm font-semibold text-gray-900">{displayName}</span>
              </div>
              <Link
                href="/favorites"
                className="bg-transparent hover:bg-blue-400 text-blue-400 font-semibold hover:text-white py-1 px-2 border border-blue-300 hover:border-transparent rounded text-sm flex items-center"
              >
                <HeartIcon className="size-5 mr-1" />
                Favoritos
              </Link>
              <Link
                href="/reservations"
                className="bg-transparent hover:bg-blue-400 text-blue-400 font-semibold hover:text-white py-1 px-2 border border-blue-300 hover:border-transparent rounded text-sm"
              >
                Mis Reservas
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="bg-transparent hover:bg-blue-400 text-blue-400 font-semibold hover:text-white py-1 px-2 border border-blue-300 hover:border-transparent rounded text-sm"
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
                    <Link
                      href="/favorites"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50 flex items-center"
                    >
                      <HeartIcon className="size-5 mr-2" />
                      Favoritos
                    </Link>
                    <Link
                      href="/reservations"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                    >
                      Mis Reservas
                    </Link>
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