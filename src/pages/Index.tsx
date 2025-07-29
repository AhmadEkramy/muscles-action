import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import BestSellingSection from '@/components/BestSellingSection';
import LatestProductsSection from '@/components/LatestProductsSection';
// Removed ReviewsSection import
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { db } from '@/lib/utils';
import { collection, getDocs } from 'firebase/firestore';
import { useCart } from '@/contexts/CartContext';
import { Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import heroProtein from '@/assets/hero-protein.jpg';
import heroProtein2 from '@/assets/hero-protein2.jpg';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [offers, setOffers] = useState([]);
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

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

        {/* Showcase Section */}
        <section className="my-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              onClick={() => navigate('/menu')}
              className="overflow-hidden rounded-3xl cursor-pointer group"
            >
              <img
                src={heroProtein}
                alt="Hero Protein 1"
                className="w-full h-[400px] object-cover object-center transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl"
              />
            </div>
            <div
              onClick={() => navigate('/menu')}
              className="overflow-hidden rounded-3xl cursor-pointer group"
            >
              <img
                src={heroProtein2}
                alt="Hero Protein 2"
                className="w-full h-[400px] object-cover object-center transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* Offers Section */}
        <section className="my-8 sm:my-12">
          <h2 className="text-3xl font-bold mb-6 text-[#3d3d3d] drop-shadow-[0_2px_8px_#b0b0b0] text-center relative">
            <span className="mr-2">🔥</span>{language === 'ar' ? 'العروض الخاصة' : 'Special Offers'}
            <span className="block h-1 w-2/3 bg-gradient-to-r from-[#b0b0b0] to-[#4f4f4f] rounded-full mt-2 mx-auto animate-fade-in-up"></span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 justify-center mx-auto" style={{ maxWidth: '1100px' }}>
            {offers.map(offer => (
              <div key={offer.id} className="relative bg-[#f6f6f6] rounded-xl shadow-xl p-6 border-2 border-[#b0b0b0] hover:shadow-[0_0_16px_4px_#b0b0b0] hover:scale-105 transition-all duration-500 group overflow-hidden flex flex-col items-center text-center glow-hover animate-float">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#b0b0b0] rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-all animate-float" />
                <h3 className="text-xl font-bold mb-2 text-[#4f4f4f]">{language === 'ar' ? offer.titleAr || offer.title : offer.title}</h3>
                <p className="text-[#6d6d6d] mb-2">{language === 'ar' ? offer.descriptionAr || offer.description : offer.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {offer.products.map(pid => {
                    const prod = products.find(p => p.id === pid);
                    return prod ? (
                      <img key={pid} src={prod.image} alt={language === 'ar' ? prod.nameAr || prod.name : prod.name} className="w-20 h-20 object-cover rounded shadow border-2 border-[#b0b0b0] bg-[#e7e7e7]" />
                    ) : null;
                  })}
                </div>
                <div className="mb-2">
                  <span className="font-bold text-[#4f4f4f]">
                    {language === 'ar' ? 'الخصم:' : 'Discount:'} {offer.discount}%
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-xs text-[#888888]">
                    {language === 'ar' ? 'المدة:' : 'Duration:'} {offer.durationValue} {offer.durationType}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-lg font-bold text-[#4f4f4f]">
                    {language === 'ar' ? 'الإجمالي:' : 'Total:'} {getOfferTotal(offer)} {language === 'ar' ? 'ج.م' : 'EGP'}
                  </span>
                </div>
                <button
                  className="w-full mt-2 py-2 rounded bg-[#4f4f4f] text-[#f6f6f6] font-bold shadow hover:bg-[#000] hover:shadow-[0_0_16px_4px_#b0b0b0] hover:scale-105 transition-all duration-500 glow-hover"
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
            <hr className="flex-1 border-t-2 border-[#b0b0b0]" />
            <div className="mx-8 flex flex-col items-center">
              <Heart className="w-12 h-12 text-[#4f4f4f] mb-2 animate-float" strokeWidth={2.5} />
              <h2 className="text-2xl font-bold mb-2 text-[#4f4f4f] drop-shadow-[0_2px_8px_#b0b0b0]">
                {language === 'ar' ? 'ما يميزنا' : 'Why Choose Us'}
              </h2>
            </div>
            <hr className="flex-1 border-t-2 border-[#b0b0b0]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 text-center">
            <div className="feature-card group flex flex-col items-center transition-all duration-300 bg-[#f6f6f6] rounded-xl p-4 sm:p-6 hover:shadow-[0_0_16px_4px_#b0b0b0] hover:-translate-y-2 hover:border-[#4f4f4f] border border-[#b0b0b0] glow-hover animate-float">
              {/* Truck Icon */}
              <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:animate-float">
                <rect x="8" y="24" width="32" height="16" rx="2" stroke="#4f4f4f" strokeWidth="2.5"/>
                <rect x="40" y="32" width="12" height="8" rx="2" stroke="#4f4f4f" strokeWidth="2.5"/>
                <circle cx="16" cy="44" r="4" stroke="#4f4f4f" strokeWidth="2.5"/>
                <circle cx="44" cy="44" r="4" stroke="#4f4f4f" strokeWidth="2.5"/>
              </svg>
              <div className="text-xl font-bold mb-1 text-[#4f4f4f] transition-colors duration-300 group-hover:text-[#000]">
                {language === 'ar' ? 'توصيل سريع' : 'Fast Delivery'}
              </div>
              <div className="text-[#888888] font-medium transition-colors duration-300 group-hover:text-[#4f4f4f]">
                {language === 'ar' ? 'نضمن لك شحن وتوصيل سريع' : 'We guarantee fast shipping and delivery'}
              </div>
            </div>
            <div className="feature-card group flex flex-col items-center transition-all duration-300 bg-[#f6f6f6] rounded-xl p-4 sm:p-6 hover:shadow-[0_0_16px_4px_#b0b0b0] hover:-translate-y-2 hover:border-[#4f4f4f] border border-[#b0b0b0] glow-hover animate-float">
              {/* Payment Icon */}
              <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:animate-float">
                <rect x="12" y="20" width="40" height="24" rx="4" stroke="#4f4f4f" strokeWidth="2.5"/>
                <circle cx="24" cy="44" r="3" stroke="#4f4f4f" strokeWidth="2.5"/>
                <rect x="32" y="36" width="16" height="4" rx="2" stroke="#4f4f4f" strokeWidth="2.5"/>
              </svg>
              <div className="text-xl font-bold mb-1 text-[#4f4f4f] transition-colors duration-300 group-hover:text-[#000]">
                {language === 'ar' ? 'طرق دفع آمنة' : 'Secure Payment'}
              </div>
              <div className="text-[#888888] font-medium transition-colors duration-300 group-hover:text-[#4f4f4f]">
                {language === 'ar' ? 'دفعك آمن وسهل مع Apple Pay وأقساط عبر تمارا وتابي' : 'Your payments are safe and easy with Apple Pay and installment plans via Tamara & Tabby'}
              </div>
            </div>
            <div className="feature-card group flex flex-col items-center transition-all duration-300 bg-[#f6f6f6] rounded-xl p-4 sm:p-6 hover:shadow-[0_0_16px_4px_#b0b0b0] hover:-translate-y-2 hover:border-[#4f4f4f] border border-[#b0b0b0] glow-hover animate-float">
              {/* Medal Icon */}
              <svg width="64" height="64" fill="none" viewBox="0 0 64 64" className="mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:animate-float">
                <circle cx="32" cy="40" r="10" stroke="#4f4f4f" strokeWidth="2.5"/>
                <path d="M32 30V12M32 30L22 12M32 30l10-18" stroke="#4f4f4f" strokeWidth="2.5"/>
              </svg>
              <div className="text-xl font-bold mb-1 text-[#4f4f4f] transition-colors duration-300 group-hover:text-[#000]">
                {language === 'ar' ? '%100 منتجات أصلية' : '100% Authentic Products'}
              </div>
              <div className="text-[#888888] font-medium transition-colors duration-300 group-hover:text-[#4f4f4f]">
                {language === 'ar' ? 'جميع منتجات محترفين المكملات أصلية 100%' : 'All products are 100% authentic and certified'}
              </div>
            </div>
          </div>
        </section>

        {/* Removed ReviewsSection component */}
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Index;
