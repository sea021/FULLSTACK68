"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { User } from "../../generated/prisma";

export default function UsersDashboard() {
    const [users, setUsers] = useState<User[]>([])
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        role: "",
    });
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await axios.get("/api/user");
                if (res.data.data) {
                    setUsers(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch users", error);
            }
        }

        fetchUsers();
    }, []);

    async function handleDeleteUser(id: string) {
        if (!confirm("ต้องการลบผู้ใช้นี้หรือไม่?")) return;
        try {
            await axios.delete("/api/user", { data: { id } });
            const res = await axios.get("/api/user");
            setUsers(res.data.data);
        } catch (error) {
            console.error("Error deleting user", error);
        }
    }

    function openEditModal(user: User) {
        // ไม่ส่ง password ไปยัง edit form เพื่อความปลอดภัย
        setEditingUser({ ...user, password: "" });
    }

    function closeEditModal() {
        setEditingUser(null);
    }

    async function handleUpdateUser() {
        if (!editingUser) return;
        try {
            // ถ้าไม่มี password ใหม่ ให้ส่งข้อมูลโดยไม่รวม password
            const updateData = editingUser.password 
                ? editingUser 
                : { ...editingUser, password: undefined };
            
            await axios.put("/api/user", updateData);
            const res = await axios.get("/api/user");
            setUsers(res.data.data);
            closeEditModal();
        } catch (error) {
            console.error("Error updating user", error);
        }
    }

    async function handleAddUser() {
        try {
            await axios.post("/api/user", newUser);
            const res = await axios.get("/api/user");
            setUsers(res.data.data);
            setShowAddModal(false);
            setNewUser({
                username: "",
                email: "",
                password: "",
                role: "",
            });
        } catch (error) {
            console.error("Error adding user", error);
        }
    }

    function formatDate(dateString: string | Date | undefined | null) {
        if (!dateString) return 'ไม่ระบุ';
        
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'วันที่ไม่ถูกต้อง';
            
            return date.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'วันที่ไม่ถูกต้อง';
        }
    }

    return (
        <div>
            <div className="p-4">
                <div className="flex justify-start p-4">
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        เพิ่มผู้ใช้ใหม่
                    </button>
                </div>
                
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2">ชื่อผู้ใช้</th>
                            <th className="border border-gray-300 p-2">อีเมล</th>
                            <th className="border border-gray-300 p-2">บทบาท</th>
                            <th className="border border-gray-300 p-2">วันที่สร้าง</th>
                            <th className="border border-gray-300 p-2">อัปเดตล่าสุด</th>
                            <th className="border border-gray-300 p-2">จัดการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center p-4">
                                    ไม่มีผู้ใช้
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td className="border border-gray-300 p-2">{user.username}</td>
                                    <td className="border border-gray-300 p-2">{user.email}</td>
                                    <td className="border border-gray-300 p-2">
                                        <span className={`px-2 py-1 rounded text-sm ${
                                            user.role === 'admin' 
                                                ? 'bg-red-100 text-red-800' 
                                                : user.role === 'manager'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {user.role || 'ผู้ใช้ทั่วไป'}
                                        </span>
                                    </td>
                                    <td className="border border-gray-300 p-2 text-sm">
                                        {formatDate(user.createdAt)}
                                    </td>
                                    <td className="border border-gray-300 p-2 text-sm">
                                        {formatDate(user.updatedAt)}
                                    </td>
                                    <td className="border border-gray-300 p-2 text-center">
                                        <button
                                            onClick={() => openEditModal(user)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mr-2"
                                        >
                                            แก้ไข
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
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

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-gray-600/90 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-96">
                        <h2 className="text-xl font-bold mb-4">แก้ไขผู้ใช้</h2>
                        
                        <input
                            className="w-full border p-2 mb-2"
                            placeholder="ชื่อผู้ใช้"
                            value={editingUser.username}
                            onChange={(e) =>
                                setEditingUser({ ...editingUser, username: e.target.value })
                            }
                        />
                        
                        <input
                            className="w-full border p-2 mb-2"
                            placeholder="อีเมล"
                            type="email"
                            value={editingUser.email}
                            onChange={(e) =>
                                setEditingUser({ ...editingUser, email: e.target.value })
                            }
                        />
                        
                        <input
                            className="w-full border p-2 mb-2"
                            placeholder="รหัสผ่านใหม่ (เว้นว่างหากไม่ต้องการเปลี่ยน)"
                            type="password"
                            value={editingUser.password}
                            onChange={(e) =>
                                setEditingUser({ ...editingUser, password: e.target.value })
                            }
                        />
                        
                        <select
                            className="w-full border p-2 mb-4"
                            value={editingUser.role || ""}
                            onChange={(e) =>
                                setEditingUser({ ...editingUser, role: e.target.value })
                            }
                        >
                            <option value="">ผู้ใช้ทั่วไป</option>
                            <option value="admin">ผู้ดูแลระบบ</option>
                            <option value="manager">ผู้จัดการ</option>
                            <option value="user">ผู้ใช้</option>
                        </select>

                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={closeEditModal}
                            >
                                ยกเลิก
                            </button>
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded"
                                onClick={handleUpdateUser}
                            >
                                บันทึก
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-600/90 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-96">
                        <h2 className="text-xl font-bold mb-4">เพิ่มผู้ใช้ใหม่</h2>
                        
                        <input
                            className="w-full border p-2 mb-2"
                            placeholder="ชื่อผู้ใช้"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        />
                        
                        <input
                            className="w-full border p-2 mb-2"
                            placeholder="อีเมล"
                            type="email"
                            value={newUser.email}
                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                        
                        <input
                            className="w-full border p-2 mb-2"
                            placeholder="รหัสผ่าน"
                            type="password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                        
                        <select
                            className="w-full border p-2 mb-4"
                            value={newUser.role}
                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        >
                            <option value="">ผู้ใช้ทั่วไป</option>
                            <option value="admin">ผู้ดูแลระบบ</option>
                            <option value="manager">ผู้จัดการ</option>
                            <option value="user">ผู้ใช้</option>
                        </select>

                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-300 px-4 py-2 rounded"
                                onClick={() => setShowAddModal(false)}
                            >
                                ยกเลิก
                            </button>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={handleAddUser}
                            >
                                บันทึก
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="p-4">
                <Link href="/dashboard">
                    <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mb-4">
                        ← กลับไปหน้า Dashboard
                    </button>
                </Link>
            </div>
        </div>
    );
}