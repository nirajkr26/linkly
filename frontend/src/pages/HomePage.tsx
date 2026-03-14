import React, { useState, FormEvent } from 'react';
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
      const { data } = await axios.post<string>(
        `${import.meta.env.VITE_BACKEND_URL}/api/create`, 
        payload, 
        { withCredentials: true }
      );
      
      setShortUrl(data);
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
    <div className="min-h-screen bg-linear-to-br from-indigo-950 via-purple-950 to-gray-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-violet-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 pt-24 pb-20 px-4">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side */}
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Shorten Your Links,<br />
                <span className="bg-clip-text text-transparent bg-linear-to-r from-violet-400 via-purple-400 to-indigo-400">
                  Expand Your Reach
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-white/80 leading-relaxed max-w-xl">
                Transform long URLs into powerful, shareable links in seconds. Fast, reliable, and completely free.
              </p>
            </div>

            {/* Form Side */}
            <div>
              <form onSubmit={handleSubmit} className="bg-violet-100/95 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-violet-200/50 hover:bg-violet-200 transition-all transform hover:scale-101 duration-300">
                <div className="flex items-center gap-3 mb-8">
                  <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <h2 className="text-2xl font-bold text-violet-900">Shorten your link</h2>
                </div>

                <div className="mb-8">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste your long URL here..."
                    className="w-full px-6 py-4 text-gray-800 bg-violet-100 border-2 border-violet-200 rounded-2xl outline-none transition-all duration-200 focus:border-violet-400 focus:bg-violet-100 focus:ring-4 focus:ring-violet-100 placeholder:text-gray-500 mb-4"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-8 py-4 text-lg font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-2xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? <DotLoader size={20} color="#ffffff" /> : (
                      <>
                        Shorten
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                {shortUrl && (
                  <div className="bg-white/80 border-2 border-violet-200 rounded-2xl p-6 mb-6">
                    <p className="text-gray-600 text-sm font-semibold mb-3 uppercase tracking-wide">Your Short Link:</p>
                    <div className="flex items-center justify-between gap-4">
                      <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-violet-600 font-mono text-lg hover:underline break-all flex-1">
                        {shortUrl}
                      </a>
                      <button
                        onClick={handleCopy}
                        type="button"
                        className="px-4 py-2 text-sm font-semibold text-violet-600 bg-violet-100 hover:bg-violet-200 border border-violet-200 rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap"
                      >
                        {isCopied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}

                {isAuthenticated && (
                  <div className="mb-6">
                    <label className="text-sm font-semibold text-gray-700 mb-3 block">Custom Short Link (Optional)</label>
                    <input
                      type="text"
                      value={customSlug}
                      onChange={(e) => setCustomSlug(e.target.value)}
                      placeholder="my-custom-link"
                      className="w-full px-6 py-4 text-gray-800 bg-white/80 border-2 border-violet-200 rounded-2xl outline-none transition-all duration-200 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 placeholder:text-gray-500"
                    />
                  </div>
                )}

                {!isAuthenticated && (
                  <div className="flex items-center gap-2 text-gray-600 text-sm pt-4">
                    <span>Want your own domain?</span>
                    <button
                      type="button"
                      onClick={() => navigate({ to: '/auth', search: { mode: 'signup' } })}
                      className="text-violet-600 hover:text-violet-700 font-semibold transition-colors"
                    >
                      Create free account
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Features & CTA sections remain similarly structured with JSX... */}
        <div id="features" className="max-w-7xl mx-auto mt-24 text-center">
            {/* ... Rest of your features grid ... */}
        </div>

        <div className="relative z-10">
          <FAQ />
        </div>
      </div>
    </div>
  );
};

export default HomePage;