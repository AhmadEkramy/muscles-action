import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { toast } from '@/hooks/use-toast';
import { db } from '@/lib/utils';
import { doc, getDoc } from 'firebase/firestore';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { language, t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFlavor, setSelectedFlavor] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      } else {
        setProduct(null);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product && Array.isArray(product.flavors) && product.flavors.length > 0) {
      setSelectedFlavor(product.flavors[0]);
    } else {
      setSelectedFlavor('');
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>{language === 'ar' ? 'جاري التحميل...' : 'Loading...'}</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">
            {language === 'ar' ? 'المنتج غير موجود' : 'Product Not Found'}
          </h1>
          <Link to="/">
            <Button className="bg-gradient-elite text-elite-dark">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image || '/placeholder.svg'];

  const displayName = language === 'ar' ? product.nameAr : product.name;
  const displayDescription = language === 'ar' ? product.descriptionAr : product.description;

  const handleAddToCart = () => {
    if (Array.isArray(product.flavors) && product.flavors.length > 0) {
      addToCart({ ...product, selectedFlavor }, quantity);
      toast({
        title: t('addedToCart'),
        description: `${displayName} (${selectedFlavor}) x${quantity}`,
      });
    } else {
    addToCart(product, quantity);
    toast({
      title: t('addedToCart'),
      description: `${displayName} x${quantity}`,
    });
    }
  };

  return (
    <div className="min-h-screen px-2 sm:px-0">
      <Header />
      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/" className="text-muted-foreground hover:text-elite-primary transition-colors">
            {t('home')}
          </Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <Link to={`/category/${product.category}`} className="text-muted-foreground hover:text-elite-primary transition-colors">
            {t(product.category.replace('-', ''))}
          </Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-foreground">{displayName}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
              <img 
                src={images[selectedImage]}
                alt={displayName}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {images.length > 1 && (
              <div className="flex space-x-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-elite-primary' 
                        : 'border-transparent hover:border-muted-foreground'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${displayName} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 flex flex-col gap-4 sm:gap-6">
            {/* Badges */}
            <div className="flex space-x-2">
              {product.discount && (
                <Badge variant="destructive" className="animate-glow-pulse">
                  -{product.discount}% OFF
                </Badge>
              )}
              {product.isNew && (
                <Badge variant="secondary">
                  {language === 'ar' ? 'جديد' : 'NEW'}
                </Badge>
              )}
              {product.isBestSeller && (
                <Badge className="bg-elite-secondary text-white">
                  {language === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller'}
                </Badge>
              )}
            </div>

            {/* Brand */}
            <p className="text-muted-foreground font-medium">{product.brand}</p>

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-elite bg-clip-text text-transparent">
              {displayName}
            </h1>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) 
                        ? 'text-elite-primary fill-current' 
                        : 'text-muted-foreground'
                    }`} 
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-elite-primary">
                {product.price} {t('egp')}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted-foreground line-through">
                  {product.originalPrice} {t('egp')}
                </span>
              )}
            </div>

            {/* Flavor */}
            {Array.isArray(product.flavors) && product.flavors.length > 0 ? (
              <div>
                <h3 className="font-semibold mb-2">{t('flavor')}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  {product.flavors.map((flavor: string) => (
                    <button
                      key={flavor}
                      type="button"
                      className={`px-3 py-1 rounded border text-sm font-semibold transition-all ${selectedFlavor === flavor ? 'bg-elite-primary text-white border-elite-primary' : 'bg-white text-elite-primary border-elite-primary/40 hover:bg-elite-primary/10'}`}
                      onClick={() => setSelectedFlavor(flavor)}
                    >
                      {flavor}
                    </button>
                  ))}
                </div>
                <span className="text-muted-foreground text-xs">{t('chooseFlavor')}</span>
              </div>
            ) : (
            <div>
              <h3 className="font-semibold mb-2">{t('flavor')}</h3>
                <p className="text-muted-foreground">-</p>
            </div>
            )}

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">{t('description')}</h3>
              <p className="text-muted-foreground leading-relaxed">{displayDescription}</p>
            </div>

            {/* Nutrition Facts */}
            <div>
              <h3 className="font-semibold mb-2">{t('nutritionFacts')}</h3>
              <p className="text-muted-foreground">{product.nutritionFacts}</p>
            </div>

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-semibold">{t('quantity')}:</span>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-xl font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleAddToCart}
                className="w-full bg-gradient-elite text-elite-dark font-bold py-4 sm:py-6 text-base sm:text-lg hover:shadow-hover transition-all duration-300 hover:scale-[1.02]"
                disabled={(!product.inStock) || (Array.isArray(product.flavors) && product.flavors.length > 0 && !selectedFlavor)}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.inStock 
                  ? `${t('addToCart')} - ${product.price * quantity} ${t('egp')}`
                  : (language === 'ar' ? 'نفد المخزون' : 'Out of Stock')
                }
              </Button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={product.inStock ? 'text-green-600' : 'text-red-600'}>
                {product.inStock 
                  ? (language === 'ar' ? 'متوفر في المخزون' : 'In Stock')
                  : (language === 'ar' ? 'نفد المخزون' : 'Out of Stock')
                }
              </span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default ProductDetail;