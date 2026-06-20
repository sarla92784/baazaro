import { createContext, useContext, useState, useEffect } from 'react'

// Step 1: Create the context object
// Think of this as a "global variable" that any component can access
const CartContext = createContext()

// Step 2: Create the Provider component
// This wraps your whole app and makes cart data available everywhere
export function CartProvider({ children }) {
  // Load cart from localStorage on first render (so cart survives page refresh)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  // Every time cart changes, save it to localStorage automatically
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  // Add a product to cart — if it already exists, increase quantity instead
  function addToCart(product) {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)

      if (existingItem) {
        // Product already in cart — just increase quantity by 1
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      // New product — add it with quantity 1
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  // Remove a product completely from cart
  function removeFromCart(productId) {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  // Change quantity directly (used by +/- buttons in cart)
  function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
      removeFromCart(productId)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  // Empty the entire cart (used after checkout)
  function clearCart() {
    setCart([])
  }

  // Total number of items (used for the badge on Navbar)
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0)

  // Total price of everything in cart
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{
      cart,
      cartCount,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

// Step 3: Custom hook so any component can use the cart easily
// Instead of writing useContext(CartContext) every time, just write useCart()
export function useCart() {
  return useContext(CartContext)
}