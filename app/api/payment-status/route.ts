import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "Missing payment id" }, { status: 400 });
    }

    const pi = await stripe.paymentIntents.retrieve(id);

    // ✅ sync สถานะกลับ DB
    await prisma.order.updateMany({
        where: { paymentIntentId: id },
        data: { status: pi.status },
    });

    return NextResponse.json({ status: pi.status });
}
