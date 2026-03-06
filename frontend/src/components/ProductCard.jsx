import { Link } from 'react-router-dom'

const ProductCard = ({ product }) => {
    return (
        <Link to={`/collection/product/${product._id}`}>
            <div className='bg-white rounded-lg shadow-md overflow-hidden cursor-pointer'>
                <img src={product.images[0]} alt={product.title} className='w-full h-88 object-cover' />
                <div className='p-4'>
                    <h3 className='font-semibold hover:underline'>{product.title}</h3>
                    <p className='text-primary font-bold mt-2'>₹{product.price}</p>
                </div>
            </div>
        </Link>
    )
}

export default ProductCard