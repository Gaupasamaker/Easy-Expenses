import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ExpenseService } from '../services/ExpenseService';
import { ExportService } from '../services/ExportService';
import ExpenseCharts from '../components/analytics/ExpenseCharts';
import ConfirmModal from '../components/common/ConfirmModal';
import { ArrowLeft, Plus, Receipt, Calendar, Utensils, Car, Hotel, ShoppingBag, PieChart as PieChartIcon, List, Download, Loader2, Trash2, Edit3, MoreVertical, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useCurrency } from '../contexts/CurrencyContext';
import { useLanguage } from '../contexts/LanguageContext';

const CATEGORY_ICONS = {
    'food': Utensils,
    'transport': Car,
    'accommodation': Hotel,
    'shopping': ShoppingBag,
    'other': Receipt
};

export default function TripDetails() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const { currency } = useCurrency();
    const { t } = useLanguage();

    const [trip, setTrip] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCharts, setShowCharts] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, expenseId: null, expenseName: '' });

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const docRef = doc(db, 'trips', tripId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setTrip({ id: docSnap.id, ...docSnap.data() });
                } else {
                    navigate('/trips');
                }
            } catch (error) {
                console.error("Error getting trip:", error);
            }
        };

        fetchTrip();

        const unsubscribe = ExpenseService.subscribeToExpenses(tripId, (data) => {
            setExpenses(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [tripId, navigate]);

    const totalSpent = expenses.reduce((sum, expense) => sum + (parseFloat(expense.amount) || 0), 0);
    const budget = trip?.budget ? parseFloat(trip.budget) : 0;
    const progress = budget > 0 ? (totalSpent / budget) * 100 : 0;
    const isOverBudget = progress > 100;
    const isWarning = progress >= 80 && progress <= 100;

    const handleExport = async () => {
        try {
            setExporting(true);
            await ExportService.exportTripData(trip, expenses);
        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setExporting(false);
        }
    };

    const openDeleteModal = (expenseId, expenseName) => {
        setActiveMenu(null);
        setDeleteModal({ isOpen: true, expenseId, expenseName });
    };

    const confirmDeleteExpense = async () => {
        const expenseId = deleteModal.expenseId;
        setDeleteModal({ isOpen: false, expenseId: null, expenseName: '' });
        try {
            await ExpenseService.deleteExpense(tripId, expenseId);
        } catch (error) {
            console.error("Failed to delete expense:", error);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">{t('loading')}</div>;

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
                <div className="flex items-center justify-between p-4">
                    <button onClick={() => navigate('/trips')} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800 dark:text-white truncate px-2 overflow-hidden flex-1">{trip?.name}</h1>
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full transition-colors"
                        title={t('export')}
                    >
                        {exporting ? <Loader2 size={24} className="animate-spin" /> : <Download size={24} />}
                    </button>
                </div>

                {/* Summary Card */}
                <div className="px-4 pb-4">
                    <div className={`rounded-xl p-4 text-white shadow-lg ${isOverBudget ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-indigo-600 to-violet-600'}`}>
                        <div className="flex items-center justify-between mb-1">
                            <p className="text-white/80 text-sm">{t('total_spent')}</p>
                            {isOverBudget && (
                                <span className="flex items-center text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                    <AlertTriangle size={12} className="mr-1" />
                                    {t('over_budget')}
                                </span>
                            )}
                            {isWarning && !isOverBudget && (
                                <span className="flex items-center text-xs bg-orange-400/30 px-2 py-0.5 rounded-full">
                                    {t('budget_warning', { percent: Math.round(progress) })}
                                </span>
                            )}
                        </div>
                        <h2 className="text-3xl font-bold mb-4">{currency.symbol}{totalSpent.toFixed(2)}</h2>

                        <div className="flex justify-between text-xs text-white/70 mb-1">
                            <span>{t('budget')}: {currency.symbol}{budget.toFixed(2)}</span>
                            <span>{Math.round(progress)}% {t('budget_used')}</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all ${isOverBudget ? 'bg-white' : 'bg-white'}`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Toggle Charts/List */}
                <div className="flex border-b border-gray-100 dark:border-gray-700">
                    <button
                        onClick={() => setShowCharts(false)}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center ${!showCharts ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        <List size={16} className="mr-2" /> {t('expenses')}
                    </button>
                    <button
                        onClick={() => setShowCharts(true)}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center ${showCharts ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        <PieChartIcon size={16} className="mr-2" /> {t('analytics')}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {showCharts ? (
                    <ExpenseCharts expenses={expenses} />
                ) : (
                    <>
                        {expenses.length === 0 ? (
                            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                                <Receipt size={48} className="mx-auto mb-2 opacity-20" />
                                <p>{t('no_expenses')}</p>
                                <p className="text-sm mt-1">{t('no_expenses_desc')}</p>
                            </div>
                        ) : (
                            expenses.map((expense) => {
                                const Icon = CATEGORY_ICONS[expense.category?.toLowerCase()] || CATEGORY_ICONS['other'];

                                return (
                                    <div key={expense.id} className="relative flex items-center bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-50 dark:border-gray-700">
                                        <div className="p-3 rounded-full bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mr-4">
                                            <Icon size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 dark:text-white truncate">{expense.merchant || expense.description || 'Unknown'}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                                <Calendar size={10} className="mr-1" />
                                                {expense.date ? format(expense.date, 'MMM d') : 'No date'}
                                                {expense.category && <span className="ml-2 px-1.5 py-0.5 rounded-sm bg-gray-100 dark:bg-gray-700">{expense.category}</span>}
                                            </p>
                                        </div>
                                        <div className="font-bold text-gray-900 dark:text-white mr-2">
                                            {currency.symbol}{parseFloat(expense.amount).toFixed(2)}
                                        </div>

                                        {/* Actions Menu */}
                                        <button
                                            onClick={() => setActiveMenu(activeMenu === expense.id ? null : expense.id)}
                                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <MoreVertical size={16} className="text-gray-400" />
                                        </button>

                                        {activeMenu === expense.id && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                                                <div className="absolute top-full right-0 mt-1 z-20 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-1 w-36">
                                                    <Link
                                                        to={`/trips/${tripId}/expenses/${expense.id}/edit`}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center"
                                                    >
                                                        <Edit3 size={14} className="mr-2" />
                                                        {t('edit')}
                                                    </Link>
                                                    <button
                                                        onClick={() => openDeleteModal(expense.id, expense.merchant || expense.description)}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 flex items-center"
                                                    >
                                                        <Trash2 size={14} className="mr-2" />
                                                        {t('delete')}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </>
                )}
            </div>

            {/* FAB for Add Expense */}
            <button
                onClick={() => navigate(`/trips/${tripId}/add-expense`)}
                className="fixed bottom-20 right-4 bg-indigo-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:bg-indigo-700 hover:scale-105 transition-all z-20"
            >
                <Plus size={28} />
            </button>

            {/* Delete Expense Modal */}
            <ConfirmModal
                isOpen={deleteModal.isOpen}
                title={t('delete_expense')}
                message={t('delete_expense_confirm')}
                confirmText={t('delete')}
                isDestructive={true}
                onConfirm={confirmDeleteExpense}
                onCancel={() => setDeleteModal({ isOpen: false, expenseId: null, expenseName: '' })}
            />
        </div>
    );
}
