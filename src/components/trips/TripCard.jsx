import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, TrendingUp, MoreVertical, Trash2, Archive, ImageOff } from 'lucide-react';
import { useCurrency } from '../../contexts/CurrencyContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { ImageService } from '../../services/ImageService';

export default function TripCard({ trip, onDelete, onArchive, index = 0 }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { currency } = useCurrency();
    const { t } = useLanguage();

    const toggleMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuOpen(!menuOpen);
    };

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuOpen(false);
        onDelete(trip.id);
    };

    const handleArchive = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuOpen(false);
        onArchive(trip.id, !trip.isActive);
    };

    // Budget warning calculation
    const spent = parseFloat(trip.totalSpent) || 0;
    const budget = parseFloat(trip.budget) || 0;
    const percentUsed = budget > 0 ? (spent / budget) * 100 : 0;
    const isOverBudget = percentUsed > 100;
    const isWarning = percentUsed >= 80 && percentUsed <= 100;

    // Get image URL - use trip's coverImage if set, otherwise generate from destination
    const imageUrl = trip.coverImage || ImageService.getDestinationImageUrl(trip.destination || trip.name);
    const fallbackGradient = ImageService.getGradientClass(index);

    return (
        <div className="relative">
            <button
                onClick={toggleMenu}
                className="absolute top-2 right-2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors z-10 backdrop-blur-sm"
            >
                <MoreVertical size={20} />
            </button>

            <Link to={`/trips/${trip.id}`} className="block">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 relative group">
                    {/* Header with Image */}
                    <div className="h-32 relative overflow-hidden">
                        {!imageError ? (
                            <img
                                src={imageUrl}
                                alt={trip.destination || trip.name}
                                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${trip.isActive === false ? 'grayscale opacity-70' : ''}`}
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${fallbackGradient} flex items-center justify-center`}>
                                <ImageOff className="text-white/30" size={32} />
                            </div>
                        )}

                        {/* Gradient overlay for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Title overlay */}
                        <div className="absolute bottom-3 left-4 right-12 text-white">
                            <h3 className="text-lg font-bold truncate drop-shadow-lg">{trip.name}</h3>
                            {trip.destination && (
                                <p className="text-sm text-white/90 truncate drop-shadow">{trip.destination}</p>
                            )}
                        </div>
                    </div>

                    <div className="p-4 space-y-3">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar size={16} className="mr-2" />
                            <span>
                                {trip.startDate ? format(trip.startDate, 'MMM d') : 'TBD'}
                                {trip.endDate && ` - ${format(trip.endDate, 'MMM d')}`}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-gray-700">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">{t('budget_spent')}</span>
                                <div className={`flex items-center font-bold ${isOverBudget ? 'text-red-600 dark:text-red-400' : isWarning ? 'text-orange-500' : 'text-indigo-600 dark:text-indigo-400'}`}>
                                    <TrendingUp size={14} className="mr-1" />
                                    <span>
                                        {budget > 0 ? `${currency.symbol}${budget}` : '-'}
                                        <span className="text-gray-400 dark:text-gray-500 font-normal mx-1">/</span>
                                        {currency.symbol}{spent.toFixed(0)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className={`text-xs px-2 py-1 rounded-full ${trip.isActive !== false ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                                    {trip.isActive !== false ? t('active') : t('archived')}
                                </span>
                                {isOverBudget && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300">
                                        {t('over_budget')}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            {menuOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                    <div className="absolute top-12 right-2 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-1 w-40 animate-in fade-in zoom-in-95 duration-100">
                        <button
                            onClick={handleArchive}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                        >
                            <Archive size={16} className="mr-2" />
                            {trip.isActive !== false ? t('archive') : t('activate')}
                        </button>
                        <button
                            onClick={handleDelete}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 flex items-center"
                        >
                            <Trash2 size={16} className="mr-2" />
                            {t('delete')}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
