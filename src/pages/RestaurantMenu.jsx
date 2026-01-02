import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { restaurants } from '../data/restaurants';
import { useCart } from '../context/CartContext';
import { Star, Clock, ChevronLeft, Plus, Minus, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const RestaurantMenu = () => {
    const { id } = useParams();
    const { addToCart, cart, updateQuantity } = useCart();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fake loading delay
        const timer = setTimeout(() => {
            const res = restaurants.find(r => r.id === parseInt(id));
            setRestaurant(res);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold mb-4">Restaurant not found</h2>
                <Link to="/" className="text-primary font-bold hover:underline">Back to Home</Link>
            </div>
        );
    }

    const getItemQuantity = (itemId) => {
        const item = cart.find(i => i.id === itemId);
        return item ? item.quantity : 0;
    };

    return (
        <div className="min-h-screen pb-20">
            {/* Restaurant Header */}
            <div className="relative h-64 md:h-80 w-full overflow-hidden">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-end">
                    <div className="container mx-auto px-4 pb-8">
                        <Link to="/" className="inline-flex items-center text-white mb-4 hover:text-primary transition-colors">
                            <ChevronLeft size={20} />
                            <span className="font-medium">Back to Restaurants</span>
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{restaurant.name}</h1>
                        <div className="flex items-center space-x-4 text-white/90">
                            <div className="flex items-center space-x-1">
                                <Star size={18} className="text-yellow-400 fill-yellow-400" />
                                <span className="font-bold">{restaurant.rating}</span>
                            </div>
                            <span>•</span>
                            <span className="font-medium">{restaurant.cuisine}</span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                                <Clock size={16} />
                                <span>25-30 min</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Section */}
            <div className="container mx-auto px-4 mt-12">
                <div className="flex items-center space-x-2 mb-8">
                    <ShoppingBag className="text-primary" />
                    <h2 className="text-2xl font-bold text-gray-800">Available Menu</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurant.menu.map(item => {
                        const quantity = getItemQuantity(item.id);
                        return (
                            <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex space-x-4 border border-gray-100 group">
                                <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
                                        <p className="text-primary font-bold text-xl">₹{item.price}</p>
                                    </div>

                                    <div className="flex items-center justify-end">
                                        {quantity > 0 ? (
                                            <div className="flex items-center bg-primary/10 rounded-xl p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="w-8 h-8 flex items-center justify-center bg-white text-primary rounded-lg shadow-sm hover:bg-gray-50 active:scale-95 transition-all"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="w-10 text-center font-bold text-primary">{quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 active:scale-95 transition-all"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    addToCart(item);
                                                    toast.success(`${item.name} added to cart!`, {
                                                        position: 'bottom-right',
                                                        icon: '🛒'
                                                    });
                                                }}
                                                className="px-6 py-2 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 shadow-lg hover:shadow-primary/30 active:scale-95 transition-all"
                                            >
                                                Add
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RestaurantMenu;
