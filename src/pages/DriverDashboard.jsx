import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, doc, updateDoc, orderBy } from 'firebase/firestore';
import {
    Bike, MapPin, Package, CheckCircle,
    Navigation, DollarSign, Clock, Check
} from 'lucide-react';
import toast from 'react-hot-toast';

const DriverDashboard = () => {
    const { user } = useAuth();
    const [availableOrders, setAvailableOrders] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('available'); // 'available', 'my-orders', 'history'

    useEffect(() => {
        if (!user) return;

        // 1. Fetch orders READY_FOR_PICKUP (Global available pool)
        const qAvailable = query(
            collection(db, "orders"),
            where("status", "==", "READY_FOR_PICKUP")
        );
        const unsubAvailable = onSnapshot(qAvailable, (snapshot) => {
            setAvailableOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        // 2. Fetch orders assigned to this driver
        const qMyOrders = query(
            collection(db, "orders"),
            where("driverId", "==", user.uid)
        );
        const unsubMy = onSnapshot(qMyOrders, (snapshot) => {
            const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setMyOrders(list);
        });

        return () => {
            unsubAvailable();
            unsubMy();
        };
    }, [user]);

    const pickupOrder = async (orderId) => {
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, {
                status: 'PICKED_UP',
                driverId: user.uid,
                driverName: user.name,
                pickedUpAt: new Date().toISOString()
            });
            toast.success("Pesanan telah Anda ambil! Silakan antar ke tujuan.");
            setActiveTab('my-orders');
        } catch (error) {
            toast.error("Gagal mengambil pesanan");
        }
    };

    const completeDelivery = async (orderId) => {
        try {
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, {
                status: 'DELIVERED',
                deliveredAt: new Date().toISOString()
            });
            toast.success("Pengantaran selesai! Kerja bagus.");
        } catch (error) {
            toast.error("Gagal update status pengiriman");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const activeOrders = myOrders.filter(o => o.status === 'PICKED_UP');
    const historyOrders = myOrders.filter(o => o.status === 'DELIVERED');
    const totalEarnings = historyOrders.length * 5000; // Misal flat rate Rp 5.000 per delivery

    return (
        <div className="min-h-screen bg-[#fcfcfd] pb-24">
            {/* Header / Stats Bar */}
            <div className="bg-gray-950 relative overflow-hidden">
                <div className="container mx-auto px-6 py-12 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 bg-primary/20 rounded-[32px] flex items-center justify-center border border-primary/30 text-primary">
                                <Bike size={40} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-white tracking-tighter">Halo, {user.name}!</h1>
                                <p className="text-white/40 text-xs font-black uppercase tracking-widest">{user.vehicleNumber} • Malang Driver</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl border border-white/10 text-right min-w-[140px]">
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Total Trip</p>
                                <p className="text-xl font-black text-white">{historyOrders.length}</p>
                            </div>
                            <div className="bg-primary p-4 rounded-3xl shadow-2xl shadow-primary/20 text-right min-w-[180px]">
                                <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">Pendapatan Hari Ini</p>
                                <p className="text-xl font-black text-white">Rp {totalEarnings.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-primary/10 blur-[100px] rounded-full"></div>
            </div>

            {/* Navigation */}
            <div className="container mx-auto px-6 -mt-8 relative z-20">
                <div className="bg-white p-2 rounded-3xl shadow-xl border border-gray-100 flex items-center space-x-2 mb-10 overflow-x-auto no-scrollbar">
                    {[
                        { id: 'available', label: `Tersedia (${availableOrders.length})`, icon: <Package size={18} /> },
                        { id: 'my-orders', label: `Aktif (${activeOrders.length})`, icon: <Navigation size={18} /> },
                        { id: 'history', label: 'Riwayat', icon: <Clock size={18} /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center space-x-2 px-8 py-4 rounded-2xl whitespace-nowrap text-sm font-black transition-all tracking-tight uppercase ${activeTab === tab.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-gray-400 hover:bg-gray-50'
                                }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Available Pool */}
                {activeTab === 'available' && (
                    <div className="space-y-6">
                        {availableOrders.length > 0 ? availableOrders.map(order => (
                            <div key={order.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8 group hover:shadow-2xl transition-all">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-indigo-100 italic">SIAP DIJEMPUT</div>
                                        <p className="text-sm font-black text-gray-400">#{order.id.slice(-6).toUpperCase()}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Penjemputan</p>
                                            <p className="font-black text-gray-800 text-lg flex items-center">
                                                <MapPin size={18} className="text-primary mr-2" />
                                                {order.restaurantName}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tujuan Pengiriman</p>
                                            <p className="font-black text-gray-800 text-lg flex items-center">
                                                <MapPin size={18} className="text-indigo-600 mr-2" />
                                                Alamat Pelanggan
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <p className="text-xs font-bold text-gray-400">Pesanan: {order.items.map(it => it.name).join(', ')}</p>
                                        <p className="font-black text-primary">Biaya Antar: Rp 5.000</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => pickupOrder(order.id)}
                                    className="w-full md:w-auto px-10 py-5 bg-gray-900 text-white font-black rounded-3xl shadow-xl hover:bg-primary transition-all flex items-center justify-center space-x-3 group/btn"
                                >
                                    <span>AMBIL PESANAN</span>
                                    <Navigation size={20} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </button>
                            </div>
                        )) : (
                            <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                                <p className="text-6xl mb-6">🏜️</p>
                                <h3 className="text-2xl font-black text-gray-800 mb-2">Belum ada pesanan masuk</h3>
                                <p className="text-gray-400 font-bold">Harap standby di area ramai untuk mendapatkan trip.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Active Orders */}
                {activeTab === 'my-orders' && (
                    <div className="space-y-6">
                        {activeOrders.length > 0 ? activeOrders.map(order => (
                            <div key={order.id} className="bg-white p-8 rounded-[40px] shadow-sm border border-primary/20 overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                <div className="relative z-10 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="px-4 py-1.5 bg-blue-100 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest flex items-center">
                                            <Navigation size={12} className="mr-2 animate-pulse" /> TERDAPAT TRIP AKTIF
                                        </span>
                                        <p className="font-black text-gray-900">Rp 5.000 <span className="text-xs text-gray-400 font-bold tracking-tighter ml-1">BERSIH</span></p>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-8">
                                        <div className="flex-1 space-y-8">
                                            <div className="relative pl-8 border-l-2 border-dashed border-gray-200">
                                                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm"></div>
                                                <div className="absolute -left-[9px] bottom-0 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-sm"></div>
                                                <div className="space-y-6">
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Titik Ambil</p>
                                                        <p className="font-black text-gray-800">{order.restaurantName}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Titik Antar</p>
                                                        <p className="font-black text-gray-800">{order.userName}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full md:w-64 bg-gray-50 rounded-3xl p-6 flex flex-col justify-between items-center text-center">
                                            <Package size={32} className="text-gray-300 mb-3" />
                                            <p className="text-xs font-bold text-gray-500 mb-6">Pastikan makanan sesuai dengan pesanan.</p>
                                            <button
                                                onClick={() => completeDelivery(order.id)}
                                                className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center justify-center space-x-2"
                                            >
                                                <CheckCircle size={18} />
                                                <span>SELESAI ANTAR</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-32 bg-white rounded-[40px] border-2 border-dashed border-gray-100">
                                <p className="text-6xl mb-6">🏘️</p>
                                <h3 className="text-2xl font-black text-gray-800 mb-2">Tidak ada trip aktif</h3>
                                <p className="text-gray-400 font-bold">Cek tab "Tersedia" untuk mulai mengambil pesanan.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* History */}
                {activeTab === 'history' && (
                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 text-left">
                                    <tr>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Detail Trip</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Pendapatan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {historyOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center space-x-3 mb-1">
                                                    <p className="font-black text-gray-900">{order.restaurantName}</p>
                                                    <ChevronRight size={14} className="text-gray-300" />
                                                    <p className="font-bold text-gray-500 text-xs">{order.userName}</p>
                                                </div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{new Date(order.deliveredAt).toLocaleDateString()} {new Date(order.deliveredAt).toLocaleTimeString()}</p>
                                            </td>
                                            <td className="px-8 py-6 text-right font-black text-emerald-600">
                                                +Rp 5.000
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const ChevronRight = ({ size, className }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);

export default DriverDashboard;
