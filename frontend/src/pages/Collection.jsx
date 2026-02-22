import { useState, useMemo } from 'react'
import { useProducts } from '../Context/productContext'
import FilterSidebar from '../components/FilterSidebar'
import ProductGrid from '../components/ProductGrid'

const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const Collection = () => {
  const { products, loading } = useProducts()

  const [filters, setFilters] = useState({
    gender: "",
    category: []
  })

  const [sortBy, setSortBy] = useState('default')

  // 🔒 Hooks MUST run before any return
  const filteredProducts = products.filter(product => {
    const productGender = product?.gender?.toLowerCase() || ''
    const productCategory = product?.category?.toLowerCase() || ''

    if (filters.gender && filters.gender !== productGender) {
      return false
    }

    if (
      filters.category.length > 0 &&
      !filters.category.some(c => productCategory.includes(c))
    ) {
      return false
    }

    return true
  })

  const shuffledProducts = useMemo(
    () => shuffleArray(filteredProducts),
    [filteredProducts]
  )

  const sortedProducts = [...shuffledProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    return 0
  })

  // ✅ Safe early return AFTER hooks
  if (loading) {
    return <div className='text-center py-2'>Loading...</div>
  }

  return (
    <div className='flex gap-8 min-h-screen pt-8'>
      <div className='w-[30%] sticky top-20 self-start'>
        <FilterSidebar filters={filters} setFilters={setFilters} />
      </div>

      <main className='w-[70%] overflow-y-auto pr-2 custom-scrollbar'>
        <div className='flex justify-between items-center mb-4 sticky top-0 bg-background py-4 z-10'>
          <p className='text-text-secondary'>
            {sortedProducts.length}{' '}
            {sortedProducts.length === 1 ? 'product' : 'products'} found
          </p>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className='border border-neutral-light rounded-lg px-4 py-2 focus:outline-none focus:border-primary'
          >
            <option value='default'>Sort by: Default</option>
            <option value='price-low'>Sort by: Low to High</option>
            <option value='price-high'>Sort by: High to Low</option>
          </select>
        </div>

        <ProductGrid products={sortedProducts} />
      </main>
    </div>
  )
}

export default Collection
