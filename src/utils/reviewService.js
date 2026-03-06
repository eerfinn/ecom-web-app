import { db } from '../firebase/config';
import { collection, addDoc, updateDoc, doc, getDoc, query, where, getDocs, limit, serverTimestamp } from 'firebase/firestore';

/**
 * Manages customer reviews and restaurant ratings.
 */
export const ReviewService = {
    // 1. Submit a customer review
    submitReview: async (reviewData) => {
        try {
            // Validate incoming data
            const { restaurantId, orderId, userId, rating, comment } = reviewData;

            // Add the review to the "reviews" collection
            const reviewRef = await addDoc(collection(db, "reviews"), {
                restaurantId,
                orderId,
                userId,
                rating: Number(rating),
                comment,
                createdAt: serverTimestamp()
            });

            // Mark order as reviewed
            const orderRef = doc(db, "orders", orderId);
            await updateDoc(orderRef, { hasReviewed: true });

            // Recalculate and update the restaurant's average rating 
            // In a production environment, this should be a Cloud Function (background)
            await ReviewService.updateRestaurantAverageRating(restaurantId);

            return { success: true, id: reviewRef.id };
        } catch (error) {
            console.error("Submission error:", error);
            return { success: false, error: error.message };
        }
    },

    // 2. Recalculate restaurant's average rating based on all reviews
    updateRestaurantAverageRating: async (restaurantId) => {
        try {
            const q = query(collection(db, "reviews"), where("restaurantId", "==", restaurantId));
            const snapshot = await getDocs(q);

            if (snapshot.empty) return;

            let totalRating = 0;
            snapshot.forEach(doc => {
                totalRating += doc.data().rating;
            });

            const averageRating = totalRating / snapshot.size;

            // Update the restaurant document with the new average
            const restaurantRef = doc(db, "restaurants", restaurantId);
            await updateDoc(restaurantRef, {
                rating: Number(averageRating.toFixed(1)),
                totalReviews: snapshot.size
            });

            return averageRating;
        } catch (error) {
            console.error("Rating recalculation error:", error);
        }
    }
};
