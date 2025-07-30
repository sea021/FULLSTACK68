import Link from "next/link";

export default function Navigation() {
  return (
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Nextshop</h1>
          <nav className="space-x-4">
            <Link href="/" className="text-gray-600 hover:text-blue-500">Home</Link>
            <Link href="#" className="text-gray-600 hover:text-blue-500">Shop</Link>
            <Link href="#" className="text-gray-600 hover:text-blue-500">Contact</Link>
            <Link href="/login" className="text-gray-600 hover:text-blue-500">Login</Link>
            <Link href="/register" className="text-gray-600 hover:text-blue-500">Register</Link>
          </nav>
        </div>
      </header>
  )
}
