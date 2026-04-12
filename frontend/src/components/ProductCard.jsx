import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product, discount = 0 }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const originalPrice = product.price;
    const discountedPrice = discount > 0 ? originalPrice * (1 - discount / 100) : originalPrice;
    const finalPrice = discount > 0 ? Math.round(discountedPrice) : originalPrice;

    const handleAddToCart = (e) => {
        e.preventDefault(); // prevent navigation to product detail
        if (!user) {
            toast.error('Please login to add items to cart');
            return;
        }
        addToCart(product, finalPrice, discount);
        toast.success('Added to cart');
    };

    return (
        <Link to={`/collection/product/${product._id}`} className="block">
            <div className='bg-white rounded-lg shadow-md overflow-hidden cursor-pointer'>
                <img src={product.images[0]} alt={product.title} className='w-full h-88 object-cover' />
                <div className='p-4'>
                    <h3 className='font-semibold hover:underline'>{product.title}</h3>
                    <div className='mt-2'>
                        {discount > 0 ? (
                            <div className='flex items-center gap-2'>
                                <span className='text-gray-400 line-through text-sm'>₹{originalPrice}</span>
                                <span className='text-red-600 font-bold text-lg'>₹{finalPrice}</span>
                                <span className='bg-red-100 text-red-600 text-xs px-1 rounded'>{discount}% OFF</span>
                            </div>
                        ) : (
                            <p className='text-primary font-bold'>₹{originalPrice}</p>
                        )}
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="mt-3 w-full bg-primary text-white py-1 rounded hover:bg-primary-dark transition"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;