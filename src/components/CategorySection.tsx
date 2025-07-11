import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { categories } from '@/data/products';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

const CategorySection = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  return (
    <section style={{ background: '#fff', padding: '60px 0' }}>
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        loop={true}
        autoplay={{ delay: 1000, disableOnInteraction: false }}
        coverflowEffect={{
          rotate: 20,
          stretch: 0,
          depth: 350,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="swiper-container"
        style={{ width: '100%', paddingTop: 50, paddingBottom: 50 }}
      >
        {categories.map((cat) => (
          <SwiperSlide key={cat.id} style={{ width: 220, background: '#fff', borderRadius: 8, cursor: 'pointer' }} onClick={() => navigate(`/category/${cat.id}`)}>
            <div className="picture" style={{ width: 220, height: 220, overflow: 'hidden' }}>
              <img
                src={cat.image}
                alt={language === 'ar' ? cat.nameAr : cat.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="detail" style={{ padding: '25px 20px', fontWeight: 600, textAlign: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 20 }}>{language === 'ar' ? cat.nameAr : cat.name}</h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default CategorySection;