// joyeria-frontend/src/lib/ProductService.ts

import axiosInstance from './axiosInstance';
import { Product } from '@/types'; 

// Define los campos que se pueden actualizar para evitar errores de tipo
export type UpdateProductPayload = {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    categoryId?: string; 
};

const ProductService = {
    /**
     * Obtiene la lista completa de productos.
     * Llama a: GET /products
     */
    findAll: async (): Promise<Product[]> => {
        try {
            const response = await axiosInstance.get('/products');
            return response.data;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw new Error('No se pudo cargar la lista de productos.');
        }
    },
    
    /**
     * Actualiza un producto existente.
     * Llama a: PATCH /products/:id
     */
    update: async (id: string, payload: UpdateProductPayload): Promise<Product> => {
        try {
            const response = await axiosInstance.patch(`/products/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar producto ${id}:`, error);
            throw new Error('No se pudo actualizar el producto.');
        }
    },

    /**
     * Elimina un producto.
     * Llama a: DELETE /products/:id
     */
    delete: async (id: string): Promise<{ message: string }> => {
        try {
            await axiosInstance.delete(`/products/${id}`);
            return { message: `Producto ${id} eliminado con éxito.` };
        } catch (error) {
            console.error(`Error al eliminar producto ${id}:`, error);
            throw new Error('No se pudo eliminar el producto.');
        }
    },
};

export default ProductService;