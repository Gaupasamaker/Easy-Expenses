import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, List, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Layout() {
    const { logout } = useAuth();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Trips', icon: List, path: '/trips' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <div className="flex h-screen flex-col bg-gray-50">
            <header className="flex items-center justify-between bg-white px-4 py-3 shadow-sm md:px-6">
                <h1 className="text-xl font-bold text-indigo-600">EasyExpenses AI</h1>
                <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700">
                    <LogOut size={20} />
                </button>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
                <Outlet />
            </main>

            <nav className="fixed bottom-0 left-0 right-0 border-t bg-white md:hidden">
                <div className="flex justify-around py-3">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex flex-col items-center ${location.pathname === item.path ? 'text-indigo-600' : 'text-gray-400'
                                }`}
                        >
                            <item.icon size={24} />
                            <span className="text-xs mt-1">{item.name}</span>
                        </Link>
                    ))}
                    <Link
                        to="/create-trip"
                        className="flex flex-col items-center text-indigo-600 -mt-6"
                    >
                        <div className="bg-indigo-600 rounded-full p-3 shadow-lg text-white">
                            <PlusCircle size={28} />
                        </div>
                        <span className="text-xs mt-1 font-medium">New Trip</span>
                    </Link>
                </div>
            </nav>

            {/* Desktop Sidebar (Optional, keeping simple for now) */}
            <div className='hidden md:block fixed left-0 top-16 bottom-0 w-64 bg-white border-r p-4'>
                {/* Desktop nav would go here if needed */}
            </div>
        </div>
    );
}
