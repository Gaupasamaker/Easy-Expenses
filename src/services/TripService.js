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
            where('userId', '==', userId),
            orderBy('startDate', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const trips = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                startDate: doc.data().startDate?.toDate(),
                endDate: doc.data().endDate?.toDate()
            }));
            callback(trips);
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
        // Note: This does not delete subcollections (expenses). 
        // In a production app, use a Cloud Function or batch delete.
        return deleteDoc(doc(db, TRIPS_COLLECTION, tripId));
    }
};
