import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/data/products';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const CategorySection = () => {
  const { language, t } = useLanguage();

  const isRTL = language === 'ar';
  const cats = isRTL ? [...categories].reverse() : categories;

  return (
    <section className="py-16 bg-muted/30" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full px-4">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-elite bg-clip-text text-transparent">
            {isRTL ? 'القائمة' : t('menu')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isRTL
              ? 'اكتشف مجموعتنا الواسعة من المكملات الغذائية عالية الجودة'
              : 'Discover our wide range of premium supplements for every fitness goal'}
          </p>
        </div>
        <div className="w-full">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
            loop={true}
            autoplay={{ delay: 500, disableOnInteraction: false }}
            speed={1200}
            className="!pb-8 w-full"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {cats.map((category) => (
              <SwiperSlide key={category.id}>
                <Link to={`/category/${category.id}`} className="group block h-full">
                  <Card className="h-full hover:shadow-card hover:shadow-elite-primary/20 transition-all duration-300 hover:-translate-y-2 border-border/50 hover:border-elite-primary/50 bg-gradient-to-br from-background to-muted/50">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <img src={category.image} alt={isRTL ? category.nameAr : category.name} className="w-16 h-16 object-contain mx-auto" />
                      </div>
                      <h3 className="font-semibold text-sm group-hover:text-elite-primary transition-colors">
                        {isRTL ? category.nameAr : category.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;