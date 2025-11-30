import React, { useEffect, useState } from 'react';
import { exchangeCodeForTokens } from '../services/googleCalendar';
import Card from '../components/ui/Card';

interface CalendarCallbackPageProps {
  code: string;
  onSuccess: () => void;
}

const CalendarCallbackPage: React.FC<CalendarCallbackPageProps> = ({ code, onSuccess }) => {
    const [status, setStatus] = useState('Connecting to Google Calendar...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleCallback = async () => {
            const params = new URLSearchParams(window.location.search);
            const errorParam = params.get('error');

            if (errorParam) {
                setError(`Google authentication failed: ${errorParam}`);
                setStatus('Authentication Failed');
                return;
            }

            if (!code) {
                setError('Authorization code not found. Please try again.');
                setStatus('Authentication Failed');
                return;
            }

            // This function simulates calling a secure backend to exchange the code for tokens.
            const result = await exchangeCodeForTokens(code);

            if (result.success) {
                setStatus('Successfully connected! Redirecting...');
                // Wait a moment for the user to see the message, then call the success handler.
                setTimeout(() => {
                    onSuccess();
                }, 1000);
            } else {
                setError(result.error || 'An unknown error occurred during token exchange.');
                setStatus('Authentication Failed');
            }
        };

        handleCallback();
    }, [code, onSuccess]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-brand-secondary dark:bg-gray-900">
            <Card className="max-w-md w-full">
                <div className="p-8 text-center">
                     <h1 className="text-2xl font-bold mb-4 dark:text-white">{status}</h1>
                    {error ? (
                        <>
                            <p className="text-red-500">{error}</p>
                            <a href="/#/calendar" className="mt-4 inline-block text-brand-primary hover:underline">Return to Calendar</a>
                        </>
                    ) : (
                         <div className="flex justify-center items-center">
                            <svg className="animate-spin h-8 w-8 text-brand-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default CalendarCallbackPage;
