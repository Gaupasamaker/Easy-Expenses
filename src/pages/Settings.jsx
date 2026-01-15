import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { User, LogOut, Info, Database, Bug, RefreshCw, Coins, Globe, Moon, Sun, Monitor } from 'lucide-react';

export default function Settings() {
    const { currentUser, logout } = useAuth();
    const { currency, setCurrency, currencies } = useCurrency();
    const { language, setLanguage, languages, t } = useLanguage();
    const { theme, setTheme, themes } = useTheme();
    const [testResult, setTestResult] = useState(null);
    const [syncResult, setSyncResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSyncTotals = async () => {
        setLoading(true);
        setSyncResult(null);
        try {
            const { recalculateAllTripTotals } = await import('../utils/recalculateTotals');
            if (currentUser) {
                const count = await recalculateAllTripTotals(currentUser.uid);
                setSyncResult({ success: true, message: t('synced_trips', { count }) });
            }
        } catch (e) {
            setSyncResult({ success: false, message: `❌ ${e.message}` });
        } finally {
            setLoading(false);
        }
    };

    const handleTestPermissions = async () => {
        setLoading(true);
        setTestResult(null);
        try {
            const { testDeletePermission } = await import('../utils/testDelete');
            const result = await testDeletePermission();
            if (result.success) {
                setTestResult({ success: true, message: "✅ Write/Delete Check Passed!" });
            } else {
                setTestResult({
                    success: false,
                    message: `❌ ${result.error?.code}: ${result.error?.message}`
                });
            }
        } catch (e) {
            setTestResult({ success: false, message: `❌ ${e.message}` });
        } finally {
            setLoading(false);
        }
    };

    const themeOptions = [
        { value: themes.light, icon: Sun, label: t('light_mode') },
        { value: themes.dark, icon: Moon, label: t('dark_mode') },
        { value: themes.system, icon: Monitor, label: t('system_mode') },
    ];

    return (
        <div className="space-y-6 pb-20">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('settings')}</h2>

            {/* Profile Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-50 dark:border-gray-700 flex items-center gap-3">
                    <User className="text-indigo-600 dark:text-indigo-400" size={20} />
                    <h3 className="font-semibold text-gray-800 dark:text-white">{t('profile')}</h3>
                </div>
                <div className="p-4">
                    <div className="flex items-center space-x-4">
                        <div className="bg-indigo-100 dark:bg-indigo-900 rounded-full p-4">
                            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">
                                {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('signed_in_as')}</p>
                            <p className="font-medium text-gray-900 dark:text-white">{currentUser?.email}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Language Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-50 dark:border-gray-700 flex items-center gap-3">
                    <Globe className="text-indigo-600 dark:text-indigo-400" size={20} />
                    <h3 className="font-semibold text-gray-800 dark:text-white">{t('language')}</h3>
                </div>
                <div className="p-4">
                    <div className="flex gap-2">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => setLanguage(lang.code)}
                                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${language === lang.code
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                <span className="text-xl">{lang.flag}</span>
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Theme Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-50 dark:border-gray-700 flex items-center gap-3">
                    <Moon className="text-indigo-600 dark:text-indigo-400" size={20} />
                    <h3 className="font-semibold text-gray-800 dark:text-white">{t('appearance')}</h3>
                </div>
                <div className="p-4">
                    <div className="flex gap-2">
                        {themeOptions.map(({ value, icon: Icon, label }) => (
                            <button
                                key={value}
                                onClick={() => setTheme(value)}
                                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${theme === value
                                        ? 'bg-indigo-600 text-white shadow-md'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                <Icon size={18} />
                                <span className="hidden sm:inline">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Currency Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-50 dark:border-gray-700 flex items-center gap-3">
                    <Coins className="text-indigo-600 dark:text-indigo-400" size={20} />
                    <h3 className="font-semibold text-gray-800 dark:text-white">{t('currency')}</h3>
                </div>
                <div className="p-4">
                    <select
                        value={currency.code}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        {currencies.map((c) => (
                            <option key={c.code} value={c.code}>
                                {c.symbol} - {c.name} ({c.code})
                            </option>
                        ))}
                    </select>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
                        {t('currency_desc')}
                    </p>
                </div>
            </div>

            {/* About */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-50 dark:border-gray-700 flex items-center gap-3">
                    <Info className="text-indigo-600 dark:text-indigo-400" size={20} />
                    <h3 className="font-semibold text-gray-800 dark:text-white">{t('about')}</h3>
                </div>
                <div className="p-4 space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">{t('version')}</span>
                        <span className="font-medium text-gray-900 dark:text-white">1.1.0</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 dark:text-gray-400">{t('build')}</span>
                        <span className="font-medium text-gray-900 dark:text-white">2026.01.16</span>
                    </div>
                </div>
            </div>

            {/* Data Management */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-50 dark:border-gray-700 flex items-center gap-3">
                    <Database className="text-indigo-600 dark:text-indigo-400" size={20} />
                    <h3 className="font-semibold text-gray-800 dark:text-white">{t('data_management')}</h3>
                </div>
                <div className="p-4 space-y-3">
                    <button
                        onClick={handleSyncTotals}
                        disabled={loading}
                        className="w-full bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-medium py-3 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading && <RefreshCw size={16} className="animate-spin" />}
                        {t('sync_totals')}
                    </button>
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                        {t('sync_totals_desc')}
                    </p>
                    {syncResult && (
                        <div className={`p-3 rounded-lg text-sm ${syncResult.success ? 'bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300'}`}>
                            {syncResult.message}
                        </div>
                    )}
                </div>
            </div>

            {/* Debug */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-50 dark:border-gray-700 flex items-center gap-3">
                    <Bug className="text-orange-500" size={20} />
                    <h3 className="font-semibold text-gray-800 dark:text-white">{t('debug')}</h3>
                </div>
                <div className="p-4 space-y-4">
                    <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">{t('project_id')}</span>
                        <p className="font-mono text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 mt-1 text-gray-800 dark:text-gray-200">
                            {import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Not Set'}
                        </p>
                    </div>
                    <button
                        onClick={handleTestPermissions}
                        disabled={loading}
                        className="w-full text-sm bg-orange-50 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 font-medium py-3 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading && <RefreshCw size={16} className="animate-spin" />}
                        {t('test_permissions')}
                    </button>
                    {testResult && (
                        <div className={`p-4 rounded-lg text-sm whitespace-pre-wrap ${testResult.success ? 'bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-300'}`}>
                            {testResult.message}
                        </div>
                    )}
                </div>
            </div>

            {/* Logout */}
            <button
                onClick={() => logout()}
                className="w-full bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 font-medium py-3 rounded-xl flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
            >
                <LogOut size={20} className="mr-2" />
                {t('sign_out')}
            </button>
        </div>
    );
}
