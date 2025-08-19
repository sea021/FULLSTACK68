"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/shop");
    }, 5000); // 5 วินาที redirect กลับหน้า Home
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-14 rounded-2xl shadow-lg text-center max-w-md">
        <CheckCircle className="mx-auto text-green-500 w-16 h-16 mb-4" />
        <h1 className="text-3xl font-bold text-green-600">ชำระเงินสำเร็จ</h1>
        <p className="text-gray-600 mt-3">
          ขอบคุณสำหรับการสั่งซื้อของคุณ
        </p>
        <p className="text-gray-500 text-sm mt-2">
          กำลังพาคุณกลับไปยังหน้าแรก...
        </p>

        <button
          onClick={() => router.push("/shop")}
          className="mt-6 w-full py-2 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold"
        >
          กลับไปหน้าแรกทันที
        </button>
      </div>
    </main>
  );
}
