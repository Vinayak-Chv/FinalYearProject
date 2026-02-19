import React from 'react'
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom'

const Browse = () => {
    const navigate = useNavigate()

    return (
        <div className='w-full h-auto flex justify-center items-center flex-col gap-2'>
            <h1 className='font-bold text-text-primary-primary text-4xl'>What are you looking for?</h1>

            <div className='flex justify-between items-center gap-6'>
                <button className='btn bg-linear-to-br from-secondary to-secondary-dark' onClick={() => navigate("/collection")}>READY-TO WEAR (Designs) <FaArrowRightLong className='text-3xl' /></button>
                <button className='btn bg-linear-to-br from-primary to-primary-dark' onClick={() => navigate("/tailor")}>CUSTOM TAILORING (Services) <FaArrowRightLong className='text-3xl' /></button>
            </div>
        </div>
    )
}

export default Browse