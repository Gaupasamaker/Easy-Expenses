import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const TRIPS_COLLECTION = 'trips';

export const TripService = {
    // Subscribe to trips for a specific user
    subscribeToTrips: (userId, callback) => {
        if (!userId) return () => { };

        const q = query(
            collection(db, TRIPS_COLLECTION),
            where('userId', '==', userId)
        );

        return onSnapshot(q, (snapshot) => {
            const trips = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                startDate: doc.data().startDate?.toDate(),
                endDate: doc.data().endDate?.toDate()
            }));

            // Client-side sort
            trips.sort((a, b) => {
                const dateA = a.startDate || new Date(0);
                const dateB = b.startDate || new Date(0);
                return dateB - dateA; // Descending
            });

            callback(trips);
        }, (error) => {
            console.error("Error fetching trips:", error);
            // Even on error, stop loading
            callback([]);
        });
    },

    // Create a new trip
    createTrip: async (tripData, userId) => {
        return addDoc(collection(db, TRIPS_COLLECTION), {
            ...tripData,
            userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    },

    // Update an existing trip
    updateTrip: async (tripId, tripData) => {
        const tripRef = doc(db, TRIPS_COLLECTION, tripId);
        return updateDoc(tripRef, {
            ...tripData,
            updatedAt: serverTimestamp()
        });
    },

    // Delete a trip
    deleteTrip: async (tripId) => {
        console.log("[TripService] deleteTrip called with tripId:", tripId);
        if (!tripId) {
            throw new Error("tripId is undefined or null");
        }
        const tripRef = doc(db, TRIPS_COLLECTION, tripId);
        console.log("[TripService] Deleting document at:", tripRef.path);
        await deleteDoc(tripRef);
        console.log("[TripService] Delete successful");
        return true;
    }
};
