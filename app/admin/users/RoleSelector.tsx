'use client'

import { useState } from 'react'

interface RoleSelectorProps {
  userId: string
  currentRole: string
}

const ROLE_OPTIONS = ['SUPERADMIN', 'ADMIN', 'USER']

export default function RoleSelector({ userId, currentRole }: RoleSelectorProps) {
  const [role, setRole] = useState(currentRole)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const updateRole = async (newRole: string) => {
    setSaving(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/users/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data?.error || 'Gagal memperbarui role')
        return
      }

      setRole(newRole)
      setMessage('Role berhasil diperbarui')
    } catch (error) {
      setMessage('Gagal memperbarui role. Silakan coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-2">
      <select
        value={role}
        onChange={(e) => updateRole(e.target.value)}
        disabled={saving}
        className="border rounded px-3 py-2 text-sm"
      >
        {ROLE_OPTIONS.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {message && <p className="text-xs text-gray-500">{message}</p>}
    </div>
  )
}
