import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '@/contexts/CartContext';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addToCart } = useCart();
  const { language, t } = useLanguage();
  const [selectedFlavor, setSelectedFlavor] = useState(
    Array.isArray(product.flavors) && product.flavors.length > 0 ? product.flavors[0] : ''
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (Array.isArray(product.flavors) && product.flavors.length > 0) {
      addToCart({
        ...product,
        flavor: selectedFlavor,
        image: product.image || (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/placeholder.svg')
      });
    } else {
      addToCart({ ...product, flavor: '' });
    }
  };

  const displayName = language === 'ar' ? product.nameAr : product.name;
  const displayDescription = language === 'ar' ? product.descriptionAr : product.description;

  return (
    <Link to={`/product/${product.id}`} className={className} style={{ display: 'block' }}>
      <Card className="group relative overflow-hidden bg-[#f6f6f6] border border-[#b0b0b0] text-[#3d3d3d] transition-all duration-300 hover:scale-105 glow-hover h-[480px] flex flex-col justify-between">
        {/* Discount Badge */}
        {product.discount && (
          <Badge 
            variant="destructive" 
            className="absolute top-3 left-3 z-10 bg-[#888888] text-white font-bold animate-fade-in-up shadow-lg"
          >
            -{product.discount}%
          </Badge>
        )}

        {/* New Badge */}
        {product.isNew && (
          <Badge 
            variant="secondary" 
            className="absolute top-3 right-3 z-10 bg-[#b0b0b0] text-[#000] font-bold animate-fade-in-up shadow-lg"
          >
            {language === 'ar' ? 'جديد' : 'NEW'}
          </Badge>
        )}

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden h-60 flex items-center justify-center bg-[#e7e7e7] animate-float group-hover:scale-110 transition-transform duration-700">
          <img 
            src={product.image || (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/placeholder.svg')}
            alt={displayName}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-125 group-hover:rotate-2"
            style={{ filter: 'drop-shadow(0 0 24px #b0b0b088)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#b0b0b033] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        <CardContent className="p-4 animate-fade-in-up">
          {/* Brand */}
          <p className="text-xs text-[#888888] mb-1 font-medium">{product.brand}</p>
          
          {/* Product Name */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-[#3d3d3d] group-hover:text-[#000] transition-colors">
            {displayName}
          </h3>
          
          {/* Flavor Selection */}
          {Array.isArray(product.flavors) && product.flavors.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {product.flavors.map((flavor: string, idx: number) => (
                <button
                  key={flavor}
                  type="button"
                  className={`px-2 py-1 rounded border text-xs font-semibold transition-all ${selectedFlavor === flavor ? 'bg-[#888888] text-white border-[#888888]' : 'bg-[#f6f6f6] text-[#4f4f4f] border-[#b0b0b0] hover:bg-[#b0b0b0] hover:text-white'}`}
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setSelectedFlavor(flavor); }}
                >
                  {flavor}
                </button>
              ))}
            </div>
          )}
          
          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rate || 0) 
                      ? 'text-[#888888] fill-current' 
                      : 'text-[#d1d1d1]'
                  }`} 
                />
              ))}
            </div>
            <span className="ml-2 text-xs text-[#888888]">
              {typeof product.rate === 'number' ? product.rate : 0}
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-xl font-bold text-[#4f4f4f]">
              {product.price} {t('egp')}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-[#b0b0b0] line-through">
                {product.originalPrice} {t('egp')}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 animate-fade-in-up">
          <Button 
            onClick={handleAddToCart}
            className="w-full bg-[#4f4f4f] text-[#f6f6f6] font-bold shadow-lg hover:bg-[#000] hover:shadow-[0_0_16px_4px_#b0b0b0] hover:scale-105 transition-all duration-500 glow-hover"
            size="sm"
            disabled={Array.isArray(product.flavors) && product.flavors.length > 0 && !selectedFlavor}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {t('addToCart')}
          </Button>
        </CardFooter>

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-[#b0b0b0]/80 flex items-center justify-center animate-fade-in-up">
            <Badge variant="destructive" className="text-white font-bold animate-fade-in-up">
              {language === 'ar' ? 'نفد المخزون' : 'Out of Stock'}
            </Badge>
          </div>
        )}
      </Card>
    </Link>
  );
};

export default ProductCard;