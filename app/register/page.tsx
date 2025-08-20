"use client";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

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
            setMessage("");
            
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
                    router.push("/login")
                }
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head>
                <title>ShopEase - Register</title>
            </Head>
            <main className="bg-gray-50 min-h-screen">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="w-full max-w-md">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
                            <p className="text-gray-600">Join us and start shopping today</p>
                        </div>

                        {/* Register Card */}
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
                            {/* Username Field */}
                            <div className="mb-6">
                                <label
                                    htmlFor="username"
                                    className="block text-sm font-medium text-gray-900 mb-2"
                                >
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900 placeholder-gray-500"
                                    placeholder="Enter your username"
                                    onChange={(v) => setUsername(v.currentTarget.value)}
                                    value={username}
                                />
                            </div>

                            {/* Email Field */}
                            <div className="mb-6">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-900 mb-2"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900 placeholder-gray-500"
                                    placeholder="Enter your email"
                                    onChange={(v) => setEmail(v.currentTarget.value)}
                                    value={email}
                                />
                            </div>

                            {/* Password Field */}
                            <div className="mb-6">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-900 mb-2"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-gray-900 placeholder-gray-500"
                                    placeholder="Enter your password"
                                    onChange={(v) => setPassword(v.currentTarget.value)}
                                    value={password}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Must be at least 8 characters long
                                </p>
                            </div>

                            {/* Message Display */}
                            {message && (
                                <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
                                    <p className="text-sm text-red-600">{message}</p>
                                </div>
                            )}

                            {/* Register Button */}
                            <button
                                onClick={register}
                                disabled={loading || !username || !email || !password}
                                className="w-full bg-black text-white py-2.5 px-4 rounded-md font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                {registerSuccess
                                    ? "Registration successful!"
                                    : loading
                                        ? "Creating account..."
                                        : "Create account"}
                            </button>

                            {/* Divider */}
                            <div className="my-6 flex items-center">
                                <div className="flex-1 border-t border-gray-300"></div>
                                <div className="px-3 text-sm text-gray-500">or</div>
                                <div className="flex-1 border-t border-gray-300"></div>
                            </div>

                            {/* Sign in Link */}
                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{" "}
                                    <a href="/login" className="text-black hover:underline font-medium">
                                        go to login page
                                    </a>
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <p className="text-xs text-gray-500">
                                By creating an account, you agree to our{' '}
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
};

export default RegisterPage;