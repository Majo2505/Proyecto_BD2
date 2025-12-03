// joyeria-frontend/app/layout.tsx
import './globals.css'; // Esto contiene las directivas de Tailwind 
import Header from './components/layout/Header';


export const metadata = {
  title: 'Joyería Shop',
  description: 'Tienda de Joyería con NestJS y Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <Header /> 
        <main className="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6">
          {children} 
        </main>
        <footer className="w-full bg-gray-800 text-white p-4 text-center mt-auto">
            © 2025 Joyería Shop
        </footer>
      </body>
    </html>
  );
}