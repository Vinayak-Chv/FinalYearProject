import { useNavigate } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

const OutfitTypeCard = ({ gender, outfitType }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/collection/${gender}/${outfitType}`);
    };

    // Capitalize first letter
    const displayName = outfitType.charAt(0).toUpperCase() + outfitType.slice(1);

    return (
        <div
            onClick={handleClick}
            className='bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1'
        >
            <div className='flex items-center justify-between'>
                <span className='font-medium text-text-primary'>{displayName}</span>
                <FiChevronRight className='text-primary' />
            </div>
        </div>
    );
};

export default OutfitTypeCard;