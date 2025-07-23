import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, CreditCard, Smartphone, DollarSign } from 'lucide-react';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/utils';

const paymentMethods = [
  { value: 'cod', label: 'Cash on Delivery', icon: <DollarSign className="text-yellow-400" /> },
  { value: 'vodafone', label: 'Vodafone Cash', icon: <Smartphone className="text-yellow-400" /> },
  { value: 'instapay', label: 'InstaPay', icon: <CreditCard className="text-yellow-400" /> },
];

const Checkout = () => {
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    payment: 'cod',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (items.length === 0) {
      setError('السلة فارغة!');
      return;
    }
    setLoading(true);
    try {
      const appliedCoupon = localStorage.getItem('appliedCoupon');
      const discountedTotal = localStorage.getItem('discountedTotal');
      await addDoc(collection(db, 'orders'), {
        name: form.name || '',
        address: form.address || '',
        phone: form.phone || '',
        paymentMethod: form.payment || '',
        items: items.map(item => ({
          id: item.id || '',
          name: item.name || '',
          flavor: item.flavor || '',
          quantity: item.quantity || 1,
          price: item.price || 0,
        })),
        total: discountedTotal ? Number(discountedTotal) : getTotalPrice() || 0,
        coupon: appliedCoupon ? JSON.parse(appliedCoupon) : null,
        createdAt: new Date(),
        status: 'Pending',
      });
      if (appliedCoupon) {
        const couponObj = JSON.parse(appliedCoupon);
        if (couponObj.id) {
          await updateDoc(doc(db, 'coupons', couponObj.id), {
            used: increment(1)
          });
        }
      }
      localStorage.removeItem('appliedCoupon');
      localStorage.removeItem('discountedTotal');
      setShowSuccess(true);
      clearCart();
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('حدث خطأ أثناء تنفيذ الطلب. حاول مرة أخرى.');
      console.error('Order Error:', err);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="max-w-2xl mx-auto w-full px-2 pt-4 sm:pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
          <button
            className="flex items-center gap-1 px-4 py-2 rounded bg-card border border-border hover:bg-muted transition mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-extrabold text-primary ml-2">Checkout</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl shadow p-4 sm:p-8 flex flex-col gap-4 sm:gap-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Order Information</h2>
          <div>
            <label className="block font-semibold mb-1">Full Name <span className="text-primary">*</span></label>
            <input
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
              className="border border-border rounded px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Address <span className="text-primary">*</span></label>
            <input
              name="address"
              type="text"
              placeholder="Enter your delivery address"
              value={form.address}
              onChange={handleChange}
              required
              className="border border-border rounded px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Phone Number <span className="text-primary">*</span></label>
            <input
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={e => {
                // Only allow numbers
                const value = e.target.value.replace(/[^0-9]/g, '');
                setForm(f => ({ ...f, phone: value }));
              }}
              required
              className="border border-border rounded px-3 py-2 w-full focus:ring-2 focus:ring-primary focus:outline-none"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={15}
            />
          </div>
          <div>
            <label className="block font-bold mb-2 text-lg">Payment Method</label>
            <div className="flex flex-col gap-4">
              {paymentMethods.map((method) => (
                <label
                  key={method.value}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.payment === method.value ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/20'}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.value}
                    checked={form.payment === method.value}
                    onChange={handleChange}
                    className="accent-primary w-5 h-5"
                  />
                  <span className="text-primary text-xl">{method.icon}</span>
                  <span className={`font-semibold text-base ${form.payment === method.value ? 'text-primary' : 'text-foreground'}`}>{method.label}</span>
                </label>
              ))}
            </div>
          </div>
          {error && <div className="text-destructive text-center">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-primary text-primary-foreground font-bold py-3 sm:py-2 rounded hover:bg-primary/80 transition-all text-base sm:text-lg"
          >
            {loading ? 'جاري التنفيذ...' : 'Place Order'}
          </button>
        </form>
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-background/80 z-50">
            <div className="bg-card rounded-lg shadow-lg p-4 sm:p-8 text-center">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 text-primary">تم الطلب بنجاح!</h2>
              <p className="text-base sm:text-lg">Order placed successfully!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout; 