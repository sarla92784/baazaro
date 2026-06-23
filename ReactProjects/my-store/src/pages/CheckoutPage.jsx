import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import './CheckoutPage.css'

const formatPrice = (price) => `₹${Number(price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [shipping, setShipping] = useState({ fullName: '', email: '', address: '', city: '', zipCode: '' })
  const [payment, setPayment] = useState({ cardNumber: '', expiry: '', cvv: '' })
  const [orderId, setOrderId] = useState('')

  function updateShipping(field, value) { setShipping(prev => ({ ...prev, [field]: value })) }
  function updatePayment(field, value) { setPayment(prev => ({ ...prev, [field]: value })) }

  function validateShipping() {
    const e = {}
    if (!shipping.fullName.trim()) e.fullName = 'Full name is required'
    if (!shipping.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(shipping.email)) e.email = 'Enter a valid email'
    if (!shipping.address.trim()) e.address = 'Address is required'
    if (!shipping.city.trim()) e.city = 'City is required'
    if (!shipping.zipCode.trim()) e.zipCode = 'ZIP code is required'
    return e
  }

  function validatePayment() {
    const e = {}
    if (payment.cardNumber.replace(/\s/g, '').length !== 16) e.cardNumber = 'Card must be 16 digits'
    if (!/^\d{2}\/\d{2}$/.test(payment.expiry)) e.expiry = 'Use MM/YY format'
    if (payment.cvv.length < 3) e.cvv = 'CVV must be 3 digits'
    return e
  }

  function handleShippingNext() {
    const e = validateShipping()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setErrors({})
    setStep(2)
  }

  function handlePlaceOrder() {
    const e = validatePayment()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    const id = Math.random().toString(36).substr(2, 9).toUpperCase()
    setOrderId(id)
    const order = { id, items: cart, total: cartTotal, shipping, date: new Date().toLocaleDateString() }
    const existing = JSON.parse(localStorage.getItem('orders') || '[]')
    localStorage.setItem('orders', JSON.stringify([...existing, order]))
    clearCart()
    setStep(3)
  }

  function handleCardInput(value) {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    updatePayment('cardNumber', digits.replace(/(.{4})/g, '$1 ').trim())
  }

  function handleExpiryInput(value) {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    updatePayment('expiry', digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits)
  }

  if (step === 3) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-card">
          <div className="confirmation-icon">✅</div>
          <h2>Order Confirmed!</h2>
          <p>Thank you for your purchase, {shipping.fullName}!</p>
          <div className="order-id-box">
            <span>Order ID</span>
            <strong>#{orderId}</strong>
          </div>
          <p className="confirmation-email">Confirmation sent to <strong>{shipping.email}</strong></p>
          <button className="back-home-btn" onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <h2 className="checkout-title">Checkout</h2>

      <div className="steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>
          <div className="step-circle">1</div>
          <span>Shipping</span>
        </div>
        <div className="step-line" />
        <div className={`step ${step >= 2 ? 'active' : ''}`}>
          <div className="step-circle">2</div>
          <span>Payment</span>
        </div>
      </div>

      <div className="checkout-layout">
        <div className="checkout-form">

          {step === 1 && (
            <div className="form-section">
              <h3>Shipping Information</h3>
              <div className="form-group">
                <label>Full Name</label>
                <input className={`form-input ${errors.fullName ? 'input-error' : ''}`} placeholder="John Doe" value={shipping.fullName} onChange={e => updateShipping('fullName', e.target.value)} />
                {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input className={`form-input ${errors.email ? 'input-error' : ''}`} placeholder="you@example.com" value={shipping.email} onChange={e => updateShipping('email', e.target.value)} />
                {errors.email && <span className="error-msg">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label>Address</label>
                <input className={`form-input ${errors.address ? 'input-error' : ''}`} placeholder="123 Main Street" value={shipping.address} onChange={e => updateShipping('address', e.target.value)} />
                {errors.address && <span className="error-msg">{errors.address}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input className={`form-input ${errors.city ? 'input-error' : ''}`} placeholder="Mumbai" value={shipping.city} onChange={e => updateShipping('city', e.target.value)} />
                  {errors.city && <span className="error-msg">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label>PIN Code</label>
                  <input className={`form-input ${errors.zipCode ? 'input-error' : ''}`} placeholder="400001" value={shipping.zipCode} onChange={e => updateShipping('zipCode', e.target.value)} />
                  {errors.zipCode && <span className="error-msg">{errors.zipCode}</span>}
                </div>
              </div>
              <button className="next-btn" onClick={handleShippingNext}>Continue to Payment →</button>
            </div>
          )}

          {step === 2 && (
            <div className="form-section">
              <h3>Payment Details</h3>
              <p className="test-note">💳 Use any 16-digit number for testing</p>
              <div className="form-group">
                <label>Card Number</label>
                <input className={`form-input ${errors.cardNumber ? 'input-error' : ''}`} placeholder="1234 5678 9012 3456" value={payment.cardNumber} onChange={e => handleCardInput(e.target.value)} />
                {errors.cardNumber && <span className="error-msg">{errors.cardNumber}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input className={`form-input ${errors.expiry ? 'input-error' : ''}`} placeholder="MM/YY" value={payment.expiry} onChange={e => handleExpiryInput(e.target.value)} />
                  {errors.expiry && <span className="error-msg">{errors.expiry}</span>}
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input className={`form-input ${errors.cvv ? 'input-error' : ''}`} placeholder="123" maxLength={3} value={payment.cvv} onChange={e => updatePayment('cvv', e.target.value.replace(/\D/g, ''))} />
                  {errors.cvv && <span className="error-msg">{errors.cvv}</span>}
                </div>
              </div>
              <div className="btn-row">
                <button className="back-btn" onClick={() => { setStep(1); setErrors({}) }}>← Back</button>
                <button className="place-order-btn" onClick={handlePlaceOrder}>Place Order</button>
              </div>
            </div>
          )}
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          {cart.map(item => (
            <div key={item.id} className="summary-item">
              <img src={item.image} alt={item.title} className="summary-item-img" />
              <div className="summary-item-info">
                <p className="summary-item-title">{item.title}</p>
                <p className="summary-item-qty">Qty: {item.quantity}</p>
              </div>
              <span className="summary-item-price">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="summary-divider" />
          <div className="summary-row"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
          <div className="summary-row"><span>Shipping</span><span className="free">Free</span></div>
          <div className="summary-divider" />
          <div className="summary-row total"><span>Total</span><span>{formatPrice(cartTotal)}</span></div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage