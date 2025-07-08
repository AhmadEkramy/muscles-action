import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/utils';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCart();
  const { language, t } = useLanguage();
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [discountedTotal, setDiscountedTotal] = useState(null);

  const deliveryFee = 85;
  const subtotal = getTotalPrice();
  const total = subtotal + deliveryFee;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">{t('cartEmpty')}</h2>
            <p className="text-muted-foreground mb-8">
              {language === 'ar' 
                ? 'ابدأ بإضافة بعض المنتجات الرائعة إلى سلتك'
                : 'Start adding some awesome products to your cart'
              }
            </p>
            <Link to="/">
              <Button className="bg-gradient-elite text-elite-dark font-semibold">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('continueShopping')}
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-elite bg-clip-text text-transparent">
            {t('cart')}
          </h1>
          <p className="text-muted-foreground">
            {getTotalItems()} {language === 'ar' ? 'منتج في السلة' : 'items in cart'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-3 sm:p-4 md:p-6">
                  <div className="flex flex-col xs:flex-row items-center gap-3 sm:gap-4">
                    <img
                      src={
                        item.image ||
                        (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : '/placeholder.svg')
                      }
                      alt={language === 'ar' ? item.nameAr : item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1 w-full">
                      <h3 className="font-semibold text-base sm:text-lg mb-1">
                        {language === 'ar' ? item.nameAr : item.name}
                        <span className="ml-2 text-sm text-yellow-500 font-bold">
                          {item.flavor && item.flavor.trim() !== '' ? `(${item.flavor})` : '(بدون نكهة)'}
                        </span>
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">{item.brand}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2">{item.flavor}</p>
                      
                      {item.discount && (
                        <Badge variant="secondary" className="mb-2">
                          -{item.discount}% OFF
                        </Badge>
                      )}
                      
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-base sm:text-lg font-semibold w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="text-right min-w-[70px]">
                          <p className="text-base sm:text-lg font-bold text-elite-primary">
                            {item.price * item.quantity} {t('egp')}
                          </p>
                          {item.originalPrice && (
                            <p className="text-sm text-muted-foreground line-through">
                              {item.originalPrice * item.quantity} {t('egp')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-2 sm:mt-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 mt-6 lg:mt-0">
            <Card className="sticky top-24 w-full">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {/* Coupon Code */}
                <div className="space-y-2">
                  <Input 
                    placeholder={language === 'ar' ? 'كود الخصم' : 'Coupon Code'}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button variant="outline" className="w-full" onClick={async () => {
                    setCouponError('');
                    setCoupon(null);
                    setDiscountedTotal(null);
                    if (!couponCode) {
                      setCouponError(language === 'ar' ? 'يرجى إدخال كود الخصم' : 'Please enter a coupon code');
                      return;
                    }
                    const snapshot = await getDocs(collection(db, 'coupons'));
                    const found = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }))
                      .find(c => c.code.toLowerCase() === couponCode.trim().toLowerCase() && c.active);
                    if (!found) {
                      setCouponError(language === 'ar' ? 'كود الخصم غير صحيح أو غير مفعل' : 'Invalid or inactive coupon code');
                      return;
                    }
                    if (typeof found.usageLimit === 'number' && typeof found.used === 'number' && found.used >= found.usageLimit) {
                      setCouponError(language === 'ar' ? 'تم الوصول للحد الأقصى لاستخدام هذا الكوبون' : 'This coupon has reached its usage limit');
                      return;
                    }
                    setCoupon(found);
                    let discount = 0;
                    if (found.type === 'percent') {
                      discount = subtotal * (found.discount / 100);
                    } else {
                      discount = found.discount;
                    }
                    const finalTotal = subtotal - discount + deliveryFee;
                    setDiscountedTotal(finalTotal);
                    localStorage.setItem('appliedCoupon', JSON.stringify(found));
                    localStorage.setItem('discountedTotal', String(finalTotal));
                  }}>
                    {language === 'ar' ? 'تطبيق' : 'Apply'}
                  </Button>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                    <span>{subtotal} {t('egp')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('delivery')}</span>
                    <span>{deliveryFee} {t('egp')}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>{t('total')}</span>
                  <span className="text-elite-primary">
                    {discountedTotal !== null ? discountedTotal : total} {t('egp')}
                  </span>
                </div>
                {coupon && (
                  <div className="text-green-600 text-sm font-bold">
                    {language === 'ar' ? 'تم تطبيق الكوبون بنجاح!' : 'Coupon applied successfully!'}
                  </div>
                )}
                {couponError && (
                  <div className="text-red-500 text-sm font-bold">
                    {couponError}
                  </div>
                )}

                <Link to="/checkout" className="block">
                  <Button className="w-full bg-gradient-elite text-elite-dark font-bold py-4 sm:py-6 text-base sm:text-lg hover:shadow-hover transition-all duration-300">
                    {t('checkout')}
                  </Button>
                </Link>

                <Link to="/" className="block">
                  <Button variant="outline" className="w-full py-3 sm:py-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('continueShopping')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Cart;