import { useMemo } from 'react';
import { useProducts } from '../Context/productContext';
import GenderSection from '../components/GenderSection';

const Collection = () => {
  const { products, loading } = useProducts();

  // Group products by gender
  const productsByGender = useMemo(() => {
    if (!products.length) return {};
    const groups = {};
    products.forEach(product => {
      const gender = product?.gender?.toLowerCase();
      if (!gender) return;
      if (!groups[gender]) groups[gender] = [];
      groups[gender].push(product);
    });
    return groups;
  }, [products]);

  // Define order of genders
  const genderOrder = ['men', 'women', 'boys', 'girls'];
  const genderLabels = {
    men: "Men's Collection",
    women: "Women's Collection",
    boys: "Boy's Collection",
    girls: "Girl's Collection"
  };

  if (loading) {
    return <div className='text-center py-12'>Loading...</div>;
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold text-text-primary mb-8 text-center'>Our Collections</h1>
      <div className='space-y-16'>
        {genderOrder.map(gender => {
          const genderProducts = productsByGender[gender] || [];
          if (genderProducts.length === 0) return null;
          return (
            <GenderSection
              key={gender}
              gender={gender}
              title={genderLabels[gender]}
              products={genderProducts}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Collection;