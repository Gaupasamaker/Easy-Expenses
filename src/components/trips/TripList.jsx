import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, TrendingUp, MoreVertical, Plus } from 'lucide-react';
import { TripService } from '../../services/TripService';
import { useAuth } from '../../contexts/AuthContext';

export default function TripList() {
    const { currentUser } = useAuth();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribe = TripService.subscribeToTrips(currentUser.uid, (data) => {
            setTrips(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    if (loading) {
        return <div className="flex justify-center p-8">Loading trips...</div>;
    }

    if (trips.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="bg-indigo-100 p-4 rounded-full mb-4">
                    <Calendar className="text-indigo-600" size={48} />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">No trips yet</h2>
                <p className="text-gray-500 mb-6">Start tracking your travel expenses by creating your first trip.</p>
                <Link to="/create-trip" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:bg-indigo-700 transition-colors">
                    Create New Trip
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">My Trips</h2>
                <Link to="/create-trip" className="bg-indigo-600 text-white p-2 rounded-full shadow hover:bg-indigo-700">
                    <Plus size={24} />
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {trips.map((trip) => (
                    <Link key={trip.id} to={`/trips/${trip.id}`} className="block">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                                <div className="absolute bottom-3 left-4 text-white">
                                    <h3 className="text-lg font-bold truncate pr-4">{trip.name}</h3>
                                </div>
                            </div>
                            <div className="p-4 space-y-3">
                                <p className="text-sm text-gray-600 line-clamp-2">{trip.description}</p>

                                <div className="flex items-center text-sm text-gray-500">
                                    <Calendar size={16} className="mr-2" />
                                    <span>
                                        {trip.startDate ? format(trip.startDate, 'MMM d, yyyy') : 'TBD'}
                                        {trip.endDate && ` - ${format(trip.endDate, 'MMM d, yyyy')}`}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                                    <div className="flex items-center text-indigo-600 font-semibold">
                                        <TrendingUp size={16} className="mr-1" />
                                        <span>{trip.budget ? `$${trip.budget}` : 'No Budget'}</span>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${trip.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {trip.isActive ? 'Active' : 'Past'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
