import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const [offers, setOffers] = useState([]);
    const [appliedOffer, setAppliedOffer] = useState(null);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        const q = query(collection(db, "offers"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setOffers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, delta) => {
        setCart(prevCart =>
            prevCart.map(item => {
                if (item.id === productId) {
                    const newQuantity = Math.max(0, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(item => item.quantity > 0)
        );
    };

    const clearCart = () => {
        setCart([]);
        setAppliedOffer(null);
        localStorage.removeItem('cart');
    };

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    const calculateDiscount = () => {
        if (!appliedOffer) return 0;
        if (cartTotal < appliedOffer.minCart) {
            setAppliedOffer(null);
            return 0;
        }

        if (appliedOffer.type === 'percentage') {
            const discount = (cartTotal * appliedOffer.discount) / 100;
            return Math.min(discount, 20000); // cap at Rp 20.000 for percentage
        }
        return appliedOffer.discount;
    };

    const discountAmount = calculateDiscount();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <CartContext.Provider value={{
            cart,
            offers,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount,
            appliedOffer,
            setAppliedOffer,
            discountAmount,
            formatCurrency
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
