import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Notification, NotificationType } from '../../types';
import { fetchNotifications, markAllNotificationsAsRead, deleteAllNotifications } from '../../services/db';
import { formatDistanceToNow } from 'date-fns';
import ConfirmationModal from './ConfirmationModal';

const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
        case NotificationType.CONTRACT_UNSIGNED:
            return <span className="text-red-500">🔴</span>;
        case NotificationType.CLIENT_UNCONTACTED:
            return <span className="text-blue-500">❄️</span>;
        case NotificationType.STATUS_CHANGE_SUGGESTION:
            return <span className="text-yellow-500">💡</span>;
        case NotificationType.REVISION_REQUESTED:
            return <span className="text-orange-500">📝</span>;
        default:
            return '🔔';
    }
};

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    return (
        <div className={`p-3 border-l-4 ${notification.isRead ? 'border-transparent' : 'border-brand-primary bg-blue-50 dark:bg-blue-900/20'}`}>
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 pt-1">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1">
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{notification.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
                    <div className="mt-2 flex items-center justify-between">
                        <div className="space-x-2">
                            {notification.clientId && <Link to={`/clients/${notification.clientId}`} className="text-sm font-semibold text-brand-primary hover:underline">View Client</Link>}
                            {notification.contractId && <Link to={`/contracts/${notification.contractId}`} className="text-sm font-semibold text-brand-primary hover:underline">View Contract</Link>}
                        </div>
                        <p className="text-xs text-gray-400">{formatDistanceToNow(new Date(notification.createdAt))} ago</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NotificationBell: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isClearing, setIsClearing] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const [isAnimating, setIsAnimating] = useState(false);
    const prevUnreadCountRef = useRef(0);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        if (unreadCount > prevUnreadCountRef.current) {
            setIsAnimating(true);
            const timer = setTimeout(() => setIsAnimating(false), 4000);
            return () => clearTimeout(timer);
        }
        prevUnreadCountRef.current = unreadCount;
    }, [unreadCount]);

    const loadNotifications = async () => {
        if (isClearing) return; // Don't reload while clearing
        const fetched = await fetchNotifications();
        setNotifications(fetched);
    };

    useEffect(() => {
        loadNotifications();
        intervalRef.current = setInterval(loadNotifications, 60000); // Refresh every minute
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isClearing]); // Re-setup interval when isClearing changes

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAllRead = async () => {
        await markAllNotificationsAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const handleClearAll = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isClearing) {
            return;
        }

        setShowClearConfirm(true);
    };

    const handleConfirmClear = async () => {
        setShowClearConfirm(false);
        setIsClearing(true);

        try {
            // Stop the auto-refresh interval
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

            await deleteAllNotifications();
            setNotifications([]);
            setIsOpen(false);

            // Restart interval after a delay
            setTimeout(() => {
                intervalRef.current = setInterval(loadNotifications, 60000);
            }, 500);

        } catch (error) {
            console.error("Failed to clear notifications:", error);
            alert(`Failed to clear notifications: ${error instanceof Error ? error.message : 'Unknown error'}`);
            intervalRef.current = setInterval(loadNotifications, 60000);
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 focus:outline-none ${isAnimating ? 'animate-notification-bell' : ''}`}
                aria-label="Toggle notifications"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center ring-2 ring-white dark:ring-gray-900">
                        {unreadCount}
                    </span>
                )}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border dark:border-gray-700 z-50 overflow-hidden">
                    <div className="p-3 flex justify-between items-center border-b dark:border-gray-700">
                        <h3 className="font-bold text-gray-800 dark:text-white">Notifications ({unreadCount})</h3>
                        <div className="flex items-center gap-2">
                            <button onClick={handleMarkAllRead} className="text-sm text-brand-primary hover:underline" disabled={unreadCount === 0}>
                                Mark All Read
                            </button>
                            {notifications.length > 0 && (
                                <button
                                    onClick={handleClearAll}
                                    className="text-sm text-red-600 hover:underline dark:text-red-400 disabled:opacity-50"
                                    disabled={isClearing}
                                >
                                    {isClearing ? 'Clearing...' : 'Clear All'}
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="divide-y dark:divide-gray-700">
                                {notifications.map(n => <NotificationItem key={n.id} notification={n} />)}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">You're all caught up!</p>
                        )}
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={showClearConfirm}
                onClose={() => setShowClearConfirm(false)}
                onConfirm={handleConfirmClear}
                title="Clear All Notifications"
                message="Are you sure you want to delete all notifications? This cannot be undone."
                confirmButtonText="Clear All"
                confirmButtonVariant="danger"
            />
        </div>
    );
};

export default NotificationBell;
