import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { id } = await req.json();

        const canceled = await stripe.paymentIntents.cancel(id);

        // ✅ อัพเดทสถานะ Order
        await prisma.order.updateMany({
            where: { paymentIntentId: id },
            data: { status: "canceled" },
        });

        return NextResponse.json({ status: canceled.status });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: err.message || "Cancel failed" },
            { status: 500 }
        );
    }
}
