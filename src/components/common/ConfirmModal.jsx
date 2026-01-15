import React from 'react';
import { Trash2, X, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmText, isDestructive = true }) {
    const { t } = useLanguage();

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
                onClick={onCancel}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-sm w-full animate-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="p-6 pb-4">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-full ${isDestructive ? 'bg-red-100 dark:bg-red-900/50' : 'bg-indigo-100 dark:bg-indigo-900/50'}`}>
                                <AlertTriangle className={isDestructive ? 'text-red-600 dark:text-red-400' : 'text-indigo-600 dark:text-indigo-400'} size={24} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{message}</p>
                            </div>
                            <button
                                onClick={onCancel}
                                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-6 pb-6 flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-3 rounded-xl font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${isDestructive
                                    ? 'bg-red-600 text-white hover:bg-red-700'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                        >
                            {isDestructive && <Trash2 size={16} />}
                            {confirmText || t('confirm')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
