import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../Context/productContext';
import FilterSidebar from '../components/FilterSidebar';
import ProductGrid from '../components/ProductGrid';
import SearchSort from '../components/SearchSort';

const OutfitTypeCollection = () => {
    const { gender, outfitType } = useParams();
    const { products, loading } = useProducts();

    const [filters, setFilters] = useState({
        gender: gender,        // pre‑set gender
        category: ""
    });
    const [sortBy, setSortBy] = useState('default');
    const [searchTerm, setSearchTerm] = useState("");

    // Filter by gender + outfitType
    const filteredByType = useMemo(() => {
        return products.filter(p =>
            p?.gender?.toLowerCase() === gender &&
            p?.outfitType?.toLowerCase() === outfitType
        );
    }, [products, gender, outfitType]);

    // Apply additional filters (category, search) on the type‑filtered list
    const filteredProducts = filteredByType.filter(product => {
        const productGender = product?.gender?.toLowerCase() || '';

        const productCategories = product?.category
            ? Array.isArray(product.category)
                ? product.category
                : product.category.split(/[,|]/)
            : [];
        const normalizedCategories = productCategories.map(c => c.toLowerCase().trim());

        if (searchTerm) {
            const titleMatch = product.title?.toLowerCase().includes(searchTerm.toLowerCase());
            if (!titleMatch) return false;
        }

        if (filters.gender && filters.gender !== productGender) return false;

        if (filters.category.length > 0) {
            const selectedCategories = filters.category.map(c => c.toLowerCase());
            const hasBridal = selectedCategories.includes('bridal');
            const hasEthnic = selectedCategories.includes('ethnic');

            if (hasBridal && hasEthnic) {
                if (!normalizedCategories.includes('fusion')) return false;
            } else {
                if (!selectedCategories.some(selected => normalizedCategories.includes(selected))) return false;
            }
        }
        return true;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0;
    });

    if (loading) return <div className='text-center py-12'>Loading...</div>;

    // Capitalise display names
    const displayGender = gender.charAt(0).toUpperCase() + gender.slice(1);
    const displayOutfit = outfitType.charAt(0).toUpperCase() + outfitType.slice(1);

    return (
        <div className='flex gap-8 min-h-screen pt-8'>
            <aside className='w-[30%] sticky top-20 self-start'>
                <FilterSidebar filters={filters} setFilters={setFilters} />
            </aside>

            <main className='w-[70%] overflow-y-auto pr-2 custom-scrollbar'>
                <div className='sticky top-0 bg-background py-4 z-10'>
                    <SearchSort
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        sortBy={sortBy}
                        setSortyBy={setSortBy}
                    />
                </div>
                <h1 className='text-2xl font-bold text-text-primary mb-2'>
                    {displayGender} {displayOutfit}
                </h1>
                <p className='text-sm text-text-secondary mb-4'>
                    {sortedProducts.length} {sortedProducts.length === 1 ? "item" : "items"} found
                </p>
                <ProductGrid products={sortedProducts} />
            </main>
        </div>
    );
};

export default OutfitTypeCollection;