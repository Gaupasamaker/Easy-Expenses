import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, Tag, FileText, Store, Upload, Camera } from 'lucide-react';
import { format } from 'date-fns';

const CATEGORIES = [
    { id: 'food', label: 'Food & Dining', icon: '🍽️' },
    { id: 'transport', label: 'Transport', icon: '🚕' },
    { id: 'accommodation', label: 'Accommodation', icon: '🏨' },
    { id: 'flight', label: 'Flights', icon: '✈️' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️' },
    { id: 'other', label: 'Other', icon: '🧾' },
];

export default function ExpenseForm({ initialData = {}, onSubmit, loading }) {
    const [formData, setFormData] = useState({
        amount: '',
        merchant: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        category: 'food',
        description: '',
        receiptImage: null, // this will be a File object or URL
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        <input
                            type="number"
                            name="amount"
                            step="0.01"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Merchant</label>
                    <div className="relative">
                        <Store className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            type="text"
                            name="merchant"
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Starbucks, Uber..."
                            value={formData.merchant}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>

            {/* Date */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input
                        type="date"
                        name="date"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm transition-all ${formData.category === cat.id
                                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <span className="text-xl mb-1">{cat.icon}</span>
                            <span className="text-xs">{cat.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
                <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                    <textarea
                        name="description"
                        rows="2"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Dinner with client..."
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
                    {loading ? 'Saving...' : 'Save Expense'}
                </button>
            </div>
        </form>
    );
}
