import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { PlusCircle, List, Settings, LogOut, Wallet } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Layout() {
    const { logout } = useAuth();
    const { t } = useLanguage();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const navItems = [
        { name: t('trips'), icon: List, path: '/trips' },
        { name: t('settings'), icon: Settings, path: '/settings' },
    ];

    return (
        <div className="flex h-[100dvh] bg-slate-50 dark:bg-gray-900 font-sans text-slate-900 dark:text-white overflow-hidden">

            {/* --- DESKTOP SIDEBAR --- */}
            <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-slate-200 dark:border-gray-700">
                <div className="p-6">
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900">
                            <Wallet className="text-white" size={24} />
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                            EasyExpenses
                        </h1>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2 py-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
                                    ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 shadow-sm'
                                    : 'text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-gray-500'} />
                                {item.name}
                            </Link>
                        )
                    })}
                    <Link
                        to="/create-trip"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-slate-500 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white"
                    >
                        <PlusCircle size={20} className="text-slate-400 dark:text-gray-500" />
                        {t('create_trip')}
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-100 dark:border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-xl transition-colors font-medium"
                    >
                        <LogOut size={20} />
                        {t('sign_out')}
                    </button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col h-full min-w-0 relative">

                {/* --- MOBILE HEADER --- */}
                <header className="md:hidden flex-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-slate-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-30">
                    <div className="flex items-center justify-between mx-auto w-full">
                        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                            <div className="bg-indigo-600 p-1.5 rounded-lg">
                                <Wallet className="text-white" size={20} />
                            </div>
                            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                                EasyExpenses
                            </h1>
                        </Link>
                        <button onClick={handleLogout} className="text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 transition-colors">
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                {/* --- MAIN CONTENT SCROLLABLE AREA --- */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth pb-24 md:pb-6 p-4 md:p-8">
                    <div className="max-w-md md:max-w-5xl mx-auto w-full min-h-full">
                        <Outlet />
                    </div>
                </main>

                {/* --- MOBILE BOTTOM NAV --- */}
                <nav className="md:hidden flex-none fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-t border-slate-200 dark:border-gray-700 z-40">
                    <div className="flex justify-around items-end max-w-md mx-auto w-full px-2 pb-2 pt-1 h-16">
                        {navItems.map((item) => {
                            const isActive = location.pathname.startsWith(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex flex-col items-center justify-center w-16 py-1 transition-all duration-300 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300'
                                        }`}
                                >
                                    <item.icon
                                        size={24}
                                        strokeWidth={isActive ? 2.5 : 2}
                                        className={`transition-transform duration-300 ${isActive ? '-translate-y-1' : ''}`}
                                    />
                                    <span className={`text-[10px] font-medium transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}

                        {/* Mobile FAB */}
                        <Link
                            to="/create-trip"
                            className="absolute left-1/2 -translate-x-1/2 -top-6 group"
                        >
                            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full p-3.5 shadow-lg shadow-indigo-200 dark:shadow-indigo-900 text-white transition-transform duration-300 group-hover:scale-110 group-active:scale-95 ring-4 ring-slate-50 dark:ring-gray-900">
                                <PlusCircle size={32} />
                            </div>
                        </Link>
                    </div>
                </nav>

            </div>
        </div>
    );
}
