import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ExpenseService } from '../services/ExpenseService';
import { ExportService } from '../services/ExportService';
import ExpenseCharts from '../components/analytics/ExpenseCharts';
import { ArrowLeft, Plus, Receipt, Calendar, CreditCard, Utensils, Plane, Car, Hotel, ShoppingBag, MoreHorizontal, PieChart as PieChartIcon, List, Download, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const CATEGORY_ICONS = {
    'food': Utensils,
    'transport': Car,
    'accommodation': Hotel,
    'flight': Plane,
    'shopping': ShoppingBag,
    'other': Receipt
};

export default function TripDetails() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCharts, setShowCharts] = useState(false);
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const docRef = doc(db, 'trips', tripId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setTrip({ id: docSnap.id, ...docSnap.data() });
                } else {
                    console.log("No such trip!");
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

    const handleExport = async () => {
        try {
            setExporting(true);
            await ExportService.exportTripData(trip, expenses);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Export failed. Please try again.");
        } finally {
            setExporting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading details...</div>;

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="flex items-center justify-between p-4">
                    <button onClick={() => navigate('/trips')} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                        <ArrowLeft size={24} className="text-gray-600" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800 truncate px-2 overflow-hidden flex-1">{trip?.name}</h1>
                    <button
                        onClick={handleExport}
                        disabled={exporting}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                        title="Export Report"
                    >
                        {exporting ? <Loader2 size={24} className="animate-spin" /> : <Download size={24} />}
                    </button>
                </div>

                {/* Summary Card */}
                <div className="px-4 pb-4">
                    <div className="bg-indigo-600 rounded-xl p-4 text-white shadow-lg">
                        <p className="text-indigo-100 text-sm mb-1">Total Spent</p>
                        <h2 className="text-3xl font-bold mb-4">${totalSpent.toFixed(2)}</h2>

                        <div className="flex justify-between text-xs text-indigo-200 mb-1">
                            <span>Budget: ${budget.toFixed(2)}</span>
                            <span>{Math.round(progress)}% utilized</span>
                        </div>
                        <div className="w-full bg-indigo-900/40 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full ${progress > 100 ? 'bg-red-400' : 'bg-white'}`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Toggle Charts/List */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setShowCharts(false)}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center ${!showCharts ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                    >
                        <List size={16} className="mr-2" /> Transactions
                    </button>
                    <button
                        onClick={() => setShowCharts(true)}
                        className={`flex-1 py-3 text-sm font-medium flex items-center justify-center ${showCharts ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
                    >
                        <PieChartIcon size={16} className="mr-2" /> Analysis
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                {showCharts ? (
                    <ExpenseCharts expenses={expenses} />
                ) : (
                    <>
                        {expenses.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                <Receipt size={48} className="mx-auto mb-2 opacity-20" />
                                <p>No expenses yet.</p>
                            </div>
                        ) : (
                            expenses.map((expense) => {
                                const Icon = CATEGORY_ICONS[expense.category?.toLowerCase()] || CATEGORY_ICONS['other'];

                                return (
                                    <div key={expense.id} className="flex items-center bg-white p-3 rounded-xl shadow-sm border border-gray-50">
                                        <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 mr-4">
                                            <Icon size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 truncate">{expense.merchant || expense.description || 'Unknown'}</p>
                                            <p className="text-xs text-gray-500 flex items-center">
                                                <Calendar size={10} className="mr-1" />
                                                {expense.date ? format(expense.date, 'MMM d') : 'No date'}
                                                {expense.category && <span className="ml-2 px-1.5 py-0.5 rounded-sm bg-gray-100">{expense.category}</span>}
                                            </p>
                                        </div>
                                        <div className="font-bold text-gray-900">
                                            ${parseFloat(expense.amount).toFixed(2)}
                                        </div>
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
        </div>
    );
}
