import { useMemo, useState } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import { useProducts } from '../Context/productContext'
import { FaWandMagicSparkles } from "react-icons/fa6";
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { products } = useProducts()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedAge, setSelectedAge] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)

  if (!products || products.length === 0) {
    return <div className="text-center py-12">Loading...</div>
  }

  const product = products.find(p => p._id === id)

  if (!product) {
    return <div className='text-center py-12'>Product not found</div>
  }

  const isKid = Array.isArray(product.ageRange) && product.ageRange.length > 0
  const discountFromQuery = Number(searchParams.get("discount") || 0) || 0
  const discountFromState = Number(location.state?.discountPercentage || 0) || 0
  const discount = discountFromState || discountFromQuery
  const originalPrice = product.price

  const { priceType, selectedPrice } = useMemo(() => {
    // Prefer explicit navigation state (coming from a collection card),
    // fall back to query param if user reloads the detail page.
    const stateType = location.state?.priceType
    const stateSelected = location.state?.selectedPrice
    if (typeof stateSelected === "number" && stateSelected > 0) {
      return { priceType: stateType || (discount > 0 ? "event" : "normal"), selectedPrice: stateSelected }
    }

    const discounted = discount > 0 ? Math.round(originalPrice * (1 - discount / 100)) : originalPrice
    return { priceType: discount > 0 ? "event" : "normal", selectedPrice: discounted }
  }, [location.state, discount, originalPrice])

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart')
      return
    }
    addToCart(product, selectedPrice, discount, priceType)
    toast.success('Added to cart')
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <div className='grid md:grid-cols-2'>
        {/* Left: Images */}
        <div>
          <img
            src={product.images?.[selectedImage]}
            alt={product.title}
            className='w-9/12 h-11/12 object-cover rounded-lg'
          />
          {product.images?.length > 1 && (
            <div className='flex gap-2 mt-4'>
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt=''
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${selectedImage === idx ? 'border-primary' : 'border-transparent'
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div>
          <h1 className='text-3xl font-bold text-text-primary'>{product.title}</h1>

          {discount > 0 ? (
            <div className="mt-4 flex items-center gap-3">
              <span className="text-gray-400 line-through text-lg">₹{originalPrice}</span>
              <span className="text-2xl font-bold text-primary">₹{selectedPrice}</span>
              <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">{discount}% OFF</span>
            </div>
          ) : (
            <p className='text-2xl font-bold text-primary mt-4'>₹{originalPrice}</p>
          )}

          <div className='mt-6 space-y-2'>
            <div>
              <h3 className='font-semibold mb-2'>Gender</h3>
              <p className='text-text-secondary capitalize'>{product.gender}</p>
            </div>

            {!isKid && (
              <div>
                <h3 className="font-semibold mb-2">Category</h3>
                <p className="text-text-secondary capitalize">
                  {product.category}
                </p>
              </div>
            )}

            {product.fabric && (
              <div>
                <h3 className='font-semibold mb-2'>Fabric</h3>
                <p className='text-text-secondary'>{product.fabric.join(', ')}</p>
              </div>
            )}

            {product.colorsAvailable && (
              <div>
                <h3 className='font-semibold mb-2'>Colors Available</h3>
                <p className='text-text-secondary'>{product.colorsAvailable.join(', ')}</p>
              </div>
            )}

            {isKid && product.ageRange?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Select Age Range</h3>

                <div className="flex flex-wrap gap-2">
                  {product.ageRange.map((age) => (
                    <button
                      key={age}
                      onClick={() => setSelectedAge(age)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium cursor-pointer transition
                        ${selectedAge === age
                          ? 'border-primary text-primary bg-primary/5'
                          : 'border-gray-300 text-text-secondary hover:border-primary'
                        }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isKid && product.sizes?.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Select Size</h3>

                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium cursor-pointer transition 
                        ${selectedSize === size
                          ? 'border-primary text-primary bg-primary/5'
                          : 'border-gray-300 text-text-secondary hover:border-primary'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.isCustomizable && (
              <div className='bg-accent-light text-primary-dark px-4 py-2 rounded-lg flex justify-center-safe items-center w-50 gap-2'>
                <FaWandMagicSparkles /> Customizable
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className='w-full bg-primary text-white py-3 rounded-lg mt-8 hover:bg-primary-dark transition cursor-pointer'
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail