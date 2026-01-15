import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Loader2, Wallet, Moon, Sun } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
    const { t, language, setLanguage, languages } = useLanguage();
    const { isDark, setTheme, themes } = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            setError('');
            setLoading(true);
            await login();
            navigate('/');
        } catch (err) {
            setError(t('error') + ': ' + err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
            {/* Theme & Language Toggle */}
            <div className="absolute top-4 right-4 flex gap-2">
                <button
                    onClick={() => setTheme(isDark ? themes.light : themes.dark)}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <div className="flex bg-white/20 rounded-full overflow-hidden">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)}
                            className={`px-3 py-2 text-sm font-medium transition-colors ${language === lang.code ? 'bg-white text-indigo-600' : 'text-white hover:bg-white/20'}`}
                        >
                            {lang.flag}
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-2xl text-center">
                {/* Logo */}
                <div className="flex justify-center">
                    <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-4 rounded-2xl shadow-lg">
                        <Wallet className="text-white" size={40} />
                    </div>
                </div>

                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{t('app_name')}</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {language === 'es' ? 'Gestiona tus gastos de viaje con IA' : 'Manage your travel expenses with AI'}
                    </p>
                </div>

                {error && <div className="text-red-500 dark:text-red-400 text-sm mb-4">{error}</div>}

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="group relative flex w-full justify-center items-center rounded-xl border border-transparent bg-indigo-600 px-4 py-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors shadow-lg"
                >
                    {loading ? (
                        <Loader2 className="animate-spin mr-2" size={20} />
                    ) : (
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 mr-3 bg-white rounded-full p-0.5" alt="Google" />
                    )}
                    {t('sign_in_google')}
                </button>

                <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                    {language === 'es' ? 'v1.1.0 • Modo oscuro • ES/EN' : 'v1.1.0 • Dark mode • ES/EN'}
                </p>
            </div>
        </div>
    );
}
