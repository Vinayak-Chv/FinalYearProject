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

    // Apply filters
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

        // Category
        if ((filters.category || []).length > 0) {
            const selectedCategories = filters.category.map(c => c.toLowerCase());

            if (!selectedCategories.some(cat => normalizedCategories.includes(cat))) {
                return false;
            }
        }

        // Price
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

    if (loading) return <div className='text-center py-12'>Loading...</div>;

    return (
        <div className='flex gap-8 min-h-screen pt-8'>

            {/* FIXED SIDEBAR */}
            <aside className='w-[30%] sticky top-24 self-start'>
                <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    fabricOptions={fabricOptions}
                    minPrice={priceBounds.min}
                    maxPrice={priceBounds.max}
                />
            </aside>

            {/* RIGHT SIDE */}
            <main className='w-[70%] overflow-y-auto pr-2 custom-scrollbar'>

                <div className='sticky top-0 bg-background py-4 z-10'>
                    <SearchSort
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />
                </div>

                <p className='text-sm text-text-secondary text-right mb-4'>
                    {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"} found
                </p>

                <ProductGrid products={filteredProducts} />
            </main>
        </div>
    );
};

export default GenderCollection;
