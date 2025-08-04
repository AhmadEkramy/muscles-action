import { useLanguage } from '@/contexts/LanguageContext';
import { categories } from '@/data/products';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const CategorySection = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  return (
    <section style={{ background: 'linear-gradient(135deg, #e8e8e8 0%, #b7b7b7 100%)', padding: '60px 0', minHeight: 400 }}>
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
          <SwiperSlide
            key={cat.id}
            onClick={() => navigate(`/category/${cat.id}`)}
            style={{
              width: 220,
              background: 'rgba(232,232,232,0.7)',
              borderRadius: 18,
              boxShadow: '0 4px 32px 0 #8c8c8c44, 0 0 0 2px #b7b7b7',
              backdropFilter: 'blur(8px)',
              border: '1.5px solid #b7b7b7',
              transition: 'box-shadow 0.4s, transform 0.4s, border 0.4s',
              position: 'relative',
              overflow: 'visible',
              cursor: 'pointer',
                    }}
            className="group hover:scale-105 hover:shadow-[0_0_32px_8px_#525252] hover:border-[#000] relative overflow-visible cursor-pointer"
          >
            <div
              className="picture"
                    style={{
                width: 220,
                height: 220,
                overflow: 'hidden',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.15)',
                boxShadow: '0 2px 16px #b7b7b7aa',
                transition: 'box-shadow 0.4s, background 0.4s',
                position: 'relative',
              }}
            >
                          <img 
                src={cat.image}
                alt={language === 'ar' ? cat.nameAr : cat.name}
                          style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'drop-shadow(0 0 16px #8c8c8c88)',
                  transition: 'filter 0.4s',
                }}
                className="group-hover:scale-110 group-hover:rotate-2 animate-float"
              />
              {/* Futuristic glow border for active/hovered */}
              <span className="pointer-events-none absolute inset-0 rounded-[16px] border-2 border-transparent group-hover:border-[#8c8c8c] group-hover:shadow-[0_0_24px_4px_#8c8c8c] transition-all duration-500" />
                        </div>
            <div
              className="detail animate-fade-in-up"
              style={{
                padding: '18px 10px 10px 10px',
                fontWeight: 700,
                textAlign: 'center',
                color: '#000',
                fontFamily: 'Orbitron, sans-serif',
                letterSpacing: '0.08em',
                fontSize: 18,
                textShadow: '0 2px 8px #b7b7b7cc, 0 0 2px #000',
                textTransform: 'uppercase',
                transition: 'color 0.4s, text-shadow 0.4s',
              }}
            >
              {language === 'ar' ? cat.nameAr : cat.name}
        </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default CategorySection;