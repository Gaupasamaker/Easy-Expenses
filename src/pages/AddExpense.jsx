import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExpenseService } from '../services/ExpenseService';
import ExpenseForm from '../components/expenses/ExpenseForm';
import ScannerModal from '../components/scanner/ScannerModal';
import { ArrowLeft, Camera } from 'lucide-react';

export default function AddExpense() {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [scannedData, setScannedData] = useState({});

    const handleCreateExpense = async (formData) => {
        try {
            setLoading(true);
            await ExpenseService.addExpense({
                ...formData,
                amount: parseFloat(formData.amount),
                date: new Date(formData.date),
                tripId
            });
            navigate(`/trips/${tripId}`);
        } catch (error) {
            console.error("Error adding expense:", error);
            alert("Failed to add expense.");
        } finally {
            setLoading(false);
        }
    };

    const handleScanComplete = (data, file) => {
        // Map Gemini data to form structure
        // Gemini returns { amount, currency, date, merchant, category, description }
        setScannedData({
            amount: data.amount || '',
            merchant: data.merchant || '',
            date: data.date || '',
            category: data.category?.toLowerCase() || 'other',
            description: data.description || '',
            receiptImage: file
        });
    };

    return (
        <div className="max-w-2xl mx-auto pb-20">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-4 p-2 rounded-full hover:bg-gray-100">
                    <ArrowLeft size={24} className="text-gray-600" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Add Expense</h2>
                <div className="ml-auto">
                    <button
                        onClick={() => setShowScanner(true)}
                        className="flex items-center text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Camera size={18} className="mr-2" />
                        Scan Receipt
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <ExpenseForm
                    initialData={scannedData}
                    onSubmit={handleCreateExpense}
                    loading={loading}
                    key={scannedData.merchant ? 'scanned' : 'manual'} // Force re-render on scan
                />
            </div>

            {showScanner && (
                <ScannerModal
                    onClose={() => setShowScanner(false)}
                    onScanComplete={handleScanComplete}
                />
            )}
        </div>
    );
}
