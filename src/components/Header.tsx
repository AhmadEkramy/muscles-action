import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { 
  Home, 
  Menu, 
  ShoppingCart, 
  User, 
  Globe, 
  Percent,
  Sparkles,
  Moon,
  Sun
} from 'lucide-react';
import { auth } from '@/lib/utils';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Dialog } from '@/components/ui/dialog';
import AuthForm from '@/components/AuthForm';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const navItems = [
    { key: 'home', href: '/', icon: Home },
    { key: 'offers', href: '/offers', icon: Percent },
    { key: 'menu', href: '/menu', icon: Menu },
    { key: 'newProducts', href: '/new-products', icon: Sparkles },
    { key: 'contact', href: '/contact', icon: User }
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f6f6f6]/95 backdrop-blur supports-[backdrop-filter]:bg-[#f6f6f6]/60 border-b border-[#b0b0b0] shadow-lg transition-all duration-500">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-100 transition-opacity animate-float">
            <img src="/logo.jpg" alt="Muscles Action" className="h-14 w-auto rounded-full border-2 border-[#4f4f4f] shadow-md" />
            <span className="text-xl font-bold text-[#4f4f4f]">Muscles Action</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.key}
                  to={item.href}
                  className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-elite-primary transition-colors duration-200 hover:animate-glow-pulse"
                >
                  <Icon className="h-4 w-4" />
                  <span>{t(item.key)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Cart, Profile, Language, Dark Mode */}
          <div className="flex items-center space-x-4">
            

            {/* Cart */}
            <Link to="/cart">
              <Button variant="outline" size="sm" className="relative hover:bg-elite-primary/10 hover:border-elite-primary transition-all duration-200">
                <ShoppingCart className="h-4 w-4" />
                {getTotalItems() > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-elite-secondary animate-glow-pulse"
                  >
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hover:bg-elite-primary/10 hover:border-elite-primary transition-all duration-200">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover/95 backdrop-blur">
                {user ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{user.email}</span>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hover:bg-elite-primary/10 hover:border-elite-primary transition-all duration-200">
                  <Globe className="h-4 w-4" />
                  <span className="ml-1 text-xs uppercase">{language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover/95 backdrop-blur">
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('ar')}>
                  العربية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;