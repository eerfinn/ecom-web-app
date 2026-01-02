import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useCart } from '../context/CartContext';
import { Star, Clock, ChevronLeft, Plus, Minus, ShoppingBag, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const RestaurantMenu = () => {
    const { id } = useParams();
    const { addToCart, cart, updateQuantity, formatCurrency } = useCart();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Semua');

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const docRef = doc(db, "restaurants", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setRestaurant({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error fetching restaurant:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurant();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-4 border-r-4 border-primary animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ShoppingBag className="text-primary animate-pulse" size={32} />
                    </div>
                </div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white">
                <div className="text-8xl mb-6 grayscale opacity-20">🚫</div>
                <h2 className="text-3xl font-black text-gray-800 mb-2 tracking-tight">Restoran tidak ditemukan</h2>
                <Link to="/" className="text-primary font-bold hover:underline flex items-center space-x-2">
                    <ChevronLeft size={20} />
                    <span>Kembali ke Beranda</span>
                </Link>
            </div>
        );
    }

    const categories = ['Semua', ...new Set(restaurant.menu.map(item => item.category))];
    const filteredMenu = activeTab === 'Semua'
        ? restaurant.menu
        : restaurant.menu.filter(item => item.category === activeTab);

    const getItemQuantity = (itemId) => {
        const item = cart.find(i => i.id === itemId);
        return item ? item.quantity : 0;
    };

    return (
        <div className="min-h-screen pb-32 bg-[#fcfcfd]">
            {/* Elegant Header */}
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#fcfcfd] via-black/40 to-black/20"></div>

                <div className="absolute inset-x-0 bottom-0">
                    <div className="container mx-auto px-4 pb-12">
                        <Link to="/" className="inline-flex items-center text-white/90 mb-8 hover:text-white transition-colors bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-sm font-bold">
                            <ChevronLeft size={18} className="mr-1" />
                            <span>Kembali Ke Beranda</span>
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="max-w-2xl">
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full shadow-lg">⭐ {restaurant.rating}</span>
                                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full border border-white/30 uppercase tracking-widest">{restaurant.cuisine}</span>
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter drop-shadow-2xl">{restaurant.name}</h1>
                                <div className="flex items-center space-x-6 text-white/80">
                                    <div className="flex items-center space-x-2">
                                        <Clock size={18} className="text-primary" />
                                        <span className="font-bold text-sm tracking-wide">{restaurant.deliveryTime} (Estimasi)</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <ShoppingBag size={18} className="text-primary" />
                                        <span className="font-bold text-sm tracking-wide">Min. Pesan Rp 20.000</span>
                                    </div>
                                </div>
                            </div>

                            {restaurant.offer && (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-primary p-6 rounded-[32px] shadow-2xl shadow-primary/40 border-4 border-white transform rotate-2 hidden md:block"
                                >
                                    <p className="text-white/80 text-[10px] uppercase font-black tracking-widest mb-1">Promo Khusus</p>
                                    <p className="text-white text-3xl font-black italic">{restaurant.offer}</p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Sections */}
            <div className="container mx-auto px-4 -mt-6 relative z-10">
                {/* Category Tabs */}
                <div className="flex overflow-x-auto space-x-3 mb-12 no-scrollbar p-2 bg-white rounded-3xl shadow-xl border border-gray-100">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveTab(cat)}
                            className={`px-8 py-4 rounded-2xl whitespace-nowrap text-sm font-black transition-all tracking-tight uppercase ${activeTab === cat
                                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {filteredMenu.map(item => {
                        const quantity = getItemQuantity(item.id);
                        return (
                            <motion.div
                                layout
                                key={item.id}
                                className="bg-white rounded-[32px] p-5 shadow-sm hover:shadow-xl transition-all flex space-x-6 border border-gray-100 group relative overflow-hidden"
                            >
                                <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl overflow-hidden flex-shrink-0 relative">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tighter text-gray-500 shadow-sm border border-white/50">{item.category}</div>
                                </div>

                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-black text-gray-800 mb-1 group-hover:text-primary transition-colors tracking-tight">{item.name}</h3>
                                        <p className="text-gray-400 text-xs font-medium mb-3 line-clamp-2">Pilihan terbaik untuk memanjakan lidah Anda hari ini.</p>
                                        <p className="text-primary font-black text-2xl tracking-tighter">{formatCurrency(item.price)}</p>
                                    </div>

                                    <div className="flex items-center justify-end mt-4">
                                        {quantity > 0 ? (
                                            <div className="flex items-center bg-gray-50 rounded-2xl p-1.5 border border-gray-100 shadow-inner">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="w-10 h-10 flex items-center justify-center bg-white text-gray-600 rounded-xl shadow-sm hover:text-red-500 active:scale-90 transition-all"
                                                >
                                                    <Minus size={18} strokeWidth={3} />
                                                </button>
                                                <span className="w-12 text-center font-black text-lg text-gray-800">{quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-xl shadow-md hover:bg-primary/90 active:scale-90 transition-all font-black text-lg"
                                                >
                                                    <Plus size={18} strokeWidth={3} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    addToCart({ ...item, restaurantId: restaurant.id, restaurantName: restaurant.name });
                                                    toast.success(`${item.name} ditambahkan!`, {
                                                        style: { borderRadius: '20px', fontWeight: 'bold' }
                                                    });
                                                }}
                                                className="px-10 py-3.5 bg-gray-900 text-white font-black rounded-2xl hover:bg-primary transition-all shadow-lg hover:shadow-primary/30 uppercase text-xs tracking-widest active:scale-95"
                                            >
                                                Tambahkan
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {quantity > 0 && <div className="absolute top-0 right-0 w-2 h-full bg-primary"></div>}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Floating Checkout Button */}
            {cart.length > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-6">
                    <Link to="/cart" className="bg-gray-900 text-white flex items-center justify-between p-2 pl-6 rounded-full shadow-2xl border-2 border-white/10 backdrop-blur-sm group hover:scale-105 transition-transform">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Total Pesanan</span>
                            <span className="text-lg font-black">{formatCurrency(cart.reduce((total, item) => total + item.price * item.quantity, 0))}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-xs font-black uppercase tracking-widest">Check Out</span>
                            <div className="bg-primary p-4 rounded-full group-hover:bg-primary/90 transition-colors">
                                <ChevronRight size={24} strokeWidth={3} />
                            </div>
                        </div>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default RestaurantMenu;
