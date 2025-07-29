import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '@/lib/utils';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  'protein': 'Protein',
  'creatine': 'Creatine',
  'mass-gainer': 'Mass Gainer',
  'carb': 'Carb',
  'fat-burner': 'Fat Burner',
  'test-booster': 'Test Booster',
  'amino-acids': 'Amino Acids',
  'preworkout': 'Preworkout',
  'vitamins': 'Vitamins',
  'best-selling': 'Best Selling',
  'new-products': 'New Products',
};

const CATEGORY_FIRESTORE: Record<string, string> = {
  'protein': 'protein',
  'creatine': 'creatine',
  'mass-gainer': 'massGainer',
  'carb': 'carb',
  'fat-burner': 'fatBurner',
  'test-booster': 'testBoster',
  'amino-acids': 'aminoAcids',
  'preworkout': 'preworkout',
  'vitamins': 'vitamins',
};

const Category = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      let q;
      if (categoryId === 'best-selling') {
        q = query(collection(db, 'products'), where('isBestSeller', '==', true));
      } else if (categoryId === 'new-products') {
        q = query(collection(db, 'products'), where('isNew', '==', true));
      } else {
        const firestoreCategory = CATEGORY_FIRESTORE[categoryId] || categoryId;
        q = query(collection(db, 'products'), where('category', '==', firestoreCategory));
      }
      const querySnapshot = await getDocs(q);
      setProducts(querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...(data as { [key: string]: any })
        };
      }));
      setLoading(false);
    };
    fetchProducts();
  }, [categoryId]);

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!categoryId || !CATEGORY_LABELS[categoryId]) {
    return <div className="min-h-screen flex items-center justify-center text-2xl font-bold">Category Not Found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 flex-1">
        <div className="mb-4">
          <Link to="/">
            <Button variant="outline">Return to Home</Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-4">{CATEGORY_LABELS[categoryId]}</h1>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <Search className="absolute right-3 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : filteredProducts.length === 0 ? (
          <div>No products found in this category.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Category;