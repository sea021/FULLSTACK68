"use client";
import Head from "next/head";



export default function Home() {

  return (
    <>
      <Head>
        <title>ShopEase - Home</title>
      </Head>

      <main className="bg-gray-50 min-h-screen">
        {/* Hero Banner */}
        <section className="bg-blue-100 text-center py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">Welcome to ShopEase</h1>
          <p className="text-lg text-blue-700 max-w-xl mx-auto">
            Your one-stop shop for everyday essentials. Explore our featured products and find great deals!
          </p>
          <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Explore Products
          </button>
        </section>



        {/* Highlights / Services */}
        <section className="bg-blue-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-2xl md:text-3xl font-semibold mb-6">Why ShopEase?</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold text-xl mb-2">Fast Delivery</h4>
                <p className="text-gray-600 text-sm">Receive your products quickly with reliable delivery services.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold text-xl mb-2">Best Prices</h4>
                <p className="text-gray-600 text-sm">Affordable products for everyone without compromising quality.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="font-bold text-xl mb-2">Customer Support</h4>
                <p className="text-gray-600 text-sm">Our team is ready to help you 24/7 with any questions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container mx-auto px-4 py-12">
          <h3 className="text-2xl font-semibold mb-6 text-center">What Our Customers Say</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-700 mb-4">Great products and excellent service! Highly recommend ShopEase.</p>
              <p className="font-bold text-blue-600">- Alice</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-700 mb-4">Fast delivery and the prices are unbeatable. Will buy again!</p>
              <p className="font-bold text-blue-600">- Bob</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-700 mb-4">Customer support is amazing, very helpful and responsive.</p>
              <p className="font-bold text-blue-600">- Carol</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-blue-100 text-center py-12">
          <h3 className="text-3xl font-semibold mb-4">Ready to Shop?</h3>
          <p className="text-blue-700 mb-6">Browse our products and grab the best deals today!</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Start Shopping
          </button>
        </section>
      </main>
    </>
  );
}
