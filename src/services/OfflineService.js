import { openDB } from 'idb';

const DB_NAME = 'easyexpenses-offline';
const DB_VERSION = 1;
const PENDING_STORE = 'pending-actions';

// Initialize the database
const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(PENDING_STORE)) {
                db.createObjectStore(PENDING_STORE, { keyPath: 'id', autoIncrement: true });
            }
        },
    });
};

export const OfflineService = {
    // Check if currently online
    isOnline: () => navigator.onLine,

    // Add a pending action to the queue
    queueAction: async (action) => {
        const db = await initDB();
        const actionWithTimestamp = {
            ...action,
            timestamp: Date.now(),
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
        await db.add(PENDING_STORE, actionWithTimestamp);
        return actionWithTimestamp.id;
    },

    // Get all pending actions
    getPendingActions: async () => {
        const db = await initDB();
        return db.getAll(PENDING_STORE);
    },

    // Get count of pending actions
    getPendingCount: async () => {
        const db = await initDB();
        return db.count(PENDING_STORE);
    },

    // Remove a pending action after it's synced
    removePendingAction: async (id) => {
        const db = await initDB();
        await db.delete(PENDING_STORE, id);
    },

    // Clear all pending actions
    clearPendingActions: async () => {
        const db = await initDB();
        await db.clear(PENDING_STORE);
    },

    // Sync all pending actions with Firebase
    syncPendingActions: async (executeAction) => {
        const pending = await OfflineService.getPendingActions();
        const results = [];

        for (const action of pending) {
            try {
                await executeAction(action);
                await OfflineService.removePendingAction(action.id);
                results.push({ id: action.id, success: true });
            } catch (error) {
                console.error(`Failed to sync action ${action.id}:`, error);
                results.push({ id: action.id, success: false, error });
            }
        }

        return results;
    },

    // Listen for online/offline changes
    addConnectionListener: (onOnline, onOffline) => {
        const handleOnline = () => {
            console.log('Back online - syncing...');
            onOnline?.();
        };

        const handleOffline = () => {
            console.log('Gone offline');
            onOffline?.();
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Return cleanup function
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }
};
