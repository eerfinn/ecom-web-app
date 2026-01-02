import React, { useState } from 'react';
import { restaurants } from '../data/restaurants';
import RestaurantCard from '../components/RestaurantCard';
import { Search, Filter } from 'lucide-react';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredRestaurants = restaurants.filter(res =>
        res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80"
                        alt="Hero"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f1f2f6]"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                        Order Food From Your <br />
                        <span className="text-primary italic">Favorite Restaurants</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Discover the best food & drinks in your city. Freshly prepared and delivered right to your doorstep.
                    </p>

                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                            <Search size={22} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search for restaurants or cuisines..."
                            className="w-full pl-14 pr-6 py-5 bg-white rounded-2xl shadow-xl focus:ring-2 focus:ring-primary outline-none text-gray-700 transition-all text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Restaurant List */}
            <section className="container mx-auto px-4 mt-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {searchTerm ? `Search Results for "${searchTerm}"` : 'Popular Restaurants'}
                    </h2>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-gray-600">
                        <Filter size={18} />
                        <span className="font-medium">Filter</span>
                    </button>
                </div>

                {filteredRestaurants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredRestaurants.map(res => (
                            <RestaurantCard key={res.id} restaurant={res} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                        <p className="text-xl text-gray-500 font-medium">No restaurants found matching your search.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
