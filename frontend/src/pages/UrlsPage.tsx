import React from 'react';
import UserUrls from '../components/UserUrls';
import { Link } from '@tanstack/react-router';

const UrlsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-950 via-purple-950 to-gray-900 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden="true">
                <div className="absolute top-20 left-20 w-96 h-96 bg-violet-500 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 pt-24 pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* TanStack Link with typed 'to' prop */}
                            <Link 
                                to="/dashboard" 
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span className="sr-only">Back to Dashboard</span>
                            </Link>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-white">All URLs</h1>
                        </div>
                    </div>

                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
                        {/* Assuming UserUrls is already converted or has types defined */}
                        <UserUrls itemsPerPage={10} showExternalIcon={false} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UrlsPage;