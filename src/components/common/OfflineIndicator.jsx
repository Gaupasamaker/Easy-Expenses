import React, { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, Check } from 'lucide-react';
import { OfflineService } from '../../services/OfflineService';
import { useLanguage } from '../../contexts/LanguageContext';

export default function OfflineIndicator() {
    const { t } = useLanguage();
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [pendingCount, setPendingCount] = useState(0);
    const [syncing, setSyncing] = useState(false);
    const [justSynced, setJustSynced] = useState(false);

    useEffect(() => {
        // Check pending count periodically
        const checkPending = async () => {
            const count = await OfflineService.getPendingCount();
            setPendingCount(count);
        };

        checkPending();
        const interval = setInterval(checkPending, 5000);

        // Listen for online/offline events
        const cleanup = OfflineService.addConnectionListener(
            async () => {
                setIsOnline(true);
                // Auto-sync when back online
                if (pendingCount > 0) {
                    setSyncing(true);
                    // Sync will be handled by the app's sync logic
                    setTimeout(() => {
                        setSyncing(false);
                        setJustSynced(true);
                        checkPending();
                        setTimeout(() => setJustSynced(false), 3000);
                    }, 2000);
                }
            },
            () => {
                setIsOnline(false);
            }
        );

        return () => {
            clearInterval(interval);
            cleanup();
        };
    }, [pendingCount]);

    // Don't show anything if online and no pending
    if (isOnline && pendingCount === 0 && !justSynced) {
        return null;
    }

    return (
        <div className={`fixed bottom-20 md:bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${isOnline && pendingCount === 0 && !justSynced ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            }`}>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-sm font-medium transition-colors ${!isOnline
                    ? 'bg-orange-500 text-white'
                    : justSynced
                        ? 'bg-green-500 text-white'
                        : syncing
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-800 text-white'
                }`}>
                {!isOnline ? (
                    <>
                        <WifiOff size={16} />
                        <span>{t('offline_mode') || 'Offline'}</span>
                        {pendingCount > 0 && (
                            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                                {pendingCount} {t('pending') || 'pending'}
                            </span>
                        )}
                    </>
                ) : justSynced ? (
                    <>
                        <Check size={16} />
                        <span>{t('synced') || 'Synced!'}</span>
                    </>
                ) : syncing ? (
                    <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>{t('syncing') || 'Syncing...'}</span>
                    </>
                ) : pendingCount > 0 ? (
                    <>
                        <RefreshCw size={16} />
                        <span>{pendingCount} {t('pending_sync') || 'to sync'}</span>
                    </>
                ) : null}
            </div>
        </div>
    );
}
