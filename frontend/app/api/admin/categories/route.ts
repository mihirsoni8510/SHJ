import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/admin';

export async function POST(request: NextRequest) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, slug, description, image } = body;

        if (!name || !slug) {
            return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
        }

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description,
                image,
            },
        });

        return NextResponse.json({ category }, { status: 201 });
    } catch (error: any) {
        console.error('Create category error:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Category with this name or slug already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
