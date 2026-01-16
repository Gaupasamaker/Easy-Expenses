import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TripService } from '../services/TripService';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { Loader2, ArrowLeft, Calendar } from 'lucide-react';

export default function CreateTrip() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { t } = useLanguage();
    const { currency } = useCurrency();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        destination: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: '',
        isActive: true
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        try {
            setLoading(true);

            const tripData = {
                ...formData,
                startDate: formData.startDate ? new Date(formData.startDate) : null,
                endDate: formData.endDate ? new Date(formData.endDate) : null,
                budget: formData.budget ? parseFloat(formData.budget) : 0
            };

            await TripService.createTrip(tripData, currentUser.uid);
            navigate('/trips');
        } catch (error) {
            console.error("Error creating trip:", error);
        } finally {
            setLoading(false);
        }
    };

    // Common input classes with dark mode support
    const inputClasses = "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors";
    const inputWithIconClasses = "w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors";

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('create_trip')}</h2>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('trip_name')}</label>
                    <input
                        type="text"
                        name="name"
                        required
                        className={inputClasses}
                        placeholder={t('trip_name_placeholder')}
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('destination')}</label>
                    <input
                        type="text"
                        name="destination"
                        className={inputClasses}
                        placeholder={t('destination_placeholder')}
                        value={formData.destination}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('description')}</label>
                    <textarea
                        name="description"
                        rows="3"
                        className={inputClasses}
                        placeholder={t('description_placeholder')}
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('start_date')}</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={20} />
                            <input
                                type="date"
                                name="startDate"
                                required
                                className={inputWithIconClasses}
                                value={formData.startDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('end_date')}</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={20} />
                            <input
                                type="date"
                                name="endDate"
                                className={inputWithIconClasses}
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('budget')}</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 font-medium">{currency.symbol}</span>
                        <input
                            type="number"
                            name="budget"
                            min="0"
                            step="0.01"
                            className={inputWithIconClasses}
                            placeholder="0.00"
                            value={formData.budget}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors flex justify-center items-center"
                    >
                        {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                        {t('create_trip')}
                    </button>
                </div>
            </form>
        </div>
    );
}
