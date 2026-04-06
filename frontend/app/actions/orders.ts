'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createOrderAction(orderData: {
    address: {
        name: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        pincode: string;
    },
    paymentMethod: string;
}) {
    try {
        const user = await getCurrentUser();
        if (!user) return { error: 'Unauthorized' };

        // Get cart items
        const cartItems = await prisma.cartItem.findMany({
            where: { userId: user.id },
            include: { product: true }
        });

        if (cartItems.length === 0) return { error: 'Cart is empty' };

        // Calculate totals
        const subtotal = cartItems.reduce((sum, item) => {
            const price = item.product.salePrice || item.product.price;
            return sum + (price * item.quantity);
        }, 0);

        const tax = subtotal * 0.03; // 3% GST
        const shippingCharge = subtotal > 25000 ? 0 : 500;
        const total = subtotal + tax + shippingCharge;

        // Create Address
        const address = await prisma.address.create({
            data: {
                userId: user.id,
                ...orderData.address,
                isDefault: true // Set this as latest order address
            }
        });

        // Generate Order Number
        const orderCount = await prisma.order.count();
        const orderNumber = `SHJ-${new Date().getFullYear()}-${1001 + orderCount}`;

        // Create Order with Items (Transaction)
        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId: user.id,
                    addressId: address.id,
                    orderNumber,
                    subtotal,
                    tax,
                    shippingCharge,
                    total,
                    paymentMethod: orderData.paymentMethod,
                    status: 'pending',
                    paymentStatus: orderData.paymentMethod === 'COD' ? 'pending' : 'paid',
                    orderItems: {
                        create: cartItems.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.salePrice || item.product.price,
                        }))
                    }
                }
            });

            // Clear Cart
            await tx.cartItem.deleteMany({
                where: { userId: user.id }
            });

            // Update Stock
            for (const item of cartItems) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                });
            }

            return newOrder;
        });

        revalidatePath('/orders');
        revalidatePath('/cart');
        
        return { success: true, orderId: order.id, orderNumber: order.orderNumber };
    } catch (error) {
        console.error('Create order error:', error);
        return { error: 'Failed to place order' };
    }
}

export async function getUserOrdersAction() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { error: 'Unauthorized' };
        }

        const orders = await prisma.order.findMany({
            where: {
                userId: user.id,
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                address: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return { orders: JSON.parse(JSON.stringify(orders)) };
    } catch (error) {
        console.error('Get user orders action error:', error);
        return { orders: [], error: 'Internal server error' };
    }
}

export async function getOrderDetailsAction(orderId: string) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { error: 'Unauthorized' };
        }

        const order = await prisma.order.findUnique({
            where: {
                id: orderId,
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                address: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                }
            },
        });

        if (!order) {
            return { error: 'Order not found' };
        }

        if (order.userId !== user.id && user.role.toLowerCase() !== 'admin') {
            return { error: 'Unauthorized' };
        }

        return { order: JSON.parse(JSON.stringify(order)) };
    } catch (error) {
        console.error('Get order details action error:', error);
        return { error: 'Internal server error' };
    }
}
