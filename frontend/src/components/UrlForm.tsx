import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { DotLoader } from 'react-spinners';

// 1. Define types for Redux and Props
interface RootState {
  auth: {
    isAuthenticated: boolean;
  };
}

interface UrlFormProps {
  onSuccess?: () => void;
}

// 2. Define the expected API Response
interface CreateUrlResponse {
  shortUrl: string;
  qrCode?: string;
  [key: string]: any;
}

const UrlForm: React.FC<UrlFormProps> = ({ onSuccess }) => {
  const [url, setUrl] = useState<string>("https://www.google.com");
  const [customSlug, setCustomSlug] = useState<string>("");
  const [shortUrl, setShortUrl] = useState<string>("");
  const [qrCode, setQrCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [showQrCode, setShowQrCode] = useState<boolean>(false);

  const [showCustomSlug, setShowCustomSlug] = useState<boolean>(false);
  const [showScheduleActivation, setShowScheduleActivation] = useState<boolean>(false);
  const [activeFrom, setActiveFrom] = useState<string>("");

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // 3. Typed Download Logic
  const downloadQrCode = async (qrUrl: string, filename: string): Promise<void> => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  // 4. Typed Web Share API Logic
  const shareQrCode = async (qrUrl: string): Promise<void> => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setShowQrCode(false);

    try {
      const payload: { url: string; slug?: string; activeFrom?: string } = { url };

      if (customSlug?.trim()) {
        payload.slug = customSlug.trim();
      }
      if (activeFrom) {
        payload.activeFrom = activeFrom;
      }

      const { data } = await axios.post<CreateUrlResponse | string>(
        `${import.meta.env.VITE_BACKEND_URL}/api/create`,
        payload,
        { withCredentials: true }
      );

      if (typeof data === 'string') {
        setShortUrl(data);
        setQrCode("");
      } else {
        setShortUrl(data.shortUrl);
        setQrCode(data.qrCode || "");
      }

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error shortening URL:', error);
      alert(error.response?.data?.message || 'Failed to shorten URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (): Promise<void> => {
    await navigator.clipboard.writeText(shortUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* URL Input */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your long link here..."
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-orange-100 rounded-2xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100/50 transition-all duration-300 font-medium text-gray-700 shadow-sm"
            required
          />
        </div>

        {/* Feature Toggles */}
        {isAuthenticated && (
          <div className="space-y-4">
            {/* Custom Slug */}
            <div>
              <button
                type="button"
                onClick={() => setShowCustomSlug(!showCustomSlug)}
                className="flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-800 transition-colors"
              >
                <svg className={`w-4 h-4 transition-transform ${showCustomSlug ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Customize link (Optional)
              </button>
              {showCustomSlug && (
                <div className="mt-2 animate-in slide-in-from-top-1 duration-200">
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    placeholder="custom-alias"
                    className="w-full pl-4 pr-4 py-3 bg-white border-2 border-orange-100 rounded-xl outline-none focus:border-orange-500 transition-all text-sm"
                  />
                </div>
              )}
            </div>

            {/* Schedule */}
            <div>
              <button
                type="button"
                onClick={() => setShowScheduleActivation(!showScheduleActivation)}
                className="flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-800 transition-colors"
              >
                <svg className={`w-4 h-4 transition-transform ${showScheduleActivation ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Schedule Activation (Optional)
              </button>
              {showScheduleActivation && (
                <div className="mt-2 animate-in slide-in-from-top-1 duration-200">
                  <input
                    type="datetime-local"
                    value={activeFrom}
                    onChange={(e) => setActiveFrom(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-orange-100 rounded-xl outline-none focus:border-orange-500 transition-all text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isLoading ? <DotLoader size={24} color="#ffffff" /> : <span>Shorten Now</span>}
        </button>

        {/* Result Card */}
        {shortUrl && (
          <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white border border-orange-100 rounded-2xl p-5 shadow-xl">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Your link is ready</p>
              <div className="flex flex-col sm:flex-row items-center gap-3 bg-orange-50 rounded-xl p-2">
                <div className="flex-1 w-full min-w-0 px-2 truncate">
                  <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="text-orange-700 font-bold hover:underline text-lg">
                    {shortUrl}
                  </a>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCopy} className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${isCopied ? 'bg-green-500 text-white' : 'bg-white border text-gray-700'}`}>
                    {isCopied ? 'Copied!' : 'Copy'}
                  </button>
                  {qrCode && isAuthenticated && (
                    <button onClick={() => setShowQrCode(!showQrCode)} className="p-2 rounded-lg border bg-white">
                      QR
                    </button>
                  )}
                </div>
              </div>

              {showQrCode && qrCode && (
                <div className="mt-4 flex flex-col items-center animate-in fade-in">
                  <img src={qrCode} alt="QR Code" className="w-32 h-32 border p-2 bg-white rounded-lg" />
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => downloadQrCode(qrCode, 'linkly-qr.png')}
                      className="text-xs font-bold text-orange-600 uppercase"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => shareQrCode(qrCode)}
                      className="text-xs font-bold text-orange-600 uppercase"
                    >
                      Share
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default UrlForm;
