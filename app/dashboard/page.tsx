"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();
      setStats(data);
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stat Boxes */}
      <div className="grid grid-cols-3 gap-4">
        <StatBox label="Users" value={stats.users} />
        <StatBox label="Products" value={stats.products} />
        <StatBox label="Orders" value={stats.orders} />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <Link href="/dashboard/products">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            จัดการสินค้า
          </button>
        </Link>
        <Link href="/dashboard/users">
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            จัดการผู้ใช้
          </button>
        </Link>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 bg-gray-100 rounded-md shadow">
      <p className="text-lg font-semibold">{label}</p>
      <p className="text-2xl">{value}</p>
    </div>
  );
}
