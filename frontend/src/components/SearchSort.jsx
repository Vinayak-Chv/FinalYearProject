import { FiSearch } from "react-icons/fi";

const SearchSort = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="flex items-center gap-2 bg-white border border-neutral-light rounded-lg focus-within:border-primary transition">
            <FiSearch className="ml-3 text-neutral" />

            <input
                type="text"
                placeholder="Search lehenga, sherwani, gown..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-1 py-3 outline-none"
            />
        </div>
    )
}

export default SearchSort;
