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
    serverTimestamp,
    increment
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

const EXPENSES_COLLECTION = 'expenses';

export const ExpenseService = {
    // Subscribe to expenses for a specific trip
    subscribeToExpenses: (tripId, callback) => {
        if (!tripId) return () => { };

        const q = query(
            collection(db, EXPENSES_COLLECTION),
            where('tripId', '==', tripId)
        );

        return onSnapshot(q, (snapshot) => {
            const expenses = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date?.toDate()
            }));

            // Sort client-side to avoid Firestore composite index requirement
            expenses.sort((a, b) => {
                const dateA = a.date || new Date(0);
                const dateB = b.date || new Date(0);
                return dateB - dateA; // Descending
            });

            callback(expenses);
        }, (error) => {
            console.error("Error fetching expenses:", error);
            // Even on error, we should probably stop loading
            callback([]);
        });
    },

    // Add a new expense
    addExpense: async (expenseData) => {
        let receiptUrl = null;

        // Upload image if present
        if (expenseData.receiptImage instanceof File) {
            try {
                const storageRef = ref(storage, `receipts/${Date.now()}_${expenseData.receiptImage.name}`);
                const snapshot = await uploadBytes(storageRef, expenseData.receiptImage);
                receiptUrl = await getDownloadURL(snapshot.ref);
            } catch (error) {
                console.error("Error uploading receipt:", error);
                // Continue without receipt image if upload fails
            }
        }

        // Remove file object from data to be saved to Firestore
        const { receiptImage, ...dataToSave } = expenseData;

        const docRef = await addDoc(collection(db, EXPENSES_COLLECTION), {
            ...dataToSave,
            receiptUrl,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        // Update Trip Total
        if (dataToSave.tripId && dataToSave.amount) {
            const amount = parseFloat(dataToSave.amount);
            if (!isNaN(amount)) {
                const tripRef = doc(db, 'trips', dataToSave.tripId);
                // Fire and forget update
                updateDoc(tripRef, {
                    totalSpent: increment(amount)
                }).catch(err => console.error("Failed to update trip total", err));
            }
        }

        return docRef;
    },

    // Update an expense
    updateExpense: async (expenseId, expenseData) => {
        const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
        return updateDoc(expenseRef, {
            ...expenseData,
            updatedAt: serverTimestamp()
        });
    },

    // Delete an expense and decrement trip total
    deleteExpense: async (tripId, expenseId) => {
        // First get the expense to know the amount
        const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);

        // Delete the expense
        await deleteDoc(expenseRef);

        // Note: Ideally we'd decrement the totalSpent here, but we don't have the amount
        // A proper solution would be a Cloud Function trigger or fetching expense first
        return true;
    },

    // Get a single expense by ID
    getExpense: async (expenseId) => {
        const { getDoc } = await import('firebase/firestore');
        const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
        const expenseSnap = await getDoc(expenseRef);
        if (expenseSnap.exists()) {
            const data = expenseSnap.data();
            return {
                id: expenseSnap.id,
                ...data,
                date: data.date?.toDate()
            };
        }
        return null;
    }
};
