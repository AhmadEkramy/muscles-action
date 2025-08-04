import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { auth } from '@/lib/utils';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
    Globe,
    Home,
    Menu,
    Percent,
    ShoppingCart,
    Sparkles,
    User,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <>
      <header className="sticky top-0 z-50 w-full bg-[#f6f6f6]/95 backdrop-blur supports-[backdrop-filter]:bg-[#f6f6f6]/60 border-b border-[#b0b0b0] shadow-lg transition-all duration-500">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 hover:opacity-100 transition-opacity animate-float">
              <img src="/logo.jpg" alt="Muscles Action" className="h-14 w-auto rounded-full border-2 border-[#4f4f4f] shadow-md" />
              <span className="text-lg sm:text-xl font-bold text-[#4f4f4f]">Muscles Action</span>
            </Link>

            {/* Desktop Navigation */}
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

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
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

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center space-x-2">
              {/* Mobile Cart */}
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

              {/* Hamburger Menu Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="hover:bg-elite-primary/10 hover:border-elite-primary transition-all duration-200"
              >
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-16 left-0 right-0 bg-[#f6f6f6] border-b border-[#b0b0b0] shadow-lg">
            <div className="container mx-auto px-4 py-4">
              {/* Mobile Navigation */}
              <nav className="space-y-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.key}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 text-base font-medium text-muted-foreground hover:text-elite-primary transition-colors duration-200 py-2"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{t(item.key)}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile Actions */}
              <div className="mt-6 pt-4 border-t border-[#b0b0b0] space-y-4">
                {/* Profile */}
                {user ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                ) : null}

                {/* Language Toggle */}
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Language:</span>
                  <div className="flex space-x-2">
                    <Button
                      variant={language === 'en' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLanguage('en')}
                      className="text-xs"
                    >
                      EN
                    </Button>
                    <Button
                      variant={language === 'ar' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLanguage('ar')}
                      className="text-xs"
                    >
                      AR
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;