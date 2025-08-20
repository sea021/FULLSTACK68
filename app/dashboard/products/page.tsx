"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { Products } from "../../generated/prisma";

interface ApiError {
  message: string;
  status?: number;
}

export default function ProductManagement() {
    const [products, setProducts] = useState<Products[]>([])
    const [editingProduct, setEditingProduct] = useState<Products | null>(null);
    const [newProduct, setNewProduct] = useState({
        name: "",
        price: 0,
        description: "",
        category: "",
        image: "",
    });
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get("/api/product");
            if (res.data.data) {
                setProducts(res.data.data);
            } else {
                setProducts([]);
            }
        } catch (error: any) {
            console.error("Failed to fetch products", error);
            setError("Failed to load product data. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteProduct(id: string, productName: string) {
        if (!confirm(`Are you sure you want to delete product "${productName}"?`)) return;
        
        try {
            setActionLoading(`delete-${id}`);
            await axios.delete("/api/product", { data: { id } });
            await fetchProducts();
        } catch (error: any) {
            console.error("Error deleting product", error);
            const errorMessage = error.response?.data?.message || "Failed to delete product";
            alert(`Error occurred: ${errorMessage}`);
        } finally {
            setActionLoading(null);
        }
    }

    function openEditModal(product: Products) {
        setEditingProduct(product);
    }

    function closeEditModal() {
        setEditingProduct(null);
    }

    async function handleUpdateProduct() {
        if (!editingProduct) return;

        // Validation
        if (!editingProduct.name.trim()) {
            alert("Please enter product name");
            return;
        }
        if (editingProduct.price <= 0) {
            alert("Please enter a valid price");
            return;
        }

        try {
            setActionLoading("update");
            await axios.put("/api/product", editingProduct);
            await fetchProducts();
            closeEditModal();
        } catch (error: any) {
            console.error("Error updating product", error);
            const errorMessage = error.response?.data?.message || "Failed to update product";
            alert(`Error occurred: ${errorMessage}`);
        } finally {
            setActionLoading(null);
        }
    }

    async function handleAddProduct() {
        // Validation
        if (!newProduct.name.trim()) {
            alert("Please enter product name");
            return;
        }
        if (newProduct.price <= 0) {
            alert("Please enter a valid price");
            return;
        }
        if (!newProduct.category.trim()) {
            alert("Please enter product category");
            return;
        }

        try {
            setActionLoading("add");
            await axios.post("/api/product", newProduct);
            await fetchProducts();
            setShowAddModal(false);
            setNewProduct({
                name: "", 
                price: 0, 
                description: "", 
                category: "", 
                image: "",
            });
        } catch (error: any) {
            console.error("Error adding product", error);
            const errorMessage = error.response?.data?.message || "Failed to add product";
            alert(`Error occurred: ${errorMessage}`);
        } finally {
            setActionLoading(null);
        }
    }

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Get unique categories
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

    return (
        <>
            <main className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                                <p className="text-gray-600 mt-2">Manage your store's product catalog</p>
                            </div>
                            <Link href="/dashboard">
                                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <span>Back to Dashboard</span>
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <div className="flex">
                                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <div className="ml-3">
                                    <p className="text-red-800">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Controls */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                            <div className="flex flex-col sm:flex-row gap-4 flex-1">
                                {/* Search */}
                                <div className="relative flex-1 max-w-md">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-black"
                                    />
                                </div>

                                {/* Category Filter */}
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-black"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category || ''}>
                                            {category || 'Uncategorized'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Add Product Button */}
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center space-x-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Add Product</span>
                            </button>
                        </div>

                        {/* Results count */}
                        <div className="mt-4 text-sm text-gray-600">
                            Showing {filteredProducts.length} of {products.length} products
                        </div>
                    </div>

                    {/* Products Table */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading products...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                                <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                                >
                                    Add your first product
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredProducts.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-12 w-12">
                                                            {product.image ? (
                                                                <img
                                                                    src={product.image}
                                                                    alt={product.name}
                                                                    className="h-12 w-12 rounded-lg object-cover"
                                                                />
                                                            ) : (
                                                                <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                                                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        {product.category || 'Uncategorized'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    ฿{product.price.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                    {product.description || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => openEditModal(product)}
                                                        className="text-black hover:text-gray-600 mr-4"
                                                        disabled={actionLoading === `delete-${product.id}`}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product.id, product.name)}
                                                        className="text-red-600 hover:text-red-900"
                                                        disabled={actionLoading === `delete-${product.id}`}
                                                    >
                                                        {actionLoading === `delete-${product.id}` ? (
                                                            <div className="w-4 h-4 animate-spin rounded-full border-b-2 border-red-600"></div>
                                                        ) : (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Edit Modal */}
                {editingProduct && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Edit Product</h2>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                        value={editingProduct.name}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (฿)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                        value={editingProduct.price}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, price: +e.target.value })}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <input
                                        type="text"
                                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                        value={editingProduct.category ?? ""}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        rows={3}
                                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                        value={editingProduct.description ?? ""}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                    <input
                                        type="url"
                                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                        value={editingProduct.image}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                                    />
                                    {editingProduct.image && (
                                        <img src={editingProduct.image} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-lg" />
                                    )}
                                </div>
                            </div>
                            
                            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                    onClick={closeEditModal}
                                    disabled={actionLoading === "update"}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center space-x-2"
                                    onClick={handleUpdateProduct}
                                    disabled={actionLoading === "update"}
                                >
                                    {actionLoading === "update" && (
                                        <div className="w-4 h-4 animate-spin rounded-full border-b-2 border-white"></div>
                                    )}
                                    <span>Update Product</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Modal */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">Add New Product</h2>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter product name"
                                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (฿)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: +e.target.value })}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Electronics, Clothing"
                                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Product description..."
                                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://example.com/image.jpg"
                                        className="text-black w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                        value={newProduct.image}
                                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                    />
                                    {newProduct.image && (
                                        <img src={newProduct.image} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-lg" />
                                    )}
                                </div>
                            </div>
                            
                            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                                <button
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                    onClick={() => setShowAddModal(false)}
                                    disabled={actionLoading === "add"}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors flex items-center space-x-2"
                                    onClick={handleAddProduct}
                                    disabled={actionLoading === "add"}
                                >
                                    {actionLoading === "add" && (
                                        <div className="w-4 h-4 animate-spin rounded-full border-b-2 border-white"></div>
                                    )}
                                    <span>Add Product</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}