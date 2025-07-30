export default function Footer() {
  return (
      <footer className="bg-white shadow-inner py-6">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Nextshop. All rights reserved.
        </div>
      </footer>
  )
}
