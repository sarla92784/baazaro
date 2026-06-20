import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Navbar from './components/Navbar/Navbar'
import './index.css'

// Lazy load all pages — they only download when the user visits them
const Home = lazy(() => import('./pages/Home'))
const CartPage = lazy(() => import('./pages/CartPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))

// Simple loading spinner shown while a page is loading
function PageLoader() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
      Loading...
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" />
  return children
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Suspense shows PageLoader while lazy pages are downloading */}
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </main>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App