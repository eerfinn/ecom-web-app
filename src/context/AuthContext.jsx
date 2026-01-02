import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const signup = (userData) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.email === userData.email)) {
            throw new Error('User already exists');
        }
        users.push(userData);
        localStorage.setItem('users', JSON.stringify(users));
    };

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userFound = users.find(u => u.email === email && u.password === password);
        if (!userFound) {
            throw new Error('Invalid email or password');
        }
        setUser(userFound);
        localStorage.setItem('currentUser', JSON.stringify(userFound));
        return userFound;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
