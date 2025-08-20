import { prisma } from "@/lib/prisma"; // ปรับ path ให้ถูกต้อง
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ data: orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
