import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { db } from '@/lib/utils';
import { collection, getDocs } from 'firebase/firestore';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const OffersPage = () => {
  const { language } = useLanguage();
  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    getDocs(collection(db, 'offers')).then(snapshot => {
      setOffers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    getDocs(collection(db, 'products')).then(snapshot => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const getOfferTotal = (offer) => {
    const offerProducts = offer.products.map(pid => products.find(p => p.id === pid)).filter(Boolean);
    const total = offerProducts.reduce((sum, p) => sum + (p.price || 0), 0);
    return Math.round(total * (1 - (offer.discount || 0) / 100));
  };

  const handleAddOfferToCart = (offer) => {
    const offerProducts = offer.products.map(pid => products.find(p => p.id === pid)).filter(Boolean);
    offerProducts.forEach(prod => {
      addToCart({ ...prod, price: Math.round(prod.price * (1 - (offer.discount || 0) / 100)) });
    });
  };

  // Filter offers based on search term
  const filteredOffers = offers.filter(offer => 
    offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-12">
          <h1 className="text-4xl font-bold mb-10 text-yellow-500 text-center">🔥 Special Offers</h1>
          
          {/* Search Bar */}
          <div className="relative mb-8 max-w-md mx-auto">
            <div className="flex items-center">
              <Input
                type="text"
                placeholder={language === 'ar' ? 'البحث في العروض...' : 'Search offers...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 justify-center mx-auto" style={{ maxWidth: '1100px' }}>
            {filteredOffers.length === 0 ? (
              <div className="col-span-3 text-center text-gray-400 py-12 text-lg">
                {searchTerm ? 
                  (language === 'ar' ? 'لم يتم العثور على عروض.' : 'No offers found.') :
                  (language === 'ar' ? 'لا توجد عروض متاحة في الوقت الحالي.' : 'No offers available at the moment.')
                }
              </div>
            ) : (
              filteredOffers.map(offer => (
                <div key={offer.id} className="relative bg-gradient-to-br from-yellow-100 via-white to-yellow-200 rounded-xl shadow-xl p-6 border-2 border-yellow-300 hover:shadow-2xl transition-all group overflow-hidden hover:scale-105 hover:shadow-yellow-400/60 duration-300 animate-pulse flex flex-col items-center text-center">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-all animate-glow-pulse" />
                  <h3 className="text-xl font-bold mb-2 text-yellow-700">{offer.title}</h3>
                  <p className="text-gray-700 mb-2">{offer.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {offer.products.map(pid => {
                      const prod = products.find(p => p.id === pid);
                      return prod ? (
                        <img key={pid} src={prod.image} alt={prod.name} className="w-20 h-20 object-cover rounded shadow border-2 border-yellow-300" />
                      ) : null;
                    })}
                  </div>
                  <div className="mb-2">
                    <span className="font-bold text-yellow-600">Discount: {offer.discount}%</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-xs text-gray-500">Duration: {offer.durationValue} {offer.durationType}</span>
                  </div>
                  <div className="mb-2">
                    <span className="text-lg font-bold text-elite-primary">Total: {getOfferTotal(offer)} EGP</span>
                  </div>
                  <button
                    className="w-full mt-2 py-2 rounded bg-yellow-400 text-black font-bold shadow hover:bg-yellow-500 transition-all text-lg"
                    onClick={() => handleAddOfferToCart(offer)}
                  >
                    Add Offer to Cart
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OffersPage; 