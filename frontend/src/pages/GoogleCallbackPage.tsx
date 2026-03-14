import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useDispatch } from 'react-redux';
import { login } from '../store/slice/authSlice';
import { DotLoader } from 'react-spinners';
import { type AppDispatch } from '../store/store'; // Adjust path to your store file

// --- Interfaces ---

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  // Add any other fields your backend returns
}

interface AuthMeResponse {
  status: string;
  data: {
    user: User;
  };
}

const GoogleCallbackPage: React.FC = () => {
  const navigate = useNavigate();

  // Use the typed AppDispatch if you've defined it in your store setup
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // This page is loaded after successful Google auth
    // The backend sets the cookie, so we need to verify the user
    const verifyAuth = async (): Promise<void> => {
      try {
        // Make a request to get current user info
        const response = await fetch('http://localhost:3000/api/auth/me', {
          credentials: 'include'
        });

        if (response.ok) {
          const result: AuthMeResponse = await response.json();

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