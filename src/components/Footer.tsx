import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { auth } from '@/lib/utils';
import { onAuthStateChanged } from 'firebase/auth';
import { Facebook, Instagram, Mail, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const { language, t } = useLanguage();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <footer className="bg-[#000] text-[#f6f6f6] py-12 mt-16 border-t border-[#b0b0b0] shadow-2xl transition-all duration-500">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 animate-float">
              <img src="/logo-white.jpg" alt="Muscles Action" className="h-10 w-auto rounded-full border-2 border-[#4f4f4f] shadow-md" />
              <span className="text-xl font-bold text-[#4f4f4f] drop-shadow-[0_2px_8px_#888888]">
                {t('eliteSupps')}
              </span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              {language === 'ar' 
                ? 'متجرك الأول للمكملات الغذائية عالية الجودة. نوفر أفضل المنتجات لتحقيق أهدافك الرياضية.'
                : 'Your premier destination for high-quality supplements. We provide the best products to achieve your fitness goals.'
              }
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-elite-primary">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-white/80 hover:text-elite-primary transition-colors text-sm">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/offers" className="text-white/80 hover:text-elite-primary transition-colors text-sm">
                  {t('offers')}
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-white/80 hover:text-elite-primary transition-colors text-sm">
                  {t('menu')}
                </Link>
              </li>
              <li>
                <Link to="/new-products" className="text-white/80 hover:text-elite-primary transition-colors text-sm">
                  {t('newProducts')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/80 hover:text-elite-primary transition-colors text-sm">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-elite-primary">
              {language === 'ar' ? 'الفئات' : 'Categories'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/protein" className="text-white/80 hover:text-elite-primary transition-colors text-sm">
                  {t('protein')}
                </Link>
              </li>
              <li>
                <Link to="/category/creatine" className="text-white/80 hover:text-elite-primary transition-colors text-sm">
                  {t('creatine')}
                </Link>
              </li>
              <li>
                <Link to="/category/preworkout" className="text-white/80 hover:text-elite-primary transition-colors text-sm">
                  {t('preworkout')}
                </Link>
              </li>
              <li>
                <Link to="/category/vitamins" className="text-white/80 hover:text-elite-primary transition-colors text-sm">
                  {t('vitamins')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-elite-primary">
              {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-elite-primary" />
                <a 
                  href="https://wa.me/201027226728" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-elite-primary transition-colors text-sm cursor-pointer hover:underline"
                >
                  +201027226728
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-elite-primary" />
                <span className="text-white/80 text-sm">Musclesaction23@gmail.com</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4 pt-4">
              <a 
                href="https://www.facebook.com/share/16suYWt5UV/?mibextid=wwXIfr" 
                className="text-white/80 hover:text-elite-primary transition-colors hover:animate-scale-bounce"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/musclesaction?igsh=MWJuOW1mbzkzMXo5MQ==" 
                className="text-white/80 hover:text-elite-primary transition-colors hover:animate-scale-bounce"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/20" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-white/60 text-sm">
            {language === 'ar' 
              ? '© 2025 ماسيلز أكشن. جميع الحقوق محفوظة.'
              : '© 2025 Muscles Action. All rights reserved.'
            }
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-white/60 hover:text-elite-primary transition-colors text-sm">
              {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </Link>
            <Link to="/terms" className="text-white/60 hover:text-elite-primary transition-colors text-sm">
              {language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
            </Link>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <Button variant="default" className="bg-yellow-400 text-black" onClick={() => navigate('/admin')}>
            Admin
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;