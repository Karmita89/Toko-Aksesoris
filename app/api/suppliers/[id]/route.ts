import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.supplier.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ message: 'Supplier deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete supplier' }, { status: 500 })
  }
}