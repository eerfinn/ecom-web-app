import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { restaurants, offers } from "../data/restaurants";

export const migrateDataToFirestore = async () => {
    try {
        const results = [];

        // 1. Migrate Restaurants
        const resQuery = await getDocs(collection(db, "restaurants"));
        if (resQuery.empty) {
            console.log("Migrating restaurants...");
            for (const res of restaurants) {
                const { id, ...restData } = res;
                await addDoc(collection(db, "restaurants"), {
                    ...restData,
                    originalId: id,
                    createdAt: new Date().toISOString()
                });
            }
            results.push("Restoran berhasil dimigrasi");
        }

        // 2. Migrate Offers
        const offerQuery = await getDocs(collection(db, "offers"));
        if (offerQuery.empty) {
            console.log("Migrating offers...");
            for (const offer of offers) {
                await addDoc(collection(db, "offers"), {
                    ...offer,
                    createdAt: new Date().toISOString()
                });
            }
            results.push("Promo berhasil dimigrasi");
        }

        if (results.length === 0) {
            return { success: true, message: "Data sudah up-to-date." };
        }

        return { success: true, message: results.join(", ") };
    } catch (error) {
        console.error("Gagal migrasi:", error);
        return { success: false, error: error.message };
    }
};
