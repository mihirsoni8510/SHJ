import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const wishlistItems = await prisma.wishlistItem.findMany({
            where: { userId: currentUser.id },
            include: {
                product: {
                    include: {
                        category: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ wishlistItems });
    } catch (error) {
        console.error('Get wishlist error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { productId } = await request.json();

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return NextResponse.json(
                { error: 'Product not found' },
                { status: 404 }
            );
        }

        // Check if already in wishlist
        const existingItem = await prisma.wishlistItem.findUnique({
            where: {
                userId_productId: {
                    userId: currentUser.id,
                    productId,
                },
            },
        });

        if (existingItem) {
            return NextResponse.json(
                { error: 'Item already in wishlist' },
                { status: 400 }
            );
        }

        // Add to wishlist
        const wishlistItem = await prisma.wishlistItem.create({
            data: {
                userId: currentUser.id,
                productId,
            },
            include: {
                product: {
                    include: {
                        category: true,
                    },
                },
            },
        });

        return NextResponse.json({ wishlistItem });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = request.nextUrl;
        const productId = searchParams.get('productId');

        if (!productId) {
            return NextResponse.json(
                { error: 'Product ID required' },
                { status: 400 }
            );
        }

        await prisma.wishlistItem.delete({
            where: {
                userId_productId: {
                    userId: currentUser.id,
                    productId,
                },
            },
        });

        return NextResponse.json({ message: 'Item removed from wishlist' });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
