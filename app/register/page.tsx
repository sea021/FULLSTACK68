"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [registerSuccess, setRegister] = useState(false);
  const router = useRouter();

  const register = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/register", {
        email,
        password,
        username,
      });
      if (res.status) {
        console.log(res.data);
        if (res.data.message) {
          setMessage(res.data.message);

          setTimeout(() => {
            setMessage("");
          }, 5000);
        } else {
          setRegister(true);
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

      useEffect(() => {
        async function checkAuth() {
            try {
                const res = await axios.get("/api/me");
                if (res.data.user) {
                    router.replace("/dashboard");
                }
            } catch {
            }
        }
        checkAuth();
    }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Register
        </h1>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username"
            onChange={(v) => setUsername(v.currentTarget.value)}
            value={username}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            onChange={(v) => setEmail(v.currentTarget.value)}
            value={email}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            onChange={(v) => setPassword(v.currentTarget.value)}
            value={password}
          />
        </div>
        <button
          onClick={register}
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {registerSuccess
            ? "สมัครสมาชิกสำเร็จ"
            : loading
            ? "กำลังสมัครสมาชิก"
            : message != ""
            ? message
            : "Register"}
        </button>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
