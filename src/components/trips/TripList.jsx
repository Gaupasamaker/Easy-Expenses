import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, X, Search } from 'lucide-react';
import { TripService } from '../../services/TripService';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import TripCard from './TripCard';
import ConfirmModal from '../common/ConfirmModal';

export default function TripList() {
    const { currentUser } = useAuth();
    const { t } = useLanguage();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [filter, setFilter] = useState('active');
    const [searchQuery, setSearchQuery] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, tripId: null, tripName: '' });

    useEffect(() => {
        if (!currentUser) return;
        const unsubscribe = TripService.subscribeToTrips(currentUser.uid, (data) => {
            setTrips(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [currentUser]);

    const handleCreateDemo = async () => {
        setGenerating(true);
        try {
            const { generateDemoTrip } = await import('../../utils/seedData');
            await generateDemoTrip(currentUser.uid);
        } catch (error) {
            console.error("Error creating demo:", error);
        } finally {
            setGenerating(false);
        }
    };

    const openDeleteModal = (tripId, tripName) => {
        setDeleteModal({ isOpen: true, tripId, tripName });
    };

    const confirmDelete = async () => {
        const tripId = deleteModal.tripId;
        setDeleteModal({ isOpen: false, tripId: null, tripName: '' });
        try {
            setErrorMsg(null);
            await TripService.deleteTrip(tripId);
        } catch (error) {
            setErrorMsg(error.code === 'permission-denied' ? t('permission_denied') : error.message);
        }
    };

    const cancelDelete = () => {
        setDeleteModal({ isOpen: false, tripId: null, tripName: '' });
    };

    const handleArchiveTrip = async (tripId, newStatus) => {
        try {
            await TripService.updateTrip(tripId, { isActive: newStatus });
        } catch (error) {
            console.error("Failed to update trip status:", error);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8 text-gray-500 dark:text-gray-400">{t('loading')}</div>;
    }

    // Filter and search
    let filteredTrips = trips.filter(trip =>
        filter === 'active' ? (trip.isActive !== false) : (trip.isActive === false)
    );

    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredTrips = filteredTrips.filter(trip =>
            trip.name?.toLowerCase().includes(query) ||
            trip.destination?.toLowerCase().includes(query)
        );
    }

    if (trips.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-full mb-4">
                    <Calendar className="text-indigo-600 dark:text-indigo-300" size={48} />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{t('no_trips')}</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">{t('no_trips_desc')}</p>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                    <Link to="/create-trip" className="flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-indigo-700 transition-colors">
                        <Plus size={20} className="mr-2" />
                        {t('create_trip')}
                    </Link>
                    <button
                        onClick={handleCreateDemo}
                        disabled={generating}
                        className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/50 py-2 rounded-lg transition-colors"
                    >
                        {generating ? t('creating') : t('load_demo')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('my_trips')}</h2>
                    <Link to="/create-trip" className="bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700">
                        <Plus size={24} />
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('search')}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {errorMsg && (
                    <div className="bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300 p-4 rounded-lg flex items-center justify-between">
                        <span>{errorMsg}</span>
                        <button onClick={() => setErrorMsg(null)} className="p-1 hover:bg-red-100 dark:hover:bg-red-800 rounded">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Filter Tabs */}
                <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg w-max">
                    <button
                        onClick={() => setFilter('active')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${filter === 'active' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                        {t('active')}
                    </button>
                    <button
                        onClick={() => setFilter('archived')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${filter === 'archived' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                        {t('archived')}
                    </button>
                </div>

                {filteredTrips.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                        <p>{filter === 'active' ? t('no_active_trips') : t('no_archived_trips')}</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredTrips.map((trip) => (
                            <TripCard
                                key={trip.id}
                                trip={trip}
                                onDelete={(tripId) => openDeleteModal(tripId, trip.name)}
                                onArchive={handleArchiveTrip}
                            />
                        ))}
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                title={t('delete_trip')}
                message={t('delete_trip_confirm')}
                confirmText={t('delete')}
                isDestructive={true}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
            />
        </>
    );
}
