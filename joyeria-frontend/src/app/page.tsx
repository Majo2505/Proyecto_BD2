// joyeria-frontend/src/app/page.tsx
'use client'; // Esto indica que es un componente que se ejecuta en el navegador

import React, { useEffect, useState, useCallback } from 'react';
import ProductService from '@/lib/ProductService'; // Importa el servicio de productos
import CartService, { CART_ID_MOCK } from '@/lib/CartService'; // Importa el servicio de carrito y el ID mockeado
import { Product, Cart, CreateOrderPayload, Order, CartItem } from '@/types'; // Importa las interfaces

// -------------------------------------------------------------
// *** ATENCIÓN: ID de Usuario Real para el Checkout ***
// Necesitas el ID de un usuario EXISTENTE en tu DB para la orden
const MOCK_USER_ID = '69306327de7391cf300111ca'; // ¡REEMPLAZAR ESTA CADENA!
const MOCK_SHIPPING_ADDRESS = 'Av. Principal #123, Ciudad de Ejemplo';
// -------------------------------------------------------------

// Componente para mostrar la tarjeta de cada producto
export const ProductCard: React.FC<{ product: Product, onAddToCart: (id: string) => void }> = ({ product, onAddToCart }) => {
    return (
        <div className="border border-gray-200 p-4 rounded-lg shadow-md bg-white space-y-3">
            <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-500 truncate">{product.description}</p>
            <p className="text-3xl font-extrabold text-red-600">${product.price.toFixed(2)}</p>
            <p className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                Stock: {product.stock > 0 ? product.stock : 'Agotado'}
            </p>

            <button 
                onClick={() => onAddToCart(product._id)}
                disabled={product.stock <= 0}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-md transition duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
            </button>
        </div>
    );
};


export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    // Inicializamos el carrito con el ID mockeado, que se usará para todas las peticiones POST/PATCH
    const [cart, setCart] = useState<Cart>({ _id: CART_ID_MOCK, products: [], total: 0 }); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null); // Mensajes de éxito/error

    // Función para cargar los productos del backend
    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const productsData = await ProductService.findAll();
            setProducts(productsData);
        } catch (err: any) {
            // Muestra el error de conexión si falla el endpoint /products
            setError(err.message || 'Fallo al cargar los productos desde el backend.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);


    // Función para añadir un producto al carrito
    const handleAddToCart = async (productId: string) => {
        setMessage(null);
        try {
            // Llama al servicio de carrito para añadir el producto.
            const updatedCart = await CartService.addProduct(productId);
            
            // Actualiza el estado del carrito con la respuesta del backend
            setCart(updatedCart);
            
            // Muestra un mensaje de éxito
            const addedItem = updatedCart.products.find(p => p.productId === productId);
            setMessage(`🎉 ${addedItem?.name} añadido. Total: $${updatedCart.total.toFixed(2)}`);
        } catch (err: any) {
            setMessage(err.message || 'Error al añadir al carrito. Verifica IDs y stock.');
        }
    };
    
    // Función para finalizar la compra (checkout)
    const handleCheckout = async () => {
        if (cart.products.length === 0) {
            setMessage('El carrito está vacío. ¡Añade algo para comprar!');
            return;
        }

        const orderPayload: CreateOrderPayload = {
            userId: MOCK_USER_ID, // Usamos el ID de usuario de prueba
            shippingAddress: MOCK_SHIPPING_ADDRESS,
            items: cart.products.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
            }))
        };

        try {
            // Llama al servicio de checkout (POST /orders)
            const newOrder: Order = await CartService.checkout(orderPayload);
            setMessage(`✅ Orden #${newOrder.orderNumber} creada. ID: ${newOrder._id}`);
            
            // Limpiar el carrito después de la compra exitosa
            setCart({ ...cart, products: [], total: 0 }); 

        } catch (err: any) {
            setMessage(err.message || 'Error durante el checkout. Revise los IDs de usuario y carrito.');
        }
    };

    if (loading) return <div className="text-center text-2xl font-semibold mt-10 text-indigo-600">Cargando Joyería...</div>;
    if (error) return <div className="text-center text-red-500 font-bold mt-10">Error de Conexión: {error}</div>;

    // --- Renderizado de la Tienda ---
    return (
        <div className="space-y-10">
            <h2 className="text-4xl font-extrabold text-gray-900 border-b-4 border-indigo-500 pb-3">💎 Catálogo de Productos</h2>

            {/* Panel de Carrito y Mensajes */}
            <div className="p-5 bg-white shadow-xl rounded-lg border border-indigo-100 sticky top-4 z-10">
                <h3 className="text-2xl font-bold mb-4 flex justify-between items-center">
                    <span>🛒 Tu Carrito</span>
                    <span className="text-indigo-600">${cart.total.toFixed(2)}</span>
                </h3>
                
                {message && (
                    <div className={`p-3 mb-4 rounded font-medium ${message.startsWith('✅') || message.startsWith('🎉') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}
                
                {cart.products.length > 0 ? (
                    <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                        {cart.products.map((item: CartItem) => (
                            <div key={item.productId} className="flex justify-between text-sm border-b pb-1">
                                <span className="text-gray-700">{item.name} x {item.quantity}</span>
                                <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 mb-4">El carrito está vacío. ¡Añade tu primera joya!</p>
                )}

                <button
                    onClick={handleCheckout}
                    disabled={cart.products.length === 0}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                    Finalizar Compra ({cart.products.length} productos)
                </button>
            </div>

            {/* Lista de Productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        onAddToCart={handleAddToCart}
                    />
                ))}
            </div>
        </div>
    );
}