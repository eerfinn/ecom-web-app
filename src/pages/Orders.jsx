import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { ShoppingBag, Clock, Package, CheckCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "orders"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="p-3 bg-white rounded-2xl shadow-sm hover:bg-primary hover:text-white transition-all">
                            <ArrowLeft size={20} />
                        </Link>
                        <h1 className="text-4xl font-black text-gray-800 tracking-tight">Riwayat Pesanan</h1>
                    </div>
                </div>

                {orders.length > 0 ? (
                    <div className="space-y-6">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
                                <div className="p-8">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-gray-50">
                                        <div className="flex items-center space-x-6">
                                            <div className="w-16 h-16 bg-gray-50 rounded-[20px] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                <ShoppingBag size={24} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
                                                <p className="text-xl font-black text-gray-800 tracking-tight">#{order.id.slice(-6).toUpperCase()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'PENDING' ? 'bg-orange-100 text-orange-600' :
                                                        order.status === 'PREPARING' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                                    }`}>
                                                    {order.status === 'PENDING' ? 'Menunggu Konfirmasi' :
                                                        order.status === 'PREPARING' ? 'Sedang Disiapkan' : 'Selesai'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detail Restoran</p>
                                            <div className="flex items-center space-x-3">
                                                <p className="font-black text-gray-800 text-lg">{order.restaurantName}</p>
                                                <span className="text-gray-300">•</span>
                                                <p className="text-sm text-gray-500 font-bold">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                            </div>
                                            <div className="space-y-2">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center text-sm font-medium text-gray-600 bg-gray-50 p-3 rounded-2xl">
                                                        <span>{item.quantity}x {item.name}</span>
                                                        <span className="font-bold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="md:border-l border-gray-50 md:pl-10 flex flex-col justify-center">
                                            <div className="bg-gray-50 p-8 rounded-[32px] border border-gray-100">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Pembayaran</p>
                                                <p className="text-3xl font-black text-primary">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
                                                <div className="mt-6 flex items-center space-x-2 text-gray-400 text-xs font-bold">
                                                    <Clock size={14} />
                                                    <span>Dipesan pukul {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[48px] shadow-sm border border-gray-100">
                        <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-gray-300">
                            <ShoppingBag size={48} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 mb-2">Belum ada pesanan</h3>
                        <p className="text-gray-400 font-medium mb-10 max-w-xs mx-auto">Anda belum pernah memesan apapun. Yuk cari makanan enak sekarang!</p>
                        <Link to="/" className="inline-flex items-center space-x-2 px-10 py-5 bg-primary text-white font-black rounded-3xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all uppercase text-xs tracking-widest">
                            <span>Jelajahi Menu</span>
                            <ChevronRight size={18} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
