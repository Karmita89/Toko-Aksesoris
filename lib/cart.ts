export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  category: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

const CART_STORAGE_KEY = 'cart';

function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setStoredCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export function getCart(): CartItem[] {
  return getStoredCart();
}

export function addProductToCart(product: Product): void {
  const cart = getStoredCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  setStoredCart(cart);
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function clearCart(): CartItem[] {
  setStoredCart([]);
  return [];
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function removeCartItem(id: string): CartItem[] {
  const cart = getStoredCart().filter(item => item.id !== id);
  setStoredCart(cart);
  return cart;
}

export function updateCartQuantity(id: string, quantity: number): CartItem[] {
  if (quantity <= 0) {
    return removeCartItem(id);
  }

  const cart = getStoredCart();
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity = quantity;
    setStoredCart(cart);
  }
  return cart;
}