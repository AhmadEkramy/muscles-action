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
    <Link to={`/product/${product.id}`} className={`block ${className}`}>
      <Card className="group relative overflow-hidden bg-card border-border/50 hover:border-elite-primary/50 transition-all duration-300 hover:shadow-card hover:shadow-elite-primary/20 hover:-translate-y-1 h-[480px] flex flex-col justify-between">
        {/* Discount Badge */}
        {product.discount && (
          <Badge 
            variant="destructive" 
            className="absolute top-3 left-3 z-10 bg-elite-secondary text-white font-bold animate-glow-pulse"
          >
            -{product.discount}%
          </Badge>
        )}

        {/* New Badge */}
        {product.isNew && (
          <Badge 
            variant="secondary" 
            className="absolute top-3 right-3 z-10 bg-elite-highlight text-elite-dark font-bold"
          >
            {language === 'ar' ? 'جديد' : 'NEW'}
          </Badge>
        )}

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden h-60 flex items-center justify-center bg-white">
          <img 
            src={product.image || (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/placeholder.svg')}
            alt={displayName}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-4">
          {/* Brand */}
          <p className="text-xs text-muted-foreground mb-1 font-medium">{product.brand}</p>
          
          {/* Product Name */}
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-foreground group-hover:text-elite-primary transition-colors">
            {displayName}
          </h3>
          
          {/* Flavor Selection */}
          {Array.isArray(product.flavors) && product.flavors.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-2">
              {product.flavors.map((flavor: string, idx: number) => (
                <button
                  key={flavor}
                  type="button"
                  className={`px-2 py-1 rounded border text-xs font-semibold transition-all ${selectedFlavor === flavor ? 'bg-elite-primary text-white border-elite-primary' : 'bg-white text-elite-primary border-elite-primary/40 hover:bg-elite-primary/10'}`}
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
                      ? 'text-elite-primary fill-current' 
                      : 'text-muted-foreground'
                  }`} 
                />
              ))}
            </div>
            <span className="ml-2 text-xs text-muted-foreground">
              {typeof product.rate === 'number' ? product.rate : 0}
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-lg font-bold text-elite-primary">
              {product.price} {t('egp')}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {product.originalPrice} {t('egp')}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button 
            onClick={handleAddToCart}
            className="w-full bg-gradient-elite text-elite-dark font-semibold hover:shadow-hover transition-all duration-300 hover:scale-105"
            size="sm"
            disabled={Array.isArray(product.flavors) && product.flavors.length > 0 && !selectedFlavor}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {t('addToCart')}
          </Button>
        </CardFooter>

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-white font-bold">
              {language === 'ar' ? 'نفد المخزون' : 'Out of Stock'}
            </Badge>
          </div>
        )}
      </Card>
    </Link>
  );
};

export default ProductCard;