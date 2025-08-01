"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Navigation() {
  interface User {
    username: string;
    role: string;
  }

  const [user, setUser] = useState<User | null>(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await axios.get("/api/me");
        if (res.data.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    }
    checkAuth();
  }, [router]);

  async function logout() {
    await axios.post("/api/logout");
    window.location.href = "/login";
  }

  function toggleDropdown() {
    setShowDropdown(!showDropdown);
  }

  return (


    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Nextshop</h1>
        <nav className="space-x-4">
          <Link href="/" className="text-gray-600 hover:text-blue-500">Home</Link>
          <Link href="#" className="text-gray-600 hover:text-blue-500">Shop</Link>
          <Link href="#" className="text-gray-600 hover:text-blue-500">Contact</Link>
          {!user ? (
            <>
              <Link href="/login" className="text-white hover:text-gray-100 hover:bg-blue-600 bg-blue-500 p-2.5 rounded-lg">Login</Link>
              <Link href="/register" className="text-gray-600 hover:text-blue-500 border border-2 p-2 rounded-lg">Register</Link>
            </>
          ) : (
            <>
              <div className="relative inline-block text-left">
                <span className="text-gray-600" onClick={toggleDropdown}> {user.username}</span>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                    {user.role === "admin" && (
                      <Link
                        href="/dashboard"
                        className="block text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>

                )}
              </div>
            </>

          )}



        </nav>
      </div>
    </header>
  )
}
