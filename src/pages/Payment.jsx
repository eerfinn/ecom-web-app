import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CreditCard, AlertCircle, ChevronLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { clearCart } = useCart();
    const [amount, setAmount] = useState('');
    const total = location.state?.total || 0;

    const handlePayment = (e) => {
        e.preventDefault();
        const enteredAmount = parseFloat(amount);

        if (enteredAmount === total) {
            toast.success('Payment Successful!');
            clearCart();
            navigate('/success', { state: { total } });
        } else {
            toast.error('Incorrect amount entered. Please enter exactly ₹' + total);
        }
    };

    if (!total) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-4">No pending payment</h2>
                <Link to="/" className="text-primary font-bold hover:underline">Back to Home</Link>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="p-8">
                    <Link to="/cart" className="flex items-center text-gray-400 hover:text-primary transition-colors mb-6 text-sm font-medium">
                        <ChevronLeft size={16} />
                        <span>Back to Cart</span>
                    </Link>

                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dummy Payment</h1>
                        <p className="text-gray-500">Enter the exact amount to confirm order</p>
                    </header>

                    <div className="bg-primary/5 rounded-2xl p-6 mb-8 border border-primary/10">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-600 font-medium">Amount to Pay</span>
                            <span className="text-3xl font-black text-primary">₹{total.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-primary/60">This is a simulation for frontend demonstration.</p>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Confirm Amount</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary font-bold">₹</div>
                                <input
                                    type="number"
                                    required
                                    step="0.01"
                                    className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-xl font-bold"
                                    placeholder="0.00"
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
                            <span>Pay Now</span>
                        </button>
                    </form>

                    <div className="mt-8 flex items-start space-x-3 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                        <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
                        <p className="text-xs text-yellow-700 leading-relaxed">
                            <strong>Demo Note:</strong> To "successfully pay", you must type the exact total amount shown above. This simulates a verification step.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
