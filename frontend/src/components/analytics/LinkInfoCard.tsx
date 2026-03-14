import React from 'react';
import { Lock, Clock, AlertCircle, ExternalLink, Copy } from 'lucide-react';

// 1. Define the Link structure
export interface LinkData {
  _id: string;
  shortUrl: string;
  originalUrl?: string;
  full_url?: string; // Supporting both naming conventions
  isPasswordProtected?: boolean;
  expiresAt?: string | Date;
  activeFrom?: string | Date;
  createdAt: string | Date;
}

interface LinkInfoCardProps {
  link: LinkData;
}

const LinkInfoCard: React.FC<LinkInfoCardProps> = ({ link }) => {
  // 2. Derive states with Type Safety
  const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date();
  const isScheduled = link.activeFrom && new Date(link.activeFrom) > new Date();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const fullShortUrl = `${backendUrl}/${link.shortUrl}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullShortUrl);
      // Optional: Trigger a success toast here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 shadow-xl h-full">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <ExternalLink className="w-5 h-5 text-violet-400" />
        Link Details
      </h3>

      <div className="space-y-6">
        {/* URLs Section */}
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Short Link</label>
            <div className="flex items-center gap-2 bg-black/20 p-3 rounded-lg border border-white/5 group relative">
              <span className="text-violet-300 font-mono text-sm truncate flex-1">
                {fullShortUrl}
              </span>
              <button
                onClick={copyToClipboard}
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Original Destination</label>
            <div className="bg-black/20 p-3 rounded-lg border border-white/5">
              <p className="text-gray-300 text-sm break-all line-clamp-2" title={link.originalUrl || link.full_url}>
                {link.originalUrl || link.full_url}
              </p>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/10" />

        {/* Status Indicators */}
        <div className="space-y-3">
          <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Status & Protection</label>

          {/* Password Protection */}
          <div className={`flex items-center gap-3 p-3 rounded-lg border ${link.isPasswordProtected
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-200'
              : 'bg-white/5 border-white/5 text-gray-400'
            }`}>
            <Lock className={`w-5 h-5 ${link.isPasswordProtected ? 'text-amber-400' : 'text-gray-500'}`} />
            <div className="flex-1">
              <p className="text-sm font-medium">
                {link.isPasswordProtected ? 'Password Protected' : 'No Password Protection'}
              </p>
            </div>
          </div>

          {/* Expiration Status */}
          {link.expiresAt && (
            <div className={`flex items-center gap-3 p-3 rounded-lg border ${isExpired
                ? 'bg-red-500/10 border-red-500/20 text-red-200'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200'
              }`}>
              <AlertCircle className={`w-5 h-5 ${isExpired ? 'text-red-400' : 'text-emerald-400'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium">{isExpired ? 'Expired' : 'Active'}</p>
                <p className="text-xs opacity-70">
                  {isExpired
                    ? `Expired on ${new Date(link.expiresAt).toLocaleDateString()}`
                    : `Expires on ${new Date(link.expiresAt).toLocaleDateString()}`}
                </p>
              </div>
            </div>
          )}

          {/* Scheduled Status */}
          {link.activeFrom && (
            <div className={`flex items-center gap-3 p-3 rounded-lg border ${isScheduled
                ? 'bg-blue-500/10 border-blue-500/20 text-blue-200'
                : 'bg-white/5 border-white/5 text-gray-400'
              }`}>
              <Clock className={`w-5 h-5 ${isScheduled ? 'text-blue-400' : 'text-gray-500'}`} />
              <div className="flex-1">
                <p className="text-sm font-medium">{isScheduled ? 'Scheduled' : 'Active'}</p>
                <p className="text-xs opacity-70">
                  {isScheduled
                    ? `Starts ${new Date(link.activeFrom).toLocaleString()}`
                    : `Active since ${new Date(link.activeFrom).toLocaleDateString()}`}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center pt-2">
          Created on {new Date(link.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default LinkInfoCard;