import React from 'react';
import { NavLink } from 'react-router-dom';

const PublicHeader: React.FC = () => {
    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `text-base font-medium transition-colors ${isActive
            ? 'text-brand-primary dark:text-brand-accent'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
        }`;

    return (
        <header className="sticky top-0 z-header bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-24">
                    <div className="flex-shrink-0">
                        <NavLink to="/" className="text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">
                            {/* Logo for Light Mode (hidden in dark mode) */}
                            <img src="/assets/logo-light-mode.png" alt="SGWL" className="h-20 w-auto dark:hidden" />
                            {/* Logo for Dark Mode (hidden in light mode) */}
                            <img src="/assets/logo-dark-mode.png" alt="SGWL" className="h-20 w-auto hidden dark:block" />
                        </NavLink>
                    </div>
                    <nav className="hidden md:flex space-x-8">
                        <NavLink to="/" className={navLinkClasses} end>
                            Home
                        </NavLink>
                        <NavLink to="/about" className={navLinkClasses}>
                            About
                        </NavLink>
                        <NavLink to="/portfolio" className={navLinkClasses}>
                            Portfolio
                        </NavLink>
                        <NavLink to="/contact" className={navLinkClasses}>
                            Contact
                        </NavLink>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <NavLink
                            to="/login"
                            className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                            Client Login
                        </NavLink>
                        <NavLink
                            to="/contact"
                            className="px-4 py-2 rounded-full bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primary/90 transition shadow-md"
                        >
                            Book Now
                        </NavLink>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default PublicHeader;
