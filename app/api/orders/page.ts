
import { prisma } from "../../../lib/prisma"; // path ขึ้นกับที่คุณตั้งไว้
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json({ data: orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}
