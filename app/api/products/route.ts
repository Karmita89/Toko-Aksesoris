import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // For high traffic: Consider caching with Redis or Next.js ISR
    // revalidate: 60 // Cache for 1 minute
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          supplier: true // Include supplier info for display
        }
      }),
      prisma.product.count()
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, price, image, description, category, stock } = await request.json()

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        image: image || '🛍️',
        description,
        category: category || 'Aksesoris',
        stock: parseInt(stock) || 0
      }
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
