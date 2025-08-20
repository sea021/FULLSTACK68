"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Order {
    id: string;
    stripeSessionId: string;
    productId: string;
    email?: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
}

export default function OrderHistory() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await axios.get("/api/orders");
                setOrders(res.data.data);
            } catch (error) {
                console.error("Error fetching orders", error);
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, []);

    function formatDate(dateString: string) {
        const date = new Date(dateString);
        return date.toLocaleDateString("th-TH", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">ประวัติคำสั่งซื้อ</h1>

            {loading ? (
                <p>กำลังโหลดข้อมูล...</p>
            ) : orders.length === 0 ? (
                <p>ไม่มีคำสั่งซื้อ</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Session ID</th>
                            <th className="border p-2">อีเมล</th>
                            <th className="border p-2">จำนวนเงิน</th>
                            <th className="border p-2">สถานะ</th>
                            <th className="border p-2">วันที่สั่งซื้อ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="border p-2 text-xs">{order.stripeSessionId}</td>
                                <td className="border p-2">{order.email || "-"}</td>
                                <td className="border p-2">{(order.amount / 100).toFixed(2)} {order.currency.toUpperCase()}</td>
                                <td className="border p-2">{order.status}</td>
                                <td className="border p-2 text-sm">{formatDate(order.createdAt)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
