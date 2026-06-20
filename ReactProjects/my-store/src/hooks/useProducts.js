import { useState, useEffect } from 'react'
import { getProducts, getCategories } from '../services/api'

function useProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ])
        setProducts(productsData || [])
        setCategories(['all', ...(categoriesData || [])])
      } catch (err) {
        // If Supabase has no products yet, fall back gracefully
        setError('Failed to load products.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { products, categories, loading, error }
}

export default useProducts