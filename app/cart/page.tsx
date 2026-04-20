'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import {
  CartItem,
  clearCart,
  getCart,
  getCartTotal,
  removeCartItem,
  updateCartQuantity
} from '@/lib/cart'

const formatCurrency = (value: number) =>
  `Rp ${value.toLocaleString('id-ID')}`

export default function CartPage() {
  const { data: session, status } = useSession()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setCartItems(getCart())
  }, [])

  const total = useMemo(() => getCartTotal(cartItems), [cartItems])

  const handleQuantityChange = (id: string, quantity: number) => {
    const updated = updateCartQuantity(id, quantity)
    setCartItems(updated)
  }

  const handleRemoveItem = (id: string) => {
    const updated = removeCartItem(id)
    setCartItems(updated)
  }

  const handleOrder = async () => {
    if (status !== 'authenticated') {
      signIn()
      return
    }

    if (!cartItems.length) {
      setMessage('Keranjang Anda masih kosong.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: (session.user as any).id,
          items: cartItems.map(item => ({
            productId: item.id, // Assuming id matches database product id
            quantity: item.quantity,
            price: item.price
          })),
          total
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const order = await response.json()
      setCartItems(clearCart())
      setMessage(`Terima kasih ${session?.user?.name ?? 'pelanggan'}! Pesanan Anda berhasil dibuat dengan ID: ${order.id}`)
    } catch (error) {
      setMessage('Gagal membuat pesanan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AksChim</h1>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/products" className="hover:text-blue-600">Produk</Link>
            <Link href="/cart" className="hover:text-blue-600 font-bold">Cart</Link>
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
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold">Keranjang Belanja</h2>
            <p className="text-gray-600">Login diperlukan untuk menyelesaikan pemesanan.</p>
          </div>
          <div className="rounded-lg bg-blue-50 border border-blue-100 p-4 text-blue-700">
            {status === 'authenticated'
              ? `Terhubung sebagai ${session.user?.name ?? session.user?.email}`
              : 'Silakan login untuk memesan.'}
          </div>
        </div>

        {message && (
          <div className={`mb-6 rounded-lg p-4 ${message.includes('berhasil') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
            {message}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">Keranjang belanja Anda kosong.</p>
            <Link href="/products" className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Lanjut Belanja
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-5xl">{item.image}</div>
                      <h3 className="text-xl font-bold mt-3">{item.name}</h3>
                      <p className="text-gray-600">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="flex flex-col gap-3 items-start md:items-end">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">Ringkasan Pesanan</h3>
              <div className="mb-4 flex justify-between text-gray-700">
                <span>Total Item</span>
                <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="mb-6 flex justify-between text-lg font-semibold">
                <span>Total Harga</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <button
                onClick={handleOrder}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Memproses...' : (status === 'authenticated' ? 'Pesan Sekarang' : 'Login untuk Memesan')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
