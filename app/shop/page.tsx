"use client";

import axios from "axios";
import Head from "next/head";
import { useEffect, useState, useMemo } from "react";
import { Products } from "../generated/prisma";
import { useAuth } from "@/context/AuthContext";

export default function Shop() {
  const [products, setProducts] = useState<Products[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");
  const { isLoggedIn, user } = useAuth();

  // ✅ Modal state
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 นาที
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [status, setStatus] = useState<"pending" | "succeeded" | "canceled">(
    "pending"
  );

  // โหลดสินค้า
  useEffect(() => {
    (async () => {
      const products = await axios.get("/api/product");
      if (products.data.data) {
        setProducts(products.data.data);
      }
    })();
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
    return uniqueCategories;
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, selectedCategory, searchTerm, sortBy]);

  // ✅ ซื้อสินค้า
  async function handleBuy(productId: string) {
    try {
      const res = await axios.post("/api/checkout", {
        productId,
        quantity: 1,
        email: user?.email,
      });
      const { qrCode, paymentIntentId } = res.data;

      if (qrCode) {
        setQrCode(qrCode);
        setPaymentIntentId(paymentIntentId);
        setShowModal(true);
        setTimeLeft(120);
        setStatus("pending");
      } else {
        alert("ไม่สามารถสร้าง QR ได้");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error ?? "Failed to start checkout");
      } else if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("Failed to start checkout");
      }
    }
  }

  // ✅ นับถอยหลัง + หมดเวลา = cancel
  useEffect(() => {
    if (!showModal || status !== "pending") return;
    if (timeLeft <= 0) {
      if (paymentIntentId) {
        axios.post("/api/cancel-payment", { id: paymentIntentId }).then(() => {
          setStatus("canceled");
          setTimeout(() => {
            setShowModal(false);
            window.location.href = "/cancel";
          }, 1500);
        });
      }
      return;
    }

    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, showModal, status, paymentIntentId]);

  // ✅ Polling เช็คการจ่าย
  useEffect(() => {
    if (!paymentIntentId || !showModal || status !== "pending") return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/api/payment-status?id=${paymentIntentId}`);
        const piStatus = res.data.status;
        if (piStatus === "succeeded") {
          setStatus("succeeded");
          setTimeout(() => {
            setShowModal(false);
            window.location.href = "/success";
          }, 1500);
        } else if (piStatus === "canceled") {
          setStatus("canceled");
          setTimeout(() => {
            setShowModal(false);
            window.location.href = "/cancel";
          }, 1500);
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [paymentIntentId, showModal, status]);

  // ✅ กดยกเลิกเอง
  async function handleCancel() {
    if (paymentIntentId) {
      await axios.post("/api/cancel-payment", { id: paymentIntentId });
    }
    setStatus("canceled");
    setShowModal(false);
    window.location.href = "/cancel";
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Head>
        <title>ShopEase - Shop</title>
      </Head>
      <main className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our carefully curated collection of premium products
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-black"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === "all"
                      ? "bg-black text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-black"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Results count */}
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
                {selectedCategory !== "all" && ` in "${selectedCategory}"`}
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-w-1 aspect-h-1 relative overflow-hidden">
                    <img
                      src={
                        product.image ||
                        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop"
                      }
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.category && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-black/80 text-white">
                          {product.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-gray-900">
                        ฿{product.price.toLocaleString()}
                      </span>
                    </div>

                    {user?.role === "admin" ? (
                      <div className="w-full py-3 px-4 rounded-md text-center font-medium text-sm bg-gray-200 text-gray-500 cursor-not-allowed">
                        Role : Admin
                      </div>
                    ) : (
                      <button
                        onClick={() => handleBuy(product.id)}
                        disabled={!isLoggedIn}
                        className={`w-full py-3 px-4 rounded-md font-medium text-sm transition-colors ${isLoggedIn
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                      >
                        {isLoggedIn ? "Buy Now" : "Please Login to Purchase"}
                      </button>
                    )}

                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* ✅ Enhanced PromptPay Modal */}
      {showModal && qrCode && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white px-6 py-4">
              <h3 className="text-xl font-bold text-center">PromptPay Payment</h3>
            </div>

            <div className="p-6">
              {status === "pending" && (
                <div className="text-center">
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <img src={qrCode} alt="PromptPay QR" className="mx-auto max-w-full h-auto" />
                  </div>

                  <div className="mb-6">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-black h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(timeLeft / 120) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Scan QR code to complete payment
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {status === "succeeded" && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-green-600 mb-2">Payment Successful!</h4>
                  <p className="text-gray-600">Redirecting to success page...</p>
                </div>
              )}

              {status === "canceled" && (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-red-600 mb-2">Payment Canceled</h4>
                  <p className="text-gray-600">Redirecting to cancel page...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}