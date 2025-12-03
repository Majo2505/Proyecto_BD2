// joyeria-frontend/lib/CartService.ts

import axiosInstance from './axiosInstance';
import { Cart, Order, CreateOrderPayload } from '@/types';

// *** ATENCIÓN: Necesitas cambiar este ID por un ID de carrito REAL y EXISTENTE en tu DB ***
// (Puedes crearlo con Postman: POST http://localhost:3000/carts, y usar el ID que devuelve)
export const CART_ID_MOCK = '69309e1ef38f10ace5e0604c'; // 

const CartService = {
    
    /**
     * Agrega un producto al carrito.
     * Llama a: POST /carts/:id/add-product
     */
    addProduct: async (productId: string, quantity: number = 1, cartId: string = CART_ID_MOCK): Promise<Cart> => {
        try {
            const response = await axiosInstance.post(`/carts/${cartId}/add-product`, {
                productId: productId,
                quantity: quantity,
            });
            // El backend de NestJS devuelve el carrito actualizado
            return response.data;
        } catch (error) {
            console.error('Error al añadir producto al carrito:', error);
            // El error 404/400 del backend será capturado y se lanzará
            throw new Error('No se pudo añadir el producto al carrito. Verifica ID de carrito y producto.');
        }
    },
    
    /**
     * Realiza el checkout (crea la orden).
     * Llama a: POST /orders
     */
    checkout: async (payload: CreateOrderPayload): Promise<Order> => {
        try {
            const response = await axiosInstance.post('/orders', payload);
            return response.data;
        } catch (error) {
            console.error('Error durante el checkout:', error);
            throw new Error('El checkout falló.');
        }
    },

    // Aquí puedes añadir findOne, removeProduct, etc.
};

export default CartService;