"use client";
import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Products } from "../generated/prisma";

import { useAuth } from "@/context/AuthContext"; // ✅ เพิ่ม

export default function Shop() {
  const [products, setProducts] = useState<Products[]>([]);
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    (async () => {
      const products = await axios.get("/api/product");
      if (products.data.data) {
        setProducts(products.data.data);
      }
    })();
  }, []);

  async function handleBuy(productId: string) {
    try {
      const res = await axios.post("/api/checkout", { productId, quantity: 1 });
      if (res.data.qrCodeUrl) {
        const qrWindow = window.open("", "_blank");
        qrWindow?.document.write(`<img src="${res.data.qrCodeUrl}" alt="QR Code" />`);
      } else {
        alert("Cannot generate QR code");
      }
    } catch (err: unknown) {
      console.log(err)
      alert("Failed to start checkout");
    }
  }


  return (
    <>
      <Head>
        <title>ShopEase - Home</title>
      </Head>

      <main className="bg-gray-50 min-h-screen">
        <section className="bg-blue-100 text-center py-16">
          <h2 className="text-4xl font-bold text-blue-800 mb-4">Ours Products</h2>
          <p className="text-lg text-blue-700">Your one-stop shop for everyday essentials</p>
        </section>

        <section className="container mx-auto px-4 py-12">
          <h3 className="text-2xl font-semibold mb-6">Featured Products</h3>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow p-4">
                <img
                  src={product.image || "https://img.freepik.com/premium-vector/no-photo-available-vector-icon-default-image-symbol-picture-coming-soon-web-site-mobile-app_87543-18055.jpg"}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover rounded"
                />
                <h4 className="mt-4 text-2xl font-black text-black">{product.name}</h4>
                <p className="text-blue-600 font-bold text-lg">{product.price} บาท</p>
                <p className="text-gray-700 text-sm">{product.description}</p>
                {product.category && (
                  <p className="inline-block p-3 mt-2 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {product.category}
                  </p>
                )}

                {user?.role !== "admin" && (
                  <button
                    onClick={() => handleBuy(product.id)}
                    disabled={!isLoggedIn}
                    className={`
      mt-4 w-full py-2 rounded-lg font-semibold
      ${isLoggedIn ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}
    `}
                  >
                    {isLoggedIn ? "ซื้อเลย" : "กรุณาเข้าสู่ระบบเพื่อซื้อ"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
