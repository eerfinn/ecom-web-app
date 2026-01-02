import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, User, UtensilsCrossed, Utensils, ShieldCheck } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-3 group text-2xl font-black tracking-tighter">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform duration-500">
                        <UtensilsCrossed size={28} className="text-white" />
                    </div>
                    <span className="text-gray-900 group-hover:text-primary transition-colors">Food<span className="text-primary">Kart</span></span>
                </Link>

                <div className="flex items-center space-x-4">
                    {user?.role !== 'RESTAURANT' && (
                        <Link to="/cart" className="relative p-3 bg-gray-50 rounded-2xl text-gray-600 hover:text-primary hover:bg-primary/5 transition-all group">
                            <ShoppingCart size={24} strokeWidth={2.5} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-4 border-white animate-bounce shadow-lg shadow-primary/20">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    )}

                    {user?.role === 'RESTAURANT' && (
                        <Link to="/restaurant-dashboard" className="px-6 py-3 bg-gray-900 text-white font-black rounded-2xl shadow-lg hover:bg-gray-800 transition-all text-sm tracking-wide flex items-center space-x-2">
                            <Utensils size={18} />
                            <span>Dashboard</span>
                        </Link>
                    )}

                    {user?.role === 'ADMIN' && (
                        <Link to="/admin" className="px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl shadow-lg hover:bg-indigo-700 transition-all text-sm tracking-wide flex items-center space-x-2">
                            <ShieldCheck size={18} />
                            <span>Admin Panel</span>
                        </Link>
                    )}

                    {user ? (
                        <div className="flex items-center space-x-2 pl-2 border-l border-gray-100">
                            <div className="flex items-center space-x-3 bg-gray-50 p-1.5 pr-4 rounded-2xl border border-gray-100">
                                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md">
                                    <User size={20} className="text-white" />
                                </div>
                                <span className="hidden md:inline font-bold text-sm text-gray-700">{user.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-all shadow-sm active:scale-90"
                                title="Logout"
                            >
                                <LogOut size={20} strokeWidth={2.5} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Link
                                to="/login"
                                className="px-6 py-3 text-gray-600 font-bold hover:text-primary transition-colors text-sm"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="px-8 py-3 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 text-sm tracking-wide"
                            >
                                Daftar
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
