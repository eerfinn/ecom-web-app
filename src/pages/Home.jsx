import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useCart } from '../context/CartContext';
import RestaurantCard from '../components/RestaurantCard';
import { Search, Filter, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { migrateDataToFirestore } from '../utils/migration';
import toast from 'react-hot-toast';

const Home = () => {
    const { formatCurrency } = useCart();
    const [restaurants, setRestaurants] = useState([]);
    const [offers, setOffers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch Restaurants
        const qRes = query(collection(db, "restaurants"), orderBy("createdAt", "desc"));
        const unsubRes = onSnapshot(qRes, (snapshot) => {
            setRestaurants(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // Fetch Offers
        const qOffers = query(collection(db, "offers"), orderBy("createdAt", "desc"));
        const unsubOffers = onSnapshot(qOffers, (snapshot) => {
            setOffers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        return () => {
            unsubRes();
            unsubOffers();
        };
    }, []);

    const handleMigration = async () => {
        const res = await migrateDataToFirestore();
        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.error);
        }
    };

    const categories = [
        { name: 'Semua', icon: '🍽️' },
        { name: 'Burgers', icon: '🍔' },
        { name: 'Pizza', icon: '🍕' },
        { name: 'Indian', icon: '🍛' },
        { name: 'Japanese', icon: '🍣' },
        { name: 'Chinese', icon: '🥢' },
        { name: 'Salads', icon: '🥗' },
    ];

    const filteredRestaurants = restaurants.filter(res => {
        const nameMatch = res.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const cuisineMatch = res.cuisine?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSearch = nameMatch || cuisineMatch;
        const matchesCategory = activeCategory === 'Semua' || res.cuisine?.includes(activeCategory);
        return matchesSearch && matchesCategory;
    });

    if (loading && restaurants.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="h-20 w-20 border-t-4 border-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 bg-[#f7f8fa]">
            {/* Hero Section */}
            <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80"
                        alt="Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/20"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between">
                    <div className="md:w-1/2">
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.1]"
                        >
                            Makan Enak <br />
                            Gak Pake <span className="text-primary italic animate-pulse">Ribet</span>
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-white/80 mb-8 max-w-lg"
                        >
                            Temukan ribuan hidangan lezat dari restoran favoritmu dan nikmati gratis ongkir ke seluruh penjuru kota!
                        </motion.p>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-xl relative group shadow-2xl rounded-2xl overflow-hidden"
                        >
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                                <Search size={22} />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari soto, burger, atau sushi..."
                                className="w-full pl-14 pr-6 py-6 bg-white outline-none text-gray-700 transition-all text-lg font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </motion.div>
                    </div>

                    <div className="hidden lg:block md:w-1/3">
                        <div className="relative">
                            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full animate-float"></div>
                            <img
                                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80"
                                alt="Featured"
                                className="relative z-10 w-full rounded-[40px] shadow-2xl border-8 border-white animate-float"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="container mx-auto px-4 -mt-16 mb-12 relative z-20">
                <div className="flex overflow-x-auto space-x-4 pb-4 no-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`flex flex-col items-center justify-center min-w-[100px] h-28 rounded-3xl transition-all shadow-sm border-2 ${activeCategory === cat.name
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-105'
                                : 'bg-white border-transparent text-gray-600 hover:border-primary/30 hover:bg-primary/5'
                                }`}
                        >
                            <span className="text-3xl mb-2">{cat.icon}</span>
                            <span className="text-xs font-bold uppercase tracking-wider">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Offers Section */}
            {!searchTerm && (
                <section className="container mx-auto px-4 mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Promo Spesial Untukmu 🎁</h2>
                        <button className="text-primary font-bold text-sm hover:underline">Lihat Semua</button>
                    </div>
                    <div className="flex overflow-x-auto space-x-6 pb-6 no-scrollbar">
                        {offers.map((offer, i) => {
                            const colors = ['bg-orange-600', 'bg-blue-600', 'bg-emerald-600', 'bg-violet-600'];
                            const color = colors[i % colors.length];
                            // Use items[0].image if offer doesn't have image, or dummy if empty
                            const img = offer.image || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80";

                            return (
                                <div key={offer.id} className={`${color} min-w-[320px] md:min-w-[400px] p-0 rounded-[32px] text-white shadow-xl flex items-stretch h-48 relative overflow-hidden group border-4 border-white`}>
                                    <div className="p-6 flex flex-col justify-between flex-1 relative z-10">
                                        <div>
                                            <p className="text-xs font-bold opacity-80 mb-1 leading-tight uppercase tracking-widest">{offer.label}</p>
                                            <h3 className="text-3xl font-black">{offer.code}</h3>
                                        </div>
                                        <div className="flex flex-col space-y-2 items-start">
                                            <div className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm border border-white/30">
                                                <p className="text-xs font-bold font-mono tracking-tighter uppercase">{offer.type === 'percentage' ? `${offer.discount}% OFF` : `Potongan ${offer.discount}`}</p>
                                            </div>
                                            <button className="text-[10px] font-black bg-white text-gray-900 px-4 py-2 rounded-full transition-transform active:scale-95 uppercase tracking-tighter">AMBIL PROMO</button>
                                        </div>
                                    </div>
                                    <div className="w-1/3 relative">
                                        <img src={img} alt="Promo" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-inherit to-transparent"></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Restaurant List Section */}
            <section className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight flex items-center">
                            {searchTerm ? `Hasil pencarian untuk "${searchTerm}"` : 'Restoran Populer'}
                            {!searchTerm && <span className="ml-3 px-3 py-1 bg-primary/10 text-primary text-[10px] rounded-full uppercase font-black tracking-widest border border-primary/20">🔥 HOT NOW</span>}
                        </h2>
                        {activeCategory !== 'Semua' && (
                            <p className="text-gray-500 mt-1 font-medium italic">Menampilkan masakan pilihan: {activeCategory}</p>
                        )}
                    </div>

                    <div className="flex space-x-3">
                        <button className="flex items-center space-x-2 px-6 py-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-gray-600 border border-gray-100 group">
                            <span className="font-bold text-sm">Rating 4.5+</span>
                        </button>
                        <button className="flex items-center space-x-2 px-6 py-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all text-gray-600 border border-gray-100">
                            <Filter size={18} className="text-primary" />
                            <span className="font-bold text-sm">Filter</span>
                        </button>
                    </div>
                </div>

                {filteredRestaurants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredRestaurants.map(res => (
                            <RestaurantCard key={res.id} restaurant={res} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[40px] shadow-sm border-2 border-dashed border-gray-200">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Wah, hasil tidak ditemukan</h3>
                        <p className="text-gray-500 font-medium">Coba cari dengan kata kunci lain atau pilih kategori berbeda.</p>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
                            <button onClick={() => { setSearchTerm(''); setActiveCategory('Semua'); }} className="px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20">Reset Semua</button>
                            {restaurants.length === 0 && (
                                <button onClick={handleMigration} className="px-8 py-3 bg-gray-900 text-white font-bold rounded-2xl shadow-lg flex items-center space-x-2">
                                    <Database size={18} />
                                    <span>Impor Data Awal</span>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
