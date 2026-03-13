'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getAdminOrdersAction() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role.toLowerCase() !== 'admin') {
            return { error: 'Unauthorized' };
        }

        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                orderItems: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return { orders: JSON.parse(JSON.stringify(orders)) };
    } catch (error) {
        console.error('Get admin orders action error:', error);
        return { orders: [], error: 'Internal server error' };
    }
}

export async function updateOrderStatusAction(id: string, status: string) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role.toLowerCase() !== 'admin') {
            return { error: 'Unauthorized' };
        }

        const order = await prisma.order.update({
            where: { id },
            data: { status },
        });

        revalidatePath('/admin/orders');
        return { success: true, order: JSON.parse(JSON.stringify(order)) };
    } catch (error) {
        console.error('Update order status action error:', error);
        return { error: 'Internal server error' };
    }
}

export async function getAdminUsersAction() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role.toLowerCase() !== 'admin') {
            return { error: 'Unauthorized' };
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                phone: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return { users: JSON.parse(JSON.stringify(users)) };
    } catch (error) {
        console.error('Get admin users action error:', error);
        return { users: [], error: 'Internal server error' };
    }
}

export async function updateUserRoleAction(id: string, role: string) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role.toLowerCase() !== 'admin') {
            return { error: 'Unauthorized' };
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { role },
        });

        revalidatePath('/admin/users');
        return { success: true, user: JSON.parse(JSON.stringify(updatedUser)) };
    } catch (error) {
        console.error('Update user role action error:', error);
        return { error: 'Internal server error' };
    }
}

export async function getAdminProductAction(id: string) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role.toLowerCase() !== 'admin') {
            return { error: 'Unauthorized' };
        }

        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true },
        });

        return { product: JSON.parse(JSON.stringify(product)) };
    } catch (error) {
        console.error('Get admin product action error:', error);
        return { error: 'Internal server error' };
    }
}

export async function getAdminCategoryAction(id: string) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role.toLowerCase() !== 'admin') {
            return { error: 'Unauthorized' };
        }

        const category = await prisma.category.findUnique({
            where: { id },
        });

        return { category: JSON.parse(JSON.stringify(category)) };
    } catch (error) {
        console.error('Get admin category action error:', error);
        return { error: 'Internal server error' };
    }
}

export async function getAdminProductsAction(filters?: { category?: string; search?: string }) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role.toLowerCase() !== 'admin') {
            return { error: 'Unauthorized' };
        }

        const where: any = {};

        if (filters?.category) {
            where.OR = [
                {
                    category: {
                        name: {
                            contains: filters.category,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    category: {
                        slug: {
                            contains: filters.category,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    metal: {
                        equals: filters.category,
                        mode: 'insensitive',
                    },
                },
            ];
        }

        if (filters?.search) {
            where.AND = [
                {
                    OR: [
                        { name: { contains: filters.search, mode: 'insensitive' } },
                        { slug: { contains: filters.search, mode: 'insensitive' } },
                    ]
                }
            ];
        }

        const products = await prisma.product.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
        });

        return { products: JSON.parse(JSON.stringify(products)) };
    } catch (error) {
        console.error('Get admin products action error:', error);
        return { products: [], error: 'Internal server error' };
    }
}
