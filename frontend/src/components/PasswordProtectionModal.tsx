import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DotLoader } from 'react-spinners';
import { updateUrl } from '../api/User.api';

// 1. Define the shape of your URL object
interface UrlData {
  _id: string;
  isLinkPassword?: boolean;
  [key: string]: unknown;
}

interface PasswordProtectionModalProps {
  url: UrlData;
  onClose: () => void;
  onUpdate: (updatedUrl: any) => void;
}

// 2. Define the payload structure for the API
interface UpdatePasswordPayload {
  isLinkPassword: boolean;
  password?: string;
}

const PasswordProtectionModal: React.FC<PasswordProtectionModalProps> = ({
  url,
  onClose,
  onUpdate
}) => {
  const [isLinkPassword, setIsLinkPassword] = useState<boolean>(url.isLinkPassword || false);
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Disable scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Re-enable scroll when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: UpdatePasswordPayload = {
        isLinkPassword
      };

      if (isLinkPassword) {
        // Validation: If protection is being enabled for the first time, password is required
        if (!url.isLinkPassword && !password) {
          alert("Please enter a password.");
          setIsLoading(false);
          return;
        }

        // Add password to payload if user provided a new one
        if (password) {
          payload.password = password;
        }
      }

      const response = await updateUrl(url._id, payload);
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Failed to update password protection:", error);
      alert("Failed to update password protection.");
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Password Protection</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-100">
              <span className="font-semibold text-gray-700">Enable Password</span>
              <button
                type="button"
                onClick={() => setIsLinkPassword(!isLinkPassword)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${isLinkPassword ? 'bg-orange-600' : 'bg-gray-200'
                  }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isLinkPassword ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            {isLinkPassword && (
              <div className="space-y-2 animate-in slide-in-from-top-2 fade-in">
                <label className="block text-sm font-semibold text-gray-700">Set Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={url.isLinkPassword ? "Enter new password to change" : "Enter password"}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white transition-all duration-200"
                />
                <p className="text-xs text-gray-500">
                  Visitors will need this password to access the link.
                </p>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 shadow-lg hover:shadow-orange-500/30 transition-all duration-200 disabled:opacity-50 flex justify-center items-center"
              >
                {isLoading ? <DotLoader size={20} color="#ffffff" /> : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PasswordProtectionModal;