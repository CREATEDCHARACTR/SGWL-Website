import React, { useState, useEffect, useCallback } from 'react';
import { getGoogleAuthUrl } from '../services/googleCalendar';
import { fetchAllSessions } from '../services/geminiService';
import { Session } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import CalendarView from '../components/CalendarView';

const CalendarPage: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sessions, setSessions] = useState<Session[]>([]);

    const checkAuthStatus = useCallback(() => {
        const token = localStorage.getItem('google_auth_token');
        if (token) {
            // In a real app, you would also check if the token is expired and use a refresh token flow.
            setIsAuthenticated(true);
            return true;
        }
        setIsAuthenticated(false);
        return false;
    }, []);

    useEffect(() => {
        if (checkAuthStatus()) {
            loadSessions();
        }
    }, [checkAuthStatus]);

    const loadSessions = async () => {
        try {
            const fetchedSessions = await fetchAllSessions();
            setSessions(fetchedSessions);
        } catch (error) {
            console.error("Failed to load sessions:", error);
        }
    };
    
    const handleConnect = () => {
        // Redirect the user to the Google consent screen.
        window.location.href = getGoogleAuthUrl();
    };
    
    const handleDisconnect = () => {
        // Clear the local authentication flag.
        localStorage.removeItem('google_auth_token');
        setIsAuthenticated(false);
        setSessions([]);
    };

    const renderAuthView = () => (
        <Card>
            <div className="p-8 text-center">
                <h2 className="text-3xl font-bold mb-4 dark:text-white">📅 Calendar Integration</h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
                    Connect your Google Calendar to automatically schedule sessions, send invites to clients, and see all your bookings in one place.
                </p>
                <ul className="text-left max-w-md mx-auto space-y-2 mb-8 list-disc list-inside">
                    <li>✓ Schedule sessions directly from client profiles</li>
                    <li>✓ Send automatic calendar invites with event details</li>
                    <li>✓ View your upcoming schedule by month, week, or day</li>
                    <li>✓ Get automated session reminders</li>
                </ul>
                <Button onClick={handleConnect} className="text-lg">
                    🔗 Connect Google Calendar
                </Button>
                <p className="text-xs text-gray-500 mt-4">
                    You will be redirected to Google to grant permission.
                </p>
            </div>
        </Card>
    );

    const renderCalendarView = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h1 className="text-4xl font-bold text-gray-900 dark:text-white">📅 My Schedule</h1>
                 <Button variant="secondary" onClick={handleDisconnect}>Disconnect Calendar</Button>
            </div>
            <CalendarView sessions={sessions} />
        </div>
    );
    
    return (
        <div>
            {isAuthenticated ? renderCalendarView() : renderAuthView()}
        </div>
    );
};

export default CalendarPage;