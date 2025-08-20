import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  try {
    // หา orders ของ user
    const orders = await prisma.order.findMany({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    // หา products ทั้งหมดที่เกี่ยวข้อง
    const productIds = orders.map((o) => o.productId);
    const products = await prisma.products.findMany({
      where: { id: { in: productIds } },
    });

    // join product เข้า order
    const enrichedOrders = orders.map((o) => ({
      ...o,
      product: products.find((p) => p.id === o.productId) || null,
    }));

    return NextResponse.json({ orders: enrichedOrders });
  } catch (err) {
    console.error("Fetch orders error:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
