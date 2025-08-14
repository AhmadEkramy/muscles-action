import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { db } from '@/lib/utils';
import { collection, getDocs } from 'firebase/firestore';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const NewProductsPage = () => {
  const { language, t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    getDocs(collection(db, 'products')).then(snapshot => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
  }, []);

  const newProducts = products.filter(p => p.isNew);
  
  // Filter products based on search term
  const filteredProducts = newProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <h1 className="text-4xl font-bold mb-10 text-elite-primary text-center">
          {t('newProducts')}
        </h1>
        
        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="flex items-center">
            <Input
              type="text"
              placeholder={language === 'ar' ? 'البحث في المنتجات الجديدة...' : 'Search new products...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-12 text-lg">Loading new products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-400 py-12 text-lg">
            {searchTerm ? 
              (language === 'ar' ? 'لم يتم العثور على منتجات جديدة.' : 'No new products found.') :
              (language === 'ar' ? 'لا توجد منتجات جديدة متاحة في الوقت الحالي.' : 'No new products available at the moment.')
            }
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {filteredProducts.map(product => (
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