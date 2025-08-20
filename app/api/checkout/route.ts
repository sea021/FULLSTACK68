import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { productId, quantity = 1 } = await req.json();

    const product = await prisma.products.findUnique({ where: { id: productId } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const unitAmount = product.price * 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: unitAmount * quantity,
      currency: "thb",
      payment_method_types: ["card", "promptpay_qr"], // ใช้พร้อมเพย์ QR
      metadata: { productId: product.id },
    });

    const qrCodeUrl = paymentIntent.next_action?.display_qr_code?.image_url;

    return NextResponse.json({ paymentIntentId: paymentIntent.id, qrCodeUrl }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) console.error("Create PaymentIntent error:", err.message);
    else console.error("Unknown error creating PaymentIntent:", err);
    return NextResponse.json({ error: "Failed to create PaymentIntent" }, { status: 500 });
  }
}
