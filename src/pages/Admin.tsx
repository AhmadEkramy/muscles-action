import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/utils';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { onAuthStateChanged } from 'firebase/auth';

const COLOR_PRIMARY = '#ffd000';
const COLOR_SECONDARY = '#ffa200';
const COLOR_HIGHLIGHT = '#ffea00';

const panels = [
  { key: 'products', label: 'Products' },
  { key: 'offers', label: 'Offers' },
  { key: 'coupons', label: 'Coupons' },
  { key: 'orders', label: 'Orders' },
  { key: 'stats', label: 'Stats' },
];

const Admin = () => {
  const [activePanel, setActivePanel] = useState('products');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Products state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', nameAr: '', description: '', descriptionAr: '', images: [''], flavors: [''], price: '', originalPrice: '', discount: '', category: '', inStock: false, isBestSeller: false, isNew: false });
  const [addForm, setAddForm] = useState({ name: '', nameAr: '', description: '', descriptionAr: '', images: [''], flavors: [''], price: '', originalPrice: '', discount: '', category: '', isBestSeller: false, isNew: false });
  const [savingAdd, setSavingAdd] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Offers Management state
  const [offers, setOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [addOfferOpen, setAddOfferOpen] = useState(false);
  const [editOffer, setEditOffer] = useState(null);
  const [offerForm, setOfferForm] = useState({
    title: '', description: '', discount: '', products: [], durationType: 'day', durationValue: 1,
  });
  const [savingOffer, setSavingOffer] = useState(false);

  // Coupons state
  const [coupons, setCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [addCouponOpen, setAddCouponOpen] = useState(false);
  const [savingCoupon, setSavingCoupon] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '', discount: '', type: 'percent', usageLimit: '', expiresAt: '', active: true,
  });
  const [editCoupon, setEditCoupon] = useState(null);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Stats state
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    confirmedOrders: 0,
    deliveredOrders: 0,
  });
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (activePanel !== 'products') return;
    setLoadingProducts(true);
    getDocs(collection(db, 'products')).then(snapshot => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingProducts(false);
    });
  }, [activePanel]);

  useEffect(() => {
    if (activePanel !== 'offers') return;
    setLoadingOffers(true);
    getDocs(collection(db, 'offers')).then(snapshot => {
      setOffers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingOffers(false);
    });
  }, [activePanel]);

  useEffect(() => {
    if (activePanel !== 'coupons') return;
    setLoadingCoupons(true);
    getDocs(collection(db, 'coupons')).then(snapshot => {
      setCoupons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingCoupons(false);
    });
  }, [activePanel]);

  useEffect(() => {
    if (activePanel !== 'orders') return;
    setLoadingOrders(true);
    getDocs(collection(db, 'orders')).then(snapshot => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      setOrders(orders);
      setLoadingOrders(false);
    });
  }, [activePanel]);

  useEffect(() => {
    if (activePanel !== 'stats') return;
    setLoadingStats(true);
    getDocs(collection(db, 'orders')).then(snapshot => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      const totalOrders = orders.length;
      const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const confirmedOrders = orders.filter(o => o.status === 'Confirmed').length;
      const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
      setStats({ totalOrders, totalSales, confirmedOrders, deliveredOrders });
      setLoadingStats(false);
    });
  }, [activePanel]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    try {
      await signInWithEmailAndPassword(auth, loginForm.email, loginForm.password);
      setIsLoggedIn(true);
    } catch (err) {
      setLoginError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginForm({ email: '', password: '' });
  };

  // Add Product handlers
  const handleAddChange = (e) => setAddForm({ ...addForm, [e.target.name]: e.target.value });
  const handleAddImageChange = (idx, value) => setAddForm(f => ({ ...f, images: f.images.map((img, i) => i === idx ? value : img) }));
  const handleAddFlavorChange = (idx, value) => setAddForm(f => ({ ...f, flavors: f.flavors.map((fl, i) => i === idx ? value : fl) }));
  const handleAddImageAdd = () => setAddForm(f => ({ ...f, images: [...f.images, ''] }));
  const handleAddImageRemove = (idx) => setAddForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  const handleAddFlavorAdd = () => setAddForm(f => ({ ...f, flavors: [...f.flavors, ''] }));
  const handleAddFlavorRemove = (idx) => setAddForm(f => ({ ...f, flavors: f.flavors.filter((_, i) => i !== idx) }));
  const handleAddSave = async (e) => {
    e.preventDefault();
    setSavingAdd(true);
    const data = {
      ...addForm,
      images: addForm.images.filter(Boolean),
      flavors: addForm.flavors.filter(Boolean),
      price: Number(addForm.price),
      isBestSeller: !!addForm.isBestSeller,
      isNew: !!addForm.isNew,
    };
    if (addForm.originalPrice) data.originalPrice = addForm.originalPrice;
    if (addForm.discount) data.discount = addForm.discount;
    await addDoc(collection(db, 'products'), data);
    setSavingAdd(false);
    setAddProductOpen(false);
    setAddForm({ name: '', nameAr: '', description: '', descriptionAr: '', images: [''], flavors: [''], price: '', originalPrice: '', discount: '', category: '', isBestSeller: false, isNew: false });
    setLoadingProducts(true);
    getDocs(collection(db, 'products')).then(snapshot => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingProducts(false);
    });
  };

  // Edit Product handlers
  const handleEditClick = (product) => {
    setEditProduct(product);
    setEditForm({
      name: product.name || '',
      nameAr: product.nameAr || '',
      description: product.description || '',
      descriptionAr: product.descriptionAr || '',
      images: Array.isArray(product.images) && product.images.length ? product.images : [''],
      flavors: Array.isArray(product.flavors) && product.flavors.length ? product.flavors : [''],
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      discount: product.discount || '',
      category: product.category || '',
      inStock: product.inStock || false,
      isBestSeller: !!product.isBestSeller,
      isNew: !!product.isNew,
    });
  };
  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });
  const handleEditImageChange = (idx, value) => setEditForm(f => ({ ...f, images: f.images.map((img, i) => i === idx ? value : img) }));
  const handleEditFlavorChange = (idx, value) => setEditForm(f => ({ ...f, flavors: f.flavors.map((fl, i) => i === idx ? value : fl) }));
  const handleEditImageAdd = () => setEditForm(f => ({ ...f, images: [...f.images, ''] }));
  const handleEditImageRemove = (idx) => setEditForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  const handleEditFlavorAdd = () => setEditForm(f => ({ ...f, flavors: [...f.flavors, ''] }));
  const handleEditFlavorRemove = (idx) => setEditForm(f => ({ ...f, flavors: f.flavors.filter((_, i) => i !== idx) }));
  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editProduct) return;
    setSavingEdit(true);
    const data = {
      ...editForm,
      images: editForm.images.filter(Boolean),
      flavors: editForm.flavors.filter(Boolean),
      price: Number(editForm.price),
      isBestSeller: !!editForm.isBestSeller,
      isNew: !!editForm.isNew,
    };
    if (editForm.originalPrice) data.originalPrice = editForm.originalPrice;
    if (editForm.discount) data.discount = editForm.discount;
    await updateDoc(doc(db, 'products', editProduct.id), data);
    setSavingEdit(false);
    setEditProduct(null);
    setLoadingProducts(true);
    getDocs(collection(db, 'products')).then(snapshot => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingProducts(false);
    });
  };

  // Delete Product
  const handleDelete = async (id) => {
    setDeletingId(id);
    await deleteDoc(doc(db, 'products', id));
    setDeletingId(null);
    setLoadingProducts(true);
    getDocs(collection(db, 'products')).then(snapshot => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingProducts(false);
    });
  };

  // Offers Management handlers
  const handleOfferChange = e => setOfferForm({ ...offerForm, [e.target.name]: e.target.value });
  const handleOfferProductsChange = id => {
    setOfferForm(f => ({
      ...f,
      products: f.products.includes(id)
        ? f.products.filter(pid => pid !== id)
        : [...f.products, id]
    }));
  };

  const handleAddOffer = async e => {
    e.preventDefault();
    setSavingOffer(true);
    await addDoc(collection(db, 'offers'), {
      ...offerForm,
      discount: Number(offerForm.discount),
      durationValue: Number(offerForm.durationValue),
      createdAt: new Date(),
    });
    setSavingOffer(false);
    setAddOfferOpen(false);
    setOfferForm({ title: '', description: '', discount: '', products: [], durationType: 'day', durationValue: 1 });
    setLoadingOffers(true);
    getDocs(collection(db, 'offers')).then(snapshot => {
      setOffers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingOffers(false);
    });
  };

  const handleEditOffer = offer => {
    setEditOffer(offer);
    setOfferForm({
      title: offer.title, description: offer.description, discount: offer.discount,
      products: offer.products || [], durationType: offer.durationType || 'day', durationValue: offer.durationValue || 1
    });
  };

  const handleSaveEditOffer = async e => {
    e.preventDefault();
    if (!editOffer) return;
    setSavingOffer(true);
    await updateDoc(doc(db, 'offers', editOffer.id), {
      ...offerForm,
      discount: Number(offerForm.discount),
      durationValue: Number(offerForm.durationValue),
    });
    setSavingOffer(false);
    setEditOffer(null);
    setLoadingOffers(true);
    getDocs(collection(db, 'offers')).then(snapshot => {
      setOffers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingOffers(false);
    });
  };

  const handleDeleteOffer = async id => {
    await deleteDoc(doc(db, 'offers', id));
    setLoadingOffers(true);
    getDocs(collection(db, 'offers')).then(snapshot => {
      setOffers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingOffers(false);
    });
  };

  // Coupons handlers
  const handleCouponChange = e => setCouponForm({ ...couponForm, [e.target.name]: e.target.value });
  const handleAddCoupon = async e => {
    e.preventDefault();
    setSavingCoupon(true);
    await addDoc(collection(db, 'coupons'), {
      ...couponForm,
      discount: Number(couponForm.discount),
      usageLimit: Number(couponForm.usageLimit),
      createdAt: new Date(),
      expiresAt: couponForm.expiresAt ? new Date(couponForm.expiresAt) : null,
      used: 0,
      active: !!couponForm.active,
    });
    setSavingCoupon(false);
    setAddCouponOpen(false);
    setCouponForm({ code: '', discount: '', type: 'percent', usageLimit: '', expiresAt: '', active: true });
    setLoadingCoupons(true);
    getDocs(collection(db, 'coupons')).then(snapshot => {
      setCoupons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingCoupons(false);
    });
  };
  const handleDeleteCoupon = async id => {
    await deleteDoc(doc(db, 'coupons', id));
    setLoadingCoupons(true);
    getDocs(collection(db, 'coupons')).then(snapshot => {
      setCoupons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingCoupons(false);
    });
  };

  const handleEditCouponClick = (coupon) => {
    setEditCoupon(coupon);
    setCouponForm({
      code: coupon.code || '',
      discount: coupon.discount || '',
      type: coupon.type || 'percent',
      usageLimit: coupon.usageLimit || '',
      expiresAt: coupon.expiresAt ? (coupon.expiresAt.seconds ? new Date(coupon.expiresAt.seconds * 1000).toISOString().slice(0,10) : coupon.expiresAt.slice(0,10)) : '',
      active: coupon.active !== false,
    });
  };

  const handleSaveEditCoupon = async (e) => {
    e.preventDefault();
    if (!editCoupon) return;
    setSavingCoupon(true);
    await updateDoc(doc(db, 'coupons', editCoupon.id), {
      ...couponForm,
      discount: Number(couponForm.discount),
      usageLimit: Number(couponForm.usageLimit),
      expiresAt: couponForm.expiresAt ? new Date(couponForm.expiresAt) : null,
      active: !!couponForm.active,
    });
    setSavingCoupon(false);
    setEditCoupon(null);
    setCouponForm({ code: '', discount: '', type: 'percent', usageLimit: '', expiresAt: '', active: true });
    setLoadingCoupons(true);
    getDocs(collection(db, 'coupons')).then(snapshot => {
      setCoupons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingCoupons(false);
    });
  };

  const handleConfirmOrder = async id => {
    setLoadingOrders(true);
    await updateDoc(doc(db, 'orders', id), { status: 'Confirmed' });
    getDocs(collection(db, 'orders')).then(snapshot => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      setOrders(orders);
      setLoadingOrders(false);
    });
  };

  const handleDeliveredOrder = async id => {
    setLoadingOrders(true);
    await updateDoc(doc(db, 'orders', id), { status: 'Delivered' });
    getDocs(collection(db, 'orders')).then(snapshot => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      setOrders(orders);
      setLoadingOrders(false);
    });
  };

  const handleDeleteOrder = async id => {
    setDeletingId(id);
    await deleteDoc(doc(db, 'orders', id));
    setDeletingId(null);
    setLoadingOrders(true);
    getDocs(collection(db, 'orders')).then(snapshot => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      setOrders(orders);
      setLoadingOrders(false);
    });
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <form onSubmit={handleLogin} className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 flex flex-col gap-4 min-w-[320px]">
          <h2 className="text-2xl font-bold mb-2 text-yellow-400">Admin Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
            className="border border-gray-200 rounded px-3 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
            className="border border-gray-200 rounded px-3 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            required
          />
          {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
          <button type="submit" className="bg-yellow-400 text-black font-bold py-2 rounded hover:bg-yellow-500 transition-all" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-black text-white flex flex-col justify-between py-4 md:py-8 px-2 md:px-4 shadow-lg">
        <div>
          <div className="text-2xl font-bold mb-8 flex items-center gap-2" style={{ color: COLOR_PRIMARY }}>
            🧑‍💻 Admin Dashboard
          </div>
          <nav className="flex flex-col gap-2">
            {panels.map(panel => (
              <button
                key={panel.key}
                className={`text-left px-4 py-2 rounded transition-all font-semibold ${activePanel === panel.key ? 'bg-yellow-400 text-black shadow-lg scale-105' : 'hover:bg-yellow-500/20 hover:text-yellow-400'}`}
                style={activePanel === panel.key ? { boxShadow: `0 0 8px 2px ${COLOR_PRIMARY}` } : {}}
                onClick={() => setActivePanel(panel.key)}
              >
                {panel.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-2">
          <button
            className="w-full py-2 rounded bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition-all shadow-lg"
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            className="w-full py-2 rounded bg-white text-black border border-yellow-400 font-bold hover:bg-yellow-100 transition-all"
            onClick={() => navigate('/')}
          >
            Return to Main Site
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-2 sm:p-4 md:p-8 bg-white min-h-screen">
        {activePanel === 'products' && (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>Products Management</h1>
            <div className="flex justify-end mb-6">
              <button className="px-6 py-2 rounded bg-yellow-400 text-black font-bold shadow hover:bg-yellow-500 transition-all" onClick={() => setAddProductOpen(true)}>+ Add Product</button>
            </div>
            {loadingProducts ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No products found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center border border-yellow-100 hover:shadow-2xl transition-all group relative">
                    {product.discount && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-white px-3 py-1 rounded-full font-bold text-xs shadow animate-pulse">
                        -{product.discount}%
                      </div>
                    )}
                    <img src={product.image || (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '/placeholder.svg')} alt={product.name} className="w-32 h-32 object-cover rounded mb-4 group-hover:scale-105 transition-transform" />
                    <h2 className="text-lg font-bold mb-1 text-center">{product.name}</h2>
                    <h3 className="text-md font-semibold text-yellow-600 mb-1 text-center">{product.nameAr}</h3>
                    <div className="text-xs text-gray-500 mb-1 text-center">{product.category}</div>
                    <div className="text-sm text-gray-700 mb-2 text-center">{product.description}</div>
                    <div className="text-sm text-yellow-700 mb-2 text-center">{product.descriptionAr}</div>
                    <div className="flex gap-2 flex-wrap justify-center mb-2">
                      {Array.isArray(product.flavors) && product.flavors.map((fl, idx) => (
                        <span key={idx} className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">{fl}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl font-bold" style={{ color: COLOR_PRIMARY }}>{product.price} EGP</span>
                      {product.originalPrice && (
                        <span className="text-md text-gray-400 line-through">{product.originalPrice} EGP</span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button className="px-4 py-1 rounded bg-yellow-400 text-black font-bold shadow hover:bg-yellow-500 transition-all" onClick={() => handleEditClick(product)}>Edit</button>
                      <button className="px-4 py-1 rounded bg-red-500 text-white font-bold shadow hover:bg-red-600 transition-all" onClick={() => handleDelete(product.id)} disabled={deletingId === product.id}>{deletingId === product.id ? 'Deleting...' : 'Delete'}</button>
                  </div>
                  </div>
                ))}
              </div>
            )}
            {/* Add Product Dialog */}
            <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
              <DialogOverlay />
              <DialogContent className="max-w-lg w-full mx-auto">
                {addProductOpen && (
                  <form onSubmit={handleAddSave} className="p-6 flex flex-col gap-4 w-full max-w-lg mx-auto overflow-y-auto" style={{ maxHeight: '80vh' }}>
                    <h2 className="text-xl font-bold mb-2">Add Product</h2>
                    <Input name="name" placeholder="Name (English)" value={addForm.name} onChange={handleAddChange} required />
                    <Input name="nameAr" placeholder="Name (Arabic)" value={addForm.nameAr} onChange={handleAddChange} required />
                    <Input name="description" placeholder="Description (English)" value={addForm.description} onChange={handleAddChange} required />
                    <Input name="descriptionAr" placeholder="Description (Arabic)" value={addForm.descriptionAr} onChange={handleAddChange} required />
                    <div>
                      <label className="block font-semibold mb-1">Images</label>
                      {addForm.images.map((img, idx) => (
                        <div key={idx} className="flex gap-2 mb-2">
                          <Input placeholder={`Image URL #${idx + 1}`} value={img} onChange={e => handleAddImageChange(idx, e.target.value)} />
                          {addForm.images.length > 1 && (
                            <button type="button" className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => handleAddImageRemove(idx)}>-</button>
                          )}
                          {idx === addForm.images.length - 1 && (
                            <button type="button" className="px-2 py-1 bg-green-500 text-white rounded" onClick={handleAddImageAdd}>+</button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Flavors</label>
                      {addForm.flavors.map((flavor, idx) => (
                        <div key={idx} className="flex gap-2 mb-2">
                          <Input placeholder={`Flavor #${idx + 1}`} value={flavor} onChange={e => handleAddFlavorChange(idx, e.target.value)} />
                          {addForm.flavors.length > 1 && (
                            <button type="button" className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => handleAddFlavorRemove(idx)}>-</button>
                          )}
                          {idx === addForm.flavors.length - 1 && (
                            <button type="button" className="px-2 py-1 bg-green-500 text-white rounded" onClick={handleAddFlavorAdd}>+</button>
                          )}
                        </div>
                      ))}
                    </div>
                    <Input name="price" type="number" placeholder="Price (After Discount)" value={addForm.price} onChange={handleAddChange} required />
                    <Input name="originalPrice" type="number" placeholder="Original Price (Before Discount)" value={addForm.originalPrice} onChange={handleAddChange} />
                    <Input name="discount" type="number" placeholder="Discount (%)" value={addForm.discount} onChange={handleAddChange} />
                    <label className="block font-semibold mb-1">Category</label>
                    <select
                      name="category"
                      value={addForm.category}
                      onChange={handleAddChange}
                      required
                      className="border border-gray-200 rounded px-3 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    >
                      <option value="" disabled>Select category</option>
                      {[...new Set(products.map(p => p.category).filter(Boolean))].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <div className="flex gap-4 items-center">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="isBestSeller"
                          checked={!!addForm.isBestSeller}
                          onChange={e => setAddForm(f => ({ ...f, isBestSeller: e.target.checked, isNew: e.target.checked ? false : f.isNew }))}
                        />
                        Best Seller
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="isNew"
                          checked={!!addForm.isNew}
                          onChange={e => setAddForm(f => ({ ...f, isNew: e.target.checked, isBestSeller: e.target.checked ? false : f.isBestSeller }))}
                        />
                        New
                      </label>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button type="submit" disabled={savingAdd} className="w-full px-4 py-2 rounded bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition-all">{savingAdd ? 'Saving...' : 'Save'}</button>
                      <button type="button" className="w-full px-4 py-2 rounded bg-gray-200 text-black font-bold hover:bg-gray-300 transition-all" onClick={() => setAddProductOpen(false)}>Cancel</button>
                    </div>
                  </form>
                )}
              </DialogContent>
            </Dialog>
            {/* Edit Product Dialog */}
            <Dialog open={!!editProduct} onOpenChange={open => { if (!open) setEditProduct(null); }}>
              <DialogOverlay />
              <DialogContent className="max-w-lg w-full mx-auto">
                {!!editProduct && (
                  <form onSubmit={handleEditSave} className="p-6 flex flex-col gap-4 w-full max-w-lg mx-auto overflow-y-auto" style={{ maxHeight: '80vh' }}>
                    <h2 className="text-xl font-bold mb-2">Edit Product</h2>
                    <Input name="name" placeholder="Name (English)" value={editForm.name} onChange={handleEditChange} required />
                    <Input name="nameAr" placeholder="Name (Arabic)" value={editForm.nameAr} onChange={handleEditChange} required />
                    <Input name="description" placeholder="Description (English)" value={editForm.description} onChange={handleEditChange} required />
                    <Input name="descriptionAr" placeholder="Description (Arabic)" value={editForm.descriptionAr} onChange={handleEditChange} required />
                    <div>
                      <label className="block font-semibold mb-1">Images</label>
                      {editForm.images.map((img, idx) => (
                        <div key={idx} className="flex gap-2 mb-2">
                          <Input placeholder={`Image URL #${idx + 1}`} value={img} onChange={e => handleEditImageChange(idx, e.target.value)} />
                          {editForm.images.length > 1 && (
                            <button type="button" className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => handleEditImageRemove(idx)}>-</button>
                          )}
                          {idx === editForm.images.length - 1 && (
                            <button type="button" className="px-2 py-1 bg-green-500 text-white rounded" onClick={handleEditImageAdd}>+</button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Flavors</label>
                      {editForm.flavors.map((flavor, idx) => (
                        <div key={idx} className="flex gap-2 mb-2">
                          <Input placeholder={`Flavor #${idx + 1}`} value={flavor} onChange={e => handleEditFlavorChange(idx, e.target.value)} />
                          {editForm.flavors.length > 1 && (
                            <button type="button" className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => handleEditFlavorRemove(idx)}>-</button>
                          )}
                          {idx === editForm.flavors.length - 1 && (
                            <button type="button" className="px-2 py-1 bg-green-500 text-white rounded" onClick={handleEditFlavorAdd}>+</button>
                          )}
                        </div>
                      ))}
                    </div>
                    <Input name="price" type="number" placeholder="Price (After Discount)" value={editForm.price} onChange={handleEditChange} required />
                    <Input name="originalPrice" type="number" placeholder="Original Price (Before Discount)" value={editForm.originalPrice} onChange={handleEditChange} />
                    <Input name="discount" type="number" placeholder="Discount (%)" value={editForm.discount} onChange={handleEditChange} />
                    <label className="block font-semibold mb-1">Category</label>
                    <select
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      required
                      className="border border-gray-200 rounded px-3 py-2 w-full focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    >
                      <option value="" disabled>Select category</option>
                      {[...new Set(products.map(p => p.category).filter(Boolean))].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <label className="block font-semibold mb-1">In Stock</label>
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={!!editForm.inStock}
                      onChange={e => setEditForm(f => ({ ...f, inStock: e.target.checked }))}
                      className="mr-2"
                    />
                    <span>{editForm.inStock ? 'In Stock' : 'Out of Stock'}</span>
                    <div className="flex gap-4 items-center">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="isBestSeller"
                          checked={!!editForm.isBestSeller}
                          onChange={e => setEditForm(f => ({ ...f, isBestSeller: e.target.checked, isNew: e.target.checked ? false : f.isNew }))}
                        />
                        Best Seller
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="isNew"
                          checked={!!editForm.isNew}
                          onChange={e => setEditForm(f => ({ ...f, isNew: e.target.checked, isBestSeller: e.target.checked ? false : f.isBestSeller }))}
                        />
                        New
                      </label>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button type="submit" disabled={savingEdit} className="w-full px-4 py-2 rounded bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition-all">{savingEdit ? 'Saving...' : 'Save'}</button>
                      <button type="button" className="w-full px-4 py-2 rounded bg-gray-200 text-black font-bold hover:bg-gray-300 transition-all" onClick={() => setEditProduct(null)}>Cancel</button>
                  </div>
                  </form>
                )}
              </DialogContent>
            </Dialog>
                  </div>
        )}
        {activePanel === 'offers' && (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-6" style={{ color: COLOR_SECONDARY }}>Offers Management</h1>
            <div className="flex justify-end mb-6">
              <button className="px-6 py-2 rounded bg-yellow-400 text-black font-bold shadow hover:bg-yellow-500 transition-all"
                onClick={() => { setAddOfferOpen(true); setOfferForm({ title: '', description: '', discount: '', products: [], durationType: 'day', durationValue: 1 }); }}>
                + Add Offer
              </button>
            </div>
            {loadingOffers ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : offers.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No offers found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {offers.map(offer => (
                  <div key={offer.id} className="relative bg-gradient-to-br from-yellow-100 via-white to-yellow-200 rounded-xl shadow-xl p-6 border-2 border-yellow-300 hover:shadow-2xl transition-all group overflow-hidden">
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-all animate-pulse" />
                    <h2 className="text-xl font-bold mb-2 text-yellow-700">{offer.title}</h2>
                    <p className="text-gray-700 mb-2">{offer.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {offer.products.map(pid => {
                        const prod = products.find(p => p.id === pid);
                        return prod ? (
                          <img key={pid} src={prod.image} alt={prod.name} className="w-12 h-12 object-cover rounded shadow border-2 border-yellow-300" />
                        ) : null;
                      })}
                    </div>
                    <div className="mb-2">
                      <span className="font-bold text-yellow-600">Discount: {offer.discount}%</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-xs text-gray-500">Duration: {offer.durationValue} {offer.durationType}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <button className="px-4 py-1 rounded bg-yellow-400 text-black font-bold shadow hover:bg-yellow-500 transition-all"
                        onClick={() => handleEditOffer(offer)}>Edit</button>
                      <button className="px-4 py-1 rounded bg-red-500 text-white font-bold shadow hover:bg-red-600 transition-all"
                        onClick={() => handleDeleteOffer(offer.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Add/Edit Offer Dialog */}
            <Dialog open={addOfferOpen || !!editOffer} onOpenChange={open => { if (!open) { setAddOfferOpen(false); setEditOffer(null); } }}>
              <DialogOverlay />
              <DialogContent className="max-w-lg w-full mx-auto">
                <form onSubmit={editOffer ? handleSaveEditOffer : handleAddOffer} className="p-6 flex flex-col gap-4 w-full max-w-lg mx-auto overflow-y-auto" style={{ maxHeight: '80vh' }}>
                  <h2 className="text-xl font-bold mb-2">{editOffer ? 'Edit Offer' : 'Add Offer'}</h2>
                  <Input name="title" placeholder="Title" value={offerForm.title} onChange={handleOfferChange} required />
                  <Input name="description" placeholder="Description" value={offerForm.description} onChange={handleOfferChange} required />
                  <Input name="discount" type="number" placeholder="Discount (%)" value={offerForm.discount} onChange={handleOfferChange} required />
                  <div>
                    <label className="block font-semibold mb-1">Select Products</label>
                    <div className="flex flex-wrap gap-2">
                      {products.map(prod => (
                        <button type="button" key={prod.id}
                          className={`border-2 rounded p-1 ${offerForm.products.includes(prod.id) ? 'border-yellow-500 bg-yellow-100' : 'border-gray-200'}`}
                          onClick={() => handleOfferProductsChange(prod.id)}>
                          <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded" />
                          <div className="text-xs">{prod.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Duration</label>
                    <select name="durationType" value={offerForm.durationType} onChange={handleOfferChange} className="border rounded px-2 py-1 mr-2">
                      <option value="day">Day</option>
                      <option value="week">Week</option>
                      <option value="month">Month</option>
                      <option value="custom">Custom (days)</option>
                    </select>
                    <Input name="durationValue" type="number" min={1} value={offerForm.durationValue} onChange={handleOfferChange} className="inline w-24" />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button type="submit" disabled={savingOffer} className="w-full px-4 py-2 rounded bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition-all">{savingOffer ? 'Saving...' : 'Save'}</button>
                    <button type="button" className="w-full px-4 py-2 rounded bg-gray-200 text-black font-bold hover:bg-gray-300 transition-all" onClick={() => { setAddOfferOpen(false); setEditOffer(null); }}>Cancel</button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
                </div>
        )}
        {activePanel === 'coupons' && (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-6" style={{ color: COLOR_HIGHLIGHT }}>Coupons Management</h1>
            <div className="flex justify-end mb-6">
              <button className="px-6 py-2 rounded bg-yellow-400 text-black font-bold shadow hover:bg-yellow-500 transition-all" onClick={() => setAddCouponOpen(true)}>+ Add Coupon</button>
            </div>
            {loadingCoupons ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : coupons.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No coupons found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg shadow text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-yellow-100">
                      <th className="px-4 py-2">Code</th>
                      <th className="px-4 py-2">Discount</th>
                      <th className="px-4 py-2">Type</th>
                      <th className="px-4 py-2">Usage Limit</th>
                      <th className="px-4 py-2">Used</th>
                      <th className="px-4 py-2">Expires At</th>
                      <th className="px-4 py-2">Active</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map(coupon => (
                      <tr key={coupon.id} className="border-b hover:bg-yellow-50">
                        <td className="px-4 py-2 font-mono font-bold">{coupon.code}</td>
                        <td className="px-4 py-2">{coupon.discount}</td>
                        <td className="px-4 py-2">{coupon.type}</td>
                        <td className="px-4 py-2">{coupon.usageLimit}</td>
                        <td className="px-4 py-2">{coupon.used || 0}</td>
                        <td className="px-4 py-2">{coupon.expiresAt ? (new Date(coupon.expiresAt.seconds ? coupon.expiresAt.seconds * 1000 : coupon.expiresAt)).toLocaleDateString() : '-'}</td>
                        <td className="px-4 py-2">{coupon.active ? 'Yes' : 'No'}</td>
                        <td className="px-4 py-2">
                          <button className="px-3 py-1 rounded bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition-all mr-2" onClick={() => handleEditCouponClick(coupon)}>Edit</button>
                          <button className="px-3 py-1 rounded bg-red-500 text-white font-bold hover:bg-red-600 transition-all" onClick={() => handleDeleteCoupon(coupon.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                      </div>
            )}
            {/* Add Coupon Dialog */}
            <Dialog open={addCouponOpen} onOpenChange={setAddCouponOpen}>
              <DialogOverlay />
              <DialogContent className="max-w-lg w-full mx-auto">
                <form onSubmit={handleAddCoupon} className="p-6 flex flex-col gap-4 w-full max-w-lg mx-auto overflow-y-auto" style={{ maxHeight: '80vh' }}>
                  <h2 className="text-xl font-bold mb-2">Add Coupon</h2>
                  <Input name="code" placeholder="Code" value={couponForm.code} onChange={handleCouponChange} required />
                  <Input name="discount" type="number" placeholder="Discount" value={couponForm.discount} onChange={handleCouponChange} required />
                  <select name="type" value={couponForm.type} onChange={handleCouponChange} className="border border-gray-200 rounded px-3 py-2 w-full">
                    <option value="percent">Percent</option>
                    <option value="fixed">Fixed</option>
                  </select>
                  <Input name="usageLimit" type="number" placeholder="Usage Limit" value={couponForm.usageLimit} onChange={handleCouponChange} required />
                  <Input name="expiresAt" type="date" placeholder="Expires At" value={couponForm.expiresAt} onChange={handleCouponChange} />
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="active" checked={!!couponForm.active} onChange={e => setCouponForm(f => ({ ...f, active: e.target.checked }))} />
                    Active
                  </label>
                  <div className="flex gap-2 mt-2">
                    <button type="submit" disabled={savingCoupon} className="w-full px-4 py-2 rounded bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition-all">{savingCoupon ? 'Saving...' : 'Save'}</button>
                    <button type="button" className="w-full px-4 py-2 rounded bg-gray-200 text-black font-bold hover:bg-gray-300 transition-all" onClick={() => setAddCouponOpen(false)}>Cancel</button>
                      </div>
                </form>
              </DialogContent>
            </Dialog>
            {/* Edit Coupon Dialog */}
            <Dialog open={!!editCoupon} onOpenChange={open => { if (!open) setEditCoupon(null); }}>
              <DialogOverlay />
              <DialogContent className="max-w-lg w-full mx-auto">
                {!!editCoupon && (
                  <form onSubmit={handleSaveEditCoupon} className="p-6 flex flex-col gap-4 w-full max-w-lg mx-auto overflow-y-auto" style={{ maxHeight: '80vh' }}>
                    <h2 className="text-xl font-bold mb-2">Edit Coupon</h2>
                    <Input name="code" placeholder="Code" value={couponForm.code} onChange={handleCouponChange} required />
                    <Input name="discount" type="number" placeholder="Discount" value={couponForm.discount} onChange={handleCouponChange} required />
                    <select name="type" value={couponForm.type} onChange={handleCouponChange} className="border border-gray-200 rounded px-3 py-2 w-full">
                      <option value="percent">Percent</option>
                      <option value="fixed">Fixed</option>
                    </select>
                    <Input name="usageLimit" type="number" placeholder="Usage Limit" value={couponForm.usageLimit} onChange={handleCouponChange} required />
                    <Input name="expiresAt" type="date" placeholder="Expires At" value={couponForm.expiresAt} onChange={handleCouponChange} />
                    <label className="flex items-center gap-2">
                      <input type="checkbox" name="active" checked={!!couponForm.active} onChange={e => setCouponForm(f => ({ ...f, active: e.target.checked }))} />
                      Active
                    </label>
                    <div className="flex gap-2 mt-2">
                      <button type="submit" disabled={savingCoupon} className="w-full px-4 py-2 rounded bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition-all">{savingCoupon ? 'Saving...' : 'Save'}</button>
                      <button type="button" className="w-full px-4 py-2 rounded bg-gray-200 text-black font-bold hover:bg-gray-300 transition-all" onClick={() => setEditCoupon(null)}>Cancel</button>
                    </div>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        )}
        {activePanel === 'orders' && (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-6" style={{ color: COLOR_PRIMARY }}>Orders Panel</h1>
            {loadingOrders ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No orders found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg shadow text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-yellow-100">
                      <th className="px-4 py-2">Customer</th>
                      <th className="px-4 py-2">Phone</th>
                      <th className="px-4 py-2">Address</th>
                      <th className="px-4 py-2">Payment</th>
                      <th className="px-4 py-2">Products</th>
                      <th className="px-4 py-2">Total</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className="border-b hover:bg-yellow-50">
                        <td className="px-4 py-2">{order.name}</td>
                        <td className="px-4 py-2">{order.phone}</td>
                        <td className="px-4 py-2">{order.address}</td>
                        <td className="px-4 py-2">{order.paymentMethod}</td>
                        <td className="px-4 py-2 text-xs">
                          {Array.isArray(order.items) ? order.items.map((item, idx) => (
                            <span key={idx}>
                              {item.name}
                              <span style={{ color: '#ffa200', fontWeight: 'bold' }}>
                                {typeof item.flavor !== 'undefined' && item.flavor !== '' ? ` (${item.flavor})` : ' (بدون نكهة)'}
                              </span>
                              <span style={{ color: '#000', fontWeight: 'bold' }}> x{item.quantity || 1}</span>
                              {idx < order.items.length - 1 ? ', ' : ''}
                            </span>
                          )) : '-'}
                        </td>
                        <td className="px-4 py-2 font-bold">{order.total} EGP</td>
                        <td className="px-4 py-2 text-xs">{order.createdAt ? (new Date(order.createdAt.seconds ? order.createdAt.seconds * 1000 : order.createdAt)).toLocaleString() : '-'}</td>
                        <td className="px-4 py-2">{order.status || 'Pending'}</td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2 flex-wrap">
                            <button
                              className={`px-3 py-1 rounded text-white font-bold transition-all text-sm ${order.status === 'Confirmed' ? 'bg-green-700' : 'bg-green-500 hover:bg-green-600'}`}
                              onClick={() => handleConfirmOrder(order.id)}
                              disabled={loadingOrders}
                            >
                              Confirm
                            </button>
                            <button
                              className={`px-3 py-1 rounded text-white font-bold transition-all text-sm ${order.status === 'Delivered' ? 'bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
                              onClick={() => handleDeliveredOrder(order.id)}
                              disabled={loadingOrders}
                            >
                              وصل
                            </button>
                            <button
                              className="px-3 py-1 rounded bg-red-500 text-white font-bold hover:bg-red-600 transition-all text-sm"
                              onClick={() => handleDeleteOrder(order.id)}
                              disabled={loadingOrders}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
            )}
            </div>
        )}
        {activePanel === 'stats' && (
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-6" style={{ color: COLOR_SECONDARY }}>Stats & Reports</h1>
            {loadingStats ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                <div className="bg-yellow-100 rounded-xl shadow p-6 flex flex-col items-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: COLOR_PRIMARY }}>{stats.totalOrders}</div>
                  <div className="text-lg font-semibold">Total Orders</div>
                </div>
                <div className="bg-yellow-100 rounded-xl shadow p-6 flex flex-col items-center">
                  <div className="text-4xl font-bold mb-2" style={{ color: COLOR_SECONDARY }}>{stats.totalSales} EGP</div>
                  <div className="text-lg font-semibold">Total Sales</div>
                </div>
                <div className="bg-yellow-100 rounded-xl shadow p-6 flex flex-col items-center">
                  <div className="text-4xl font-bold mb-2 text-green-600">{stats.confirmedOrders}</div>
                  <div className="text-lg font-semibold">Confirmed Orders</div>
                </div>
                <div className="bg-yellow-100 rounded-xl shadow p-6 flex flex-col items-center">
                  <div className="text-4xl font-bold mb-2 text-blue-600">{stats.deliveredOrders}</div>
                  <div className="text-lg font-semibold">Delivered Orders</div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;