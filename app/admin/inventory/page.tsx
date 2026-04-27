'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Inventory {
  id: string
  productId: string
  product: {
    name: string
  }
  quantity: number
  location: string
}

interface Product {
  id: string
  name: string
}

export default function AdminInventoryPage() {
  const [inventories, setInventories] = useState<Inventory[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    location: ''
  })

  useEffect(() => {
    fetchInventories()
    fetchProducts()
  }, [])

  const fetchInventories = async () => {
    try {
      const response = await fetch('/api/inventory')
      if (response.ok) {
        const data = await response.json()
        setInventories(data)
      }
    } catch (error) {
      console.error('Failed to fetch inventories')
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || data)
      }
    } catch (error) {
      console.error('Failed to fetch products')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity)
        })
      })
      if (response.ok) {
        setShowForm(false)
        setFormData({ productId: '', quantity: '', location: '' })
        fetchInventories()
      }
    } catch (error) {
      console.error('Failed to create inventory')
    }
  }

  const deleteInventory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inventory entry?')) return
    try {
      await fetch(`/api/inventory/${id}`, { method: 'DELETE' })
      fetchInventories()
    } catch (error) {
      console.error('Failed to delete inventory')
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AksChim Admin - Inventory</h1>
          <Link href="/admin" className="hover:text-blue-600">Back to Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Manage Inventory</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Add Inventory'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={formData.productId}
                onChange={(e) => setFormData({...formData, productId: e.target.value})}
                className="border p-2 rounded"
                required
              >
                <option value="">Select Product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="border p-2 rounded"
                required
              />
            </div>
            <button type="submit" className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Create Inventory Entry
            </button>
          </form>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inventories.map(inventory => (
                <tr key={inventory.id}>
                  <td className="px-6 py-4">{inventory.product.name}</td>
                  <td className="px-6 py-4">{inventory.quantity}</td>
                  <td className="px-6 py-4">{inventory.location}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => deleteInventory(inventory.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}