'use client'

import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AksChim</h1>
          <div className="space-x-4">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/products" className="hover:text-blue-600">Produk</Link>
            <Link href="/cart" className="hover:text-blue-600">Cart</Link>
            <Link href="/about" className="hover:text-blue-600 font-bold">Tentang</Link>
            <Link href="/auth/signin" className="hover:text-blue-600">Login</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-12 px-4">
        <h2 className="text-4xl font-bold mb-8">Tentang AksChim</h2>
        
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h3 className="text-2xl font-bold mb-4">Misi Kami</h3>
          <p className="text-gray-600 mb-4">
            AksChim adalah platform e-commerce terpercaya untuk menjual aksesoris berkualitas tinggi dengan harga yang kompetitif. Kami berkomitmen untuk memberikan pengalaman berbelanja yang terbaik bagi pelanggan kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-8">
            <h3 className="text-2xl font-bold mb-4">🏭 Manufaktur</h3>
            <p className="text-gray-600">
              Kami bekerja sama dengan manufaktur terkemuka untuk menghasilkan aksesoris berkualitas premium dengan standar internasional.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-8">
            <h3 className="text-2xl font-bold mb-4">📦 Supply Chain</h3>
            <p className="text-gray-600">
              Sistem logistik kami yang canggih memastikan produk sampai ke tangan pelanggan dengan cepat dan aman.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-8">
            <h3 className="text-2xl font-bold mb-4">✅ Kualitas Terjamin</h3>
            <p className="text-gray-600">
              Setiap produk melalui quality control ketat untuk memastikan kepuasan pelanggan 100%.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-8">
            <h3 className="text-2xl font-bold mb-4">💬 Customer Support</h3>
            <p className="text-gray-600">
              Tim customer service kami siap membantu Anda 24/7 untuk segala pertanyaan dan keluhan.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-8 mt-8">
          <h3 className="text-2xl font-bold mb-4">Hubungi Kami</h3>
          <div className="text-gray-600 space-y-2">
            <p>📧 Email: info@akschim.com</p>
            <p>📞 Telepon: +62 123 4567 8900</p>
            <p>📍 Alamat: Jl. Aksesoris No. 123, Jakarta, Indonesia</p>
          </div>
        </div>
      </div>
    </div>
  )
}