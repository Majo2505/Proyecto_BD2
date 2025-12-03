// joyeria-frontend/types/index.ts

// --- Tipos de Producto ---
export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryName: string;
    categoryId: string; // Como string para el frontend
}

// --- Tipos de Carrito ---
export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Cart {
    _id: string;
    products: CartItem[];
    total: number;
    userId?: string;
}

// --- Tipos de Orden (Checkout) ---
export interface CreateOrderPayload {
    userId: string;
    shippingAddress: string;
    items: { productId: string; quantity: number }[];
}

export interface OrderItem extends CartItem {}

export interface Order {
    _id: string;
    orderNumber: number;
    userId: string;
    shippingAddress: string;
    items: OrderItem[];
    orderTotal: number;
    paymentStatus: 'Aprobado' | 'Fallido' | 'Pendiente' | string;
    status: 'Pendiente' | 'Procesando' | 'Enviado' | 'Entregado' | 'Cancelado' | string;
    createdAt: string;
}