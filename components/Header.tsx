import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import NotificationBell from './ui/NotificationBell';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSearch, onOpenSettings }) => {
  const logoUrl = "https://raw.githubusercontent.com/CREATEDCHARACTR/SaulGOOD-WEATHER-Lowery/68369dded8ed6941e4f334db3e4fcdf2645cbc57/IMG_0036.png";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center px-1 pt-1 border-b-2 text-base font-medium ${isActive
      ? 'border-brand-primary text-gray-900 dark:text-white'
      : 'border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-100'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-gray-900/60 backdrop-blur-lg border-b border-gray-900/10 dark:border-gray-100/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <NavLink to="/dashboard" className="font-serif text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              SGWL.
            </NavLink>
          </div>
          {/* Main navigation is now hidden on mobile */}
          <nav className="hidden md:flex md:space-x-10">
            <NavLink to="/dashboard" className={navLinkClasses}>
              Contracts
            </NavLink>
            <NavLink to="/invoices" className={navLinkClasses}>
              Invoices
            </NavLink>
            <NavLink to="/clients" className={navLinkClasses}>
              Clients
            </NavLink>
            <NavLink to="/analytics" className={navLinkClasses}>
              Analytics
            </NavLink>
            <NavLink to="/galleries" className={navLinkClasses}>
              Galleries
            </NavLink>
            <NavLink to="/calendar" className={navLinkClasses}>
              Calendar
            </NavLink>
            <NavLink to="/emails" className={navLinkClasses}>
              Emails
            </NavLink>
            <NavLink to="/templates" className={navLinkClasses}>
              Templates
            </NavLink>
          </nav>
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
              aria-label="Open search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <NotificationBell />
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
              aria-label="Open settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
            <Link to="/" className="hidden sm:flex items-center ml-2 pl-2 border-l border-gray-200 dark:border-gray-700 hover:opacity-80 transition-opacity" title="Go to Client Home">
              <span className="text-base font-medium text-gray-700 dark:text-gray-300">Saul Lowery</span>
              <img className="ml-3 h-10 w-10 rounded-md object-cover" src={logoUrl} alt="User Logo" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <NavLink to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-gray-100 dark:bg-gray-800 text-brand-primary' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              Contracts
            </NavLink>
            <NavLink to="/invoices" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-gray-100 dark:bg-gray-800 text-brand-primary' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              Invoices
            </NavLink>
            <NavLink to="/clients" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-gray-100 dark:bg-gray-800 text-brand-primary' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              Clients
            </NavLink>
            <NavLink to="/analytics" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-gray-100 dark:bg-gray-800 text-brand-primary' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              Analytics
            </NavLink>
            <NavLink to="/galleries" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-gray-100 dark:bg-gray-800 text-brand-primary' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              Galleries
            </NavLink>
            <NavLink to="/calendar" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-gray-100 dark:bg-gray-800 text-brand-primary' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              Calendar
            </NavLink>
            <NavLink to="/emails" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-gray-100 dark:bg-gray-800 text-brand-primary' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              Emails
            </NavLink>
            <NavLink to="/templates" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-gray-100 dark:bg-gray-800 text-brand-primary' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              Templates
            </NavLink>
          </div>
        </div>
    </header>
  );
};

export default Header;