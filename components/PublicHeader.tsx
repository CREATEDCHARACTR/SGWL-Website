import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const PublicHeader: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `text-base font-medium transition-colors ${isActive
            ? 'text-brand-primary dark:text-brand-accent'
            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
        }`;

    const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `block py-3 px-4 text-lg font-medium transition-colors rounded-lg ${isActive
            ? 'text-brand-primary dark:text-brand-accent bg-brand-primary/10'
            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`;

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className="sticky top-0 z-header bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20 md:h-24">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <NavLink to="/" className="text-2xl font-serif font-bold text-gray-900 dark:text-white tracking-tight">
                            <img src="/assets/logo-light-mode.png" alt="SGWL" className="h-16 md:h-20 w-auto dark:hidden" />
                            <img src="/assets/logo-dark-mode.png" alt="SGWL" className="h-16 md:h-20 w-auto hidden dark:block" />
                        </NavLink>
                    </div>

                    {/* Desktop Navigation */}
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

                    {/* Desktop Right Side Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <NavLink
                            to="/login"
                            className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        >
                            Login
                        </NavLink>
                        <NavLink
                            to="/contact"
                            className="px-4 py-2 rounded-full bg-brand-primary text-white text-sm font-semibold hover:bg-brand-primary/90 transition shadow-md"
                        >
                            Book Now
                        </NavLink>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Toggle mobile menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? (
                            // X icon
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            // Hamburger icon
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Slide Down */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <nav className="px-4 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 space-y-1">
                    <NavLink to="/" className={mobileNavLinkClasses} end onClick={closeMobileMenu}>
                        Home
                    </NavLink>
                    <NavLink to="/about" className={mobileNavLinkClasses} onClick={closeMobileMenu}>
                        About
                    </NavLink>
                    <NavLink to="/portfolio" className={mobileNavLinkClasses} onClick={closeMobileMenu}>
                        Portfolio
                    </NavLink>
                    <NavLink to="/contact" className={mobileNavLinkClasses} onClick={closeMobileMenu}>
                        Contact
                    </NavLink>
                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        <NavLink
                            to="/login"
                            className="block py-3 px-4 text-center text-gray-600 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={closeMobileMenu}
                        >
                            Login
                        </NavLink>
                        <NavLink
                            to="/contact"
                            className="block py-3 px-4 text-center bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary/90 transition"
                            onClick={closeMobileMenu}
                        >
                            Book Now
                        </NavLink>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default PublicHeader;

