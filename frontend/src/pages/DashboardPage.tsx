import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import UrlForm from '../components/UrlForm';
import UserUrls from '../components/UserUrls';

// --- Interfaces ---

interface DashboardStats {
  totalLinks: number;
  totalClicks: number;
}

interface UserPayload {
  name: string;
  email?: string;
  // add other user fields as necessary
}

interface RootState {
  auth: {
    user: {
      data?: {
        user?: UserPayload;
      };
      name?: string;
    } | null;
    isAuthenticated: boolean;
  };
}

const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [stats, setStats] = useState<DashboardStats>({ totalLinks: 0, totalClicks: 0 });
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  // Typing effect state
  const [typingIndex, setTypingIndex] = useState<number>(0);

  const handleStatsUpdate = (newStats: DashboardStats): void => {
    setStats(newStats);
  };

  // Determine greeting based on time
  const hour = new Date().getHours();
  let timeGreeting: string = 'Good Morning';
  if (hour >= 12 && hour < 17) timeGreeting = 'Good Afternoon';
  else if (hour >= 17 || hour < 5) timeGreeting = 'Good Evening';

  // Handling the nested user name logic with TS safety
  const userName = user?.data?.user?.name || user?.name || 'Champion';
  const fullGreeting = `${timeGreeting}, ${userName}!`;

  useEffect(() => {
    // Reset index when user changes to ensure animation restarts if needed
    setTypingIndex(0);

    const typeInterval = setInterval(() => {
      setTypingIndex((prev) => {
        if (prev < fullGreeting.length) {
          return prev + 1;
        } else {
          clearInterval(typeInterval);
          return prev;
        }
      });
    }, 100);

    return () => clearInterval(typeInterval);
  }, [user, fullGreeting.length]);

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-950 via-purple-950 to-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-96 h-96 bg-violet-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 pt-24 pb-20 px-4">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Motivational Message */}
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight min-h-[1.2em]">
                <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-400 via-purple-400 to-indigo-400">
                  {fullGreeting.slice(0, typingIndex)}
                  <span className="opacity-0">{fullGreeting.slice(typingIndex)}</span>
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-white/80 leading-relaxed max-w-xl">
                Streamline your digital presence with our advanced URL shortening tools. Enhance your sharing capabilities and gain valuable insights with every link you create.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="backdrop-blur-xl bg-gradient-to-br from-violet-900/30 to-purple-900/20 border border-violet-500/30 rounded-2xl p-5 hover:border-violet-400/50 transition-all duration-300 group">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Total Links</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.totalLinks}</p>
                </div>

                <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border border-emerald-500/30 rounded-2xl p-5 hover:border-emerald-400/50 transition-all duration-300 group">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-white/60 text-xs font-medium uppercase tracking-wide">Total Clicks</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.totalClicks}</p>
                </div>
              </div>
            </div>

            {/* Right Side - URL Shortener Form */}
            <div>
              <div className="bg-violet-100/95 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-violet-200/50 hover:bg-violet-200 transition-all duration-300">
                <div className="flex items-center gap-3 mb-8">
                  <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <h2 className="text-2xl font-bold text-violet-900">Create Short Link</h2>
                </div>
                <UrlForm onSuccess={() => setRefreshTrigger(prev => prev + 1)} />
              </div>
            </div>
          </div>
        </div>

        {/* URLs List Section */}
        <div className="max-w-6xl mx-auto">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl hover:border-white/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center transition-transform duration-300 hover:-translate-y-1">
                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Your Links</h2>
            </div>
            <UserUrls
              itemsPerPage={3}
              showExternalIcon="/urls"
              showStatsHeader={false}
              onStatsLoaded={handleStatsUpdate}
              refreshTrigger={refreshTrigger}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;