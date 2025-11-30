import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicHeader from './PublicHeader';

const PublicLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <PublicHeader />
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} SaulGOOD WEATHER Lowery. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
