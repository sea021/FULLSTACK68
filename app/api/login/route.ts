import { prisma } from '@/lib/prisma';
import { createHash } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

interface LoginBody {
    email: string;
    password: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as LoginBody;

        if (!body) return NextResponse.json({
            message: 'Body Invalid',
        })

        if (!body.email || !body.password) return NextResponse.json({
            message: 'Please provide email and password',
        })

        const hashPassword = createHash('sha256').update(body.password).digest('hex');
        console.log('Hashed Password:', hashPassword);

        const user = await prisma.user.findFirst({
            where: {
                email: body.email.toLowerCase()
            },
        })

        if (!user) {
            return NextResponse.json({
                message: 'Email or password is incorrect'
            });
        }

        if (user.password !== hashPassword) {
            return NextResponse.json({
                message: 'Email or password is incorrect'
            });
        }

        const token_obj = {
            userId: user.id,
            email: user.email,
            username: user.username,
            role: user.role
        }

        const token = sign(token_obj, process.env.JWT_KEY!, {
            expiresIn: '1h',
        });


        const res = NextResponse.json({
            token,
            token_obj,
        });

        res.cookies.set({
            name: 'token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60,
            path: '/',
        });

        return res;


    } catch (error) {
        return NextResponse.json({
            message: 'Error :' + error,
        });
    }
}