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

        const cartItems = await prisma.cartItem.findMany({
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

        return NextResponse.json({ cartItems });
    } catch (error) {
        console.error('Get cart error:', error);
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

        const { productId, quantity = 1 } = await request.json();

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

        // Check if item already in cart
        const existingItem = await prisma.cartItem.findUnique({
            where: {
                userId_productId: {
                    userId: currentUser.id,
                    productId,
                },
            },
        });

        let cartItem;

        if (existingItem) {
            // Update quantity
            cartItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: {
                    quantity: existingItem.quantity + quantity,
                },
                include: {
                    product: {
                        include: {
                            category: true,
                        },
                    },
                },
            });
        } else {
            // Create new cart item
            cartItem = await prisma.cartItem.create({
                data: {
                    userId: currentUser.id,
                    productId,
                    quantity,
                },
                include: {
                    product: {
                        include: {
                            category: true,
                        },
                    },
                },
            });
        }

        return NextResponse.json({ cartItem });
    } catch (error) {
        console.error('Add to cart error:', error);
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

        await prisma.cartItem.delete({
            where: {
                userId_productId: {
                    userId: currentUser.id,
                    productId,
                },
            },
        });

        return NextResponse.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { productId, quantity } = await request.json();

        if (quantity < 1) {
            return NextResponse.json(
                { error: 'Quantity must be at least 1' },
                { status: 400 }
            );
        }

        const cartItem = await prisma.cartItem.update({
            where: {
                userId_productId: {
                    userId: currentUser.id,
                    productId,
                },
            },
            data: { quantity },
            include: {
                product: {
                    include: {
                        category: true,
                    },
                },
            },
        });

        return NextResponse.json({ cartItem });
    } catch (error) {
        console.error('Update cart error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
