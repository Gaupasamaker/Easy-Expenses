import { collection, getDocs, query, where, updateDoc, doc, getAggregateFromServer, sum } from 'firebase/firestore';
import { db } from '../firebase';

export const recalculateAllTripTotals = async (userId) => {
    if (!userId) return 0;

    try {
        // 1. Get all trips
        const tripsRef = collection(db, 'trips');
        const q = query(tripsRef, where('userId', '==', userId));
        const tripsSnapshot = await getDocs(q);

        let updatedCount = 0;

        for (const tripDoc of tripsSnapshot.docs) {
            const tripId = tripDoc.id;

            // 2. Aggregate expenses for this trip
            // Note: aggregation queries are optimal but might require indexes. 
            // Fallback to client-side sum if aggregation fails or for simplicity in this dev phase.
            const expensesRef = collection(db, 'expenses');
            const expQuery = query(expensesRef, where('tripId', '==', tripId));
            const expSnapshot = await getDocs(expQuery);

            let total = 0;
            expSnapshot.forEach(doc => {
                total += parseFloat(doc.data().amount) || 0;
            });

            // 3. Update trip
            await updateDoc(doc(db, 'trips', tripId), {
                totalSpent: total
            });
            updatedCount++;
        }

        return updatedCount;
    } catch (error) {
        console.error("Recalculation failed:", error);
        return 0;
    }
};
