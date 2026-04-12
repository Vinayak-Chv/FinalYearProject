import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useProducts } from "../Context/productContext";
import { events } from "../config/events";
import ProductGrid from "../components/ProductGrid";
import EventFilterSidebar from "../components/EventFilterSidebar";

const EventCollection = () => {
    const { eventId } = useParams();
    const { products, loading } = useProducts();

    const event = events.find((e) => e.id === eventId);
    if (!event) {
        return <div className="text-center py-12">Event not found</div>;
    }

    // State for selected gender (null = not selected)
    const [selectedGender, setSelectedGender] = useState(null);

    // Base products: those matching event's outfitTypes
    const baseProducts = useMemo(() => {
        const lowerTypes = event.outfitTypes.map(t => t.toLowerCase());
        return products.filter(product => {
            const outfit = product.outfitType?.toLowerCase();
            return outfit && lowerTypes.includes(outfit);
        });
    }, [products, event.outfitTypes]);

    // Further filter by selected gender (if any)
    const genderFilteredProducts = useMemo(() => {
        if (!selectedGender) return [];
        return baseProducts.filter(p => p.gender?.toLowerCase() === selectedGender);
    }, [baseProducts, selectedGender]);

    // Compute min/max price and fabric options from genderFilteredProducts
    const priceBounds = useMemo(() => {
        if (genderFilteredProducts.length === 0) return { min: 0, max: 10000 };
        const prices = genderFilteredProducts.map(p => p.price);
        return {
            min: Math.min(...prices),
            max: Math.max(...prices),
        };
    }, [genderFilteredProducts]);

    const fabricOptions = useMemo(() => {
        const fabrics = new Set();
        genderFilteredProducts.forEach(p => {
            if (p.fabric && Array.isArray(p.fabric)) {
                p.fabric.forEach(f => fabrics.add(f.toLowerCase()));
            }
        });
        return Array.from(fabrics).sort();
    }, [genderFilteredProducts]);

    // Additional filters (price, stock, etc.)
    const [filters, setFilters] = useState({
        maxPrice: "",
        inStock: false,
        customizable: false,
        fabric: [],
    });

    const filteredProducts = genderFilteredProducts.filter(product => {
        if (filters.maxPrice !== "" && product.price > filters.maxPrice) return false;
        if (filters.inStock && !product.inStock) return false;
        if (filters.customizable && !product.isCustomizable) return false;
        if (filters.fabric.length > 0) {
            const productFabrics = product.fabric?.map(f => f.toLowerCase()) || [];
            if (!filters.fabric.some(f => productFabrics.includes(f))) return false;
        }
        return true;
    });

    const genderOptions = [
        { value: "men", label: "Men" },
        { value: "women", label: "Women" },
        { value: "boys", label: "Boys" },
        { value: "girls", label: "Girls" },
    ];

    if (loading) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2 text-center">
                {event.title}
            </h1>

            {/* Gender Selection */}
            {!selectedGender ? (
                <div className="text-center my-12">
                    <p className="text-text-secondary text-lg mb-8">
                        Choose a gender to explore the {event.title} collection
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                        {genderOptions.map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setSelectedGender(opt.value)}
                                className="group w-36 h-36 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col items-center justify-center gap-3 border border-neutral-light"
                            >
                                {/* Icon */}
                                <div className="text-4xl text-primary group-hover:scale-110 transition">
                                    {opt.value === "men" && "👔"}
                                    {opt.value === "women" && "👗"}
                                    {opt.value === "boys" && "👕"}
                                    {opt.value === "girls" && "👚"}
                                </div>
                                <span className="text-xl font-semibold text-text-primary">
                                    {opt.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex gap-8 mt-6">
                    {/* Sidebar */}
                    <div className="w-[30%] sticky top-18 self-start">
                        <EventFilterSidebar
                            filters={filters}
                            setFilters={setFilters}
                            fabricOptions={fabricOptions}
                            minPrice={priceBounds.min}
                            maxPrice={priceBounds.max}
                        />
                    </div>

                    {/* Product Grid */}
                    <main className="w-[70%] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-text-secondary">
                                {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
                            </p>
                            <button
                                onClick={() => setSelectedGender(null)}
                                className="text-sm text-primary hover:underline"
                            >
                                Change Gender
                            </button>
                        </div>
                        <ProductGrid products={filteredProducts} />
                    </main>
                </div>
            )}
        </div>
    );
};

export default EventCollection;