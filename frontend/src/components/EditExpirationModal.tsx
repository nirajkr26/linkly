import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DotLoader } from 'react-spinners';
import { updateUrl } from '../api/User.api';

// Define the shape of URL data used by this modal
export interface EditExpirationUrlData {
  _id: string;
  expiresAt?: string;
  [key: string]: unknown;
}

interface EditExpirationModalProps {
  url: EditExpirationUrlData;
  onClose: () => void;
  onUpdate: (updatedUrl: EditExpirationUrlData) => void;
}

const EditExpirationModal: React.FC<EditExpirationModalProps> = ({
  url,
  onClose,
  onUpdate
}) => {
  const [expiresAt, setExpiresAt] = useState<string>(
    url.expiresAt ? new Date(url.expiresAt).toISOString().slice(0, 16) : ''
  );
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
      const payload = {
        expiresAt: expiresAt || null, // Send null to remove expiration
        isExpired: false // Reset status when updating
      };

      const response = await updateUrl(url._id, payload);
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Failed to update expiration:", error);
      alert("Failed to update expiration date.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove the expiration date?")) return;
    setIsLoading(true);
    try {
      const response = await updateUrl(url._id, { expiresAt: null, isExpired: false });
      onUpdate(response.data);
      onClose();
    } catch (error) {
      console.error("Failed to remove expiration:", error);
      alert("Failed to remove expiration.");
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">Set Expiration Date</h3>
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
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Expires On</label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-violet-500 focus:bg-white transition-all duration-200"
              />
              <p className="text-xs text-gray-500">
                The link will stop working after this date.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              {url.expiresAt && (
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  Remove
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 shadow-lg hover:shadow-violet-500/30 transition-all duration-200 disabled:opacity-50 flex justify-center items-center"
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

export default EditExpirationModal;