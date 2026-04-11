import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../Context/productContext';
import FilterSidebar from '../components/FilterSidebar';
import ProductGrid from '../components/ProductGrid';
import SearchSort from '../components/SearchSort';

const GenderCollection = () => {
    const { gender } = useParams();
    const { products, loading } = useProducts();

    const [filters, setFilters] = useState({
        gender: gender,
        category: [],
        priceMin: "",
        priceMax: "",
        inStock: false,
        customizable: false,
        fabric: []
    });

    const [sortBy, setSortBy] = useState('default');
    const [searchTerm, setSearchTerm] = useState("");

    // Filter products by gender
    const genderFiltered = useMemo(() => {
        return products.filter(p => p?.gender?.toLowerCase() === gender);
    }, [products, gender]);

    // Price range
    const priceBounds = useMemo(() => {
        if (genderFiltered.length === 0) return { min: 0, max: 10000 };
        const prices = genderFiltered.map(p => p.price || 0);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices),
        };
    }, [genderFiltered]);

    // Fabric options
    const fabricOptions = useMemo(() => {
        const fabrics = new Set();
        genderFiltered.forEach(p => {
            if (Array.isArray(p.fabric)) {
                p.fabric.forEach(f => fabrics.add(f.toLowerCase()));
            }
        });
        return Array.from(fabrics).sort();
    }, [genderFiltered]);

    // Apply ALL filters
    const filteredProducts = genderFiltered.filter(product => {
        const productGender = product?.gender?.toLowerCase() || '';

        const productCategories = product?.category
            ? Array.isArray(product.category)
                ? product.category
                : product.category.split(/[,|]/)
            : [];
        const normalizedCategories = productCategories.map(c => c.toLowerCase().trim());

        // Search
        if (searchTerm) {
            const titleMatch = product.title?.toLowerCase().includes(searchTerm.toLowerCase());
            if (!titleMatch) return false;
        }

        // Gender
        if (filters.gender && filters.gender !== productGender) return false;

        // Category
        if ((filters.category || []).length > 0) {
            const selectedCategories = filters.category.map(c => c.toLowerCase());
            const hasBridal = selectedCategories.includes('bridal');
            const hasEthnic = selectedCategories.includes('ethnic');

            if (hasBridal && hasEthnic) {
                if (!normalizedCategories.includes('fusion')) return false;
            } else {
                if (!selectedCategories.some(selected => normalizedCategories.includes(selected))) return false;
            }
        }

        // Price
        if (filters.priceMin !== "" && product.price < filters.priceMin) return false;
        if (filters.priceMax !== "" && product.price > filters.priceMax) return false;

        // Stock
        if (filters.inStock && !product.inStock) return false;

        // Customizable
        if (filters.customizable && !product.isCustomizable) return false;

        // Fabric
        if ((filters.fabric || []).length > 0) {
            const productFabrics = product.fabric?.map(f => f.toLowerCase()) || [];
            if (!filters.fabric.some(f => productFabrics.includes(f))) return false;
        }

        return true;
    });

    // Sorting
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        return 0;
    });

    if (loading) return <div className='text-center py-12'>Loading...</div>;

    return (
        <div className='flex gap-8 min-h-screen pt-8'>
            <aside className='w-[30%] sticky top-20 self-start'>
                <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    fabricOptions={fabricOptions}
                    minPrice={priceBounds.min}
                    maxPrice={priceBounds.max}
                />
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

                <p className='text-sm text-text-secondary text-right mb-4'>
                    {sortedProducts.length} {sortedProducts.length === 1 ? "item" : "items"} found
                </p>

                <ProductGrid products={sortedProducts} />
            </main>
        </div>
    );
};

export default GenderCollection;
