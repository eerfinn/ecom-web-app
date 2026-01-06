import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, orderBy } from 'firebase/firestore';
import {
    Utensils, Plus, Edit2, Trash2, ShoppingBag,
    TrendingUp, Users, Clock, CheckCircle, Package,
    ChevronRight, Store, X, Image as ImageIcon
} from 'lucide-react';
import { uploadImage } from '../utils/upload';
import toast from 'react-hot-toast';

const RestaurantDashboard = () => {
    const { user } = useAuth();
    const [myRestaurant, setMyRestaurant] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'menu', 'orders'

    // Modal states
    const [isAddingItem, setIsAddingItem] = useState(false);
    const [isCreatingStore, setIsCreatingStore] = useState(false);

    // Form states
    const [newItem, setNewItem] = useState({ name: '', price: '', category: '', image: '' });
    const [newStore, setNewStore] = useState({ name: '', cuisine: '', image: '', deliveryTime: '20-30 min' });

    // File states
    const [storeImageFile, setStoreImageFile] = useState(null);
    const [itemImageFile, setItemImageFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (!user) return;

        // 1. Fetch Restaurant
        const qRes = query(collection(db, "restaurants"), where("ownerId", "==", user.uid));
        const unsubRes = onSnapshot(qRes, (snapshot) => {
            if (!snapshot.empty) {
                const docData = snapshot.docs[0];
                const resData = { id: docData.id, ...docData.data() };
                setMyRestaurant(resData);

                // 2. Fetch Orders for this restaurant
                const qOrders = query(
                    collection(db, "orders"),
                    where("restaurantId", "==", docData.id)
                );
                const unsubOrders = onSnapshot(qOrders, (orderSnap) => {
                    const orderList = orderSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    // Use client-side sorting to avoid missing index error
                    orderList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setOrders(orderList);
                }, (error) => {
                    console.error("Orders sync error:", error);
                });

                setLoading(false);
                return () => unsubOrders();
            } else {
                setLoading(false);
            }
        }, (error) => {
            console.error("Restaurant sync error:", error);
            setLoading(false);
        });

        return () => unsubRes();
    }, [user]);

    const handleCreateStore = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            let imageUrl = newStore.image;

            // Upload gambar jika ada file yang dipilih
            if (storeImageFile) {
                toast.loading("Mengupload logo restoran...", { id: 'upload' });
                imageUrl = await uploadImage(storeImageFile, 'restaurants');
                toast.success("Gambar berhasil diupload!", { id: 'upload' });
            }

            await addDoc(collection(db, "restaurants"), {
                ...newStore,
                image: imageUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500',
                ownerId: user.uid,
                ownerEmail: user.email,
                rating: 5.0,
                menu: [],
                createdAt: new Date().toISOString()
            });
            toast.success("Restoran berhasil didaftarkan!");
            setIsCreatingStore(false);
            setStoreImageFile(null);
        } catch (error) {
            toast.error("Gagal mendaftarkan restoran");
        } finally {
            setIsUploading(false);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            let imageUrl = newItem.image;

            // Upload gambar jika ada file yang dipilih
            if (itemImageFile) {
                toast.loading("Mengupload gambar menu...", { id: 'upload' });
                imageUrl = await uploadImage(itemImageFile, 'menus');
                toast.success("Gambar menu terupload!", { id: 'upload' });
            }

            const updatedMenu = [...(myRestaurant.menu || []), {
                ...newItem,
                id: Date.now(),
                price: Number(newItem.price),
                image: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'
            }];

            const resRef = doc(db, "restaurants", myRestaurant.id);
            await updateDoc(resRef, { menu: updatedMenu });
            toast.success("Menu berhasil ditambahkan!");
            setNewItem({ name: '', price: '', category: '', image: '' });
            setItemImageFile(null);
            setIsAddingItem(false);
        } catch (error) {
            toast.error("Gagal menambah menu");
        } finally {
            setIsUploading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, { status: newStatus });
            toast.success(`Status pesanan diperbarui: ${newStatus}`);
        } catch (error) {
            toast.error("Gagal memperbarui status");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    // Render Onboarding if no restaurant
    if (!myRestaurant) return (
        <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-6">
            {!isCreatingStore ? (
                <div className="bg-white max-w-xl w-full rounded-[40px] shadow-2xl p-12 text-center border border-gray-100">
                    <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                        <Store size={48} className="text-primary" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-800 mb-4 tracking-tight">Selamat Datang, Mitra!</h2>
                    <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                        Anda telah mendaftar sebagai akun Restoran. Langkah terakhir adalah mendaftarkan profil restoran Anda untuk mulai berjualan.
                    </p>
                    <button
                        onClick={() => setIsCreatingStore(true)}
                        className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all text-lg"
                    >
                        Daftarkan Restoran Sekarang
                    </button>
                </div>
            ) : (
                <div className="bg-white max-w-2xl w-full rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
                    <div className="bg-primary p-10 text-white flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-black">Profil Restoran</h2>
                            <p className="opacity-80">Masukkan informasi detail warung/toko Anda</p>
                        </div>
                        <button onClick={() => setIsCreatingStore(false)} className="p-2 bg-white/20 rounded-xl hover:bg-white/30 transition-all">
                            <X size={24} />
                        </button>
                    </div>
                    <form onSubmit={handleCreateStore} className="p-10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-700 ml-1 uppercase tracking-wider">Nama Restoran</label>
                                <input
                                    type="text" required placeholder="Misal: Sate Padang Bang Jo"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                                    value={newStore.name}
                                    onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-700 ml-1 uppercase tracking-wider">Jenis Masakan</label>
                                <input
                                    type="text" required placeholder="Misal: Indonesian, Seafood"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                                    value={newStore.cuisine}
                                    onChange={(e) => setNewStore({ ...newStore, cuisine: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 ml-1 uppercase tracking-wider">Logo / Foto Banner Toko</label>
                            <label className="relative flex flex-col items-center justify-center w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[32px] cursor-pointer hover:bg-gray-100 hover:border-primary/50 transition-all group overflow-hidden">
                                {storeImageFile ? (
                                    <div className="flex flex-col items-center">
                                        <CheckCircle className="text-green-500 mb-2" size={24} />
                                        <p className="text-xs font-bold text-gray-600 truncate max-w-[200px]">{storeImageFile.name}</p>
                                        <p className="text-[10px] text-gray-400 mt-1">Klik untuk mengganti</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <ImageIcon className="text-gray-400 group-hover:text-primary transition-colors mb-2" size={32} />
                                        <p className="text-xs font-bold text-gray-500">Pilih atau Seret Gambar</p>
                                        <p className="text-[10px] text-gray-400 mt-1">Maksimal 2MB</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => setStoreImageFile(e.target.files[0])}
                                />
                            </label>
                            {/* Input URL disembunyikan tapi tetap ada sebagai fallback */}
                            <input
                                type="hidden"
                                value={newStore.image}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black text-gray-700 ml-1 uppercase tracking-wider">Estimasi Pengantaran</label>
                            <select
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                                value={newStore.deliveryTime}
                                onChange={(e) => setNewStore({ ...newStore, deliveryTime: e.target.value })}
                            >
                                <option>15-20 min</option>
                                <option>20-30 min</option>
                                <option>30-45 min</option>
                                <option>45-60 min</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            disabled={isUploading}
                            className={`w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl transition-all text-xl mt-4 flex items-center justify-center space-x-3 ${isUploading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-primary/30'}`}
                        >
                            {isUploading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                            <span>{isUploading ? 'Sedang Memproses...' : 'Simpan & Buka Toko'}</span>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fcfcfd] pb-24">
            {/* Realtime Stats Bar */}
            <div className="bg-gray-900 overflow-hidden relative">
                <div className="container mx-auto px-6 py-12 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-[10px] font-black rounded-full border border-green-500/30 uppercase tracking-[2px]">Toko Buka</span>
                                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{myRestaurant.cuisine}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">{myRestaurant.name}</h1>
                            <div className="flex items-center space-x-6 text-white/60">
                                <div className="flex items-center space-x-2">
                                    <Clock size={16} className="text-primary" />
                                    <span className="font-bold text-sm tracking-tight">{myRestaurant.deliveryTime}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CheckCircle size={16} className="text-primary" />
                                    <span className="font-bold text-sm tracking-tight">{myRestaurant.rating} Rating</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 text-right min-w-[160px]">
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Total Pesanan</p>
                                <p className="text-2xl font-black text-white">{orders.length}</p>
                            </div>
                            <div className="bg-primary p-4 rounded-3xl shadow-2xl shadow-primary/20 text-right min-w-[200px]">
                                <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">Pendapatan Bersih</p>
                                <p className="text-2xl font-black text-white">
                                    Rp {orders.filter(o => o.status === 'DELIVERED').reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[120px] rounded-full -mr-20"></div>
            </div>

            {/* Navigation Tabs */}
            <div className="container mx-auto px-6 -mt-8 relative z-20">
                <div className="bg-white p-2 rounded-3xl shadow-xl border border-gray-100 flex items-center space-x-2 mb-10 overflow-x-auto no-scrollbar">
                    {[
                        { id: 'overview', label: 'Ringkasan', icon: <TrendingUp size={18} /> },
                        { id: 'orders', label: `Pesanan (${orders.filter(o => o.status !== 'DELIVERED').length})`, icon: <ShoppingBag size={18} /> },
                        { id: 'menu', label: 'Atur Menu', icon: <Utensils size={18} /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-8 py-4 rounded-2xl whitespace-nowrap text-sm font-black transition-all tracking-tight uppercase ${activeTab === tab.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                                : 'text-gray-400 hover:bg-gray-50'
                                }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                {activeTab === 'overview' && (
                    <div className="space-y-10 animate-in fade-in duration-500">
                        {/* Summary Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Pesanan Baru', value: orders.filter(o => o.status === 'PENDING').length, color: 'bg-orange-500' },
                                { label: 'Sedang Disiapkan', value: orders.filter(o => o.status === 'PREPARING').length, color: 'bg-blue-500' },
                                { label: 'Terkirim', value: orders.filter(o => o.status === 'DELIVERED').length, color: 'bg-green-500' },
                                { label: 'Pelanggan Unik', value: new Set(orders.map(o => o.userId)).size, color: 'bg-purple-500' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between h-40">
                                    <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                                        <p className="text-3xl font-black text-gray-800">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Recent Activity Mini List */}
                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10">
                            <h3 className="text-2xl font-black text-gray-800 mb-8 tracking-tighter">Aktivitas Terbaru</h3>
                            <div className="space-y-6">
                                {orders.length > 0 ? orders.slice(0, 5).map(order => (
                                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary font-black">
                                                #{order.id.slice(-4).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-800">{order.userName}</p>
                                                <p className="text-xs text-gray-400 font-bold">{order.items.length} Menu • Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                                            </div>
                                        </div>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                                            order.status === 'PREPARING' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                )) : (
                                    <p className="text-center text-gray-400 font-bold py-10">Belum ada aktivitas hari ini.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-500">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-3xl font-black text-gray-800 tracking-tighter">Kelola Pesanan</h2>
                            <span className="bg-primary/10 text-primary px-4 py-2 rounded-2xl text-xs font-black">REALTIME FEED</span>
                        </div>

                        {orders.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {orders.map(order => (
                                    <div key={order.id} className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all">
                                        <div className="p-8 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
                                            <div className="flex-1 flex flex-col md:flex-row gap-8">
                                                <div className="min-w-[120px]">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nomer Pesanan</p>
                                                    <p className="font-black text-lg text-primary">#{order.id.slice(-6).toUpperCase()}</p>
                                                    <p className="text-xs text-gray-400 mt-2 font-bold">{new Date(order.createdAt).toLocaleTimeString('id-ID')}</p>
                                                </div>
                                                <div className="flex-1 border-l-0 md:border-l border-gray-100 md:pl-8">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Item Menu</p>
                                                    <ul className="space-y-1">
                                                        {order.items.map((it, idx) => (
                                                            <li key={idx} className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                                                                <span className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-[10px]">{it.quantity}x</span>
                                                                <span>{it.name}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="min-w-[150px] border-l-0 md:border-l border-gray-100 md:pl-8">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pembeli</p>
                                                    <p className="font-black text-gray-800">{order.userName}</p>
                                                    <p className="text-xs text-gray-400 font-bold">{order.userId.slice(0, 8)}...</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 w-full lg:w-auto pt-6 lg:pt-0 border-t lg:border-t-0 border-gray-50">
                                                <div className="mr-4 text-right">
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Bayar</p>
                                                    <p className="text-xl font-black text-gray-900">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                                                </div>

                                                {order.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                                                        className="flex-1 lg:flex-none px-8 py-4 bg-orange-500 text-white font-black rounded-2xl shadow-lg shadow-orange-500/20 hover:scale-105 transition-all uppercase text-xs tracking-widest"
                                                    >
                                                        Siapkan Pesanan
                                                    </button>
                                                )}
                                                {order.status === 'PREPARING' && (
                                                    <button
                                                        onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                                                        className="flex-1 lg:flex-none px-8 py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all uppercase text-xs tracking-widest"
                                                    >
                                                        Antar Sekarang
                                                    </button>
                                                )}
                                                {order.status === 'DELIVERED' && (
                                                    <div className="flex items-center space-x-2 text-green-500 bg-green-50 px-6 py-3 rounded-2xl border border-green-100 font-black text-xs uppercase tracking-widest">
                                                        <CheckCircle size={16} />
                                                        <span>Pesanan Selesai</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                                <div className="text-6xl mb-6">🏜️</div>
                                <h3 className="text-2xl font-black text-gray-800 mb-2">Belum ada pesanan</h3>
                                <p className="text-gray-400 font-bold">Terus promosikan lapak Anda agar pelanggan berdatangan!</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'menu' && (
                    <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h2 className="text-3xl font-black text-gray-800 tracking-tighter">Katalog Menu</h2>
                                <p className="text-gray-400 font-bold">Total {myRestaurant.menu?.length || 0} hidangan terdaftar</p>
                            </div>
                            <button
                                onClick={() => setIsAddingItem(true)}
                                className="flex items-center justify-center space-x-2 px-10 py-5 bg-gray-900 text-white font-black rounded-3xl shadow-2xl hover:bg-primary transition-all group"
                            >
                                <Plus size={22} className="group-hover:rotate-90 transition-transform" />
                                <span className="uppercase text-xs tracking-widest">Tambah Menu Baru</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {myRestaurant.menu?.map((item) => (
                                <div key={item.id} className="bg-white p-5 rounded-[40px] shadow-sm border border-gray-100 flex flex-col group hover:shadow-2xl transition-all relative overflow-hidden">
                                    <div className="h-48 rounded-[32px] overflow-hidden mb-6 relative">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-lg border border-white/50">{item.category}</span>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-xl font-black text-gray-800 mb-2">{item.name}</h3>
                                            <p className="text-primary font-black text-2xl tracking-tighter mb-6">Rp {item.price.toLocaleString('id-ID')}</p>
                                        </div>
                                        <div className="flex items-center space-x-3 pt-4 border-t border-gray-50">
                                            <button className="flex-1 py-3 bg-gray-50 text-gray-400 font-bold rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center space-x-2">
                                                <Edit2 size={16} />
                                                <span className="text-[10px] uppercase tracking-widest">Edit</span>
                                            </button>
                                            <button className="flex-1 py-3 bg-gray-50 text-gray-400 hover:text-red-500 font-bold rounded-2xl hover:bg-red-50 transition-all flex items-center justify-center space-x-2 border border-transparent hover:border-red-100">
                                                <Trash2 size={16} />
                                                <span className="text-[10px] uppercase tracking-widest">Hapus</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Tambah Menu (Reuse from previous version but enhanced) */}
            {isAddingItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden border border-white/20">
                        <div className="bg-gray-900 p-8 text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black tracking-tighter">Tambah Menu</h2>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Lengkapi detail hidangan</p>
                            </div>
                            <button onClick={() => setIsAddingItem(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddItem} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Makanan/Minuman</label>
                                    <input
                                        type="text" required
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                                        placeholder="Misal: Nasi Goreng Gila"
                                        value={newItem.name}
                                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Harga (Rp)</label>
                                        <input
                                            type="number" required
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                                            placeholder="25000"
                                            value={newItem.price}
                                            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kategori</label>
                                        <input
                                            type="text" required
                                            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                                            placeholder="Makanan/Minuman/Snack"
                                            value={newItem.category}
                                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Foto Menu</label>
                                    <label className="relative flex items-center space-x-4 p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-100 transition-all group">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-primary shadow-sm border border-gray-100 transition-all">
                                            {itemImageFile ? <CheckCircle className="text-green-500" size={24} /> : <ImageIcon size={24} />}
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-xs font-black text-gray-700 truncate">{itemImageFile ? itemImageFile.name : 'Pilih Gambar Menu'}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Klik untuk mencari file</p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => setItemImageFile(e.target.files[0])}
                                        />
                                    </label>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={isUploading}
                                className={`w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl transition-all uppercase text-xs tracking-[2px] mt-4 flex items-center justify-center space-x-3 ${isUploading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-primary/30'}`}
                            >
                                {isUploading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                <span>{isUploading ? 'Menyimpan...' : 'Simpan Hidangan'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantDashboard;
