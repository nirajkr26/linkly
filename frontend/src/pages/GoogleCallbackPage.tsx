import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useDispatch } from 'react-redux';
import { login } from '../store/slice/authSlice';
import { DotLoader } from 'react-spinners';
import { type AppDispatch } from '../store/store';
import { getCurrentUser } from '../api/User.api';

const GoogleCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const verifyAuth = async (): Promise<void> => {
      try {
        // Use the existing API service which uses the correct VITE_BACKEND_URL
        const result = await getCurrentUser();

        if (result.isSuccess && result.data?.user) {
          // Dispatch the user data to Redux
          dispatch(login(result.data.user));

          // Redirect to dashboard
          navigate({ to: '/dashboard' });
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        console.error('Google auth callback error:', error);
        // Redirect back to login on failure
        navigate({ to: '/auth', search: { mode: 'login' } });
      }
    };

    verifyAuth();
  }, [navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-red-50">
      <div className="text-center">
        <DotLoader color="#4F46E5" size={60} />
        <p className="mt-6 text-lg text-gray-600 font-semibold">
          Completing authentication...
        </p>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;