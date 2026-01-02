import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import {
    LayoutDashboard, Store, ShoppingBag, Users as UsersIcon,
    TrendingUp, Search, ExternalLink, ShieldCheck,
    ArrowUpRight, AlertCircle, CheckCircle2
} from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [restaurants, setRestaurants] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Platform level metrics tracking
        const unsubRes = onSnapshot(collection(db, "restaurants"), (snap) => {
            setRestaurants(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const unsubOrders = onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc")), (snap) => {
            setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
            setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        return () => {
            unsubRes();
            unsubOrders();
            unsubUsers();
        };
    }, []);

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center space-y-4">
                <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-indigo-600 animate-pulse">Memuat Data Panel Admin...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f1f3f9] pb-24">
            {/* Elegant Sidebar/Header Container */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">FoodKart Admin</h1>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Pusat Kendali Platform</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-10">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Omzet', value: `Rp ${totalRevenue.toLocaleString('id-ID')}`, icon: <TrendingUp className="text-emerald-600" />, color: 'bg-emerald-50' },
                        { label: 'Total Pesanan', value: orders.length, icon: <ShoppingBag className="text-blue-600" />, color: 'bg-blue-50' },
                        { label: 'Total Restoran', value: restaurants.length, icon: <Store className="text-orange-600" />, color: 'bg-orange-50' },
                        { label: 'Total Pengguna', value: users.length, icon: <UsersIcon className="text-purple-600" />, color: 'bg-purple-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center space-x-5">
                            <div className={`p-4 rounded-2xl ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[2px] mb-1">{stat.label}</p>
                                <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Recent Orders Table */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                                <h2 className="text-xl font-black text-gray-900">Transaksi Terbaru</h2>
                                <button className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline">Lihat Semua</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50/50">
                                        <tr>
                                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Pelanggan</th>
                                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Restoran</th>
                                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                            <th className="px-8 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {orders.slice(0, 10).map(order => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-8 py-5 font-bold text-gray-900 text-sm">#{order.id.slice(-6).toUpperCase()}</td>
                                                <td className="px-8 py-5 text-gray-600 text-sm font-medium">{order.userName}</td>
                                                <td className="px-8 py-5 text-gray-600 text-sm font-medium">{order.restaurantName}</td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                                                            order.status === 'PREPARING' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right font-black text-gray-900 text-sm">Rp {order.totalAmount.toLocaleString('id-ID')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Top Restaurants */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8">
                            <h2 className="text-xl font-black text-gray-900 mb-6">Restoran Terdaftar</h2>
                            <div className="space-y-6">
                                {restaurants.slice(0, 6).map(res => (
                                    <div key={res.id} className="flex items-center justify-between group">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md">
                                                <img src={res.image} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{res.name}</p>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">{res.cuisine}</p>
                                            </div>
                                        </div>
                                        <button className="p-2 bg-gray-50 rounded-xl text-gray-400 hover:text-indigo-600 transition-all">
                                            <ExternalLink size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* User Distribution */}
                        <div className="bg-indigo-900 rounded-[40px] shadow-2xl p-8 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h2 className="text-xl font-black mb-6">Distribusi User</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-white/10 p-4 rounded-2xl border border-white/10">
                                        <span className="text-xs font-black uppercase">Pembeli</span>
                                        <span className="text-xl font-black">{users.filter(u => u.role === 'USER').length}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-indigo-600 p-4 rounded-2xl border border-indigo-400 shadow-xl">
                                        <span className="text-xs font-black uppercase">Partner Toko</span>
                                        <span className="text-xl font-black">{users.filter(u => u.role === 'RESTAURANT').length}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 blur-3xl opacity-30"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
