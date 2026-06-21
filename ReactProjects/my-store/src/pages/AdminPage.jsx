import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../services/supabase'
import './AdminPage.css'

const formatPrice = (price) => `₹${Number(price).toLocaleString('en-IN')}`

function AdminPage() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()

  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('products')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    name: '', description: '', price: '', image_url: '', category: '', stock: ''
  })

  // Redirect if not admin
  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (!isAdmin(user.email)) { navigate('/'); return }
    fetchData()
  }, [user])

  async function fetchData() {
    setLoading(true)
    const { data: productsData } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setProducts(productsData || [])
    setOrders(ordersData || [])
    setLoading(false)
  }

  function updateForm(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function openAddForm() {
    setForm({ name: '', description: '', price: '', image_url: '', category: '', stock: '' })
    setEditingProduct(null)
    setShowForm(true)
  }

  function openEditForm(product) {
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      image_url: product.image_url || '',
      category: product.category || '',
      stock: product.stock || 0
    })
    setEditingProduct(product)
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.name || !form.price) {
      setMessage('Name and price are required')
      return
    }

    const productData = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      image_url: form.image_url,
      category: form.category,
      stock: Number(form.stock) || 0
    }

    if (editingProduct) {
      await supabase.from('products').update(productData).eq('id', editingProduct.id)
      setMessage('Product updated!')
    } else {
      await supabase.from('products').insert([productData])
      setMessage('Product added!')
    }

    setShowForm(false)
    fetchData()
    setTimeout(() => setMessage(''), 3000)
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    setMessage('Product deleted!')
    fetchData()
    setTimeout(() => setMessage(''), 3000)
  }

  if (loading) return <div className="admin-loading">Loading admin panel...</div>

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>🛍️ Baazaro Admin</h1>
        <div className="admin-stats">
          <div className="stat">
            <span className="stat-num">{products.length}</span>
            <span className="stat-label">Products</span>
          </div>
          <div className="stat">
            <span className="stat-num">{orders.length}</span>
            <span className="stat-label">Orders</span>
          </div>
        </div>
      </div>

      {message && <div className="admin-message">{message}</div>}

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="admin-products">
          <div className="admin-actions">
            <button className="add-product-btn" onClick={openAddForm}>
              + Add New Product
            </button>
          </div>

          {showForm && (
            <div className="product-form-overlay">
              <div className="product-form">
                <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>

                <div className="form-group">
                  <label>Product Name *</label>
                  <input className="form-input" placeholder="Cotton Kurta" value={form.name} onChange={e => updateForm('name', e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-input" rows={3} placeholder="Product description..." value={form.description} onChange={e => updateForm('description', e.target.value)} />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₹) *</label>
                    <input className="form-input" type="number" placeholder="999" value={form.price} onChange={e => updateForm('price', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input className="form-input" type="number" placeholder="50" value={form.stock} onChange={e => updateForm('stock', e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select className="form-input" value={form.category} onChange={e => updateForm('category', e.target.value)}>
                    <option value="">Select category</option>
                    <option>Mens Clothing</option>
                    <option>Womens Clothing</option>
                    <option>Electronics</option>
                    <option>Jewellery</option>
                    <option>Footwear</option>
                    <option>Accessories</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Image URL</label>
                  <input className="form-input" placeholder="https://..." value={form.image_url} onChange={e => updateForm('image_url', e.target.value)} />
                  {form.image_url && (
                    <img src={form.image_url} alt="preview" className="image-preview" />
                  )}
                </div>

                <div className="form-buttons">
                  <button className="save-btn" onClick={handleSave}>
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button className="cancel-btn" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="table-product-img"
                      />
                    </td>
                    <td className="product-name-cell">{product.name}</td>
                    <td>{product.category}</td>
                    <td>{formatPrice(product.price)}</td>
                    <td>
                      <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                        {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                      </span>
                    </td>
                    <td>
                      <button className="edit-btn" onClick={() => openEditForm(product)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(product.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="admin-orders">
          {orders.length === 0 ? (
            <p className="no-orders">No orders yet</p>
          ) : (
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td className="order-id">#{order.id.slice(0, 8)}</td>
                      <td>{order.shipping?.fullName || 'N/A'}</td>
                      <td>{order.items?.length || 0} items</td>
                      <td>{formatPrice(order.total)}</td>
                      <td>
                        <span className={`status-badge ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{new Date(order.created_at).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminPage