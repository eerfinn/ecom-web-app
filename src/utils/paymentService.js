import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Simulates a payment gateway (Midtrans/Stripe style)
 */
export const PaymentService = {
    // 1. Create a transaction record in Firestore
    createTransaction: async (orderData) => {
        const transaction = {
            orderId: orderData.id,
            amount: orderData.totalAmount,
            status: 'PENDING_PAYMENT',
            method: 'VIRTUAL_ACCOUNT', // Simulated
            createdAt: serverTimestamp(),
            expiryAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        };

        const docRef = await addDoc(collection(db, "transactions"), transaction);
        return { transactionId: docRef.id, ...transaction };
    },

    // 2. Simulate payment verification
    verifyPayment: async (transactionId) => {
        // In a real system, this would be a webhook from Midtrans
        const transRef = doc(db, "transactions", transactionId);
        const snap = await getDoc(transRef);

        if (snap.exists()) {
            await updateDoc(transRef, {
                status: 'PAID',
                paidAt: serverTimestamp()
            });
            return { success: true };
        }
        return { success: false, error: 'Transaction not found' };
    }
};
