import ProductCard from './ProductCard'

const ProductGrid = ({ products, discount = 0 }) => {
    if (products.length === 0) {
        return (
            <div className='text-center py-12 bg-gray-50 rounded-lg'>
                <p className='text-text-secondary text-lg'>No product match your filter</p>
            </div>
        )
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {products.map(product => (
                <ProductCard key={product._id} product={product} discount={discount} />
            ))}
        </div>
    )
}

export default ProductGrid