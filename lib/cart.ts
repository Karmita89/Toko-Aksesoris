export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  stock?: number
}

const CART_STORAGE_KEY = 'akschim_cart'

/**
 * Get cart from localStorage
 */
export function getCart(): CartItem[] {
  if (typeof window === 'undefined') {
    return []
  }
  
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY)
    return cart ? JSON.parse(cart) : []
  } catch (error) {
    console.error('Failed to get cart:', error)
    return []
  }
}

/**
 * Save cart to localStorage
 */
function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  } catch (error) {
    console.error('Failed to save cart:', error)
  }
}

/**
 * Add item to cart or update quantity if it already exists
 */
export function addToCart(item: CartItem): CartItem[] {
  const cart = getCart()
  const existingItem = cart.find(i => i.id === item.id)
  
  if (existingItem) {
    existingItem.quantity += item.quantity
  } else {
    cart.push(item)
  }
  
  saveCart(cart)
  return cart
}

/**
 * Add product to cart (alias for addToCart with Product type)
 */
export function addProductToCart(product: Product, quantity: number = 1): CartItem[] {
  const cartItem: CartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: quantity,
    image: product.image
  }
  return addToCart(cartItem)
}

/**
 * Remove item from cart
 */
export function removeCartItem(itemId: string): CartItem[] {
  const cart = getCart()
  const filtered = cart.filter(i => i.id !== itemId)
  saveCart(filtered)
  return filtered
}

/**
 * Update item quantity
 */
export function updateCartQuantity(itemId: string, quantity: number): CartItem[] {
  const cart = getCart()
  const item = cart.find(i => i.id === itemId)
  
  if (item) {
    if (quantity <= 0) {
      return removeCartItem(itemId)
    }
    item.quantity = quantity
  }
  
  saveCart(cart)
  return cart
}

/**
 * Clear all items from cart
 */
export function clearCart(): CartItem[] {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CART_STORAGE_KEY)
  }
  return []
}

/**
 * Get cart total
 */
export function getCartTotal(items?: CartItem[]): number {
  const cart = items || getCart()
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
}

/**
 * Get cart item count
 */
export function getCartCount(items?: CartItem[]): number {
  const cart = items || getCart()
  return cart.reduce((count, item) => count + item.quantity, 0)
}
