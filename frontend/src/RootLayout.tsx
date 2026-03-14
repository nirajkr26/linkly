import React from 'react';
import { Outlet, useLocation } from '@tanstack/react-router';
import Navbar from './components/NavBar';
import Footer from './components/Footer';

/**
 * RootLayout defines the global structure of the application.
 * It conditionally renders the Navbar and Footer based on the current route.
 */
const RootLayout: React.FC = () => {
  const location = useLocation();
  
  // Define restricted paths as a read-only array of strings
  const pagesWithoutLayout: string[] = [
    '/auth', 
    '/protected', 
    '/link-not-active', 
    '/link-expired'
  ];

  // Check if current path starts with any of the restricted routes
  const shouldShowLayout: boolean = !pagesWithoutLayout.some((path) => 
    location.pathname.startsWith(path)
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Conditional Rendering of Global Components */}
      {shouldShowLayout && <Navbar />}
      
      <main className="flex-grow">
        {/* Outlet renders the matched child route component */}
        <Outlet />
      </main>
      
      {shouldShowLayout && <Footer />}
    </div>
  );
};

export default RootLayout;