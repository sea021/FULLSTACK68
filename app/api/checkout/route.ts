// /app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
    try {
        const { productId, quantity = 1 } = await req.json();

        // ดึงสินค้าจาก DB
        const product = await prisma.products.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // ต้อง await headers() ก่อน
        const headersList = await headers();
        const origin = headersList.get("origin") ?? process.env.NEXT_PUBLIC_BASE_URL;

        // แปลง relative path เป็น full URL
        const imageUrl = product.image
            ? product.image.startsWith("http")
                ? product.image
                : `${origin}${product.image}`
            : "https://img.freepik.com/premium-vector/no-photo-available-vector-icon-default-image-symbol-picture-coming-soon-web-site-mobile-app_87543-18055.jpg";

        // ราคาเก็บเป็นบาทใน DB → แปลงเป็นสตางค์
        const unitAmount = product.price * 100;

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cancel`,
            line_items: [
                {
                    quantity,
                    price_data: {
                        currency: "thb",
                        unit_amount: unitAmount,
                        product_data: {
                            name: product.name,
                            images: [imageUrl],
                            description: product.description ?? undefined,
                        },
                    },
                },
            ],
            metadata: {
                productId: product.id,
            },
        });


        return NextResponse.json({ id: session.id, url: session.url }, { status: 200 });
    } catch (err: unknown) {
        // ไม่ใช้ any → ใช้ unknown แล้ว check type
        if (err instanceof Error) {
            console.error("Create checkout session error:", err.message);
        } else {
            console.error("Unknown error creating checkout session:", err);
        }
        return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
    }
}
