import { FaFilterCircleXmark } from "react-icons/fa6";

const FilterSidebar = ({ filters, setFilters }) => {
    const genderOptions = ['men', 'women', 'boys', 'girls'];
    const categoryOptions = ['bridal', 'ethnic'];

    // Handle gender single value
    const handleGenderChange = (gender) => {
        setFilters({ ...filters, gender });
    };

    // Handle category multiple values(array)
    const handleCategoryChange = (category) => {
        let updated = [...filters.category];
        if (updated.includes(category)) {
            updated = updated.filter(c => c !== category);
        } else {
            updated.push(category);
        }
        setFilters({ ...filters, category: updated });
    };

    const clearFilters = () => {
        setFilters({
            gender: "",
            category: ""
        });
    };

    return (
        <aside className="bg-accent p-6 rounded-lg shadow-md h-full overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 sticky top-0 py-2">
                <h2 className="text-xl font-bold text-text-primary">Filters</h2>
                <button
                    onClick={clearFilters}
                    className="text-2xl text-neutral hover:text-primary transition"
                    title="Clear all filters"
                >
                    <FaFilterCircleXmark />
                </button>
            </div>

            {/* Gender Filter (Radio) */}
            <div className="mb-8">
                <h3 className="font-semibold mb-3 text-text-primary border-b pb-2">
                    Gender
                </h3>
                <div className="space-y-3">
                    {genderOptions.map(gender => (
                        <label
                            key={gender}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <input
                                type="radio"
                                name="gender"
                                value={gender}
                                checked={filters.gender === gender}
                                onChange={() => handleGenderChange(gender)}
                                className="w-4 h-4 text-primary focus:ring-primary"
                            />
                            <span className="capitalize text-text-secondary group-hover:text-primary transition">
                                {gender}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Category Filter (Checkbox) */}
            <div>
                <h3 className="font-semibold mb-3 text-text-primary border-b pb-2">
                    Collection Type
                </h3>
                <div className="space-y-3">
                    {categoryOptions.map(category => (
                        <label
                            key={category}
                            className="flex items-center gap-3 cursor-pointer group"
                        >
                            <input
                                type="checkbox"
                                checked={filters.category.includes(category)}
                                onChange={() => handleCategoryChange(category)}
                                className="w-4 h-4 text-primary rounded focus:ring-primary"
                            />
                            <span className="capitalize text-text-secondary group-hover:text-primary transition">
                                {category}
                            </span>
                        </label>
                    ))}
                    {filters.category.length > 0 && (
                        <p className="text-xs text-primary mt-1">
                            {filters.category.length} selected
                        </p>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default FilterSidebar;
