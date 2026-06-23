import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import './CartPage.css'

const formatPrice = (price) => `₹${Number(price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

function CartPage() {
  const { cart, cartTotal, removeFromCart, updateQuantity } = useCart()

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <p className="empty-cart-icon">🛒</p>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started</p>
        <Link to="/" className="continue-btn">Continue Shopping</Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h2 className="cart-title">Your Cart ({cart.length} items)</h2>

      <div className="cart-layout">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.title} className="cart-item-image" />

              <div className="cart-item-details">
                <p className="cart-item-title">{item.title}</p>
                <p className="cart-item-price">{formatPrice(item.price)}</p>

                <div className="quantity-controls">
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                  <span className="qty-number">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
              </div>

              <div className="cart-item-right">
                <p className="cart-item-subtotal">{formatPrice(item.price * item.quantity)}</p>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3 className="summary-title">Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free-shipping">Free</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row total-row">
            <span>Total</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
          <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
          <Link to="/" className="keep-shopping-btn">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}

export default CartPage