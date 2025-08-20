"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard/stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <Head>
        <title>ShopEase - Dashboard</title>
      </Head>
      <main className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatBox 
              label="Total Users" 
              value={stats.users} 
              loading={loading}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-2.25a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              }
              bgColor="bg-blue-600"
              change="+12%"
              changeType="positive"
            />
            <StatBox 
              label="Total Products" 
              value={stats.products} 
              loading={loading}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
              bgColor="bg-green-600"
              change="+5%"
              changeType="positive"
            />
            <StatBox 
              label="Total Orders" 
              value={stats.orders} 
              loading={loading}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              }
              bgColor="bg-purple-600"
              change="+23%"
              changeType="positive"
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <ActionCard
                title="Manage Products"
                description="Add, edit, or remove products"
                href="/dashboard/products"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                }
              />
              <ActionCard
                title="Manage Users"
                description="View and manage user accounts"
                href="/dashboard/users"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-2.25a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                }
              />
              <ActionCard
                title="View Orders"
                description="Monitor and process orders"
                href="/dashboard/orders"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                }
              />
              <ActionCard
                title="Analytics"
                description="View sales and performance"
                href="#"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
            <div className="space-y-4">
              <ActivityItem
                action="New user registered"
                description="john.doe@example.com joined the platform"
                time="2 minutes ago"
                type="user"
              />
              <ActivityItem
                action="Order completed"
                description="Order #12345 has been fulfilled"
                time="15 minutes ago"
                type="order"
              />
              <ActivityItem
                action="Product updated"
                description="iPhone 15 Pro stock has been updated"
                time="1 hour ago"
                type="product"
              />
              <ActivityItem
                action="New order received"
                description="Order #12346 requires processing"
                time="2 hours ago"
                type="order"
              />
            </div>
            
            <div className="mt-6 text-center">
              <Link href="#" className="text-black hover:underline text-sm font-medium">
                View all activity →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

interface StatBoxProps {
  label: string;
  value: number;
  loading: boolean;
  icon: React.ReactNode;
  bgColor: string;
  change?: string;
  changeType?: 'positive' | 'negative';
}

function StatBox({ label, value, loading, icon, bgColor, change, changeType }: StatBoxProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
            {loading ? (
              <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
            )}
            {change && (
              <div className="mt-2 flex items-center">
                <span className={`text-sm font-medium ${
                  changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {changeType === 'positive' ? '↗' : '↘'} {change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            )}
          </div>
          <div className={`w-12 h-12 ${bgColor} rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

function ActionCard({ title, description, href, icon }: ActionCardProps) {
  return (
    <Link href={href} className="group">
      <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-black group-hover:bg-gray-800 rounded-lg flex items-center justify-center text-white transition-colors">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-black">
              {title}
            </h3>
            <p className="text-xs text-gray-500 mt-1 truncate">
              {description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface ActivityItemProps {
  action: string;
  description: string;
  time: string;
  type: 'user' | 'order' | 'product';
}

function ActivityItem({ action, description, time, type }: ActivityItemProps) {
  const getTypeIcon = () => {
    switch (type) {
      case 'user':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      case 'order':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        );
      case 'product':
        return (
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="flex items-start space-x-3 py-2">
      {getTypeIcon()}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{action}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="text-xs text-gray-400">{time}</div>
    </div>
  );
}