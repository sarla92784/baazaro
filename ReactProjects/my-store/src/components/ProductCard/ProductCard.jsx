import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import './ProductCard.css'

const formatPrice = (price) => `₹${Number(price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`}>
        <div className="product-image-wrapper">
          <img
            src={product.image_url || product.image}
            alt={product.name || product.title}
            className="product-image"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-title">{product.name || product.title}</h3>

        {/* Only show rating if product has it */}
        {product.rating && (
          <div className="product-rating">
            <span className="stars">
              {'★'.repeat(Math.round(product.rating.rate))}
              {'☆'.repeat(5 - Math.round(product.rating.rate))}
            </span>
            <span className="rating-count">({product.rating.count})</span>
          </div>
        )}

        <div className="product-footer">
          <span className="product-price">{formatPrice(product.price)}</span>
          <button
            className="add-to-cart-btn"
            onClick={() => addToCart({
              id: product.id,
              title: product.name || product.title,
              price: product.price,
              image: product.image_url || product.image,
              category: product.category
            })}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard