'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getProductsAction(filters?: any) {
    try {
        const {
            category,
            search,
            metal,
            minPrice,
            maxPrice,
            page = 1,
            limit = 12
        } = filters || {};

        const skip = (page - 1) * limit;

        const where: any = {
            isActive: true,
        };

        if (category) {
            where.category = { slug: category };
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (metal) {
            where.metal = metal;
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = parseFloat(minPrice);
            if (maxPrice) where.price.lte = parseFloat(maxPrice);
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    category: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.product.count({ where }),
        ]);

        return {
            products: JSON.parse(JSON.stringify(products)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    } catch (error) {
        console.error('Get products action error:', error);
        return { products: [], error: 'Internal server error' };
    }
}

export async function getProductBySlugAction(slug: string) {
    try {
        const product = await prisma.product.findUnique({
            where: { slug },
            include: {
                category: true,
            },
        });

        if (!product) return { error: 'Product not found' };

        return { product: JSON.parse(JSON.stringify(product)) };
    } catch (error) {
        console.error('Get product by slug action error:', error);
        return { error: 'Internal server error' };
    }
}

export async function createProductAction(data: any) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role.toLowerCase() !== 'admin') {
            return { error: 'Unauthorized' };
        }

        // Generate slug from name
        const slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const product = await prisma.product.create({
            data: {
                ...data,
                slug,
            },
        });

        revalidatePath('/products');
        revalidatePath('/admin/products');

        return { success: true, product: JSON.parse(JSON.stringify(product)) };
    } catch (error) {
        console.error('Create product action error:', error);
        return { error: 'Internal server error' };
    }
}

export async function updateProductAction(id: string, data: any) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role.toLowerCase() !== 'admin') {
            return { error: 'Unauthorized' };
        }

        if (data.name) {
            data.slug = data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
        }

        const product = await prisma.product.update({
            where: { id },
            data,
        });

        revalidatePath('/products');
        revalidatePath(`/products/${product.slug}`);
        revalidatePath('/admin/products');

        return { success: true, product: JSON.parse(JSON.stringify(product)) };
    } catch (error) {
        console.error('Update product action error:', error);
        return { error: 'Internal server error' };
    }
}

export async function deleteProductAction(id: string) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role.toLowerCase() !== 'admin') {
            return { error: 'Unauthorized' };
        }

        await prisma.product.delete({
            where: { id },
        });

        revalidatePath('/products');
        revalidatePath('/admin/products');

        return { success: true };
    } catch (error) {
        console.error('Delete product action error:', error);
        return { error: 'Internal server error' };
    }
}
