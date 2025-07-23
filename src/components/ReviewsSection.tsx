import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

const reviews = [
  {
    id: 1,
    name: 'أحمد محمد',
    nameEn: 'Ahmed Mohamed',
    rating: 5,
    review: 'منتجات ممتازة وجودة عالية جداً. البروتين طعمه رائع والنتائج واضحة خلال أسبوعين فقط! 💪',
    reviewEn: 'Excellent products with very high quality. The protein tastes amazing and results are visible in just two weeks! 💪',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    date: '2024-01-15'
  },
  {
    id: 2,
    name: 'سارة أحمد',
    nameEn: 'Sara Ahmed',
    rating: 5,
    review: 'خدمة عملاء رائعة وتوصيل سريع. الكرياتين ساعدني كثيراً في زيادة القوة والتحمل في الجيم 🔥',
    reviewEn: 'Amazing customer service and fast delivery. The creatine helped me a lot in increasing strength and endurance at the gym 🔥',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    date: '2024-01-10'
  },
  {
    id: 3,
    name: 'كريم حسن',
    nameEn: 'Karim Hassan',
    rating: 5,
    review: 'أفضل موقع للمكملات الغذائية في مصر! الأسعار معقولة والمنتجات أصلية ومضمونة ⭐',
    reviewEn: 'Best supplement website in Egypt! Reasonable prices and authentic, guaranteed products ⭐',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    date: '2024-01-08'
  },
  {
    id: 4,
    name: 'فاطمة علي',
    nameEn: 'Fatma Ali',
    rating: 5,
    review: 'منتجات التخسيس فعالة جداً! خسرت 8 كيلو في شهرين مع النظام الغذائي والتمارين 🎯',
    reviewEn: 'Weight loss products are very effective! Lost 8kg in two months with diet and exercise 🎯',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    date: '2024-01-05'
  },
  {
    id: 5,
    name: 'محمود رمضان',
    nameEn: 'Mahmoud Ramadan',
    rating: 5,
    review: 'ماس جينر رهيب! زاد وزني 5 كيلو في شهر واحد. طعمه حلو ومش تقيل على المعدة 💯',
    reviewEn: 'Amazing mass gainer! Gained 5kg in one month. Tastes great and easy on the stomach 💯',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    date: '2024-01-03'
  }
];

const ReviewsSection = () => {
  const { language, t } = useLanguage();
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="py-16" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        <div className={`mb-12 ${language === 'ar' ? 'text-right' : 'text-center'}`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
            {t('customerReviews')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === 'ar' 
              ? 'آراء عملائنا الكرام وتجاربهم مع منتجاتنا'
              : 'What our valued customers say about their experience with our products'
            }
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: language === 'ar' ? `translateX(${currentReview * 100}%)` : `translateX(${-currentReview * 100}%)` }}
            >
              {reviews.map((review) => (
                <div key={review.id} className="w-full flex-shrink-0 px-4">
                  <Card className="bg-gradient-to-br from-background to-muted/30 border-border/50 shadow-card">
                    <CardContent className={`p-8 ${language === 'ar' ? 'text-right' : 'text-center'}`}> 
                      <Avatar className="w-16 h-16 mx-auto mb-4 ring-2 ring-elite-primary/20">
                        <AvatarImage src={review.avatar} alt={language === 'ar' ? review.name : review.nameEn} />
                        <AvatarFallback className="bg-elite-primary/10 text-elite-primary font-bold">
                          {(language === 'ar' ? review.name : review.nameEn).charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <h4 className={`font-semibold mb-2 ${language === 'ar' ? 'text-right' : ''}`}>
                        {language === 'ar' ? review.name : review.nameEn}
                      </h4>
                      <div className="flex items-center justify-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-5 w-5 ${
                              i < review.rating 
                                ? 'text-elite-primary fill-current' 
                                : 'text-muted-foreground'
                            }`} 
                          />
                        ))}
                      </div>
                      <blockquote className={`text-muted-foreground italic mb-4 text-lg leading-relaxed ${language === 'ar' ? 'text-right' : ''}`}> 
                        "{language === 'ar' ? review.review : review.reviewEn}"
                      </blockquote>
                      <p className="text-sm text-muted-foreground">
                        {new Date(review.date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {language === 'ar' ? (
            <>
              <button
                onClick={nextReview}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-background/80 backdrop-blur-sm rounded-full p-3 shadow-card hover:bg-elite-primary/10 transition-all duration-200 hover:scale-110"
              >
                <ChevronRight className="h-5 w-5 text-elite-primary" />
              </button>
              <button
                onClick={prevReview}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-background/80 backdrop-blur-sm rounded-full p-3 shadow-card hover:bg-elite-primary/10 transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft className="h-5 w-5 text-elite-primary" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={prevReview}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-background/80 backdrop-blur-sm rounded-full p-3 shadow-card hover:bg-elite-primary/10 transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft className="h-5 w-5 text-elite-primary" />
              </button>
              <button
                onClick={nextReview}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-background/80 backdrop-blur-sm rounded-full p-3 shadow-card hover:bg-elite-primary/10 transition-all duration-200 hover:scale-110"
              >
                <ChevronRight className="h-5 w-5 text-elite-primary" />
              </button>
            </>
          )}

          {/* Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReview(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentReview 
                    ? 'bg-elite-primary shadow-glow' 
                    : 'bg-muted-foreground/40 hover:bg-muted-foreground/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;