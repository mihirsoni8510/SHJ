import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/admin';

export async function GET() {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const orders = await prisma.order.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    }
                },
                orderItems: {
                    include: {
                        product: true
                    }
                },
                address: true
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ orders });
    } catch (error) {
        console.error('Admin get orders error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
