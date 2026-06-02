'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export const dynamic = 'force-dynamic'

interface ValidationErrors {
  name?: string
  email?: string
  password?: string
  passwordConfirm?: string
}

function PasswordStrengthIndicator({ password }: { password: string }) {
  let strength = 0
  let color = 'bg-gray-300'
  let label = 'Sangat lemah'

  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9]/.test(password)) strength++

  if (strength === 1) {
    color = 'bg-red-500'
    label = 'Lemah'
  } else if (strength === 2) {
    color = 'bg-yellow-500'
    label = 'Sedang'
  } else if (strength === 3) {
    color = 'bg-green-500'
    label = 'Kuat'
  }

  return password ? (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded ${i <= strength ? color : 'bg-gray-300'}`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-600">Kekuatan password: {label}</p>
    </div>
  ) : null
}

export default function RegisterPage() {
  const session = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', passwordConfirm: '' })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (session?.data) {
      router.replace('/')
    }
  }, [session, router])

  // Client-side validation
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Nama tidak boleh kosong'
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nama minimal 3 karakter'
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email tidak boleh kosong'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password tidak boleh kosong'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter'
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password harus mengandung huruf besar (A-Z)'
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password harus mengandung angka (0-9)'
    }

    // Validate password confirmation
    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Konfirmasi password tidak boleh kosong'
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Password tidak cocok'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')
    setSuccess(false)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.toLowerCase().trim(),
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setServerError(data?.error || 'Registrasi gagal, coba lagi.')
        return
      }

      setSuccess(true)
      setFormData({ name: '', email: '', password: '', passwordConfirm: '' })
      
      setTimeout(() => {
        router.push('/auth/signin')
      }, 2000)
    } catch (error) {
      setServerError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">AksChim Register</h1>
        <p className="text-center text-gray-600 mb-6">Buat akun baru untuk berbelanja</p>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Registrasi berhasil! Anda akan dialihkan ke halaman login...
          </div>
        )}

        {serverError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Nama Lengkap</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
              className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 transition ${
                errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Masukkan email Anda"
              className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 transition ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Minimal 8 karakter dengan huruf besar dan angka"
              className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 transition ${
                errors.password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
            <PasswordStrengthIndicator password={formData.password} />
          </div>

          {/* Password Confirmation */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Konfirmasi Password</label>
            <input
              type="password"
              value={formData.passwordConfirm}
              onChange={(e) => handleChange('passwordConfirm', e.target.value)}
              placeholder="Ulangi password Anda"
              className={`w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 transition ${
                errors.passwordConfirm
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.passwordConfirm && <p className="text-red-600 text-sm mt-1">{errors.passwordConfirm}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Registrasi...' : 'Buat Akun'}
          </button>
        </form>

        {/* Links */}
        <p className="text-center mt-6 text-gray-600">
          Sudah punya akun?{' '}
          <Link href="/auth/signin" className="text-blue-600 hover:underline font-bold">
            Login di sini
          </Link>
        </p>

        <Link href="/" className="block text-center mt-4 text-gray-600 hover:text-blue-600 transition">
          ← Kembali ke Home
        </Link>
      </div>
    </div>
  )
}
