import React, { useState, type FormEvent } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from '@tanstack/react-router';
import axios, { AxiosError } from 'axios';
import { DotLoader } from 'react-spinners';
import FAQ from '../components/FAQ';

// --- Interfaces ---

interface RootState {
  auth: {
    isAuthenticated: boolean;
  };
}

interface ShortenPayload {
  url: string;
  slug?: string;
}

interface ApiErrorResponse {
  message?: string;
}

const HomePage: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [customSlug, setCustomSlug] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Selector typing
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: ShortenPayload = { url };
      if (customSlug && customSlug.trim()) {
        payload.slug = customSlug.trim();
      }

      // Using environment variable for backend URL
      const { data } = await axios.post<any>(
        `${import.meta.env.VITE_BACKEND_URL}/api/create`,
        payload,
        { withCredentials: true }
      );
      
      if (typeof data === 'string') {
        setShortUrl(data);
      } else if (data && typeof data === 'object') {
        setShortUrl(data.shortUrl || data.short_url || '');
      } else {
        setShortUrl(String(data));
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error('Error shortening URL:', axiosError);
      alert(axiosError.response?.data?.message || 'Failed to shorten URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-950 via-red-950 to-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 pt-24 pb-20 px-4">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Shorten Your Links,
                <br />
                <span className="bg-clip-text text-transparent bg-linear-to-r from-orange-400 via-red-400 to-amber-400">
                  Expand Your Reach
                </span>
              </h1>
              <p className="text-l lg:text-xl text-white/80 leading-relaxed max-w-xl">
                Transform long URLs into powerful, shareable links in seconds. Fast, reliable, and completely free.
              </p>
            </div>

            {/* Right Side - URL Shortener Form */}
            <div>
              <form onSubmit={handleSubmit} className="bg-orange-100/95 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-orange-200/50 hover:bg-orange-200 transition-all transform hover:scale-101  duration-300">
                {/* Heading */}
                <div className="flex items-center gap-3 mb-8">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <h2 className="text-2xl font-bold text-orange-900">Shorten your link</h2>
                </div>

                {/* URL Input with Button */}
                <div className="mb-8">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste your long URL here..."
                    className="w-full px-6 py-4 text-gray-800 bg-orange-100 border-2 border-orange-200 rounded-2xl outline-none transition-all duration-200 focus:border-orange-400 focus:bg-orange-100 focus:ring-4 focus:ring-orange-100 placeholder:text-gray-500 mb-4"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-8 py-4 text-lg font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-2xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <DotLoader size={20} color="#ffffff" />
                      </>
                    ) : (
                      <>
                        Shorten
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                {/* Short Link Result */}
                {shortUrl && (
                  <div className="bg-white/80 border-2 border-orange-200 rounded-2xl p-6 mb-6">
                    <p className="text-gray-600 text-sm font-semibold mb-3 uppercase tracking-wide">
                      Your Short Link:
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 font-mono text-lg hover:underline break-all flex-1"
                      >
                        {shortUrl}
                      </a>
                      <button
                        onClick={handleCopy}
                        type="button"
                        className="px-4 py-2 text-sm font-semibold text-orange-600 bg-orange-100 hover:bg-orange-200 border border-orange-200 rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {isCopied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Custom Slug (for authenticated users) */}
                {isAuthenticated && (
                  <div className="mb-6">
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">
                      Custom Short Link (Optional)
                    </label>
                    <input
                      type="text"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                      placeholder="my-custom-link"
                      className="w-full px-6 py-4 text-gray-800 bg-white/80 border-2 border-orange-200 rounded-2xl outline-none transition-all duration-200 focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100 placeholder:text-gray-500"
                    />
                  </div>
                )}

                {/* Footer */}
                {!isAuthenticated && (
                  <div className="flex items-center gap-2 text-gray-600 text-sm pt-4">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Want your own domain?</span>
                    <button
                      type="button"
                      onClick={() => navigate({ to: '/auth', search: { mode: 'signup' } })}
                      className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
                    >
                      Create free account
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="max-w-7xl mx-auto mt-24">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white text-center mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-linear-to-r from-white via-orange-200 to-red-200">
              Powerful Tools,
            </span>
            <br />
            Effortless Management
          </h2>
          <p className="text-center text-white/70 text-xl mb-20 max-w-3xl mx-auto leading-relaxed">
            Everything you need to create, track, and optimize your short links — all in one beautiful platform
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-20">
            {/* Feature 1 - Advanced Analytics */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border border-emerald-500/30 rounded-3xl p-8 hover:border-emerald-400/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-6">
                <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-emerald-400 group-hover:to-teal-400 mb-4 relative inline-block transition-all duration-300">
                Advanced Analytics
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-linear-to-r from-emerald-400 to-teal-400 rounded-full shadow-lg shadow-emerald-400/50 transition-all duration-300 group-hover:w-full"></span>
              </h3>
              <p className="text-white/60 text-base leading-relaxed">
                Track clicks, conversions, and user behavior with detailed insights and real-time reporting
              </p>
            </div>

            {/* Feature 2 - Custom Domains */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-teal-900/30 to-cyan-900/20 border border-teal-500/30 rounded-3xl p-8 hover:border-teal-400/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-teal-500/20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-6">
                <svg className="w-7 h-7 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-teal-400 group-hover:to-cyan-400 mb-4 relative inline-block transition-all duration-300">
                Custom Domains
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-linear-to-r from-teal-400 to-cyan-400 rounded-full shadow-lg shadow-teal-400/50 transition-all duration-300 group-hover:w-full"></span>
              </h3>
              <p className="text-white/60 text-base leading-relaxed">
                Use your own branded domain to create professional short links that build trust
              </p>
            </div>

            {/* Feature 3 - Schedule Link Activation */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-cyan-900/30 to-blue-900/20 border border-cyan-500/30 rounded-3xl p-8 hover:border-cyan-400/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-6">
                <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-cyan-400 group-hover:to-blue-400 mb-4 relative inline-block transition-all duration-300">
                Schedule Activation
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-linear-to-r from-cyan-400 to-blue-400 rounded-full shadow-lg shadow-cyan-400/50 transition-all duration-300 group-hover:w-full"></span>
              </h3>
              <p className="text-white/60 text-base leading-relaxed">
                Plan ahead by scheduling exactly when your links go live and start redirecting
              </p>
            </div>

            {/* Feature 4 - QR Code Generation */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-orange-900/30 to-red-900/20 border border-orange-500/30 rounded-3xl p-8 hover:border-orange-400/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-6">
                <svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-orange-400 group-hover:to-red-400 mb-4 relative inline-block transition-all duration-300">
                QR Code Generation
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-linear-to-r from-orange-400 to-red-400 rounded-full shadow-lg shadow-orange-400/50 transition-all duration-300 group-hover:w-full"></span>
              </h3>
              <p className="text-white/60 text-base leading-relaxed">
                Generate beautiful QR codes for your links instantly and share them anywhere
              </p>
            </div>

            {/* Feature 5 - Link Expiration */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-pink-900/30 to-rose-900/20 border border-pink-500/30 rounded-3xl p-8 hover:border-pink-400/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-6">
                <svg className="w-7 h-7 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-pink-400 group-hover:to-rose-400 mb-4 relative inline-block transition-all duration-300">
                Link Expiration
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-linear-to-r from-pink-400 to-rose-400 rounded-full shadow-lg shadow-pink-400/50 transition-all duration-300 group-hover:w-full"></span>
              </h3>
              <p className="text-white/60 text-base leading-relaxed">
                Set expiration dates for your links and maintain control over your content
              </p>
            </div>

            {/* Feature 6 - Password Protection */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-amber-900/30 to-blue-900/20 border border-amber-500/30 rounded-3xl p-8 hover:border-amber-400/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-6">
                <svg className="w-7 h-7 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-amber-400 group-hover:to-blue-400 mb-4 relative inline-block transition-all duration-300">
                Password Protection
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-linear-to-r from-amber-400 to-blue-400 rounded-full shadow-lg shadow-amber-400/50 transition-all duration-300 group-hover:w-full"></span>
              </h3>
              <p className="text-white/60 text-base leading-relaxed">
                Secure your links with password protection for sensitive content
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="relative overflow-hidden mt-20 p-16">
            <div className="text-center">
              <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                Ready to Amplify
                <br />
                <span className="bg-clip-text text-transparent bg-linear-to-r from-orange-400 via-red-400 to-amber-400">
                  Your Online Presence?
                </span>
              </h2>

              <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
                Create branded links, track every click, and grow your reach
              </p>

              <div className="flex flex-col gap-6 justify-center items-center">
                <button
                  onClick={() => navigate({ to: '/auth', search: { mode: 'signup' } })}
                  className="group px-10 py-4 text-lg font-bold text-white bg-linear-to-r from-orange-600 via-red-600 to-amber-600 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50 flex items-center gap-3"
                >
                  <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Get Started
                </button>

                {/* Features Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-20 mt-15">
                  <div className="flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 hover:-translate-y-2 group">
                    <div className="w-14 h-14 bg-orange-500/20 rounded-full flex items-center justify-center border border-orange-400/30 transition-all duration-300 group-hover:bg-orange-500/40 group-hover:border-orange-400/60 group-hover:shadow-lg group-hover:shadow-orange-400/50">
                      <svg className="w-7 h-7 text-orange-400 transition-all duration-300 group-hover:text-orange-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <span className="text-white/80 text-sm font-medium transition-colors group-hover:text-white">Custom Domain</span>
                  </div>

                  <div className="flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 hover:-translate-y-2 group">
                    <div className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center border border-red-400/30 transition-all duration-300 group-hover:bg-red-500/40 group-hover:border-red-400/60 group-hover:shadow-lg group-hover:shadow-red-400/50">
                      <svg className="w-7 h-7 text-red-400 transition-all duration-300 group-hover:text-red-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <span className="text-white/80 text-sm font-medium transition-colors group-hover:text-white">Secure & Reliable</span>
                  </div>

                  <div className="flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 hover:-translate-y-2 group">
                    <div className="w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-400/30 transition-all duration-300 group-hover:bg-amber-500/40 group-hover:border-amber-400/60 group-hover:shadow-lg group-hover:shadow-amber-400/50">
                      <svg className="w-7 h-7 text-amber-400 transition-all duration-300 group-hover:text-amber-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <span className="text-white/80 text-sm font-medium transition-colors group-hover:text-white">QR Codes</span>
                  </div>

                  <div className="flex flex-col items-center gap-3 cursor-pointer transition-all duration-300 hover:-translate-y-2 group">
                    <div className="w-14 h-14 bg-orange-500/20 rounded-full flex items-center justify-center border border-orange-400/30 transition-all duration-300 group-hover:bg-orange-500/40 group-hover:border-orange-400/60 group-hover:shadow-lg group-hover:shadow-orange-400/50">
                      <svg className="w-7 h-7 text-orange-400 transition-all duration-300 group-hover:text-orange-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <span className="text-white/80 text-sm font-medium transition-colors group-hover:text-white">Analytics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative z-10">
        <FAQ />
      </div>
    </div>
  );
};

export default HomePage;