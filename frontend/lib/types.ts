export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    image?: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    salePrice?: number;
    images: string[];
    categoryId: string;
    category?: Category;
    stock: number;
    isActive: boolean;
    metal?: string;
    purity?: string;
    weight?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
}

export interface CartItem {
    id: string;
    userId: string;
    productId: string;
    product: Product;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface WishlistItem {
    id: string;
    userId: string;
    productId: string;
    product: Product;
    createdAt: Date;
}

export interface Address {
    id: string;
    userId: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
}

export interface Order {
    id: string;
    userId: string;
    addressId: string;
    orderNumber: string;
    subtotal: number;
    tax: number;
    shippingCharge: number;
    total: number;
    status: string;
    paymentStatus: string;
    paymentMethod?: string;
    orderItems: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    product: Product;
    quantity: number;
    price: number;
}
