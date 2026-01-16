import React, { useState, useRef } from 'react';
import { Camera, X, Loader2 } from 'lucide-react';
import { GeminiService } from '../../services/GeminiService';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ScannerModal({ onClose, onScanComplete }) {
    const { t } = useLanguage();
    const [analyzing, setAnalyzing] = useState(false);
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        await processImage(file);
    };

    const processImage = async (file) => {
        try {
            setAnalyzing(true);
            setErrorMsg(null);
            const data = await GeminiService.analyzeReceipt(file);
            onScanComplete(data, file);
            onClose();
        } catch (error) {
            console.error("Scan failed", error);
            setErrorMsg(error.message || t('scan_error'));
            setAnalyzing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-6 text-center">

                    {!analyzing ? (
                        <>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{t('scan_receipt')}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                                {t('take_photo')} / {t('upload_image')}
                            </p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full flex items-center justify-center p-4 bg-indigo-600 text-white rounded-xl font-medium shadow-lg hover:bg-indigo-700 transition-all"
                                >
                                    <Camera size={24} className="mr-2" />
                                    {t('take_photo')} / {t('upload_image')}
                                </button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="py-8">
                            <div className="relative w-20 h-20 mx-auto mb-4">
                                <div className="absolute inset-0 border-4 border-indigo-100 dark:border-indigo-900 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 size={32} className="text-indigo-600 dark:text-indigo-400 animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-300 animate-pulse">{t('scanning')}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-2">AI-powered extraction</p>
                        </div>
                    )}

                    {errorMsg && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-300 rounded-lg text-sm">
                            {errorMsg}
                            <button onClick={onClose} className="block w-full mt-2 text-red-700 dark:text-red-400 font-bold underline">
                                {t('close')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
