export const restaurants = [
    {
        id: 1,
        name: "Burger King Royale",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80",
        rating: 4.8,
        cuisine: "Burgers, Fast Food",
        deliveryTime: "20-25 min",
        offer: "60% OFF",
        menu: [
            { id: 101, name: "Whopper Premium", price: 45000, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80", category: "Burgers" },
            { id: 102, name: "Cheeseburger Deluxe", price: 35000, image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80", category: "Burgers" },
            { id: 103, name: "French Fries Large", price: 15000, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80", category: "Sides" },
            { id: 104, name: "Onion Rings", price: 18000, image: "https://images.unsplash.com/photo-1639024471283-03518883511d?w=500&q=80", category: "Sides" }
        ]
    },
    {
        id: 2,
        name: "Pizza Hut Artisan",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
        rating: 4.2,
        cuisine: "Pizza, Italian",
        deliveryTime: "30-35 min",
        offer: "Rp 20rb Off",
        menu: [
            { id: 201, name: "Pepperoni Feast", price: 85000, image: "https://images.unsplash.com/photo-1628840042765-a46c8f2ba06d?w=500&q=80", category: "Pizza" },
            { id: 202, name: "Margherita Classic", price: 65000, image: "https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?w=500&q=80", category: "Pizza" },
            { id: 203, name: "Garlic Bread", price: 25000, image: "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=500&q=80", category: "Sides" }
        ]
    },
    {
        id: 3,
        name: "Sushi Tei Zen",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&q=80",
        rating: 4.7,
        cuisine: "Japanese, Sushi",
        deliveryTime: "40-45 min",
        offer: "FREE Delivery",
        menu: [
            { id: 301, name: "Salmon Sashimi", price: 55000, image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&q=80", category: "Sushi" },
            { id: 302, name: "Maki Platter", price: 45000, image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&q=80", category: "Sushi" },
            { id: 303, name: "Miso Soup", price: 15000, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&q=80", category: "Chinese" }
        ]
    },
    {
        id: 4,
        name: "The Biryani House",
        image: "https://images.unsplash.com/photo-1563379091339-03b11adbc932?w=800&q=80",
        rating: 4.5,
        cuisine: "Indian, Curry",
        deliveryTime: "35-40 min",
        offer: "50% OFF",
        menu: [
            { id: 401, name: "Chicken Biryani", price: 55000, image: "https://images.unsplash.com/photo-1589302168068-1c49911d33b9?w=500&q=80", category: "Indian" },
            { id: 402, name: "Butter Chicken", price: 45000, image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=80", category: "Indian" },
            { id: 403, name: "Naan Bread", price: 10000, image: "https://images.unsplash.com/photo-1601303584126-2f076d48ba7a?w=500&q=80", category: "Indian" }
        ]
    },
    {
        id: 5,
        name: "Salad Point",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80",
        rating: 4.4,
        cuisine: "Salads, Healthy",
        deliveryTime: "15-20 min",
        offer: "20% OFF",
        menu: [
            { id: 501, name: "Caesar Salad", price: 45000, image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&q=80", category: "Salads" },
            { id: 502, name: "Greek Salad", price: 40000, image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80", category: "Salads" }
        ]
    },
    {
        id: 6,
        name: "Golden Dragon",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80",
        rating: 4.1,
        cuisine: "Chinese, Noodles",
        deliveryTime: "25-30 min",
        offer: "Rp 15rb Off",
        menu: [
            { id: 601, name: "Dim Sum Set", price: 35000, image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&q=80", category: "Chinese" },
            { id: 602, name: "Kung Pao Chicken", price: 45000, image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&q=80", category: "Chinese" }
        ]
    }
];

export const offers = [
    { id: 'O1', code: 'FOOD50', discount: 50, type: 'percentage', label: '50% OFF up to Rp 20rb', minCart: 50000 },
    { id: 'O2', code: 'WELCOME100', discount: 20000, type: 'flat', label: 'Flat Rp 20rb OFF', minCart: 100000 },
    { id: 'O3', code: 'FREEDEL', discount: 15000, type: 'flat', label: 'Free Delivery (Rp 15rb)', minCart: 80000 },
    { id: 'O4', code: 'SUSHI20', discount: 20, type: 'percentage', label: '20% OFF Sushi Night', minCart: 120000 },
];
