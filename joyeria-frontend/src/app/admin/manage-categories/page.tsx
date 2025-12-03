// joyeria-frontend/src/app/admin/manage-categories/page.tsx
'use client';

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import Link from 'next/link';
import { Trash2, Edit, X } from 'lucide-react';

// Tipo simple para Categoría (asume que el backend solo tiene _id, name, description)
interface Category {
    _id: string;
    name: string;
    description: string;
}

// -----------------------------------------------------------------
// 💡 Componente Modal para Actualizar Categoría
// -----------------------------------------------------------------
interface EditCategoryModalProps {
    category: Category;
    onClose: () => void;
    onSave: (id: string, name: string, description: string) => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ category, onClose, onSave }) => {
    const [name, setName] = useState(category.name);
    const [description, setDescription] = useState(category.description);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(category._id, name, description);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h2 className="text-2xl font-bold">Editar Categoría</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><X /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"/>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={3}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"/>
                    </div>
                    
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition">
                        Guardar Cambios
                    </button>
                </form>
            </div>
        </div>
    );
};

// -----------------------------------------------------------------
// 💡 Página de Gestión de Categorías
// -----------------------------------------------------------------
export default function ManageCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // Función principal para cargar los datos (GET /categories)
    const loadCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get('/categories');
            setCategories(response.data);
        } catch (err: any) {
            setError('Fallo al cargar las categorías desde el backend.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    // Manejar la eliminación (DELETE /categories/:id)
    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`¿Estás seguro de eliminar la categoría: ${name}?`)) return;

        setMessage(null);
        try {
            await axiosInstance.delete(`/categories/${id}`);
            setMessage(`🗑️ Categoría "${name}" eliminada con éxito.`);
            loadCategories(); 
        } catch (err: any) {
            setMessage('Error al eliminar categoría. Podría tener productos asociados.');
        }
    };
    
    // Manejar la actualización (PATCH /categories/:id)
    const handleUpdate = async (id: string, name: string, description: string) => {
        setMessage(null);
        setEditingCategory(null);
        try {
            await axiosInstance.patch(`/categories/${id}`, { name, description });
            setMessage(`✨ Categoría actualizada con éxito.`);
            loadCategories(); 
        } catch (err: any) {
            setMessage('Error al actualizar la categoría.');
        }
    };

    if (loading) return <div className="text-center text-2xl font-semibold mt-10">Cargando gestión de categorías...</div>;
    if (error) return <div className="text-center text-red-500 font-bold mt-10">Error de Conexión: {error}</div>;

    return (
        <div className="py-10">
            <h1 className="text-4xl font-extrabold mb-6 text-gray-800">📋 Gestión de Categorías (CRUD)</h1>
            <p className="text-gray-600 mb-8">Utilice esta interfaz para ver, actualizar y eliminar categorías.</p>

            <div className="flex justify-between items-center mb-6">
                <Link href="/admin" className="text-indigo-600 hover:text-indigo-800 font-bold">
                    ← Volver a Crear Datos
                </Link>
                <button
                    onClick={loadCategories}
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                >
                    Recargar Lista
                </button>
            </div>

            {message && (<div className={`p-3 mb-4 rounded font-medium ${message.includes('éxito') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>)}

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.length > 0 ? categories.map((category) => (
                            <tr key={category._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category._id.slice(-6)}...</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{category.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => setEditingCategory(category)}
                                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md border border-indigo-200"
                                        title="Editar Categoría"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category._id, category.name)}
                                        className="text-red-600 hover:text-red-900 p-1 rounded-md border border-red-200"
                                        title="Eliminar Categoría"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={4} className="text-center py-8 text-gray-500">No hay categorías en la base de datos.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Renderizar Modal */}
            {editingCategory && (
                <EditCategoryModal
                    category={editingCategory}
                    onClose={() => setEditingCategory(null)}
                    onSave={handleUpdate}
                />
            )}
        </div>
    );
}