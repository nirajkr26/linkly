import React, { useState } from 'react';
import { RegisterUser } from '../api/User.api';
import { useNavigate } from '@tanstack/react-router';
import { DotLoader } from 'react-spinners';
import GoogleAuthButton from './GoogleAuthButton';

// 1. Define component props
interface RegisterFormProps {
  onSuccess?: (response: any) => void;
  onToggleForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onToggleForm }) => {
  const navigate = useNavigate();

  // 2. State with inferred types
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // 3. Typed Change Event
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // 4. Typed Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await RegisterUser(formData.name, formData.email, formData.password);
      if (onSuccess) onSuccess(response);
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      setError(err.data?.message || err.message || 'Registration failed. Please try again.');
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

      {/* Left Side Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-900 via-red-900 to-gray-800 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-orange-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center text-white max-w-lg">
          <img
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
            alt="Analytics"
            className="w-full max-w-md mx-auto rounded-2xl shadow-2xl mb-8"
          />
          <h1 className="text-4xl font-extrabold mb-6 leading-tight">
            Join <br />
            <span className="text-white text-6xl font-black italic">Linkly</span> <br />
            Today!
          </h1>
          <p className="text-lg text-white/90 font-medium">Create, track, and optimize your links effortlessly.</p>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-orange-100 px-8 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-orange-950 mb-2">Sign Up</h2>
            <p className="text-gray-600 font-semibold">
              Already have an account?{' '}
              <button onClick={onToggleForm} className="text-amber-600 hover:underline">Log In</button>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-orange-50 border border-orange-200 text-orange-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <GoogleAuthButton text="Sign up with Google" />

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-sm text-gray-500 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 transition bg-white"
                placeholder="Enter Your Full Name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 transition bg-white"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 transition bg-white"
                  placeholder="Minimum 8 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-red-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2"
            >
              {isLoading ? <DotLoader size={20} color="#ffffff" /> : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;