// joyeria-frontend/src/app/admin/manage-products/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ProductService, { UpdateProductPayload } from '@/lib/ProductService';
import { Product } from '@/types';
import Link from 'next/link';
import { Trash2, Edit, X } from 'lucide-react';

// -----------------------------------------------------------------
// 💡 Componente Modal para Actualizar Producto
// -----------------------------------------------------------------
interface EditModalProps {
    product: Product;
    onClose: () => void;
    onSave: (id: string, payload: UpdateProductPayload) => void;
}

const EditModal: React.FC<EditModalProps> = ({ product, onClose, onSave }) => {
    const [formData, setFormData] = useState<UpdateProductPayload>({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        categoryId: product.categoryId,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [id]: id === 'price' || id === 'stock' ? Number(value) : value 
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validación básica (puedes agregar más aquí)
        if (formData.name && formData.price && formData.stock && formData.categoryId) {
            onSave(product._id, formData);
        }
    };

    return (
        // Overlay y Modal
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-2xl font-bold">Editar {product.name}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Campos a editar */}
                    {[
                        { id: 'name', label: 'Nombre', type: 'text', value: formData.name },
                        { id: 'description', label: 'Descripción', type: 'textarea', value: formData.description },
                        { id: 'price', label: 'Precio', type: 'number', value: formData.price, step: 0.01 },
                        { id: 'stock', label: 'Stock', type: 'number', value: formData.stock, step: 1 },
                        { id: 'categoryId', label: 'ID Categoría', type: 'text', value: formData.categoryId },
                    ].map((field) => (
                        <div key={field.id}>
                            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">{field.label}</label>
                            {field.type === 'textarea' ? (
                                <textarea
                                    id={field.id}
                                    value={field.value as string}
                                    onChange={handleChange}
                                    required
                                    rows={2}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    id={field.id}
                                    value={field.value !== undefined ? String(field.value) : ''}
                                    onChange={handleChange}
                                    required
                                    step={field.step}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
                                />
                            )}
                        </div>
                    ))}
                    
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white font-bold py-2 rounded-md hover:bg-green-700 transition"
                    >
                        Guardar Cambios
                    </button>
                </form>
            </div>
        </div>
    );
};

// -----------------------------------------------------------------
// 💡 Página de Gestión de Productos
// -----------------------------------------------------------------
export default function ManageProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Función principal para cargar los datos
    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const productsData = await ProductService.findAll();
            setProducts(productsData);
        } catch (err: any) {
            setError(err.message || 'Fallo al cargar los productos para gestión.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    // Manejar la eliminación (DELETE)
    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`¿Estás seguro de que quieres eliminar el producto: ${name}?`)) return;

        setMessage(null);
        try {
            await ProductService.delete(id);
            setMessage(`🗑️ Producto "${name}" eliminado con éxito.`);
            // Recargar la lista de productos
            loadProducts(); 
        } catch (err: any) {
            setMessage(err.message || 'Error al eliminar el producto.');
        }
    };
    
    // Manejar la actualización (PATCH) desde el modal
    const handleUpdate = async (id: string, payload: UpdateProductPayload) => {
        setMessage(null);
        setEditingProduct(null); // Cerrar modal inmediatamente
        try {
            await ProductService.update(id, payload);
            setMessage(`✨ Producto actualizado con éxito.`);
            // Recargar la lista de productos
            loadProducts(); 
        } catch (err: any) {
            setMessage(err.message || 'Error al actualizar el producto.');
        }
    };

    if (loading) return <div className="text-center text-2xl font-semibold mt-10">Cargando gestión de productos...</div>;
    if (error) return <div className="text-center text-red-500 font-bold mt-10">Error de Conexión: {error}</div>;

    return (
        <div className="py-10">
            <h1 className="text-4xl font-extrabold mb-6 text-gray-800">📋 Gestión de Productos (CRUD)</h1>
            <p className="text-gray-600 mb-8">Utilice esta interfaz para ver, actualizar y eliminar productos existentes en la base de datos.</p>

            <div className="flex justify-between items-center mb-6">
                <Link href="/admin" className="text-indigo-600 hover:text-indigo-800 font-bold">
                    ← Volver a Crear Datos
                </Link>
                <button
                    onClick={loadProducts}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                >
                    Recargar Lista
                </button>
            </div>

            {message && (
                <div className={`p-3 mb-4 rounded font-medium ${message.includes('éxito') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.length > 0 ? products.map((product) => (
                            <tr key={product._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product._id.slice(-6)}...</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price.toFixed(2)}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {product.stock}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => setEditingProduct(product)}
                                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md border border-indigo-200"
                                        title="Editar Producto"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id, product.name)}
                                        className="text-red-600 hover:text-red-900 p-1 rounded-md border border-red-200"
                                        title="Eliminar Producto"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={5} className="text-center py-8 text-gray-500">No hay productos en la base de datos.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Renderizar Modal si hay un producto en edición */}
            {editingProduct && (
                <EditModal
                    product={editingProduct}
                    onClose={() => setEditingProduct(null)}
                    onSave={handleUpdate}
                />
            )}
        </div>
    );
}