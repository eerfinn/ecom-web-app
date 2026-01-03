import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle2, ShoppingBag, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { formatCurrency } = useCart();
    const total = location.state?.total || 0;

    useEffect(() => {
        if (!total) {
            navigate('/');
        }
    }, [total, navigate]);

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
                >
                    <CheckCircle2 size={80} className="text-green-500" />
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-black text-gray-800 mb-4"
                >
                    Pesanan Berhasil!
                </motion.h1>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-500 mb-10 text-lg"
                >
                    Terima kasih atas pesanan Anda. Makanan Anda akan sampai dalam waktu 30 menit!
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 mb-10"
                >
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-50">
                        <span className="text-gray-500 font-medium">Total Pesanan</span>
                        <span className="text-2xl font-black text-primary">{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-medium">Status</span>
                        <span className="px-4 py-1 bg-green-100 text-green-600 font-bold rounded-full text-sm">Dikonfirmasi</span>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
                >
                    <Link
                        to="/"
                        className="flex-1 px-8 py-4 bg-gray-800 text-white font-bold rounded-2xl hover:bg-gray-900 transition-all flex items-center justify-center space-x-2"
                    >
                        <Home size={20} />
                        <span>Beranda</span>
                    </Link>
                    <Link
                        to="/"
                        className="flex-1 px-8 py-4 border-2 border-primary text-primary font-bold rounded-2xl hover:bg-primary/5 transition-all flex items-center justify-center space-x-2"
                    >
                        <ShoppingBag size={20} />
                        <span>Pesan Lagi</span>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default OrderSuccess;
