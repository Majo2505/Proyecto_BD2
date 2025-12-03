// joyeria-frontend/src/app/admin/orders/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { Order } from '@/types'; // Usamos la interfaz Order existente
import Link from 'next/link';
import { RefreshCw } from 'lucide-react';

// -----------------------------------------------------------------
// 💡 Página de Historial de Órdenes
// -----------------------------------------------------------------
export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Función principal para cargar los datos (GET /orders)
    const loadOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/orders');
            // Asume que el backend devuelve un array, y lo ordenamos por número de orden descendente
            const sortedOrders = response.data.sort((a: Order, b: Order) => b.orderNumber - a.orderNumber);
            setOrders(sortedOrders);
        } catch (err: any) {
            setError('Fallo al cargar el historial de órdenes.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Entregado': return 'bg-green-100 text-green-800';
            case 'Enviado': return 'bg-blue-100 text-blue-800';
            case 'Procesando': return 'bg-yellow-100 text-yellow-800';
            case 'Cancelado': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="text-center text-2xl font-semibold mt-10">Cargando historial de órdenes...</div>;
    if (error) return <div className="text-center text-red-500 font-bold mt-10">Error de Conexión: {error}</div>;

    return (
        <div className="py-10">
            <h1 className="text-4xl font-extrabold mb-6 text-gray-800">🧾 Historial de Órdenes</h1>
            <p className="text-gray-600 mb-8">Lista de todas las órdenes creadas mediante el proceso de checkout.</p>

            <div className="flex justify-between items-center mb-6">
                <Link href="/admin" className="text-indigo-600 hover:text-indigo-800 font-bold">
                    ← Volver al Panel
                </Link>
                <button
                    onClick={loadOrders}
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition flex items-center space-x-2"
                >
                    <RefreshCw className="w-4 h-4" /> <span>Recargar Órdenes</span>
                </button>
            </div>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"># Orden</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario ID</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                        </tr>
                    </thead>
                    
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.length > 0 ? orders.map((order) => {
                            // --- COMIENZO DE LA CORRECCIÓN ---
                            // 1. Determina el ID. Si order.userId es un objeto, usa order.userId._id. Si es string, úsalo directamente.
                            //    Usamos 'any' temporalmente debido a la complejidad de la interfaz 'Order' que definimos previamente.
                            const actualUserId = typeof order.userId === 'string' 
                                ? order.userId 
                                : (order.userId as any)?._id || 'N/A';
                            // --- FIN DE LA CORRECCIÓN ---

                            return (
                                <tr key={order._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">{order.orderNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900">${order.orderTotal.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.items.length} productos</td>
                                    {/* USA LA VARIABLE CORREGIDA AQUÍ */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{actualUserId.slice(-6)}...</td>
                                    {/* FIN DE LA CORRECCIÓN */}
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr><td colSpan={5} className="text-center py-8 text-gray-500">No hay órdenes registradas. ¡Haz un checkout!</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}