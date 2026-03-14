import React, { useState, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
import { DotLoader } from 'react-spinners';
import { useParams, useNavigate } from '@tanstack/react-router';

// --- Interfaces ---

interface VerifyResponse {
    isSuccess: boolean;
    full_url: string;
}

interface ApiErrorResponse {
    message?: string;
}

const ProtectedLinkPage: React.FC = () => {
    // 1. Type the dynamic route parameter
    const { shortUrl } = useParams({ from: '/protected/$shortUrl' });
    const navigate = useNavigate();

    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const { data } = await axios.post<VerifyResponse>(
                `${import.meta.env.VITE_BACKEND_URL}/api/create/verify`,
                {
                    shortUrl,
                    password
                }
            );

            if (data.isSuccess && data.full_url) {
                // External redirect
                window.location.href = data.full_url;
            }
        } catch (err) {
            const axiosError = err as AxiosError<ApiErrorResponse>;
            console.error('Verification error:', axiosError);

            // 2. Handle specific HTTP status codes
            if (axiosError.response?.status === 410) {
                const expiredAt = new Date().toISOString();
                navigate({
                    to: '/link-expired',
                    search: {
                        expiredAt,
                        shortUrl
                    }
                });
                return;
            }

            setError(axiosError.response?.data?.message || 'Incorrect password or server error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-red-900/20 animate-in fade-in zoom-in-95 duration-300">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/20 rounded-2xl flex items-center justify-center border border-orange-500/30">
                        <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Password Protected</h1>
                    <p className="text-white/60">This link is protected. Please enter the password to continue.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-white/80 text-sm font-medium ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password..."
                            className="w-full px-5 py-3.5 bg-white/5 border border-orange-500/20 rounded-xl text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:bg-white/10 transition-all placeholder:text-white/40"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-orange-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading || !password}
                        className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold rounded-xl shadow-lg shadow-orange-600/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-[1.02]"
                    >
                        {isLoading ? <DotLoader size={20} color="#ffffff" /> : (
                            <>
                                <span>Access Link</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProtectedLinkPage;