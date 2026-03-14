import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slice/authSlice';
import { LogoutUser } from '../api/User.api';
import type { RootState } from '../store/store';

const NavBar: React.FC = () => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);

  const dispatch = useDispatch();

  // Use RootState to get full type safety on the auth slice
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // User data is stored directly (not nested)
  const userData = user;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (profileDropdownOpen && !target.closest('.profile-dropdown-container')) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdownOpen]);

  const handleLogout = async (): Promise<void> => {
    try {
      localStorage.removeItem('authState');
      await LogoutUser();
    } catch (error) {
      console.error('Logout API failed:', error);
    }

    dispatch(logout());
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);

    // Force refresh ensures all cache and memory-leaked states are purged
    window.location.href = '/';
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-violet-950/90 backdrop-blur-md py-4' : 'bg-transparent py-6'
      }`}>
      <div className="max-w-15xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center gap-2 group"
          >
            <img
              src="/logo2.png"
              alt="Linkly"
              className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-white/80 hover:text-white font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <div className="relative profile-dropdown-container">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                  >
                    {userData?.avatar ? (
                      <img
                        src={userData.avatar}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-inner">
                        {userData?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="text-white font-medium text-sm">
                      {userData?.name || 'User'}
                    </span>
                    <svg
                      className={`w-4 h-4 text-white/60 transition-transform duration-300 ${profileDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-violet-100/95 backdrop-blur-lg rounded-xl shadow-xl border border-violet-200/50 overflow-hidden origin-top-right">
                      <div className="p-4 border-b border-violet-200/50 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {userData?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {userData?.email}
                          </p>
                        </div>
                      </div>
                      <div className="p-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-violet-600 hover:bg-violet-200/50 rounded-lg transition-colors font-medium"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  search={{ mode: 'login' }}
                  className="relative text-white/70 hover:text-white font-medium transition-colors group"
                >
                  Log In
                </Link>
                <Link
                  to="/auth"
                  search={{ mode: 'signup' }}
                  className="px-5 py-2.5 text-sm font-semibold text-violet-900 bg-violet-100 hover:bg-violet-200 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/80 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;