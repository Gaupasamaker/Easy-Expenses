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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

const EXPENSES_COLLECTION = 'expenses';

export const ExpenseService = {
    // Subscribe to expenses for a specific trip
    subscribeToExpenses: (tripId, callback) => {
        if (!tripId) return () => { };

        const q = query(
            collection(db, EXPENSES_COLLECTION),
            where('tripId', '==', tripId),
            orderBy('date', 'desc'),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(q, (snapshot) => {
            const expenses = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                date: doc.data().date?.toDate()
            }));
            callback(expenses);
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

        return addDoc(collection(db, EXPENSES_COLLECTION), {
            ...dataToSave,
            receiptUrl,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
    },

    // Update an expense
    updateExpense: async (expenseId, expenseData) => {
        const expenseRef = doc(db, EXPENSES_COLLECTION, expenseId);
        return updateDoc(expenseRef, {
            ...expenseData,
            updatedAt: serverTimestamp()
        });
    },

    // Delete an expense
    deleteExpense: async (expenseId) => {
        return deleteDoc(doc(db, EXPENSES_COLLECTION, expenseId));
    }
};
