import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExpenseService } from '../services/ExpenseService';
import ExpenseForm from '../components/expenses/ExpenseForm';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function EditExpense() {
    const { tripId, expenseId } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expense, setExpense] = useState(null);

    useEffect(() => {
        const loadExpense = async () => {
            try {
                const data = await ExpenseService.getExpense(expenseId);
                if (data) {
                    setExpense({
                        ...data,
                        date: data.date instanceof Date ? data.date.toISOString().split('T')[0] : data.date
                    });
                } else {
                    navigate(`/trips/${tripId}`);
                }
            } catch (error) {
                console.error("Error loading expense:", error);
                navigate(`/trips/${tripId}`);
            } finally {
                setLoading(false);
            }
        };
        loadExpense();
    }, [expenseId, tripId, navigate]);

    const handleUpdateExpense = async (formData) => {
        try {
            setSaving(true);
            await ExpenseService.updateExpense(expenseId, {
                ...formData,
                amount: parseFloat(formData.amount),
                date: new Date(formData.date)
            });
            navigate(`/trips/${tripId}`);
        } catch (error) {
            console.error("Error updating expense:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto pb-20">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('edit_expense')}</h2>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <ExpenseForm
                    initialData={expense}
                    onSubmit={handleUpdateExpense}
                    loading={saving}
                    submitLabel={t('save')}
                />
            </div>
        </div>
    );
}
