import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.inventory.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ message: 'Inventory deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete inventory' }, { status: 500 })
  }
}