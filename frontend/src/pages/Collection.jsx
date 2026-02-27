import { useState, useMemo } from 'react'
import { useProducts } from '../Context/productContext'
import FilterSidebar from '../components/FilterSidebar'
import ProductGrid from '../components/ProductGrid'
import SearchSort from '../components/SearchSort'

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
    category: ""
  })

  const [sortBy, setSortBy] = useState('default')
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(product => {
    const productGender = product?.gender?.toLowerCase() || ''

    const productCategories = product?.category
      ? Array.isArray(product.category)
        ? product.category
        : product.category.split(/[,|]/)
      : []

    const normalizedCategories = productCategories
      .map(c => c.toLowerCase().trim())

    // Search filter
    if (searchTerm) {
      const titleMatch = product.title?.toLowerCase().includes(searchTerm.toLowerCase())
      if (!titleMatch) return false
    }

    // Gender filter
    if (filters.gender && filters.gender !== productGender) {
      return false
    }

    // Category filter
    if (filters.category.length > 0) {
      const selectedCategories = filters.category.map(c => c.toLowerCase())

      const hasBridal = selectedCategories.includes('bridal')
      const hasEthnic = selectedCategories.includes('ethnic')

      // If both bridal + ethnic are selected → show fusion only
      if (hasBridal && hasEthnic) {
        if (!normalizedCategories.includes('fusion')) {
          return false
        }
      }
      // If only one category selected → normal behavior
      else {
        if (!selectedCategories.some(selected => normalizedCategories.includes(selected))) {
          return false
        }
      }
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

  if (loading) {
    return <div className='text-center py-2'>Loading...</div>
  }

  return (
    <div className='flex gap-8 min-h-screen pt-8'>
      <aside className='w-[30%] sticky top-20 self-start'>
        <FilterSidebar filters={filters} setFilters={setFilters} />
      </aside>

      <main className='w-[70%] overflow-y-auto pr-2 custom-scrollbar'>
        <div className='sticky top-0 bg-background py-4 z-10 w-[75%]'>
          <SearchSort searchTerm={searchTerm} setSearchTerm={setSearchTerm} sortBy={sortBy} setSortyBy={setSortBy} />
        </div>

        <p className='text-sm text-text-secondary text-right mb-4 w-auto flex justify-start'>
          {sortedProducts.length} {sortedProducts.length === 1 ? "item" : "items"} found
        </p>

        <ProductGrid products={sortedProducts} />
      </main>
    </div>
  )
}

export default Collection
