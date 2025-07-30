"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Products } from "../generated/prisma";


export default function Dashboard() {

    interface User {
        username: string;
    }

    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [products, setProducts] = useState<Products[]>([])


    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await axios.get("/api/me");
                if (!res.data.user) {
                    router.push("/login")
                } else {
                    setUser(res.data.user);
                }
            } catch (error) {
                console.error(error);
                router.push("/login")
            }
        }

        async function fetchProducts() {
            try {
                const res = await axios.get("/api/product");
                if (res.data.data) {
                    setProducts(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            }
        }

        fetchProducts();
        fetchUser();
    }, [router]);

    async function logout() {
        await axios.post("/api/logout");
        router.push("/login");
    }

    async function handleDeleteProduct(id: number) {
        if (!confirm("ต้องการลบสินค้านี้หรือไม่?")) return;
        try {
            await axios.delete("/api/product", { data: { id } });
            const res = await axios.get("/api/product");
            setProducts(res.data.data);
        } catch (error) {
            console.error("Error deleting product", error);
        }
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {user.username}</p>
            <button onClick={logout} className="py-2 px-2 bg-red-500 rounded-lg">Logout</button>

            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">รายการสินค้า</h2>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2">ID</th>
                            <th className="border border-gray-300 p-2">ชื่อ</th>
                            <th className="border border-gray-300 p-2">ราคา</th>
                            <th className="border border-gray-300 p-2">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center p-4">
                                    ไม่มีสินค้า
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td className="border border-gray-300 p-2 text-center">{product.id}</td>
                                    <td className="border border-gray-300 p-2">{product.name}</td>
                                    <td className="border border-gray-300 p-2 text-right">${product.price}</td>
                                    <td className="border border-gray-300 p-2 text-center">
                                        <button
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                        >
                                            ลบ
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>


    );
}
