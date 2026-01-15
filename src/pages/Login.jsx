import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export default function Login() {
    const { login } = useAuth();
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
            setError('Failed to sign in via Google');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg text-center">
                <div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">EasyExpenses AI</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to manage your travel expenses
                    </p>
                </div>

                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
                >
                    {loading ? (
                        <Loader2 className="animate-spin mr-2" size={20} />
                    ) : (
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5 mr-3 bg-white rounded-full p-0.5" alt="Google" />
                    )}
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}
