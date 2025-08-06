"use client"

import axios from "axios";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function Navigation() {

  interface User {
    username: string;
    role: string;
  }

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("/api/me");
        if (res.data.user) {
          setUser(res.data.user);
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error(error);
        setIsLoggedIn(false);
        setUser(null);
      }
    }

    fetchUser();

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const logout = async () => {
    await axios.post("/api/logout");
    window.location.href = "/login";
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">Nextshop</h1>
        <nav className="space-x-4 flex items-center">
          <Link href="/" className="text-gray-600 hover:text-blue-500">Home</Link>
          <Link href="#" className="text-gray-600 hover:text-blue-500">Shop</Link>
          <Link href="#" className="text-gray-600 hover:text-blue-500">Contact</Link>

          {!isLoggedIn && (
            <>
              <Link href="/login" className="text-white hover:text-gray-100 hover:bg-blue-600 bg-blue-500 p-2.5 rounded-lg">Login</Link>
              <Link href="/register" className="text-gray-600 hover:text-blue-500 border border-2 p-2 rounded-lg">Register</Link>
            </>
          )}

          {isLoggedIn && user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="text-gray-700 hover:text-blue-600 px-3 py-1 rounded cursor-pointer flex items-center space-x-1"
              >
                <span className="bg-blue-500 text-white p-2 rounded-lg">{user.username}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-20">
                  <div className="flex flex-col">
                    {user.role === 'admin' && (
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100/60"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100/60"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
