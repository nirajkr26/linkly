import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from '@tanstack/react-router';
import { DotLoader } from 'react-spinners';
import { LoginUser } from '../api/User.api';
import { login } from '../store/slice/authSlice';
import GoogleAuthButton from './GoogleAuthButton';

interface LoginFormProps {
  onSuccess?: (data: any) => void;
  onToggleForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Type the change event for HTML Input elements
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await LoginUser(formData.email, formData.password);

      // Assuming your API returns { data: { user: UserObject } }
      dispatch(login(response.data.user));

      // Type-safe navigation
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      setError(err.data?.message || err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Back Button */}
      <button
        onClick={() => navigate({ to: '/' })}
        className="absolute top-6 right-6 z-50 flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-500 hover:text-amber-600 bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-amber-400 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      {/* Left Side - Welcome Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-900 via-red-900 to-gray-800 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-orange-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center text-white max-w-lg">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"
            alt="Illustration"
            className="w-full max-w-md mx-auto rounded-2xl shadow-2xl mb-8"
          />
          <h1 className="text-5xl font-extrabold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-red-200 to-amber-200">
              Welcome to
            </span>
            <br />
            <span className="text-white text-6xl font-black" style={{ fontFamily: 'cursive' }}>
              Linkly!
            </span>
          </h1>
          <p className="text-lg text-white/90 font-medium">Shorten links, expand reach.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-orange-100 px-8 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-orange-950 mb-4">Log In</h2>
            <p className="text-gray-600 font-semibold text-xl">
              Don't have an account?{' '}
              <button
                onClick={onToggleForm}
                className="text-amber-600 hover:text-red-700 font-semibold underline"
              >
                Sign Up
              </button>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <GoogleAuthButton text="Log in with Google" />

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-orange-50 outline-none"
                placeholder="Enter Email Address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 bg-orange-50 outline-none"
                  placeholder="Enter Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-red-600 text-white font-semibold rounded-lg hover:from-amber-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <DotLoader size={20} color="#ffffff" /> : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;