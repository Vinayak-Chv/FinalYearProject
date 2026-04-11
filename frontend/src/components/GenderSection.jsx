import { useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import OutfitTypeCard from './OutfitTypeCard';

const GenderSection = ({ gender, title, products }) => {
    const navigate = useNavigate();

    // Extract unique outfit types from products of this gender
    const outfitTypes = [...new Set(products.map(p => p.outfitType?.toLowerCase()).filter(Boolean))];

    const handleGenderClick = () => {
        navigate(`/collection/${gender}`);
    };

    return (
        <div className='mb-12'>
            {/* Gender Header with Arrow */}
            <div
                onClick={handleGenderClick}
                className='flex items-center justify-between cursor-pointer group mb-6'
            >
                <h2 className='text-2xl font-bold text-text-primary group-hover:text-primary transition'>
                    {title}
                </h2>
                <FiArrowRight className='text-2xl text-text-primary group-hover:text-primary transition transform group-hover:translate-x-1' />
            </div>

            {/* Outfit Type Cards Row */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
                {outfitTypes.map(outfit => (
                    <OutfitTypeCard
                        key={outfit}
                        gender={gender}
                        outfitType={outfit}
                    />
                ))}
            </div>
        </div>
    );
};

export default GenderSection;