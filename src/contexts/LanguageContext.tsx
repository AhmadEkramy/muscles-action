import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    home: 'Home',
    offers: 'Offers',
    menu: 'Menu',
    newProducts: 'New Products',
    contact: 'Contact',
    cart: 'Cart',
    search: 'Search',
    profile: 'Profile',
    login: 'Login',
    register: 'Register',
    
    // Hero
    shopNow: 'Shop Now',
    premiumSupplements: 'Premium Supplements',
    eliteSupps: 'Muscles Action',
    
    // Categories
    protein: 'Protein',
    creatine: 'Creatine',
    massGainer: 'Mass Gainer',
    carb: 'Carb',
    fatBurner: 'Fat Burner',
    testBooster: 'Test Booster',
    aminoAcids: 'Amino Acids',
    preworkout: 'Preworkout',
    vitamins: 'Vitamins',
    
    // Product
    addToCart: 'Add to Cart',
    price: 'Price',
    brand: 'Brand',
    flavor: 'Flavor',
    rating: 'Rating',
    description: 'Description',
    nutritionFacts: 'Nutrition Facts',
    
    // Cart
    cartEmpty: 'Your cart is empty',
    continueShopping: 'Continue Shopping',
    checkout: 'Checkout',
    total: 'Total',
    quantity: 'Quantity',
    remove: 'Remove',
    delivery: 'Delivery',
    egp: 'EGP',
    
    // Checkout
    fullName: 'Full Name',
    address: 'Address',
    phoneNumber: 'Phone Number',
    paymentMethod: 'Payment Method',
    cashOnDelivery: 'Cash on Delivery',
    vodafoneCash: 'Vodafone Cash',
    instaPay: 'InstaPay',
    placeOrder: 'Place Order',
    
    // Messages
    addedToCart: 'Added to cart',
    orderPlaced: 'Order placed successfully!',
    
    // Sections
    bestSelling: 'Best Selling',
    latestProducts: 'Latest Products',
    customerReviews: 'Customer Reviews',
    
    // Admin
    admin: 'Admin',
    dashboard: 'Dashboard',
    products: 'Products',
    orders: 'Orders',
    coupons: 'Coupons',
    income: 'Income',
    stats: 'Stats',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete Product',
    logout: 'Logout',
    backToSite: 'Back to Site',
  },
  ar: {
    // Header
    home: 'الرئيسية',
    offers: 'العروض',
    menu: 'القائمة',
    newProducts: 'منتجات جديدة',
    contact: 'اتصل بنا',
    cart: 'السلة',
    search: 'البحث',
    profile: 'الملف الشخصي',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    
    // Hero
    shopNow: 'تسوق الآن',
    premiumSupplements: 'مكملات غذائية فاخرة',
    eliteSupps: 'ماسيلز أكشن',
    
    // Categories
    protein: 'بروتين',
    creatine: 'كرياتين',
    massGainer: 'زيادة الوزن',
    carb: 'كربوهيدرات',
    fatBurner: 'حارق الدهون',
    testBooster: 'منشط التستوستيرون',
    aminoAcids: 'أحماض أمينية',
    preworkout: 'ما قبل التمرين',
    vitamins: 'فيتامينات',
    
    // Product
    addToCart: 'أضف للسلة',
    price: 'السعر',
    brand: 'الماركة',
    flavor: 'النكهة',
    rating: 'التقييم',
    description: 'الوصف',
    nutritionFacts: 'القيم الغذائية',
    
    // Cart
    cartEmpty: 'سلتك فارغة',
    continueShopping: 'متابعة التسوق',
    checkout: 'إتمام الطلب',
    total: 'المجموع',
    quantity: 'الكمية',
    remove: 'إزالة',
    delivery: 'التوصيل',
    egp: 'جنيه',
    
    // Checkout
    fullName: 'الاسم الكامل',
    address: 'العنوان',
    phoneNumber: 'رقم الهاتف',
    paymentMethod: 'طريقة الدفع',
    cashOnDelivery: 'الدفع عند الاستلام',
    vodafoneCash: 'فودافون كاش',
    instaPay: 'إنستاباي',
    placeOrder: 'تأكيد الطلب',
    
    // Messages
    addedToCart: 'تمت الإضافة إلى السلة',
    orderPlaced: 'تم الطلب بنجاح!',
    
    // Sections
    bestSelling: 'الأكثر مبيعاً',
    latestProducts: 'أحدث المنتجات',
    customerReviews: 'آراء العملاء',
    
    // Admin
    admin: 'الإدارة',
    dashboard: 'لوحة التحكم',
    products: 'المنتجات',
    orders: 'الطلبات',
    coupons: 'الكوبونات',
    income: 'الدخل',
    stats: 'الإحصائيات',
    addProduct: 'إضافة منتج',
    editProduct: 'تعديل منتج',
    deleteProduct: 'حذف منتج',
    logout: 'تسجيل الخروج',
    backToSite: 'العودة للموقع',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language]?.[key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <div className={language === 'ar' ? 'rtl' : 'ltr'} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};