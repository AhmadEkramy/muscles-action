import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { db } from '@/lib/utils';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import ProductCard from './ProductCard';

const LatestProductsSection = () => {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const q = query(
        collection(db, 'products'),
        where('isNew', '==', true),
        limit(4)
      );
      const querySnapshot = await getDocs(q);
      const productsArr = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsArr);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-elite bg-clip-text text-transparent">
              {t('latestProducts')}
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              {language === 'ar' 
                ? 'آخر المنتجات الجديدة والمبتكرة في عالم المكملات الغذائية'
                : 'Discover the newest and most innovative supplements in our collection'
              }
            </p>
          </div>
          <Link to="/category/new-products">
            <Button variant="outline" className="hover:bg-elite-primary/10 hover:border-elite-primary hover:text-elite-primary">
              {language === 'ar' ? 'عرض الكل' : 'View All'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-4 text-center text-gray-400 py-12 text-lg">Loading...</div>
          ) : (
            products.map((product) => (
            <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default LatestProductsSection;