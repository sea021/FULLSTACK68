import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { productId, quantity = 1, email } = await req.json();

    const product = await prisma.products.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const unitAmount = product.price * 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: unitAmount * quantity,
      currency: "thb",
      payment_method_types: ["promptpay"],
      description: product.description ?? undefined,
      metadata: { productId: product.id },
      confirm: true,
      payment_method_data: {
        type: "promptpay",
        billing_details: {
          email: email,
        },
      },
    });

    // ✅ บันทึก Order ลง DB
    await prisma.order.create({
      data: {
        paymentIntentId: paymentIntent.id,
        productId,
        email,
        amount: product.price * 100,
        currency: "thb",
        status: "pending",
      },
    });

    const qrCode = (paymentIntent.next_action as any)?.promptpay_display_qr_code?.image_url_png;

    if (!qrCode) {
      return NextResponse.json({ error: "Failed to generate QR" }, { status: 400 });
    }

    return NextResponse.json({ paymentIntentId: paymentIntent.id, qrCode }, { status: 200 });
  } catch (err: any) {
    console.error("Create checkout error:", err);
    return NextResponse.json({ error: err?.message ?? "Failed to create checkout" }, { status: 500 });
  }
}
