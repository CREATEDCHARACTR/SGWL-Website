import React, { useState, useEffect, useCallback } from 'react';
import { Client, Contract, Session, SessionStatus } from '../types';
import { fetchSessionsByClientId, createSession, updateSession, deleteSession } from '../services/geminiService';
import { createGoogleCalendarEvent } from '../services/googleCalendar';
import Button from './ui/Button';
import Card from './ui/Card';
import ScheduleSessionModal from './ui/ScheduleSessionModal';
import { Link } from 'react-router-dom';

// Helper function to check auth status from localStorage
const isGoogleAuthenticated = () => !!localStorage.getItem('google_auth_token');

interface ClientSessionsListProps {
    client: Client;
    contracts: Contract[];
}

const SessionCard: React.FC<{ session: Session }> = ({ session }) => {
    const { sessionDetails, status } = session;
    const startTime = new Date(sessionDetails.dateTime);
    const endTime = new Date(startTime.getTime() + sessionDetails.duration * 60000);

    const formatDate = (date: Date) => date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    const formatTime = (date: Date) => date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    const statusColors: Record<SessionStatus, string> = {
        [SessionStatus.CONFIRMED]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        [SessionStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        [SessionStatus.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        [SessionStatus.COMPLETED]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };

    return (
        <Card className="p-4">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-bold text-lg dark:text-white">📸 {sessionDetails.type}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{formatDate(startTime)} &bull; {formatTime(startTime)} - {formatTime(endTime)}</p>
                    <p className="text-gray-500 dark:text-gray-300">📍 {sessionDetails.location}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status]}`}>{status}</span>
            </div>
            <div className="mt-4 pt-3 border-t dark:border-gray-700 flex justify-end space-x-2">
                <Button variant="secondary" className="!text-sm !py-1 !px-3">View Details</Button>
            </div>
        </Card>
    );
};

const ClientSessionsList: React.FC<ClientSessionsListProps> = ({ client, contracts }) => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadSessions = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedSessions = await fetchSessionsByClientId(client.id);
            fetchedSessions.sort((a, b) => new Date(b.sessionDetails.dateTime).getTime() - new Date(a.sessionDetails.dateTime).getTime());
            setSessions(fetchedSessions);
        } catch (error) {
            console.error("Failed to load sessions:", error);
        } finally {
            setIsLoading(false);
        }
    }, [client.id]);

    useEffect(() => {
        loadSessions();
    }, [loadSessions]);

    const handleScheduleSession = async (formData: Omit<Session, 'id' | 'clientId' | 'clientName' | 'clientEmail' | 'meta' | 'status'>) => {
        const now = new Date().toISOString();
        const sessionData: Omit<Session, 'id'> = {
            clientId: client.id,
            clientName: client.personalInfo.name,
            clientEmail: client.personalInfo.email,
            ...formData,
            status: SessionStatus.CONFIRMED,
            meta: {
                createdAt: now,
                updatedAt: now,
                createdBy: 'Saul Lowery' // Placeholder
            }
        };

        try {
            const newSession = await createSession(sessionData);
            
            if (isGoogleAuthenticated()) {
                // With a real backend, you would now call your backend API to create the calendar event.
                // The backend would use the stored tokens to make the authenticated request to Google.
                const googleEvent = await createGoogleCalendarEvent(newSession);
                await updateSession(newSession.id, {
                    googleCalendar: {
                        eventId: googleEvent.id,
                        eventUrl: googleEvent.htmlLink,
                        inviteSent: true,
                        inviteSentAt: new Date().toISOString()
                    }
                });
            }

            await loadSessions(); // Refresh list
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to create session:", error);
            // TODO: Show error to user
        }
    };

    const upcomingSessions = sessions.filter(s => s.status === SessionStatus.CONFIRMED || s.status === SessionStatus.PENDING);
    const completedSessions = sessions.filter(s => s.status === SessionStatus.COMPLETED || s.status === SessionStatus.CANCELLED);

    if (isLoading) {
        return <div className="text-center p-8 text-gray-500">Loading sessions...</div>;
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Upcoming Sessions ({upcomingSessions.length})</h3>
                    <Button onClick={() => setIsModalOpen(true)}>+ Schedule Session</Button>
                </div>
                {upcomingSessions.length > 0 ? (
                    <div className="space-y-4">
                        {upcomingSessions.map(s => <SessionCard key={s.id} session={s} />)}
                    </div>
                ) : <p className="text-gray-500">No upcoming sessions.</p>}
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white pt-6 border-t dark:border-gray-700">Past Sessions ({completedSessions.length})</h3>
                {completedSessions.length > 0 ? (
                    <div className="space-y-4">
                        {completedSessions.map(s => <SessionCard key={s.id} session={s} />)}
                    </div>
                ) : <p className="text-gray-500">No past sessions.</p>}

            </div>
            {isModalOpen && (
                <ScheduleSessionModal
                    client={client}
                    contracts={contracts}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleScheduleSession}
                />
            )}
        </>
    );
};

export default ClientSessionsList;