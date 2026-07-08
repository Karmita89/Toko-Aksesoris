import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Validation functions
function validateEmail(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !email.trim()) {
    return { valid: false, error: 'Email tidak boleh kosong' }
  }
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Format email tidak valid' }
  }
  return { valid: true }
}

function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Password tidak boleh kosong' }
  }
  if (password.length < 8) {
    return { valid: false, error: 'Password minimal 8 karakter' }
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password harus mengandung huruf besar (A-Z)' }
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password harus mengandung angka (0-9)' }
  }
  return { valid: true }
}

function validateName(name: string): { valid: boolean; error?: string } {
  if (!name || !name.trim()) {
    return { valid: false, error: 'Nama tidak boleh kosong' }
  }
  if (name.length < 3) {
    return { valid: false, error: 'Nama minimal 3 karakter' }
  }
  if (name.length > 100) {
    return { valid: false, error: 'Nama maksimal 100 karakter' }
  }
  return { valid: true }
}

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json()

    // Validate inputs
    const nameValidation = validateName(name)
    if (!nameValidation.valid) {
      return NextResponse.json(
        { error: nameValidation.error },
        { status: 400 }
      )
    }

    const emailValidation = validateEmail(email)
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      )
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.error },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar. Silakan login atau gunakan email lain.' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name: name.trim(),
        role: 'USER'
      }
    })

    return NextResponse.json(
      { message: 'Registrasi berhasil! Silakan login.', userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat registrasi. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}