import React, { useState } from 'react';
import { Calendar, DollarSign, FileText, Store } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '../../contexts/LanguageContext';
import { useCurrency } from '../../contexts/CurrencyContext';

export default function ExpenseForm({ initialData = {}, onSubmit, loading, submitLabel }) {
    const { t } = useLanguage();
    const { currency } = useCurrency();

    const CATEGORIES = [
        { id: 'food', label: t('category_food'), icon: '🍽️' },
        { id: 'transport', label: t('category_transport'), icon: '🚕' },
        { id: 'accommodation', label: t('category_accommodation'), icon: '🏨' },
        { id: 'entertainment', label: t('category_entertainment'), icon: '🎭' },
        { id: 'shopping', label: t('category_shopping'), icon: '🛍️' },
        { id: 'other', label: t('category_other'), icon: '🧾' },
    ];

    const [formData, setFormData] = useState({
        amount: '',
        merchant: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        category: 'food',
        description: '',
        receiptImage: null,
        ...initialData
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount and Merchant */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('expense_amount')}</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 font-medium">{currency.symbol}</span>
                        <input
                            type="number"
                            name="amount"
                            step="0.01"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('expense_name')}</label>
                    <div className="relative">
                        <Store className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={18} />
                        <input
                            type="text"
                            name="merchant"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Starbucks, Uber..."
                            value={formData.merchant}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            {/* Date */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('expense_date')}</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" size={20} />
                    <input
                        type="date"
                        name="date"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('expense_category')}</label>
                <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm transition-all ${formData.category === cat.id
                                ? 'bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500'
                                : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                                }`}
                        >
                            <span className="text-xl mb-1">{cat.icon}</span>
                            <span className="text-xs truncate w-full text-center">{cat.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('expense_notes')}</label>
                <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
                    <textarea
                        name="description"
                        rows="2"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="..."
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                    {loading ? t('loading') : (submitLabel || t('save'))}
                </button>
            </div>
        </form>
    );
}
