// joyeria-frontend/src/app/admin/page.tsx

'use client'; 

import React, { useState, FormEvent } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';

// -----------------------------------------------------------------
// 💡 Componente para Crear Usuario (POST /users)
// -----------------------------------------------------------------
const CreateUserForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '', // Nuevo campo
        address: '',  // Nuevo campo
        role: 'cliente', // Nuevo campo con valor por defecto
    });
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage('');

        // Validación de campos obligatorios
        if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.address.trim() || !formData.role.trim()) {
            setMessage("❌ Todos los campos son obligatorios.");
            return;
        }

        try {
            // El backend ahora recibe todos los campos validados
            const response = await axiosInstance.post('/users', formData);
            setMessage(`✅ Usuario '${response.data.name}' creado con éxito! ID: ${response.data._id}`);
            
            // Limpiamos los campos, manteniendo 'cliente' como rol por defecto
            setFormData({ name: '', email: '', password: '', address: '', role: 'cliente' }); 
            
        } catch (error: any) {
            // Manejamos errores específicos de validación si el backend los devuelve
            const errorMessage = error.response?.data?.message 
                ? (Array.isArray(error.response.data.message) ? error.response.data.message.join(', ') : error.response.data.message) 
                : error.message;
            setMessage(`❌ Error al crear usuario: ${errorMessage}`);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-yellow-200">
            <h3 className="text-2xl font-bold mb-4 text-yellow-700 flex items-center space-x-2">
                <UserPlus className="w-6 h-6" /> <span>Crear Nuevo Usuario</span>
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Campos de Nombre y Email */}
                <input type="text" id="name" value={formData.name} onChange={handleChange} required placeholder="Nombre"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-yellow-500 focus:border-yellow-500"/>
                
                <input type="email" id="email" value={formData.email} onChange={handleChange} required placeholder="Email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-yellow-500 focus:border-yellow-500"/>

                {/* Campo Contraseña (requerido) */}
                <input type="password" id="password" value={formData.password} onChange={handleChange} required placeholder="Contraseña (ej: 123456)"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-yellow-500 focus:border-yellow-500"/>

                {/* Campo Dirección (requerido) */}
                <input type="text" id="address" value={formData.address} onChange={handleChange} required placeholder="Dirección de Envío"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-yellow-500 focus:border-yellow-500"/>

                {/* Campo Rol (requerido y validado) */}
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rol</label>
                    <select id="role" value={formData.role} onChange={handleChange as any} required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-yellow-500 focus:border-yellow-500">
                        <option value="cliente">Cliente</option>
                        <option value="admin">Administrador</option>
                        <option value="vendedor">Vendedor</option>
                    </select>
                </div>
                
                <button
                    type="submit"
                    className="w-full bg-yellow-600 text-white font-semibold py-3 rounded-md hover:bg-yellow-700 transition"
                >
                    Guardar Usuario
                </button>
            </form>
            {message && <p className={`mt-4 p-3 rounded ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</p>}
        </div>
    );
};
// -----------------------------------------------------------------
// 💡 Componente para Crear Categoría (POST /categories) - COPIADO DE LA RESPUESTA ANTERIOR
// -----------------------------------------------------------------
const CreateCategoryForm: React.FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage('');
        if (!name.trim() || !description.trim()) {
            setMessage("❌ Todos los campos son obligatorios.");
            return;
        }
        try {
            const response = await axiosInstance.post('/categories', { name, description }); 
            setMessage(`✅ Categoría '${response.data.name}' creada con éxito! ID: ${response.data._id}`);
            setName('');
            setDescription(''); 
        } catch (error: any) {
            setMessage(`❌ Error al crear categoría: ${error.response?.data?.message || error.message}`);
        }
    };
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-200">
            <h3 className="text-2xl font-bold mb-4 text-indigo-700">Crear Nueva Categoría</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">Nombre de la Categoría</label>
                    <input
                        type="text"
                        id="categoryName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div>
                    <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                        id="categoryDescription"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        required 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-md hover:bg-indigo-700 transition"
                >
                    Guardar Categoría
                </button>
            </form>
            {message && <p className={`mt-4 p-3 rounded ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</p>}
        </div>
    );
};

// -----------------------------------------------------------------
// 💡 Componente para Crear Producto (POST /products) - COPIADO DE LA RESPUESTA ANTERIOR
// -----------------------------------------------------------------
const CreateProductForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', stock: '', categoryId: '', 
    });
    const [message, setMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage('');
        
        if (!formData.name || !formData.description || !formData.categoryId || !formData.price || !formData.stock) {
            setMessage("❌ Todos los campos son obligatorios.");
            return;
        }

        const priceNum = parseFloat(formData.price);
        const stockNum = parseInt(formData.stock);
        
        if (isNaN(priceNum) || priceNum < 0 || isNaN(stockNum) || stockNum < 0) {
            setMessage("❌ Precio y Stock deben ser números válidos y no negativos.");
            return;
        }
        
        if (!formData.categoryId.trim()) {
            setMessage("❌ ¡Error! Necesitas un CategoryId existente para crear un producto.");
            return;
        }

        try {
            const payload = { ...formData, price: priceNum, stock: stockNum };
            const response = await axiosInstance.post('/products', payload);
            setMessage(`🎉 Producto '${response.data.name}' creado con éxito! Stock inicial: ${response.data.stock}`);
            setFormData({ name: '', description: '', price: '', stock: '', categoryId: formData.categoryId }); 
        } catch (error: any) {
            setMessage(`❌ Error al crear producto: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-red-200">
            <h3 className="text-2xl font-bold mb-4 text-red-700">Crear Nuevo Producto</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-red-700">ID de Categoría Existente</label>
                    <input
                        type="text" id="categoryId" value={formData.categoryId} onChange={handleChange} required
                        className="mt-1 block w-full border border-red-300 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500"
                    />
                </div>

                {[
                    { id: 'name', type: 'text' }, 
                    { id: 'description', type: 'text' }, 
                    { id: 'price', type: 'text', inputMode: 'decimal' }, 
                    { id: 'stock', type: 'text', inputMode: 'numeric' }
                ].map(({ id, type, inputMode }) => (
                    <div key={id}>
                        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{id.charAt(0).toUpperCase() + id.slice(1)}</label>
                        <input
                            type={type as any} id={id} value={(formData as any)[id]} onChange={handleChange} required
                            inputMode={inputMode as any}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                ))}

                <button type="submit" className="w-full bg-red-600 text-white font-semibold py-3 rounded-md hover:bg-red-700 transition">
                    Guardar Producto
                </button>
            </form>
            {message && <p className={`mt-4 p-3 rounded ${message.startsWith('🎉') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</p>}
        </div>
    );
};

// Página de Administración Principal
export default function AdminPage() {
    return (
        <div className="max-w-4xl mx-auto py-10">
            <h1 className="text-5xl font-extrabold mb-8 text-center text-gray-800">🛠️ Panel de Administración (Datos Iniciales)</h1>
            <p className="text-center text-lg text-gray-600 mb-10">Use estos formularios para crear Usuarios, Categorías y Productos.</p>

            {/* Enlaces a las páginas de gestión */}
            <div className="flex justify-center space-x-4 mb-10">
                <Link href="/admin/manage-products" className="bg-pink-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-pink-700 transition">
                    Gestionar Productos
                </Link>
                <Link href="/admin/manage-categories" className="bg-blue-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition">
                    Gestionar Categorías
                </Link>
                <Link href="/admin/orders" className="bg-green-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-green-700 transition">
                    Ver Órdenes
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <CreateUserForm /> {/* NUEVO FORMULARIO */}
                    <CreateCategoryForm />
                </div>
                <CreateProductForm />
            </div>

            <div className="mt-10 text-center">
                <Link href="/" className="text-indigo-600 hover:text-indigo-800 font-bold text-lg">
                    ← Volver a la Tienda
                </Link>
            </div>
        </div>
    );
}