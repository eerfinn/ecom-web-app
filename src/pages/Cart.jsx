import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, ChevronLeft, Tag, X } from 'lucide-react';
import toast from 'react-hot-toast';
const Cart = () => {
    const {
        cart, removeFromCart, updateQuantity, cartTotal,
        appliedOffer, setAppliedOffer, discountAmount,
        formatCurrency, offers
    } = useCart();
    const [couponInput, setCouponInput] = useState('');
    const navigate = useNavigate();

    const tax = cartTotal * 0.05; // 5% tax
    const deliveryFee = (cartTotal > 150000 || (appliedOffer?.code === 'FREEDEL')) ? 0 : 15000;
    const grandTotal = Math.max(0, cartTotal + tax + deliveryFee - discountAmount);

    const handleApplyCoupon = (e) => {
        e.preventDefault();
        const offer = offers.find(o => o.code.toUpperCase() === couponInput.toUpperCase());

        if (!offer) {
            toast.error('Kupon tidak valid');
            return;
        }

        if (cartTotal < offer.minCart) {
            toast.error(`Pesanan minimal ${formatCurrency(offer.minCart)} untuk kupon ini`);
            return;
        }

        setAppliedOffer(offer);
        toast.success(`Kupon "${offer.code}" berhasil dipasang!`);
        setCouponInput('');
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
                <div className="w-64 h-64 bg-primary/5 rounded-full flex items-center justify-center mb-8 animate-pulse">
                    <ShoppingCart size={100} className="text-primary/20" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Keranjang Anda Kosong</h2>
                <p className="text-gray-500 mb-8 max-w-sm text-center">Sepertinya Anda belum memesan apapun. Yuk mulai jelajahi restoran terbaik!</p>
                <Link
                    to="/"
                    className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 shadow-lg hover:shadow-primary/30 transition-all flex items-center space-x-2"
                >
                    <span>Jelajahi Restoran</span>
                    <ArrowRight size={20} />
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <Link to="/" className="flex items-center text-gray-600 hover:text-primary transition-colors font-medium">
                        <ChevronLeft size={20} />
                        <span>Lanjut Belanja</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">Keranjang Saya ({cart.length})</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 flex items-center space-x-4 md:space-x-6 hover:shadow-md transition-shadow">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
                                    <p className="text-primary font-bold">{formatCurrency(item.price)}</p>
                                </div>

                                <div className="flex items-center space-x-3 md:space-x-6">
                                    <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="w-8 h-8 flex items-center justify-center bg-white text-gray-600 rounded-lg shadow-sm hover:text-primary transition-colors"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-8 text-center font-bold text-gray-800">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="w-8 h-8 flex items-center justify-center bg-white text-gray-600 rounded-lg shadow-sm hover:text-primary transition-colors"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Available Offers Info */}
                        <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                                <Tag size={18} className="mr-2 text-primary" />
                                Promo Tersedia
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {offers.map(offer => (
                                    <div key={offer.id} className="bg-white p-3 rounded-xl border border-dashed border-primary/30 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-primary text-sm">{offer.code}</p>
                                            <p className="text-xs text-gray-500">{offer.label}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setCouponInput(offer.code);
                                            }}
                                            className="text-xs font-bold text-primary hover:underline"
                                        >
                                            SALIN
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Ringkasan Pesanan</h2>

                            {/* Coupon Input */}
                            {!appliedOffer ? (
                                <form onSubmit={handleApplyCoupon} className="mb-6 flex space-x-2">
                                    <input
                                        type="text"
                                        placeholder="Kode kupon"
                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm uppercase"
                                        value={couponInput}
                                        onChange={(e) => setCouponInput(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="bg-secondary text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-secondary/90 transition-all"
                                    >
                                        Gunakan
                                    </button>
                                </form>
                            ) : (
                                <div className="mb-6 bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex justify-between items-center">
                                    <div className="flex items-center space-x-2 text-green-700">
                                        <Tag size={16} />
                                        <span className="font-bold text-sm uppercase">{appliedOffer.code} terpasang</span>
                                    </div>
                                    <button
                                        onClick={() => setAppliedOffer(null)}
                                        className="text-green-700 hover:text-red-500 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(cartTotal)}</span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600 font-bold">
                                        <span>Potongan Harga</span>
                                        <span>- {formatCurrency(discountAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Pajak (5%)</span>
                                    <span>{formatCurrency(tax)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Biaya Pengiriman</span>
                                    <span className={deliveryFee === 0 ? 'text-green-500 font-bold' : ''}>
                                        {deliveryFee === 0 ? 'GRATIS' : formatCurrency(deliveryFee)}
                                    </span>
                                </div>
                                <div className="pt-4 border-t border-gray-100 mt-4 flex justify-between items-center">
                                    <span className="text-xl font-bold text-gray-800">Total Bayar</span>
                                    <span className="text-2xl font-black text-primary">{formatCurrency(grandTotal)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/payment', { state: { total: grandTotal } })}
                                className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center space-x-2 text-lg"
                            >
                                <span>Bayar Sekarang</span>
                                <ArrowRight size={22} />
                            </button>

                            {deliveryFee > 0 && (
                                <p className="text-center text-xs text-gray-400 mt-4">
                                    Tambah {formatCurrency(150000 - cartTotal)} lagi untuk gratis ongkir
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
