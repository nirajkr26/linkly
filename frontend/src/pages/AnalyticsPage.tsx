import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useSelector } from 'react-redux';
import axiosInstance from '../utils/axiosInstance';
import { Globe, MousePointer2, ArrowLeft } from 'lucide-react';
import DailyClicksChart from '../components/analytics/DailyClicksChart';
import DeviceBreakdownChart from '../components/analytics/DeviceBreakdownChart';
import LinkInfoCard from '../components/analytics/LinkInfoCard';
import StatCard from '../components/analytics/StatCard';
import { BeatLoader } from 'react-spinners';

// --- Interfaces ---

interface DailyClick {
    _id: string; // Date string
    clicks: number;
}

interface DeviceBreakdown {
    _id: string | null;
    count: number;
}

interface LinkData {
    _id: string;
    originalUrl: string;
    shortUrl: string;
    slug: string;
    createdAt: string;
    isPasswordProtected?: boolean;
    // Add other link properties here
}

interface AnalyticsData {
    totalClicks: number;
    uniqueClicks: number;
    dailyClicks: DailyClick[];
    deviceBreakdown: DeviceBreakdown[];
}

interface ApiResponse {
    link: LinkData;
    analytics: AnalyticsData;
}

// Import RootState from store
import type { RootState } from '../store/store';

const AnalyticsPage: React.FC = () => {
    // TanStack Router params typing
    const { slug } = useParams({ from: '/analytics/$slug' }) as { slug: string };
    const navigate = useNavigate();

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (!isAuthenticated) return;

            try {
                const response = await axiosInstance.get<ApiResponse>(`/api/analytics/${slug}`);
                setData(response.data);
            } catch (err: any) {
                console.error("Error fetching analytics:", err);
                if (err.response?.status === 403) {
                    setError("You don't have permission to view analytics for this link.");
                } else if (err.response?.status === 404) {
                    setError("Link not found.");
                } else {
                    setError("Failed to load analytics data.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [slug, isAuthenticated, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <BeatLoader color="#8b5cf6" size={15} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
                <h2 className="text-2xl font-bold mb-4 text-red-500">Error</h2>
                <p className="text-gray-400 mb-6">{error}</p>
                <button
                    onClick={() => navigate({ to: '/dashboard' })}
                    className="px-6 py-2 bg-violet-600 rounded-lg hover:bg-violet-700 transition font-medium"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    if (!data) return null;

    const { link, analytics } = data;

    // Prepare data for Recharts with explicit types
    const dailyClicksData = analytics.dailyClicks?.length > 0
        ? analytics.dailyClicks.map(item => ({
            _id: item._id,
            clicks: item.clicks
        }))
        : [];

    const deviceData = analytics.deviceBreakdown?.length > 0
        ? analytics.deviceBreakdown.map(item => ({
            name: item._id || 'Unknown',
            value: item.count
        }))
        : [{ name: 'No Data', value: 1 }];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-950 to-indigo-950 p-6 md:p-12 font-sans relative overflow-hidden text-white">
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-violet-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <button
                    onClick={() => navigate({ to: '/dashboard' })}
                    className="flex items-center text-gray-400 hover:text-white mb-8 transition group"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-2">
                            Analytics Dashboard
                        </h1>
                        <div className="flex items-center gap-2 text-violet-300/80">
                            <Globe className="w-4 h-4" />
                            <span className="truncate max-w-md">{link.originalUrl}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <StatCard
                                title="Total Clicks"
                                value={analytics.totalClicks}
                                icon={MousePointer2}
                                colorClass="bg-violet-500"
                            />
                            <StatCard
                                title="Unique Users"
                                value={analytics.uniqueClicks}
                                icon={Globe}
                                colorClass="bg-blue-500"
                            />
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-white/90">Click Trends</h3>
                            <DailyClicksChart data={dailyClicksData} />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-white/90">Devices</h3>
                            <DeviceBreakdownChart data={deviceData} />
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <LinkInfoCard link={link} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;