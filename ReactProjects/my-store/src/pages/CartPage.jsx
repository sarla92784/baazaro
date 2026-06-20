import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import './ProductCard.css'

function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="product-card">

      <Link to={`/product/${product.id}`}>
        <div className="product-image-wrapper">
          <img
            src={product.image}
            alt={product.title}
            className="product-image"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-title">{product.title}</h3>

        <div className="product-rating">
          <span className="stars">{'★'.repeat(Math.round(product.rating.rate))}{'☆'.repeat(5 - Math.round(product.rating.rate))}</span>
          <span className="rating-count">({product.rating.count})</span>
        </div>

        <div className="product-footer">
          <span className="product-price">₹{(product.price * 83).toFixed(0)}</span>
          <button
            className="add-to-cart-btn"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>

    </div>
  )
}

export default ProductCard