import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, onSnapshot, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import {
    LayoutDashboard, Store, ShoppingBag, Users as UsersIcon,
    TrendingUp, ExternalLink, ShieldCheck,
    CheckCircle2, X, Trash2, ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const { user: currentUser } = useAuth();
    const [restaurants, setRestaurants] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'users', 'restaurants'

    useEffect(() => {
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

    const toggleUserRole = async (userId, currentRole) => {
        if (userId === currentUser.uid) {
            toast.error("Anda tidak bisa mengubah role Anda sendiri!");
            return;
        }
        const newRole = currentRole === 'USER' ? 'RESTAURANT' : 'USER';
        try {
            await updateDoc(doc(db, "users", userId), { role: newRole });
            toast.success(`Role user diperbarui menjadi ${newRole}`);
        } catch (error) {
            toast.error("Gagal memperbarui role");
        }
    };

    const deleteRestaurant = async (resId) => {
        if (!window.confirm("Yakin ingin menghapus restoran ini?")) return;
        try {
            await deleteDoc(doc(db, "restaurants", resId));
            toast.success("Restoran dihapus dari platform");
        } catch (error) {
            toast.error("Gagal menghapus restoran");
        }
    };

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center space-y-4">
                <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-indigo-600 animate-pulse text-xs tracking-widest uppercase">Pusat Data Terkoneksi...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#f4f7fe] pb-24">
            {/* Admin Top Bar */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-200">
                            <ShieldCheck size={26} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Mainframe Admin</h1>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[3px]">Platform Control Center</p>
                        </div>
                    </div>

                    <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                        {[
                            { id: 'overview', label: 'Ringkasan', icon: <LayoutDashboard size={16} /> },
                            { id: 'users', label: 'Pengguna', icon: <UsersIcon size={16} /> },
                            { id: 'restaurants', label: 'Partner Toko', icon: <Store size={16} /> },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                        ? 'bg-white text-indigo-600 shadow-md'
                                        : 'text-gray-500 hover:text-indigo-400'
                                    }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-10">
                {activeTab === 'overview' && (
                    <div className="space-y-10 animate-in fade-in duration-500">
                        {/* Summary Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Gross Revenue', value: `Rp ${totalRevenue.toLocaleString('id-ID')}`, trend: '+12%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                { label: 'Executed Orders', value: orders.length, trend: '+5%', color: 'text-blue-600', bg: 'bg-blue-50' },
                                { label: 'Active Sellers', value: restaurants.length, trend: 'Stable', color: 'text-orange-600', bg: 'bg-orange-50' },
                                { label: 'Total Users', value: users.length, trend: '+8%', color: 'text-purple-600', bg: 'bg-purple-50' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                                    <h3 className="text-3xl font-black text-gray-900 mb-4">{stat.value}</h3>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black ${stat.bg} ${stat.color}`}>{stat.trend}</span>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Transactions list */}
                            <div className="lg:col-span-2 bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                                    <h2 className="text-xl font-black text-gray-900 tracking-tight">Recent Transactions</h2>
                                    <ShoppingBag size={20} className="text-gray-200" />
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50/50">
                                            <tr>
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Details</th>
                                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                                <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {orders.slice(0, 8).map(order => (
                                                <tr key={order.id} className="group hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-8 py-6">
                                                        <p className="font-black text-gray-900 text-sm mb-0.5">#{order.id.slice(-6).toUpperCase()}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{order.userName} @ {order.restaurantName}</p>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-6 text-right font-black text-gray-900">
                                                        Rp {order.totalAmount.toLocaleString('id-ID')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Sidebar components */}
                            <div className="space-y-8">
                                <div className="bg-indigo-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                                    <h2 className="text-xl font-black mb-8 relative z-10">User Topology</h2>
                                    <div className="space-y-4 relative z-10">
                                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <div className="flex items-center space-x-3">
                                                <UsersIcon size={16} className="text-indigo-400" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Customers</span>
                                            </div>
                                            <span className="text-xl font-black">{users.filter(u => u.role === 'USER').length}</span>
                                        </div>
                                        <div className="flex justify-between items-center bg-indigo-600/50 p-4 rounded-2xl border border-indigo-400/30">
                                            <div className="flex items-center space-x-3">
                                                <Store size={16} className="text-indigo-200" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Sellers</span>
                                            </div>
                                            <span className="text-xl font-black">{users.filter(u => u.role === 'RESTAURANT').length}</span>
                                        </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500 blur-[80px] opacity-30 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-5 duration-500">
                        <div className="p-10 border-b border-gray-50">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">User Directory</h2>
                            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Total Identity Access Management: {users.length}</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/50">
                                    <tr>
                                        <th className="px-10 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">User Profile</th>
                                        <th className="px-10 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Role Level</th>
                                        <th className="px-10 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black">
                                                        {u.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900">{u.name}</p>
                                                        <p className="text-xs text-gray-400 font-medium">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'ADMIN' ? 'bg-indigo-600 text-white' :
                                                        u.role === 'RESTAURANT' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                {u.role !== 'ADMIN' && (
                                                    <button
                                                        onClick={() => toggleUserRole(u.id, u.role)}
                                                        className="p-3 bg-gray-50 text-gray-400 hover:text-indigo-600 rounded-xl transition-all border border-transparent hover:border-indigo-100 active:scale-95"
                                                        title="Switch Role"
                                                    >
                                                        <ShieldAlert size={18} />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'restaurants' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-5 duration-500">
                        {restaurants.map(res => (
                            <div key={res.id} className="bg-white rounded-[48px] overflow-hidden shadow-sm border border-gray-100 group hover:shadow-2xl transition-all duration-500 flex flex-col">
                                <div className="h-56 relative overflow-hidden">
                                    <img src={res.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                                    <div className="absolute top-6 left-6">
                                        <span className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black border border-white/50 text-gray-900 shadow-xl uppercase tracking-widest">
                                            {res.cuisine}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => deleteRestaurant(res.id)}
                                        className="absolute top-6 right-6 p-4 bg-red-500/20 backdrop-blur-md text-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white border border-red-500/30 shadow-xl"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                                <div className="p-10 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-2xl font-black text-gray-900 leading-tight">{res.name}</h3>
                                        <div className="flex items-center space-x-1 text-orange-500">
                                            <CheckCircle2 size={16} />
                                            <span className="text-sm font-black tracking-tighter">{res.rating}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-400 font-medium text-sm mb-8 flex-1">Owner ID: {res.ownerId?.slice(0, 12)}...</p>
                                    <div className="pt-8 border-t border-gray-50 mt-auto flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Cuisines</p>
                                            <p className="text-xs font-bold text-gray-700">{res.cuisine}</p>
                                        </div>
                                        <Link to={`/restaurant/${res.id}`} className="p-4 bg-gray-50 rounded-2xl text-gray-400 hover:text-indigo-600 transition-all">
                                            <ExternalLink size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
