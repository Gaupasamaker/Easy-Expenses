import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, Check } from 'lucide-react';
import { GeminiService } from '../../services/GeminiService';

export default function ScannerModal({ onClose, onScanComplete }) {
    const [analyzing, setAnalyzing] = useState(false);
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);

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
            const data = await GeminiService.analyzeReceipt(file);
            onScanComplete(data, file); // Pass extracted data and the file back
            onClose();
        } catch (error) {
            console.error("Scan failed", error);
            alert("Could not analyze receipt. Please try again or enter manually.");
            setAnalyzing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-6 text-center">

                    {!analyzing ? (
                        <>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Scan Receipt</h3>
                            <p className="text-gray-500 text-sm mb-6">Take a photo or upload a receipt to automatically extract details.</p>

                            <div className="space-y-3">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full flex items-center justify-center p-4 bg-indigo-600 text-white rounded-xl font-medium shadow-lg hover:bg-indigo-700 transition-all"
                                >
                                    <Camera size={24} className="mr-2" />
                                    Take Photo / Upload
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
                                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Loader2 size={32} className="text-indigo-600 animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-indigo-900 animate-pulse">Analyzing with AI...</h3>
                            <p className="text-gray-500 text-xs mt-2">Extracting merchant, date, and amount</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
