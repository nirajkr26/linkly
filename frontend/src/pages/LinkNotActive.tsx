import React, { useEffect, useMemo } from 'react';
import { useSearch } from '@tanstack/react-router';

// 1. Define the expected search parameters
interface LinkNotActiveSearch {
    activeFrom?: string;
    shortUrl?: string;
}

const LinkNotActive: React.FC = () => {
    // 2. Use TanStack's useSearch for type-safety
    // 'from' should match the route path defined in your route tree
    const search = useSearch({ from: '/link-not-active' }) as LinkNotActiveSearch;
    const { activeFrom, shortUrl } = search;

    // 3. Memoize the date to prevent unnecessary calculations
    const activationDate = useMemo(() =>
        activeFrom ? new Date(activeFrom) : null,
        [activeFrom]);

    useEffect(() => {
        if (!activationDate) return;

        const checkTime = (): void => {
            const now = new Date();
            if (now >= activationDate) {
                if (shortUrl) {
                    window.location.href = shortUrl;
                }
            }
        };

        // Check immediately
        checkTime();

        // Check every second
        const interval = setInterval(checkTime, 1000);

        return () => clearInterval(interval);
        // Using getTime() in dependencies ensures the effect only triggers if the value changes
    }, [activationDate?.getTime(), shortUrl]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-red-900/20 animate-in fade-in zoom-in-95 duration-300">
                <div className="text-center mb-6">
                    {/* Icon */}
                    <div className="w-16 h-16 mx-auto mb-4 bg-orange-500/20 rounded-2xl flex items-center justify-center border border-orange-500/30">
                        <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-white mb-2">
                        Link Not Active Yet
                    </h1>

                    {/* Subtitle */}
                    <p className="text-white/60">
                        This link is scheduled to become active soon
                    </p>
                </div>

                {/* Date Display */}
                {activationDate && (
                    <div className="space-y-2 mb-6">
                        <label className="text-white/80 text-sm font-medium ml-1">Activation Date</label>
                        <div className="w-full px-5 py-4 bg-white/5 border border-orange-500/20 rounded-xl hover:border-orange-500/30 transition-colors">
                            <div className="flex items-center gap-3 text-white">
                                <svg className="w-5 h-5 text-orange-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-base font-medium">
                                    {activationDate.toLocaleString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Info Message */}
                <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-orange-200 text-sm leading-relaxed">
                            This link will become accessible after the scheduled activation time. Please check back later.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LinkNotActive;