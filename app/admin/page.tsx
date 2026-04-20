'use client'

import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AksChim Admin</h1>
          <Link href="/" className="hover:text-blue-600">Logout</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold mb-8">Dashboard Admin</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/inventory" className="bg-white rounded-lg shadow p-6 hover:shadow-lg">
            <h3 className="text-xl font-bold mb-2">📦 Inventory Management</h3>
            <p className="text-gray-600">Kelola stok produk dan lokasi gudang</p>
          </Link>

          <Link href="/admin/suppliers" className="bg-white rounded-lg shadow p-6 hover:shadow-lg">
            <h3 className="text-xl font-bold mb-2">🏭 Suppliers</h3>
            <p className="text-gray-600">Kelola supplier dan manufaktur</p>
          </Link>

          <Link href="/admin/orders" className="bg-white rounded-lg shadow p-6 hover:shadow-lg">
            <h3 className="text-xl font-bold mb-2">📋 Orders</h3>
            <p className="text-gray-600">Kelola pesanan pelanggan</p>
          </Link>

          <Link href="/admin/products" className="bg-white rounded-lg shadow p-6 hover:shadow-lg">
            <h3 className="text-xl font-bold mb-2">🏷️ Produk</h3>
            <p className="text-gray-600">Tambah dan edit produk</p>
          </Link>

          <Link href="/admin/users" className="bg-white rounded-lg shadow p-6 hover:shadow-lg">
            <h3 className="text-xl font-bold mb-2">👥 Users</h3>
            <p className="text-gray-600">Kelola pengguna sistem</p>
          </Link>

          <Link href="/admin/reports" className="bg-white rounded-lg shadow p-6 hover:shadow-lg">
            <h3 className="text-xl font-bold mb-2">📊 Reports</h3>
            <p className="text-gray-600">Laporan penjualan dan analytics</p>
          </Link>
        </div>
      </div>
    </div>
  )
}