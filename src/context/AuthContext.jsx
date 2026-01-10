import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            try {
                if (currentUser) {
                    // Ambil data tambahan user (role, name) dari Firestore
                    const docRef = doc(db, "users", currentUser.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const firestoreData = docSnap.data();

                        // SINKRONISASI EMAIL: Jika email di Auth berbeda dengan Firestore (misal setelah ganti email)
                        if (currentUser.email !== firestoreData.email) {
                            const { updateDoc } = await import('firebase/firestore');
                            await updateDoc(docRef, { email: currentUser.email });
                            firestoreData.email = currentUser.email;
                        }

                        setUser({ uid: currentUser.uid, email: currentUser.email, ...firestoreData });
                    } else {
                        setUser({ uid: currentUser.uid, email: currentUser.email, role: 'USER' });
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth helper error:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const signup = async (userData) => {
        const { email, password, name } = userData;
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;

        // Create user profile in Firestore with all metadata
        await setDoc(doc(db, "users", newUser.uid), {
            name,
            email,
            role: userData.role || 'USER',
            location: userData.location || null,
            vehicleNumber: userData.vehicleNumber || null,
            createdAt: new Date().toISOString()
        });

        return newUser;
    };

    const login = async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;

        // Fetch role and extra data for immediate use after login
        const docRef = doc(db, "users", fbUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { uid: fbUser.uid, email: fbUser.email, ...docSnap.data() };
        }
        return fbUser;
    };

    const logout = () => {
        return signOut(auth);
    };

    const resetPassword = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    return (
        <AuthContext.Provider value={{ user, signup, login, logout, resetPassword, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
