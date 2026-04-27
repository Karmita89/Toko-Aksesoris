import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const inventories = await prisma.inventory.findMany({
      include: {
        product: true
      },
      orderBy: { updatedAt: 'desc' }
    })
    return NextResponse.json(inventories)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch inventories' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { productId, quantity, location } = await request.json()

    const inventory = await prisma.inventory.create({
      data: {
        productId,
        quantity,
        location
      }
    })

    return NextResponse.json(inventory, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create inventory' }, { status: 500 })
  }
}