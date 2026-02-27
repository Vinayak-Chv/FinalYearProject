import { FiSearch } from "react-icons/fi";

const SearchSort = ({ searchTerm, setSearchTerm, sortBy, setSortyBy }) => {
    return (
        <div className="flex items-center gap-2 bg-white border border-neutral-light rounded-lg focus-within:border-primary transition">
            {/* Search Icon */}
            <FiSearch className="ml-3 text-neutral" />

            {/* Search Input */}
            <input type="text" placeholder="Search lehenga, sherwani, gown..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="flex-1 py-3 outline-none" />

            {/* Divider */}
            <div className="w-px h-6 bg-neutral-light"></div>

            {/* Sort Dropdown */}
            <select value={sortBy} onChange={e => setSortyBy(e.target.value)} className="px-3 py-3 outline-none bg-transparent text-text-secondary cursor-pointer">
                <option value='default'>Sort by: Default</option>
                <option value='price-low'>Sort by: Low to High</option>
                <option value='price-high'>Sort by: High to Low</option>
            </select>
        </div>
    )
}

export default SearchSort