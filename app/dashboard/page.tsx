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
    const [editingProduct, setEditingProduct] = useState<Products | null>(null);



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


    async function handleDeleteProduct(id: string) {

        if (!confirm("ต้องการลบสินค้านี้หรือไม่?")) return;
        try {
            await axios.delete("/api/product", { data: { id } });
            const res = await axios.get("/api/product");
            setProducts(res.data.data);
        } catch (error) {
            console.error("Error deleting product", error);
        }
    }

    function openEditModal(product: Products) {
        setEditingProduct(product);
    }

    function closeEditModal() {
        setEditingProduct(null);
    }

    async function handleUpdateProduct(id: string) {
        if (!editingProduct) return;
        try {
            await axios.put("/api/product", editingProduct);
            const res = await axios.get("/api/product");
            setProducts(res.data.data);
            closeEditModal();
        } catch (error) {
            console.error("Error updating product", error);
        }
    }

    const [newProduct, setNewProduct] = useState({
        name: "",
        price: 0,
        description: "",
        category: "",
        image: "",

    });
    const [showAddModal, setShowAddModal] = useState(false);

    async function handleAddProduct() {
        try {
            await axios.post("/api/product", newProduct);
            const res = await axios.get("/api/product");
            setProducts(res.data.data);
            setShowAddModal(false);
            setNewProduct({
                name: "", price: 0, description: "", category: "", image: "",
            });
        } catch (error) {
            console.error("Error adding product", error);
        }
    }


    if (!user) {
        return <div>Loading...</div>;
    }


    return (
        <div>
            <div className="p-4">
                <div className="flex justify-end p-4">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        เพิ่มสินค้าใหม่
                    </button>
                </div>
                <table className="w-full border-collapse border border-gray-300">

                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2">ชื่อ</th>
                            <th className="border border-gray-300 p-2">ราคา</th>
                            <th className="border border-gray-300 p-2">คำอธิบาย</th>
                            <th className="border border-gray-300 p-2">ประเภท</th>
                            <th className="border border-gray-300 p-2">รูปภาพ</th>
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
                                    <td className="border border-gray-300 p-2">{product.name}</td>
                                    <td className="border border-gray-300 p-2 text-right">${product.price}</td>
                                    <td className="border border-gray-300 p-2 text-right truncate max-w-[50px]">{product.description}</td>
                                    <td className="border border-gray-300 p-2 text-right max-w-[30px]">{product.category}</td>
                                    <td className="border border-gray-300 p-2">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-10 h-10 object-cover" />
                                        ) : (
                                            "ไม่มีรูป"
                                        )}
                                    </td>

                                    <td className="border border-gray-300 p-2 text-center">
                                        <button
                                            onClick={() => openEditModal(product)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mr-2"
                                        >
                                            แก้ไข
                                        </button>

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

            {editingProduct && (
                <div className="fixed inset-0 bg-gray-600/90 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-96">
                        <h2 className="text-xl font-bold mb-4">แก้ไขสินค้า</h2>
                        <input
                            className="w-full border p-2 mb-2"
                            value={editingProduct.name}
                            onChange={(e) =>
                                setEditingProduct({ ...editingProduct, name: e.target.value })
                            }
                        />
                        <input
                            className="w-full border p-2 mb-2"
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) =>
                                setEditingProduct({ ...editingProduct, price: +e.target.value })
                            }
                        />
                        <input
                            className="w-full border p-2 mb-2"
                            value={editingProduct.description ?? ""}
                            onChange={(e) =>
                                setEditingProduct({ ...editingProduct, description: e.target.value })
                            }
                        />
                        <input
                            className="w-full border p-2 mb-4"
                            value={editingProduct.category ?? ""}
                            onChange={(e) =>
                                setEditingProduct({ ...editingProduct, category: e.target.value })
                            }
                        />

                        <input
                            className="w-full border p-2 mb-2"
                            placeholder="ลิงก์รูปภาพ"
                            value={editingProduct.image}
                            onChange={(e) =>
                                setEditingProduct({ ...editingProduct, image: e.target.value })
                            }
                        />

                        <div className="flex justify-end space-x-2">

                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={closeEditModal}
                            >
                                ยกเลิก
                            </button>
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded"
                                onClick={() => handleUpdateProduct(editingProduct.id)}
                            >
                                บันทึก
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAddModal && (
                <div className="fixed inset-0 bg-gray-600/90 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-96">
                        <h2 className="text-xl font-bold mb-4">เพิ่มสินค้า</h2>
                        <input
                            className="w-full border p-2 mb-2"
                            placeholder="ชื่อสินค้า"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                        <input
                            className="w-full border p-2 mb-2"
                            placeholder="ราคา"
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: +e.target.value })}
                        />
                        <input
                            className="w-full border p-2 mb-2"
                            placeholder="คำอธิบาย"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        />
                        <input
                            className="w-full border p-2 mb-4"
                            placeholder="ประเภท"
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        />
                        <input
                            className="w-full border p-2 mb-2"
                            placeholder="ลิงก์รูปภาพ"
                            value={newProduct.image}
                            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                        />

                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => setShowAddModal(false)}
                            >
                                ยกเลิก
                            </button>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={handleAddProduct}
                            >
                                บันทึก
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>


    );
}
