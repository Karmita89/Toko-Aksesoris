import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  const role = session?.user?.role

  if (!session || (role !== 'SUPERADMIN' && role !== 'ADMIN')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { userId, role: newRole } = body

  if (!userId || !newRole) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!['SUPERADMIN', 'ADMIN', 'USER'].includes(newRole)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole }
    })

    return NextResponse.json({ success: true, user: { id: updatedUser.id, role: updatedUser.role } })
  } catch (error) {
    console.error('Update role error:', error)
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 })
  }
}
