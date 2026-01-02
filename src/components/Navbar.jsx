import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, User, UtensilsCrossed } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 glass bg-white/80 backdrop-blur-md shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-primary">
                    <UtensilsCrossed size={32} />
                    <span>FoodKart</span>
                </Link>

                <div className="flex items-center space-x-6">
                    <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
                        <ShoppingCart size={24} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 text-gray-700">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <User size={18} className="text-primary" />
                                </div>
                                <span className="hidden md:inline font-medium">{user.name}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-gray-500 hover:text-primary transition-colors tooltip"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-gray-600 font-medium hover:text-primary transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="px-6 py-2 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
