import ProductCard from './ProductCard.jsx'
import { useProducts } from '../Context/productContext.jsx'

const FeaturedProducts = () => {
    const { products, loading } = useProducts()

    if (loading) return <div>Loading...</div>

    // Filter by gender and pick one random from each
    const menProducts = products.filter(p => p.gender === 'men' || p.gender === 'Men')
    const womenProducts = products.filter(p => p.gender === 'women' || p.gender === 'Women')
    const kidsProductsMen = products.filter(p => p.gender === 'boys' || p.gender === 'Boys' || p.gender === 'kids')
    const kidsProductsWomen = products.filter(p => p.gender === 'girls' || p.gender === 'Girls' || p.gender === 'kids')

    // Pick random one from each category
    const getRandomProduct = (arr) => arr[Math.floor(Math.random() * arr.length)]

    const featuredProducts = [
        getRandomProduct(menProducts),
        getRandomProduct(womenProducts),
        getRandomProduct(kidsProductsMen),
        getRandomProduct(kidsProductsWomen)
    ].filter(Boolean) // Remove any undefined if category empty

    return (
        <div className='w-full h-auto flex justify-center items-center flex-col gap-2'>
            <h1 className='font-bold text-text-primary text-4xl mb-2'>Designs for Every Gender and Age</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                {featuredProducts.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    )
}

export default FeaturedProducts