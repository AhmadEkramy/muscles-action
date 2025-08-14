import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { db } from '@/lib/utils';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ChevronRight, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const BestSellingSection = () => {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const q = query(
        collection(db, 'products'),
        where('isBestSeller', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const productsArr = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsArr);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#3d3d3d] drop-shadow-[0_2px_8px_#b0b0b0] relative">
              {t('bestSelling')}
              <span className="block h-1 w-2/3 bg-gradient-to-r from-[#b0b0b0] to-[#4f4f4f] rounded-full mt-2 mx-auto animate-fade-in-up"></span>
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              {language === 'ar' 
                ? 'المنتجات الأكثر مبيعاً والأعلى تقييماً من عملائنا'
                : 'Top-rated and most popular supplements trusted by our customers'
              }
            </p>
          </div>
          <Link to="/category/best-selling">
            <Button variant="outline" className="hover:bg-elite-primary/10 hover:border-elite-primary hover:text-elite-primary">
              {language === 'ar' ? 'عرض الكل' : 'View All'}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="flex items-center">
            <Input
              type="text"
              placeholder={language === 'ar' ? 'البحث في المنتجات...' : 'Search products...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-4 text-center text-gray-400 py-12 text-lg">Loading...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-4 text-center text-gray-400 py-12 text-lg">
              {language === 'ar' ? 'لم يتم العثور على منتجات.' : 'No products found.'}
            </div>
          ) : (
            filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default BestSellingSection;