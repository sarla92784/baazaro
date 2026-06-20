import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { getProductById } from '../services/api'
import './ProductDetail.css'

const formatPrice = (price) => `₹${Number(price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    getProductById(id)
      .then(data => setProduct(data))
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  function handleAddToCart() {
    addToCart({
      id: product.id,
      title: product.name || product.title,
      price: product.price,
      image: product.image_url || product.image,
      category: product.category
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  if (loading) return <div className="detail-status">Loading product...</div>
  if (error) return <div className="detail-status error">{error}</div>

  return (
    <div className="product-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="detail-layout">
        <div className="detail-image-wrapper">
          <img
            src={product.image_url || product.image}
            alt={product.name || product.title}
            className="detail-image"
          />
        </div>

        <div className="detail-info">
          <p className="detail-category">{product.category}</p>
          <h1 className="detail-title">{product.name || product.title}</h1>

          {/* Only show rating if it exists (FakeStore has it, Supabase doesn't) */}
          {product.rating && (
            <div className="detail-rating">
              <span className="stars">
                {'★'.repeat(Math.round(product.rating.rate))}
                {'☆'.repeat(5 - Math.round(product.rating.rate))}
              </span>
              <span className="rating-text">
                {product.rating.rate} out of 5 ({product.rating.count} reviews)
              </span>
            </div>
          )}

          <p className="detail-price">{formatPrice(product.price)}</p>

          <div className="detail-divider" />

          <p className="detail-description">{product.description}</p>

          <div className="detail-divider" />

          <button
            className={`detail-add-btn ${added ? 'added' : ''}`}
            onClick={handleAddToCart}
          >
            {added ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail