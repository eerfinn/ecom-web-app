import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart, ChevronLeft } from 'lucide-react';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    const tax = cartTotal * 0.05; // 5% tax
    const deliveryFee = cartTotal > 500 ? 0 : 40;
    const grandTotal = cartTotal + tax + deliveryFee;

    if (cart.length === 0) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-4">
                <div className="w-64 h-64 bg-primary/5 rounded-full flex items-center justify-center mb-8 animate-pulse">
                    <ShoppingCart size={100} className="text-primary/20" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 max-w-sm text-center">Looks like you haven't added anything to your cart yet. Go ahead and explore top restaurants!</p>
                <Link
                    to="/"
                    className="px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 shadow-lg hover:shadow-primary/30 transition-all flex items-center space-x-2"
                >
                    <span>Explore Restaurants</span>
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
                        <span>Continue Shopping</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">My Cart ({cart.length})</h1>
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
                                    <p className="text-primary font-bold">₹{item.price}</p>
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
                    </div>

                    {/* Price Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Tax (5%)</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Delivery Fee</span>
                                    <span className={deliveryFee === 0 ? 'text-green-500 font-bold' : ''}>
                                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="pt-4 border-t border-gray-100 mt-4 flex justify-between items-center">
                                    <span className="text-xl font-bold text-gray-800">Total Payable</span>
                                    <span className="text-2xl font-black text-primary">₹{grandTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/payment', { state: { total: grandTotal } })}
                                className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center space-x-2 text-lg"
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight size={22} />
                            </button>

                            {deliveryFee > 0 && (
                                <p className="text-center text-xs text-gray-400 mt-4">
                                    Add ₹{(500 - cartTotal).toFixed(2)} more for free delivery
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
