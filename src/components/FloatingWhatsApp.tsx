import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FloatingWhatsApp = () => {
  const phoneNumber = '+201027226728'; // Updated WhatsApp number
  const message = 'Hello! I need help with Muscles Action products.';
  
  const openWhatsApp = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={openWhatsApp}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 p-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 animate-glow-pulse"
        style={{
          boxShadow: '0 4px 20px rgba(34, 197, 94, 0.4), 0 0 20px rgba(34, 197, 94, 0.3)'
        }}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default FloatingWhatsApp;