import { useState, useEffect } from "react";
import { FaFilterCircleXmark } from "react-icons/fa6";

const FilterSidebar = ({
    filters,
    setFilters,
    fabricOptions,
    minPrice,
    maxPrice,
}) => {
    // Local state for the slider (max price)
    const [localMax, setLocalMax] = useState(filters.priceMax !== "" ? filters.priceMax : maxPrice);

    useEffect(() => {
        setLocalMax(filters.priceMax !== "" ? filters.priceMax : maxPrice);
    }, [filters.priceMax, maxPrice]);

    const handleMaxChange = (e) => {
        const val = Number(e.target.value);
        setLocalMax(val);
        setFilters({ ...filters, priceMax: val });
    };

    const handleInStockChange = () => {
        setFilters({ ...filters, inStock: !filters.inStock });
    };
    const handleCustomizableChange = () => {
        setFilters({ ...filters, customizable: !filters.customizable });
    };
    const handleFabricChange = (fabric) => {
        const updated = filters.fabric.includes(fabric)
            ? filters.fabric.filter((f) => f !== fabric)
            : [...filters.fabric, fabric];
        setFilters({ ...filters, fabric: updated });
    };
    const clearFilters = () => {
        setFilters({
            priceMin: "",
            priceMax: "",
            inStock: false,
            customizable: false,
            fabric: [],
        });
        setLocalMax(maxPrice);
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

            {/* Price Range – Single Slider for Max */}
            <div className="mb-6">
                <h3 className="font-semibold mb-2 text-text-primary">Max Price</h3>
                <div className="flex justify-between text-sm mb-1">
                    <span>₹{minPrice}</span>
                    <span>₹{localMax}</span>
                </div>
                <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={localMax ?? 0}
                    onChange={handleMaxChange}
                    className="w-full accent-primary"
                />
                <p className="text-xs text-text-secondary mt-1">Showing items up to ₹{localMax}</p>
            </div>

            {/* In Stock Toggle */}
            <div className="mb-4">
                <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-text-secondary">In Stock only</span>
                    <button
                        type="button"
                        onClick={handleInStockChange}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${filters.inStock ? "bg-primary" : "bg-neutral-light"
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${filters.inStock ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>
                </label>
            </div>

            {/* Customizable Toggle */}
            <div className="mb-6">
                <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-text-secondary">Customizable only</span>
                    <button
                        type="button"
                        onClick={handleCustomizableChange}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${filters.customizable ? "bg-primary" : "bg-neutral-light"
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${filters.customizable ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>
                </label>
            </div>

            {/* Fabric Filter */}
            {fabricOptions?.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-2 text-text-primary border-b pb-2">Fabric</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {fabricOptions.map((fabric) => (
                            <label key={fabric} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.fabric.includes(fabric)}
                                    onChange={() => handleFabricChange(fabric)}
                                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                                />
                                <span className="capitalize text-text-secondary">{fabric}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
};

export default FilterSidebar;