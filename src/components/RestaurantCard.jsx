import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, ChevronRight } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
    return (
        <Link to={`/restaurant/${restaurant.id}`} className="group">
            <div className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 card-hover border border-gray-100 flex flex-col h-full">
                <div className="relative h-56 overflow-hidden">
                    <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    {/* Glass Tag Overlay */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {restaurant.rating >= 4.5 && (
                            <div className="bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg flex items-center space-x-1 animate-pulse">
                                <span>POPULAR</span>
                            </div>
                        )}
                        {restaurant.offer && (
                            <div className="bg-white/90 backdrop-blur-md text-primary text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg border border-white/50">
                                {restaurant.offer}
                            </div>
                        )}
                    </div>

                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-2xl flex items-center space-x-1 shadow-lg border border-white/50">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-black text-gray-800">{restaurant.rating}</span>
                    </div>

                    {/* Gradient Overlay for Title readability */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-2xl font-black text-gray-800 mb-1 group-hover:text-primary transition-colors leading-tight">
                        {restaurant.name}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium mb-6 flex-1">{restaurant.cuisine}</p>

                    <div className="flex items-center justify-between pt-5 border-t border-gray-50 mt-auto">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center text-gray-500 text-xs font-bold space-x-1 bg-gray-50 px-2 py-1 rounded-lg">
                                <Clock size={14} className="text-primary" />
                                <span>{restaurant.deliveryTime}</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1 text-primary group-hover:translate-x-1 transition-transform">
                            <span className="font-black text-xs uppercase tracking-widest">View Menu</span>
                            <ChevronRight size={14} strokeWidth={3} />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RestaurantCard;
