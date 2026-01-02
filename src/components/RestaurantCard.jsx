import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
    return (
        <Link to={`/restaurant/${restaurant.id}`} className="group">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 card-hover">
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold text-gray-800">{restaurant.rating}</span>
                    </div>
                </div>
                <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors">
                        {restaurant.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-1">{restaurant.cuisine}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center text-gray-400 text-xs space-x-1">
                            <Clock size={14} />
                            <span>25-30 min</span>
                        </div>
                        <span className="text-primary font-bold text-sm">View Menu</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RestaurantCard;
