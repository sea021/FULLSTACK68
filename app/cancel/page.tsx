"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";

export default function CancelPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/shop");
    }, 5000); // 5 วินาที redirect กลับหน้า Home
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
        <XCircle className="mx-auto text-red-500 w-16 h-16 mb-4" />
        <h1 className="text-3xl font-bold text-red-600">การชำระเงินถูกยกเลิก</h1>
        <p className="text-gray-600 mt-3">
          ยังไม่ได้ถูกตัดเงิน กรุณาลองใหม่อีกครั้ง
        </p>
        <p className="text-gray-500 text-sm mt-2">
          กำลังพาคุณกลับไปยังหน้าแรก...
        </p>

        <button
          onClick={() => router.push("/shop")}
          className="mt-6 w-full py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold"
        >
          กลับไปหน้าแรกทันที
        </button>
      </div>
    </main>
  );
}
