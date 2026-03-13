'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getCategoriesAction() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: 'asc',
            },
        });

        return { categories: JSON.parse(JSON.stringify(categories)) };
    } catch (error) {
        console.error('Get categories action error:', error);
        return { categories: [], error: 'Internal server error' };
    }
}

export async function createCategoryAction(data: any) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role.toLowerCase() !== 'admin') {
            return { error: 'Unauthorized' };
        }

        const { name, slug, description, image } = data;

        if (!name || !slug) {
            return { error: 'Name and slug are required' };
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description,
                image,
            },
        });

        revalidatePath('/collections');
        revalidatePath('/admin/categories');

        return { success: true, category: JSON.parse(JSON.stringify(category)) };
    } catch (error: any) {
        console.error('Create category action error:', error);
        if (error.code === 'P2002') {
            const field = error.meta?.target?.[0] || 'name or slug';
            return { error: `A category with this ${field} already exists.` };
        }
        return { error: 'Internal server error' };
    }
}

export async function updateCategoryAction(id: string, data: any) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role.toLowerCase() !== 'admin') {
            return { error: 'Unauthorized' };
        }

        const category = await prisma.category.update({
            where: { id },
            data,
        });

        revalidatePath('/collections');
        revalidatePath('/admin/categories');

        return { success: true, category: JSON.parse(JSON.stringify(category)) };
    } catch (error) {
        console.error('Update category action error:', error);
        return { error: 'Internal server error' };
    }
}

export async function deleteCategoryAction(id: string) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role.toLowerCase() !== 'admin') {
            return { error: 'Unauthorized' };
        }

        await prisma.category.delete({
            where: { id },
        });

        revalidatePath('/collections');
        revalidatePath('/admin/categories');

        return { success: true };
    } catch (error) {
        console.error('Delete category action error:', error);
        return { error: 'Internal server error' };
    }
}
