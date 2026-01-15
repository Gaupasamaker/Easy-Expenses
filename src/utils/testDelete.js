import { collection, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth, signInAnonymously } from 'firebase/auth';

export const testDeletePermission = async () => {
    try {
        console.log("Starting deletion test...");

        // 1. Create a dummy doc
        const colRef = collection(db, 'trips'); // using real collection to test real rules
        const docRef = await addDoc(colRef, {
            name: "Delete Test",
            userId: "test-user",
            temp: true
        });
        console.log("Created temp doc:", docRef.id);

        // 2. Try to delete it
        await deleteDoc(docRef);
        console.log("✅ Successfully deleted doc. Permissions are OK.");
        return { success: true };

    } catch (error) {
        console.error("❌ Deletion failed:", error);
        return { success: false, error: error };
    }
};
