import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CreditCard, AlertCircle, ChevronLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { clearCart, formatCurrency, cart } = useCart();
    const [amount, setAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const total = location.state?.total || 0;

    const handlePayment = async (e) => {
        e.preventDefault();
        const enteredAmount = parseFloat(amount);

        if (enteredAmount === total) {
            setIsProcessing(true);
            try {
                // Group items by restaurant to create separate orders
                const ordersByRestaurant = cart.reduce((acc, item) => {
                    if (!acc[item.restaurantId]) acc[item.restaurantId] = [];
                    acc[item.restaurantId].push(item);
                    return acc;
                }, {});

                // Create orders in Firestore
                const orderPromises = Object.entries(ordersByRestaurant).map(([restaurantId, items]) => {
                    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    return addDoc(collection(db, "orders"), {
                        userId: user.uid,
                        userName: user.name,
                        restaurantId: restaurantId,
                        restaurantName: items[0].restaurantName,
                        items: items,
                        totalAmount: subtotal,
                        status: 'PENDING',
                        createdAt: new Date().toISOString()
                    });
                });

                await Promise.all(orderPromises);

                toast.success('Pembayaran Berhasil & Pesanan Diterima!');
                clearCart();
                navigate('/success', { state: { total } });
            } catch (error) {
                console.error("Error saving order:", error);
                toast.error("Terjadi kesalahan saat memproses pesanan.");
            } finally {
                setIsProcessing(false);
            }
        } else {
            toast.error('Jumlah yang Anda masukkan salah. Masukkan tepat ' + formatCurrency(total));
        }
    };

    if (!total) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-4">Tidak ada pembayaran tertunda</h2>
                <Link to="/" className="text-primary font-bold hover:underline">Kembali ke Beranda</Link>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="p-8">
                    <Link to="/cart" className="flex items-center text-gray-400 hover:text-primary transition-colors mb-6 text-sm font-medium">
                        <ChevronLeft size={16} />
                        <span>Kembali ke Keranjang</span>
                    </Link>

                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Simulasi Pembayaran</h1>
                        <p className="text-gray-500">Masukkan jumlah yang tepat untuk konfirmasi pesanan</p>
                    </header>

                    <div className="bg-primary/5 rounded-2xl p-6 mb-8 border border-primary/10">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-600 font-medium">Jumlah Bayar</span>
                            <span className="text-2xl font-black text-primary">{formatCurrency(total)}</span>
                        </div>
                        <p className="text-xs text-primary/60">Ini adalah simulasi untuk demonstrasi frontend.</p>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Konfirmasi Jumlah (Angka saja)</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary font-bold">Rp</div>
                                <input
                                    type="number"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-xl font-bold"
                                    placeholder="0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-5 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center space-x-3 text-lg"
                        >
                            <CreditCard size={22} />
                            <span>Bayar Sekarang</span>
                        </button>
                    </form>

                    <div className="mt-8 flex items-start space-x-3 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                        <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
                        <p className="text-xs text-yellow-700 leading-relaxed">
                            <strong>Catatan Demo:</strong> Untuk "berhasil bayar", Anda harus mengetikkan jumlah total yang sama persis seperti di atas (hanya angka).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
