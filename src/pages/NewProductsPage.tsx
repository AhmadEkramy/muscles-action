import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { db } from '@/lib/utils';
import { collection, getDocs } from 'firebase/firestore';

const NewProductsPage = () => {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDocs(collection(db, 'products')).then(snapshot => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
  }, []);

  const newProducts = products.filter(p => p.isNew);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <h1 className="text-4xl font-bold mb-10 text-elite-primary text-center">
          {t('newProducts')}
        </h1>
        {loading ? (
          <div className="text-center text-gray-400 py-12 text-lg">Loading new products...</div>
        ) : newProducts.length === 0 ? (
          <div className="text-center text-gray-400 py-12 text-lg">No new products available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {newProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default NewProductsPage; 