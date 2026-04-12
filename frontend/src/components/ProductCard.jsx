import { Link } from 'react-router-dom'

const ProductCard = ({ product, discount = 0 }) => {
    const originalPrice = product.price;
    const discountedPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;

    return (
        <Link to={`/collection/product/${product._id}`}>
            <div className='bg-white rounded-lg shadow-md overflow-hidden cursor-pointer'>
                <img src={product.images[0]} alt={product.title} className='w-full h-88 object-cover' />
                <div className='p-4'>
                    <h3 className='font-semibold hover:underline'>{product.title}</h3>
                    <div className='mt-2'>
                        {discount > 0 ? (
                            <div className='flex items-center gap-2'>
                                <span className='text-gray-400 line-through text-sm'>₹{originalPrice}</span>
                                <span className='text-red-600 font-bold text-lg'>₹{Math.round(discountedPrice)}</span>
                                <span className='bg-red-100 text-red-600 text-xs px-1 rounded'>{discount}% OFF</span>
                            </div>
                        ) : (
                            <p className='text-primary font-bold'>₹{originalPrice}</p>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard