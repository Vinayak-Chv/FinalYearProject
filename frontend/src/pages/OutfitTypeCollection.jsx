import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../Context/productContext';
import FilterSidebar from '../components/FilterSidebar';
import ProductGrid from '../components/ProductGrid';

const OutfitTypeCollection = () => {
    const { gender, outfitType } = useParams();
    const { products, loading } = useProducts();

    // Base products filtered by gender + outfitType
    const baseProducts = useMemo(() => {
        return products.filter(p =>
            p?.gender?.toLowerCase() === gender &&
            p?.outfitType?.toLowerCase() === outfitType
        );
    }, [products, gender, outfitType]);

    // Compute min and max price from baseProducts (for slider)
    const priceBounds = useMemo(() => {
        if (baseProducts.length === 0) return { min: 0, max: 10000 };
        const prices = baseProducts.map(p => p.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices),
        };
    }, [baseProducts]);

    // Extract unique fabric names
    const fabricOptions = useMemo(() => {
        const fabrics = new Set();
        baseProducts.forEach(p => {
            if (p.fabric && Array.isArray(p.fabric)) {
                p.fabric.forEach(f => fabrics.add(f.toLowerCase()));
            }
        });
        return Array.from(fabrics).sort();
    }, [baseProducts]);

    // Filters state
    const [filters, setFilters] = useState({
        priceMin: "",
        priceMax: "",
        inStock: false,
        customizable: false,
        fabric: [],
    });

    // Apply all filters
    const filteredProducts = baseProducts.filter(product => {
        if (filters.priceMin !== "" && product.price < filters.priceMin) return false;
        if (filters.priceMax !== "" && product.price > filters.priceMax) return false;
        if (filters.inStock && !product.inStock) return false;
        if (filters.customizable && !product.isCustomizable) return false;
        if (filters.fabric.length > 0) {
            const productFabrics = product.fabric?.map(f => f.toLowerCase()) || [];
            if (!filters.fabric.some(f => productFabrics.includes(f))) return false;
        }
        return true;
    });

    if (loading) return <div className='text-center py-12'>Loading...</div>;

    const displayGender = gender.charAt(0).toUpperCase() + gender.slice(1);
    const displayOutfit = outfitType.charAt(0).toUpperCase() + outfitType.slice(1);

    return (
        <div className='flex gap-8 min-h-screen pt-8'>
            <div className='w-[30%] sticky top-20 self-start'>
                <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    fabricOptions={fabricOptions}
                    minPrice={priceBounds.min}
                    maxPrice={priceBounds.max}
                />
            </div>
            <main className='w-[70%] overflow-y-auto pr-2 custom-scrollbar'>
                <h1 className='text-2xl font-bold text-text-primary mb-2'>
                    {displayGender} {displayOutfit}
                </h1>
                <p className='text-sm text-text-secondary mb-4'>
                    {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"} found
                </p>
                <ProductGrid products={filteredProducts} />
            </main>
        </div>
    );
};

export default OutfitTypeCollection;