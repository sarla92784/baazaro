import ProductList from '../components/ProductList/ProductList'

function Home() {
  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>
        All Products
      </h2>
      <ProductList />
    </div>
  )
}

export default Home