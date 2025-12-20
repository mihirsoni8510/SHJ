import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validated = registerSchema.parse(body);

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validated.email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(validated.password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: validated.email,
                password: hashedPassword,
                name: validated.name,
                phone: validated.phone,
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                image: true,
            },
        });

        // Generate token
        const token = generateToken({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        });

        // Set cookie
        await setAuthCookie(token);

        return NextResponse.json({
            user,
            token,
        });
    } catch (error) {
        console.error('Registration error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid input', details: error.issues },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
