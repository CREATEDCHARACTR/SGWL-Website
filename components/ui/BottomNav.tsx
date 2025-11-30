import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
    { to: '/dashboard', icon: '📋', label: 'Contracts' },
    { to: '/clients', icon: '👥', label: 'Clients' },
    { to: '/contracts/new', icon: '➕', label: 'New' },
    { to: '/analytics', icon: '📊', label: 'Analytics' },
    { to: '/calendar', icon: '📅', label: 'Calendar' },
];

const BottomNav: React.FC = () => {
    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `flex flex-col items-center justify-center flex-1 p-1 text-xs transition-colors ${
            isActive ? 'text-brand-primary' : 'text-gray-500 dark:text-gray-400'
        }`;

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 z-40 flex items-center justify-around">
            {navItems.map(item => (
                <NavLink key={item.to} to={item.to} className={navLinkClasses}>
                    <span className="text-2xl">{item.icon}</span>
                    <span className="mt-0.5">{item.label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default BottomNav;
