// joyeria-frontend/src/app/components/layout/Header.tsx

'use client'; 

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Gem, User } from 'lucide-react'; // Iconos

// Definición de las rutas principales
const navLinks = [
  { name: 'Tienda', href: '/' },
  { name: 'Ofertas', href: '/ofertas' },
  { name: 'Contacto', href: '/contacto' },
];

const Header: React.FC = () => {
  // Nota: Usamos Link de next/link para la navegación
  return (
    // Header fijo en la parte superior, con sombra y fondo blanco
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO (Ruta principal) */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 text-xl font-extrabold text-indigo-600 hover:text-indigo-700 transition duration-150">
              <Gem className="w-6 h-6" />
              <span>Joyería Shop</span>
            </Link>
          </div>

          {/* Navegación Principal (Oculta en móviles, visible en md y superior) */}
          <nav className="hidden md:flex md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-indigo-600 font-medium transition duration-150"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Íconos de Usuario y Carrito */}
          <div className="flex items-center space-x-4">
            
            {/* Ícono de Usuario/Perfil */}
            <Link href="/perfil" className="text-gray-600 hover:text-indigo-600 p-2 rounded-full transition duration-150">
                <User className="w-6 h-6" />
            </Link>

            {/* Ícono de Carrito */}
            <Link 
                href="/carrito" 
                className="relative text-gray-600 hover:text-indigo-600 p-2 rounded-full transition duration-150"
            >
              <ShoppingCart className="w-6 h-6" />
              {/* Contador del carrito (Hardcodeado por ahora) */}
              <span 
                  className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"
              >
                  3 {/* <-- Cambiar por el estado real del carrito */}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;