import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const userCount = await prisma.user.count();
        const productCount = await prisma.products.count();
        const orderCount = await prisma.order.count();

        return NextResponse.json({
            users: userCount,
            products: productCount,
            orders: orderCount,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch counts' }, { status: 500 });
    }
}
