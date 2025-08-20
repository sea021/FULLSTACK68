"use client";
import axios from 'axios';
import Head from "next/head";
import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [loginSuccess, setLogin] = useState(false);

    const login = async () => {
        try {
            setLoading(true);
            setMessage("");

            const res = await axios.post('/api/login', {
                email,
                password
            })

            if (res.status) {
                console.log(res.data);
                if (res.data.message) {
                    setMessage(res.data.message);
                    setTimeout(() => setMessage(""), 2000);
                } else {
                    setLogin(true);
                    window.location.href = "/dashboard";
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Head>
                <title>ShopEase - Login</title>
            </Head>
            <main className="bg-gray-50 min-h-screen">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="w-full max-w-md">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
                            <p className="text-gray-600">Sign in to your account to continue</p>
                        </div>

                        {/* Login Card */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
                            {/* Email Field */}
                            <div className="mb-6">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900 placeholder-gray-500"
                                    placeholder="Enter your email"
                                    required
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />
                            </div>

                            {/* Password Field */}
                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900 placeholder-gray-500"
                                    placeholder="Enter your password"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                />
                            </div>

                            {/* Message Display */}
                            {message && (
                                <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
                                    <p className="text-sm text-red-600">{message}</p>
                                </div>
                            )}

                            {/* Login Button */}
                            <button
                                onClick={login}
                                disabled={loading || !email || !password}
                                className="w-full bg-black text-white py-2.5 px-4 rounded-md font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                {loginSuccess ? "Logged in successfully" : loading ? "Signing in..." : "Sign in"}
                            </button>

                            {/* Divider */}
                            <div className="my-6 flex items-center">
                                <div className="flex-1 border-t border-gray-300"></div>
                                <div className="px-3 text-sm text-gray-500">or</div>
                                <div className="flex-1 border-t border-gray-300"></div>
                            </div>

                            {/* Sign up Link */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <a href="/register" className="text-black hover:underline font-medium">
                                        go to register page
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-xs text-gray-500">
                                By signing in, you agree to our{' '}
                                <a href="#" className="text-gray-700 hover:underline">Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" className="text-gray-700 hover:underline">Privacy Policy</a>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}