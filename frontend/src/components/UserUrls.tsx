import { useEffect, useState, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { DotLoader } from 'react-spinners';
import EditExpirationModal from './EditExpirationModal';
import PasswordProtectionModal from './PasswordProtectionModal';
import { deleteUrl } from '../api/User.api';
import type { RootState } from '../store/store';

// --- Interfaces ---

interface UrlItem {
  _id: string;
  full_url: string;
  short_url: string;
  clicks: number;
  createdAt: string;
  expiresAt?: string;
  activeFrom?: string;
  isLinkPassword?: boolean;
  qrCode?: string;
  [key: string]: unknown;
}

interface StatsData {
  totalLinks: number;
  totalClicks: number;
}

interface UserUrlsProps {
  itemsPerPage?: number;
  showExternalIcon?: boolean | string;
  showStatsHeader?: boolean;
  onStatsLoaded?: (stats: StatsData) => void;
  refreshTrigger?: number;
}

const UserUrls = ({ itemsPerPage = 10, showExternalIcon = false, showStatsHeader = true, onStatsLoaded, refreshTrigger }: UserUrlsProps) => {
  const navigate = useNavigate();
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'clicks', 'alphabetical'
  const [expandedQrId, setExpandedQrId] = useState<string | null>(null);
  const [shareMenuId, setShareMenuId] = useState<string | null>(null); // ID of the URL whose share menu is open
  const [moreActionsId, setMoreActionsId] = useState<string | null>(null); // ID of the URL whose more actions menu is open
  const [editExpirationUrl, setEditExpirationUrl] = useState<UrlItem | null>(null);
  const [editPasswordUrl, setEditPasswordUrl] = useState<UrlItem | null>(null);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  // Refs for click-outside detection
  const moreActionsRef = useRef<HTMLDivElement | null>(null);
  const shareMenuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close more actions dropdown if clicked outside
      if (moreActionsRef.current && !moreActionsRef.current.contains(event.target as Node)) {
        setMoreActionsId(null);
      }
      // Close share menu if clicked outside
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShareMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUrls = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/urls`,
          { withCredentials: true }
        );
        setUrls(data.data.urls);
        if (onStatsLoaded) {
          const fetchedUrls: UrlItem[] = data.data.urls;
          const totalClicks = fetchedUrls.reduce((sum: number, url: UrlItem) => sum + url.clicks, 0);
          onStatsLoaded({ totalLinks: fetchedUrls.length, totalClicks });
        }
      } catch (err: unknown) {
        console.error('Error fetching URLs:', err);
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message || 'Failed to fetch URLs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUrls();
  }, [isAuthenticated, refreshTrigger]);

  if (!isAuthenticated) {
    return (
      <div className="w-full">
        <div className="text-center p-10 backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl">
          <svg className="w-12 h-12 mx-auto mb-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h3 className="text-lg font-semibold text-white mb-1">Authentication required</h3>
          <p className="text-white/70 text-sm">Please login to view your shortened URLs</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="text-center p-10 flex flex-col items-center justify-center">
          <DotLoader size={50} color="#a78bfa" />
          <p className="mt-4 text-white/70 font-medium">Loading your URLs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-5 text-center">
          <svg className="w-10 h-10 mx-auto mb-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-orange-300 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="w-full">
        <div className="text-center p-10 backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl">
          <div className="w-16 h-16 mx-auto mb-3 bg-orange-500/20 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-1">No URLs yet</h3>
          <p className="text-white/70">Start by shortening your first URL above!</p>
        </div>
      </div>
    );
  }

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(`${import.meta.env.VITE_BACKEND_URL}/${url}`);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleQrCode = (id: string) => {
    setExpandedQrId(expandedQrId === id ? null : id);
  };

  const toggleShareMenu = (id: string) => {
    setShareMenuId(shareMenuId === id ? null : id);
  };

  const downloadQrCode = async (qrUrl: string, filename: string) => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  const shareQrCode = async (qrUrl: string) => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const file = new File([blob], 'qrcode.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'QR Code',
          text: 'Check out this QR code!',
        });
      } else {
        alert('Sharing files is not supported on this browser.');
      }
    } catch (error) {
      console.error('Error sharing QR code:', error);
    }
  };

  const shareUrl = (platform: string, shortUrl: string) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/${shortUrl}`;
    const encodedUrl = encodeURIComponent(url);
    let shareLink = '';

    switch (platform) {
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodedUrl}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      default:
        return;
    }
    window.open(shareLink, '_blank', 'noopener,noreferrer');
  };

  const handleDeleteUrl = async (urlId: string) => {
    if (!confirm('Are you sure you want to delete this link? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteUrl(urlId);
      setUrls(prev => prev.filter(url => url._id !== urlId));

      // Update stats if callback provided
      if (onStatsLoaded) {
        const updatedUrls = urls.filter(url => url._id !== urlId);
        const totalClicks = updatedUrls.reduce((sum: number, url: UrlItem) => sum + url.clicks, 0);
        onStatsLoaded({ totalLinks: updatedUrls.length, totalClicks });
      }
    } catch (error: unknown) {
      console.error('Error deleting URL:', error);
      const axiosErr = error as { response?: { data?: { message?: string } } };
      alert(axiosErr.response?.data?.message || 'Failed to delete URL');
    }
  };

  // Filter and sort URLs
  const filteredAndSortedUrls = urls
    .filter(url =>
      url.full_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      url.short_url.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'clicks') return b.clicks - a.clicks;
      if (sortBy === 'alphabetical') return a.short_url.localeCompare(b.short_url);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // recent
    });

  const totalClicks = urls.reduce((sum: number, url: UrlItem) => sum + url.clicks, 0);

  // Pagination Logic
  const indexOfLastUrl = currentPage * itemsPerPage;
  const indexOfFirstUrl = indexOfLastUrl - itemsPerPage;
  const currentUrls = filteredAndSortedUrls.slice(indexOfFirstUrl, indexOfLastUrl);

  return (
    <div className="w-full">
      {/* Header with Stats */}
      {showStatsHeader && (
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-100/90 rounded-xl border border-orange-200">
              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="font-bold text-orange-700">{urls.length}</span>
              <span className="text-gray-600 font-medium">Links</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-100/90 rounded-xl border border-emerald-200">
              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <span className="font-bold text-emerald-700">{totalClicks}</span>
              <span className="text-gray-600 font-medium">Clicks</span>
            </div>
          </div>
        </div>
      )}

      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search your links..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 text-gray-800 bg-orange-100 border-2 border-orange-200 rounded-xl outline-none transition-all duration-200 focus:border-orange-400 focus:bg-orange-100 focus:ring-4 focus:ring-orange-100 placeholder:text-gray-500"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 text-gray-800 bg-orange-100 border-2 border-orange-200 rounded-xl outline-none transition-all duration-200 focus:border-orange-400 focus:bg-orange-100 focus:ring-4 focus:ring-orange-100 cursor-pointer font-medium"
        >
          <option value="recent">Most Recent</option>
          <option value="clicks">Most Clicks</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

      {/* URLs Grid */}
      <div className="space-y-4">
        {currentUrls.map((url) => (
          <div
            key={url._id}
            className={`group bg-orange-100/95 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-orange-200/50 hover:bg-orange-200 transition-all duration-300 relative ${moreActionsId === url._id || shareMenuId === url._id || expandedQrId === url._id ? 'z-50' : 'z-0'
              }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Short URL */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Short Link</span>
                  </div>
                  <a
                    href={`${import.meta.env.VITE_BACKEND_URL}/${url.short_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-bold text-orange-600 hover:text-orange-700 hover:underline break-all block"
                  >
                    {import.meta.env.VITE_BACKEND_URL}/{url.short_url}
                  </a>
                </div>

                {/* Original URL */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Original URL</span>
                  </div>
                  <p className="text-sm text-gray-700 truncate" title={url.full_url}>
                    {url.full_url}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 border border-orange-200 rounded-lg">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-sm font-bold text-orange-600">{url.clicks}</span>
                    <span className="text-sm text-gray-600">clicks</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 border border-orange-200 rounded-lg">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">{new Date(url.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions Section - Clean & Modern */}
              <div className="lg:min-w-[320px] lg:max-w-[320px] relative z-10">
                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {url.isLinkPassword && (
                    <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg inline-flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Protected
                    </span>
                  )}
                  {url.expiresAt && new Date(url.expiresAt) < new Date() && (
                    <span className="px-2.5 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded-lg inline-flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Expired
                    </span>
                  )}
                  {url.expiresAt && new Date(url.expiresAt) >= new Date() && (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg inline-flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Expires: {new Date(url.expiresAt).toLocaleDateString()}
                    </span>
                  )}
                  {url.activeFrom && new Date(url.activeFrom) > new Date() && (
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg inline-flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Scheduled
                    </span>
                  )}
                </div>

                {/* Primary Action Buttons - Icon-based */}
                <div className="flex gap-2 relative z-0">
                  {/* Copy Button */}
                  <button
                    onClick={() => copyToClipboard(url.short_url, url._id)}
                    className={`group px-3.5 py-3 rounded-xl transition-all duration-200 flex items-center justify-center ${copiedId === url._id
                      ? 'bg-emerald-500/20 text-emerald-700 border-2 border-emerald-500/40'
                      : 'bg-orange-200/60 text-orange-700 border-2 border-orange-300/50 hover:bg-orange-300/70 hover:border-orange-400/60'
                      }`}
                    title="Copy Link"
                  >
                    {copiedId === url._id ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>

                  {/* Share Button */}
                  <div className="relative z-50" ref={shareMenuId === url._id ? shareMenuRef : null}>
                    <button
                      onClick={() => toggleShareMenu(url._id)}
                      className="group px-3.5 py-3 bg-orange-200/60 text-orange-700 border-2 border-orange-300/50 hover:bg-orange-300/70 hover:border-orange-400/60 rounded-xl transition-all duration-200 flex items-center justify-center"
                      title="Share"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>

                    {/* Share Social Menu */}
                    {shareMenuId === url._id && (
                      <div className="absolute left-0 mt-2 p-2.5 bg-orange-100/95 backdrop-blur-sm rounded-xl shadow-xl border border-orange-200/80"
                        style={{ zIndex: 9999 }}
                      >
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => shareUrl('whatsapp', url.short_url)}
                            className="group p-2 hover:bg-emerald-50/80 rounded-lg text-[#25D366] transition-all border border-orange-100/50 hover:border-emerald-200 flex items-center justify-center"
                            title="Share on WhatsApp"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                          </button>
                          <button
                            onClick={() => shareUrl('twitter', url.short_url)}
                            className="group p-2 hover:bg-gray-50/80 rounded-lg text-black transition-all border border-orange-100/50 hover:border-gray-300 flex items-center justify-center"
                            title="Share on X"
                          >
                            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                          </button>
                          <button
                            onClick={() => shareUrl('linkedin', url.short_url)}
                            className="group p-2 hover:bg-blue-50/80 rounded-lg text-[#0A66C2] transition-all border border-orange-100/50 hover:border-blue-200 flex items-center justify-center"
                            title="Share on LinkedIn"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                          </button>
                          <button
                            onClick={() => shareUrl('facebook', url.short_url)}
                            className="group p-2 hover:bg-blue-50/80 rounded-lg text-[#1877F2] transition-all border border-orange-100/50 hover:border-blue-200 flex items-center justify-center"
                            title="Share on Facebook"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.603-2.797 2.87v1.12h5.306l-1 3.667h-4.306v7.98H9.101z" /></svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* QR Code Button */}
                  {url.qrCode && (
                    <button
                      onClick={() => toggleQrCode(url._id)}
                      className="group px-3.5 py-3 bg-orange-200/60 text-orange-700 border-2 border-orange-300/50 hover:bg-orange-300/70 hover:border-orange-400/60 rounded-xl transition-all duration-200 flex items-center justify-center"
                      title="QR Code"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </button>
                  )}

                  {/* Analytics Button */}
                  <button
                    onClick={() => navigate({ to: '/analytics/$slug', params: { slug: url.short_url } })}
                    className="group px-3.5 py-3 bg-orange-200/60 text-orange-700 border-2 border-orange-300/50 hover:bg-orange-300/70 hover:border-orange-400/60 rounded-xl transition-all duration-200 flex items-center justify-center"
                    title="Analytics"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                    </svg>
                  </button>

                  {/* More Actions Dropdown */}
                  <div className="relative z-50" ref={moreActionsId === url._id ? moreActionsRef : null}>
                    <button
                      onClick={() => setMoreActionsId(moreActionsId === url._id ? null : url._id)}
                      className="group px-3.5 py-3 bg-orange-200/60 text-orange-700 border-2 border-orange-300/50 hover:bg-orange-300/70 hover:border-orange-400/60 rounded-xl transition-all duration-200 flex items-center justify-center"
                      title="More Actions"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {moreActionsId === url._id && (
                      <div className="absolute right-0 mt-2 w-52 bg-orange-100/95 backdrop-blur-sm rounded-xl shadow-2xl border border-orange-200/80 overflow-hidden"
                        style={{ zIndex: 9999 }}
                      >
                        <button
                          onClick={() => {
                            setEditExpirationUrl(url);
                            setMoreActionsId(null);
                          }}
                          className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-orange-200/50 flex items-center gap-3 transition-colors"
                        >
                          <svg className="w-4.5 h-4.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">{url.expiresAt ? 'Edit Expiration' : 'Set Expiration'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setEditPasswordUrl(url);
                            setMoreActionsId(null);
                          }}
                          className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-orange-200/50 flex items-center gap-3 transition-colors border-t border-orange-100/50"
                        >
                          <svg className="w-4.5 h-4.5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span className="text-sm">{url.isLinkPassword ? 'Edit Password' : 'Set Password'}</span>
                        </button>

                        <button
                          onClick={() => {
                            handleDeleteUrl(url._id);
                            setMoreActionsId(null);
                          }}
                          className="w-full px-4 py-3 text-left text-sm font-medium text-orange-600 hover:bg-orange-50/80 flex items-center gap-3 transition-colors border-t border-orange-100/50"
                        >
                          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span className="text-sm">Delete Link</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>



            {/* QR Code Display - Accordion style */}
            {url.qrCode && expandedQrId === url._id && (
              <div className="mt-4 p-5 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-200/80">
                <div className="flex flex-col md:flex-row items-center gap-5">
                  <div className="shrink-0">
                    <div className="p-3 bg-orange-50/60 rounded-xl shadow-md border-2 border-orange-200/70">
                      <img
                        src={url.qrCode}
                        alt="QR Code"
                        className="w-36 h-36 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h4 className="text-base font-bold text-orange-700 mb-1">QR Code</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Scan to access your link
                    </p>

                    {/* QR Actions */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <button
                        onClick={() => downloadQrCode(url.qrCode!, `qrcode-${url.short_url}.png`)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-orange-700 bg-orange-100/80 rounded-xl hover:bg-orange-200/80 transition-all border border-orange-200/70"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                      <button
                        onClick={() => shareQrCode(url.qrCode!)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-orange-700 bg-orange-100/80 rounded-xl hover:bg-orange-200/80 transition-all border border-orange-200/70"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Pagination Controls */}
        {filteredAndSortedUrls.length > itemsPerPage && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white border border-white/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-white font-medium">
              Page {currentPage} of {Math.ceil(filteredAndSortedUrls.length / itemsPerPage)}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredAndSortedUrls.length / itemsPerPage)))}
              disabled={currentPage === Math.ceil(filteredAndSortedUrls.length / itemsPerPage)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white border border-white/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        {/* View All Details Button */}
        {showExternalIcon && (
          <div className="flex justify-center mt-6">
            <a
              href={typeof showExternalIcon === 'string' ? showExternalIcon : '#'}
              className="flex items-center gap-2 text-orange-300 hover:text-white transition-colors"
            >
              <span className="font-semibold">View All</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        )}

        {
          filteredAndSortedUrls.length === 0 && searchTerm && (
            <div className="text-center p-10 bg-orange-100/95 backdrop-blur-lg rounded-3xl shadow-xl border border-orange-200/50">
              <svg className="w-12 h-12 mx-auto mb-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-700 font-semibold">No links found matching "{searchTerm}"</p>
            </div>
          )
        }

        {editExpirationUrl && (
          <EditExpirationModal
            url={editExpirationUrl}
            onClose={() => setEditExpirationUrl(null)}
            onUpdate={(updatedUrl) => {
              setUrls(prev => prev.map(u => u._id === updatedUrl._id ? { ...u, ...updatedUrl } : u));
            }}
          />
        )}

        {editPasswordUrl && (
          <PasswordProtectionModal
            url={editPasswordUrl}
            onClose={() => setEditPasswordUrl(null)}
            onUpdate={(updatedUrl: UrlItem) => {
              setUrls(prev => prev.map(u => u._id === updatedUrl._id ? updatedUrl : u));
            }}
          />
        )}
      </div>
    </div>
  );
};

export default UserUrls;