"use client"
import axios from 'axios';
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Products } from './generated/prisma';

export default function Home() {
  const [products, setProducts] = useState<Products[]>([])
  useEffect(() => {
    (async () => {
      const products = await axios.get('/api/product')
      if (products.data.data) {
        setProducts(products.data.data)
      }
    })()
  }, [])

  return (
    <>
      <Head>
        <title>ShopEase - Home</title>
      </Head>

      <main className="bg-gray-50 min-h-screen">
        <section className="bg-blue-100 text-center py-16">
          <h2 className="text-4xl font-bold text-blue-800 mb-4">Welcome to Nextshop</h2>
          <p className="text-lg text-blue-700">Your one-stop shop for everyday essentials</p>
        </section>

        <section className="container mx-auto px-4 py-12">
          <h3 className="text-2xl font-semibold mb-6">Featured Products</h3>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow p-4">
                <img
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover rounded"
                />
                <h4 className="mt-4 text-2xl font-black text-black">{product.name}</h4>
                <p className="text-blue-600 font-bold text-lg">{product.price} บาท </p>
                <p className="text-gray-700 font-sm">{product.desciption}</p>
                <p className="inline-block p-3 mt-2 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">{product.cetagory}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
