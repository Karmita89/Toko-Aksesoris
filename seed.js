const products = [
  { name: 'Kalung Silver', price: 150000, image: '🪙', description: 'Kalung perak berkualitas tinggi', category: 'Kalung' },
  { name: 'Gelang Beads', price: 80000, image: '✨', description: 'Gelang manik-manik cantik', category: 'Gelang' },
  { name: 'Earring Gold', price: 120000, image: '💎', description: 'Anting emas elegan', category: 'Anting' },
  { name: 'Anklet Pearl', price: 95000, image: '⚪', description: 'Gelang kaki mutiara', category: 'Gelang Kaki' },
  { name: 'Ring Diamond', price: 200000, image: '💍', description: 'Cincin berlian mewah', category: 'Cincin' }
]

async function seedProducts() {
  for (const product of products) {
    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      })
      if (response.ok) {
        console.log(`Seeded: ${product.name}`)
      }
    } catch (error) {
      console.error(`Failed to seed: ${product.name}`)
    }
  }
}

seedProducts()
