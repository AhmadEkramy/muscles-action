import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import heroProtein from '@/assets/hero-protein.jpg';
import heroBestseller from '@/assets/hero-bestseller.jpg';
import heroBundle from '@/assets/hero-bundle.jpg';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    id: 1,
    image: heroProtein,
    title: '',
    titleAr: '',
    subtitle: '',
    subtitleAr: '',
    cta: 'Shop Protein',
    ctaAr: 'تسوق البروتين'
  },
  {
    id: 2,
    image: heroBestseller,
    title: '',
    titleAr: '',
    subtitle: '',
    subtitleAr: '',
    cta: 'View Best Sellers',
    ctaAr: 'عرض الأكثر مبيعاً'
  },
  {
    id: 3,
    image: heroBundle,
    title: '',
    titleAr: '',
    subtitle: '',
    subtitleAr: '',
    cta: 'Shop Bundles',
    ctaAr: 'تسوق الحزم'
  }
];

const Hero = () => {
  const { language, t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url(${currentSlideData.image})` 
        }}
      />

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="text-center text-white">
          {/* Button only, no text */}
          <Button 
            size="lg" 
            className="bg-gradient-elite text-elite-dark font-bold px-8 py-6 text-lg rounded-xl hover:shadow-hover transition-all duration-300 hover:scale-105 animate-slide-up"
            style={{ animationDelay: '0.4s' }}
            onClick={() => {
              // English and Arabic support
              const cta = language === 'ar' ? currentSlideData.ctaAr : currentSlideData.cta;
              if (cta === 'Shop Protein' || cta === 'تسوق البروتين') {
                navigate('/category/protein');
              } else if (cta === 'View Best Sellers' || cta === 'عرض الأكثر مبيعاً') {
                navigate('/menu?bestseller=1');
              } else if (cta === 'Shop Bundles' || cta === 'تسوق الحزم') {
                navigate('/offers');
              }
            }}
          >
            {language === 'ar' ? currentSlideData.ctaAr : currentSlideData.cta}
          </Button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-200 hover:scale-110"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-200 hover:scale-110"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide 
                ? 'bg-elite-primary shadow-glow' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;