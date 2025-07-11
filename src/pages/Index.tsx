import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import BestSellingSection from '@/components/BestSellingSection';
import LatestProductsSection from '@/components/LatestProductsSection';
import ReviewsSection from '@/components/ReviewsSection';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { db } from '@/lib/utils';
import { collection, getDocs } from 'firebase/firestore';
import { useCart } from '@/contexts/CartContext';
import { Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const { language, t } = useLanguage();

  useEffect(() => {
    getDocs(collection(db, 'offers')).then(snapshot => {
      setOffers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    getDocs(collection(db, 'products')).then(snapshot => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  // Helper to calculate total price after discount
  const getOfferTotal = (offer) => {
    const offerProducts = offer.products.map(pid => products.find(p => p.id === pid)).filter(Boolean);
    const total = offerProducts.reduce((sum, p) => sum + (p.price || 0), 0);
    return Math.round(total * (1 - (offer.discount || 0) / 100));
  };

  // Add all offer products to cart as a bundle
  const handleAddOfferToCart = (offer) => {
    const offerProducts = offer.products.map(pid => products.find(p => p.id === pid)).filter(Boolean);
    offerProducts.forEach(prod => {
      // Apply discount to each product
      addToCart({ ...prod, price: Math.round(prod.price * (1 - (offer.discount || 0) / 100)) });
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="px-2 sm:px-0">
        <Hero />
        <CategorySection />
        <BestSellingSection />
        <LatestProductsSection />

        {/* Offers Section */}
        <section className="my-8 sm:my-12">
          <h2 className="text-3xl font-bold mb-6 text-yellow-500 text-center">
            🔥 {language === 'ar' ? 'العروض الخاصة' : 'Special Offers'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 justify-center mx-auto" style={{ maxWidth: '1100px' }}>
            {offers.map(offer => (
              <div key={offer.id} className="relative bg-gradient-to-br from-yellow-100 via-white to-yellow-200 rounded-xl shadow-xl p-6 border-2 border-yellow-300 hover:shadow-2xl transition-all group overflow-hidden hover:scale-105 hover:shadow-yellow-400/60 duration-300 animate-pulse flex flex-col items-center text-center">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-all animate-glow-pulse" />
                <h3 className="text-xl font-bold mb-2 text-yellow-700">{language === 'ar' ? offer.titleAr || offer.title : offer.title}</h3>
                <p className="text-gray-700 mb-2">{language === 'ar' ? offer.descriptionAr || offer.description : offer.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {offer.products.map(pid => {
                    const prod = products.find(p => p.id === pid);
                    return prod ? (
                      <img key={pid} src={prod.image} alt={language === 'ar' ? prod.nameAr || prod.name : prod.name} className="w-20 h-20 object-cover rounded shadow border-2 border-yellow-300" />
                    ) : null;
                  })}
                </div>
                <div className="mb-2">
                  <span className="font-bold text-yellow-600">
                    {language === 'ar' ? 'الخصم:' : 'Discount:'} {offer.discount}%
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-xs text-gray-500">
                    {language === 'ar' ? 'المدة:' : 'Duration:'} {offer.durationValue} {offer.durationType}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-lg font-bold text-elite-primary">
                    {language === 'ar' ? 'الإجمالي:' : 'Total:'} {getOfferTotal(offer)} {language === 'ar' ? 'ج.م' : 'EGP'}
                  </span>
                </div>
                <button
                  className="w-full mt-2 py-2 rounded bg-yellow-400 text-black font-bold shadow hover:bg-yellow-500 transition-all text-lg"
                  onClick={() => handleAddOfferToCart(offer)}
                >
                  {language === 'ar' ? 'أضف العرض إلى السلة' : 'Add Offer to Cart'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* About Us Section */}
        <section className="my-10 sm:my-16">
          <div className="flex flex-col md:flex-row items-center justify-between mb-6 md:mb-10 gap-4 md:gap-0">
            <hr className="flex-1 border-t-2 border-[#ffd000]" />
            <div className="mx-8 flex flex-col items-center">
              <Heart className="w-12 h-12 text-[#ffd000] mb-2 animate-pulse" strokeWidth={2.5} />
              <h2 className="text-2xl font-bold mb-2 text-[#ffa200]">
                {language === 'ar' ? 'ما يميزنا' : 'Why Choose Us'}
              </h2>
            </div>
            <hr className="flex-1 border-t-2 border-[#ffd000]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 text-center">
            <div className="feature-card group flex flex-col items-center transition-all duration-300 bg-white rounded-xl p-4 sm:p-6 hover:shadow-xl hover:-translate-y-2 hover:border-[#ffd000] border border-transparent">
              {/* Truck Icon */}
              <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:animate-bounce">
                <rect x="8" y="24" width="32" height="16" rx="2" stroke="#ffd000" strokeWidth="2.5"/>
                <rect x="40" y="32" width="12" height="8" rx="2" stroke="#ffd000" strokeWidth="2.5"/>
                <circle cx="16" cy="44" r="4" stroke="#ffd000" strokeWidth="2.5"/>
                <circle cx="44" cy="44" r="4" stroke="#ffd000" strokeWidth="2.5"/>
              </svg>
              <div className="text-xl font-bold mb-1 text-[#ffa200] transition-colors duration-300 group-hover:text-[#ffd000]">
                {language === 'ar' ? 'توصيل سريع' : 'Fast Delivery'}
              </div>
              <div className="text-[#ffea00] font-medium transition-colors duration-300 group-hover:text-[#ffa200]">
                {language === 'ar' ? 'نضمن لك شحن وتوصيل سريع' : 'We guarantee fast shipping and delivery'}
              </div>
            </div>
            <div className="feature-card group flex flex-col items-center transition-all duration-300 bg-white rounded-xl p-4 sm:p-6 hover:shadow-xl hover:-translate-y-2 hover:border-[#ffd000] border border-transparent">
              {/* Payment Icon */}
              <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:animate-bounce">
                <rect x="12" y="20" width="40" height="24" rx="4" stroke="#ffd000" strokeWidth="2.5"/>
                <circle cx="24" cy="44" r="3" stroke="#ffd000" strokeWidth="2.5"/>
                <rect x="32" y="36" width="16" height="4" rx="2" stroke="#ffd000" strokeWidth="2.5"/>
              </svg>
              <div className="text-xl font-bold mb-1 text-[#ffa200] transition-colors duration-300 group-hover:text-[#ffd000]">
                {language === 'ar' ? 'طرق دفع آمنة' : 'Secure Payment'}
              </div>
              <div className="text-[#ffea00] font-medium transition-colors duration-300 group-hover:text-[#ffa200]">
                {language === 'ar' ? 'دفعاتك آمنة وسهلة مع Apple Pay واقساط عبر تمارا وتابي' : 'Your payments are safe and easy with Apple Pay and installment plans via Tamara & Tabby'}
              </div>
            </div>
            <div className="feature-card group flex flex-col items-center transition-all duration-300 bg-white rounded-xl p-4 sm:p-6 hover:shadow-xl hover:-translate-y-2 hover:border-[#ffd000] border border-transparent">
              {/* Medal Icon */}
              <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:animate-bounce">
                <circle cx="32" cy="40" r="10" stroke="#ffd000" strokeWidth="2.5"/>
                <path d="M32 30V12M32 30L22 12M32 30l10-18" stroke="#ffd000" strokeWidth="2.5"/>
              </svg>
              <div className="text-xl font-bold mb-1 text-[#ffa200] transition-colors duration-300 group-hover:text-[#ffd000]">
                {language === 'ar' ? '%100 منتجات أصلية' : '100% Authentic Products'}
              </div>
              <div className="text-[#ffea00] font-medium transition-colors duration-300 group-hover:text-[#ffa200]">
                {language === 'ar' ? 'جميع منتجات محترفين المكملات أصلية 100%' : 'All products are 100% authentic and certified'}
              </div>
            </div>
          </div>
        </section>

        <ReviewsSection />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Index;
