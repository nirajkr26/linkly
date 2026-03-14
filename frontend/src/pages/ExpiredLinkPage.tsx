import React from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';

// 1. Define the expected search parameters
interface ExpiredLinkSearch {
    expiredAt?: string;
}

const ExpiredLinkPage: React.FC = () => {
    const navigate = useNavigate();

    // 2. Use TanStack's useSearch for type-safe parameter access
    // Note: 'from' should match the route path defined in your route tree
    const search = useSearch({ from: '/link-expired' }) as ExpiredLinkSearch;
    const expiredAt = search.expiredAt;

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-purple-900/20 animate-in fade-in zoom-in-95 duration-300">
                <div className="text-center mb-6">
                    {/* Icon */}
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-2xl flex items-center justify-center border border-red-500/30">
                        <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Link Expired
                    </h1>

                    {/* Subtitle */}
                    <p className="text-white/60">
                        This link is no longer accessible
                    </p>

                    {/* Optional: Display expiration date if present */}
                    {expiredAt && (
                        <p className="text-xs text-white/40 mt-2">
                            Expired on: {new Date(expiredAt).toLocaleString()}
                        </p>
                    )}
                </div>

                {/* Info Message */}
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-200 text-sm leading-relaxed">
                            This link has expired and is no longer accessible. If you believe this is an error, please contact the person who shared this link with you.
                        </p>
                    </div>
                </div>

                {/* Back to Home Button (Suggested addition) */}
                <button
                    onClick={() => navigate({ to: '/' })}
                    className="w-full mt-6 py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all duration-200 border border-white/10"
                >
                    Return Home
                </button>
            </div>
        </div>
    );
};

export default ExpiredLinkPage;