import React from 'react'

const ProductCard = ({ product }) => {
    return (
        <div className='bg-white rounded-lg shadow-md overflow-hidden'>
            <img src={product.images[0]} alt={product.title} className='w-full h-88 object-cover' />
            <div className='p-4'>
                <h3 className='font-semibold'>{product.title}</h3>
                <p className='text-primary font-bold mt-2'>₹{product.price}</p>
            </div>
        </div>
    )
}

export default ProductCard