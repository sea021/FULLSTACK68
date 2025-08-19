import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Webhook signature verification failed:", err.message);
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }
    console.error("Unknown webhook verification error:", err);
    return new NextResponse("Webhook Error: unknown", { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    // Ignore events we don't need
    return NextResponse.json({ received: true });
  }

  try {
    const session = event.data.object as Stripe.Checkout.Session;
    const productId = session.metadata?.productId;

    if (!productId) {
      console.error("Missing productId in session metadata");
      return new NextResponse("Missing productId", { status: 400 });
    }

    // ตรวจสอบว่ามี order อยู่แล้วหรือไม่
    const existingOrder = await prisma.order.findUnique({
      where: { stripeSessionId: session.id },
    });

    if (!existingOrder) {
      await prisma.order.create({
        data: {
          stripeSessionId: session.id,
          productId,
          email: session.customer_details?.email ?? null,
          amount: session.amount_total ?? 0,
          currency: session.currency ?? "thb",
          status: "paid",
        },
      });
      console.log(`Order saved: ${session.id}`);
    } else {
      console.log(`Order already exists: ${session.id}`);
    }

  } catch (err) {
    console.error("Error handling webhook event:", err);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }

  return NextResponse.json({ received: true });
}
