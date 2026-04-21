'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { addProductToCart, getCart, getCartCount, Product } from '@/lib/cart'

export const dynamic = 'force-dynamic'

const formatCurrency = (value: number) =>
  `Rp ${value.toLocaleString('id-ID')}`

export default function ProductsPage() {
  const { data: session } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [notification, setNotification] = useState('')
  const [animating, setAnimating] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
    setCartCount(getCartCount(getCart()))
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    addProductToCart(product)
    setCartCount(getCartCount(getCart()))
    setNotification(`${product.name} berhasil ditambahkan ke keranjang.`)
    setAnimating(product.id)
    setTimeout(() => {
      setNotification('')
      setAnimating(null)
    }, 3000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AksChim</h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/products" className="hover:text-blue-600 font-bold">Produk</Link>
            <Link href="/cart" className="hover:text-blue-600 relative">
              Cart ({cartCount})
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {cartCount}
                </span>
              )}
            </Link>
            {session ? (
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-blue-600 hover:text-blue-800"
              >
                Logout
              </button>
            ) : (
              <Link href="/auth/signin" className="hover:text-blue-600">Login</Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-bold">Koleksi Aksesoris</h2>
          <p className="text-sm text-gray-600">Tambahkan barang ke keranjang, lalu pesan setelah login.</p>
        </div>

        {notification && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
            {notification}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow p-6 relative overflow-hidden">
              {animating === product.id && (
                <div className="absolute inset-0 bg-green-100 opacity-50 animate-pulse"></div>
              )}
              <div className="text-6xl mb-4">{product.image}</div>
              <h3 className="text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">{formatCurrency(product.price)}</p>
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-200"
              >
                Tambah ke Keranjang
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
