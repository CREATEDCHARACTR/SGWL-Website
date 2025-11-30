import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchClients, createClient, fetchNotifications, createNotification, deleteContract, deleteClient } from '../services/geminiService';
import { Client, ReferralSource, ClientStatus, NotificationType } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import AddClientModal from './ui/AddClientModal';
import Skeleton from './ui/Skeleton';
import ConfirmationModal from './ui/ConfirmationModal';

const getStatusBadgeColor = (status: ClientStatus) => {
    switch (status) {
        case ClientStatus.HOT: return 'bg-[#EF476F]/20 text-[#EF476F]';
        case ClientStatus.ACTIVE: return 'bg-green-500/20 text-green-500';
        case ClientStatus.COLD: return 'bg-[#4c9aff]/20 text-[#4c9aff]';
        case ClientStatus.DO_NOT_WORK_WITH: return 'bg-red-700/20 text-red-700';
        default: return 'bg-gray-400/20 text-gray-500';
    }
};


const ClientCard: React.FC<{ client: Client, isSelected: boolean, onSelect: (id: string) => void }> = ({ client, isSelected, onSelect }) => {
    const totalRevenue = client.businessInfo.totalRevenue || 0;

    const isSubscription = totalRevenue < 1000 && client.businessInfo.contractCount > 0;
    const revenueText = isSubscription
        ? `$${totalRevenue.toLocaleString()}/mo`
        : `$${totalRevenue.toLocaleString()}`;

    return (
        <Card className={`flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-1 ${isSelected ? 'ring-2 ring-brand-primary' : ''}`}>
            <div className="p-6 relative">
                <div className="absolute top-4 right-4">
                    <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-brand-primary focus:ring-brand-primary"
                        checked={isSelected}
                        onChange={() => onSelect(client.id)}
                        aria-label={`Select client ${client.personalInfo.name}`}
                    />
                </div>
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white pr-8">{client.personalInfo.name}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(client.status)}`}>
                        {client.status}
                    </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-1">{client.personalInfo.email} &bull; {client.personalInfo.phone || 'No phone'}</p>
                <div className="mt-4 text-gray-700 dark:text-gray-200 flex items-center gap-4 text-sm">
                    <span>📋 {client.businessInfo.contractCount} contract{client.businessInfo.contractCount !== 1 && 's'}</span>
                    <span>💰 {revenueText} total</span>
                    <span>📍 {client.personalInfo.location || 'N/A'}</span>
                </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 rounded-b-2xl">
                <Link to={`/clients/${client.id}`} className="text-brand-primary font-semibold hover:underline">
                    View Profile
                </Link>
            </div>
        </Card>
    );
};

const ClientList: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<'all' | ClientStatus>('all');
    const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
    const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

    const loadClients = async () => {
        setIsLoading(true);
        try {
            const fetchedClients = await fetchClients();
            // Alphabetical sort
            fetchedClients.sort((a, b) => (a.personalInfo?.name || '').localeCompare(b.personalInfo?.name || ''));
            setClients(fetchedClients);
            checkForColdClients(fetchedClients);
        } catch (error) {
            console.error("Failed to load clients:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadClients();
    }, []);


    const checkForColdClients = async (allClients: Client[]) => {
        try {
            const existingNotifications = await fetchNotifications();
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

            for (const client of allClients) {
                if (client.status === ClientStatus.ACTIVE && new Date(client.businessInfo.lastContact) < thirtyDaysAgo) {
                    const hasExistingNotification = existingNotifications.some(
                        n => n.type === NotificationType.STATUS_CHANGE_SUGGESTION && n.clientId === client.id && !n.isRead
                    );

                    if (!hasExistingNotification) {
                        await createNotification({
                            type: NotificationType.STATUS_CHANGE_SUGGESTION,
                            isRead: false,
                            createdAt: new Date().toISOString(),
                            title: `Client May Be Cold: ${client.personalInfo.name}`,
                            message: `It's been over 30 days since your last contact. Consider marking them as 'Cold Client' to re-engage.`,
                            clientId: client.id,
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Error checking for cold clients and creating notifications:", error);
        }
    };

    const handleAddClient = async (formData: Omit<Client, 'id' | 'businessInfo' | 'contracts' | 'meta'> & { notes?: string, referralSource?: ReferralSource }) => {
        const now = new Date().toISOString();
        const newClientData: Omit<Client, 'id'> = {
            personalInfo: {
                name: formData.personalInfo.name,
                email: formData.personalInfo.email,
                phone: formData.personalInfo.phone,
                location: formData.personalInfo.location,
            },
            businessInfo: {
                referralSource: formData.referralSource,
                clientSince: now,
                totalRevenue: 0,
                contractCount: 0,
                lastContact: now,
            },
            status: ClientStatus.ACTIVE,
            contracts: [],
            notes: formData.notes,
            meta: {
                createdAt: now,
                updatedAt: now,
                createdBy: 'Saul Lowery',
            }
        };

        try {
            await createClient(newClientData);
            await loadClients();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to add client:", error);
        }
    };

    const handleSelectClient = (id: string) => {
        setSelectedClientIds(prev =>
            prev.includes(id) ? prev.filter(clientId => clientId !== id) : [...prev, id]
        );
    };

    const handleConfirmBulkDelete = async () => {
        try {
            await Promise.all(selectedClientIds.map(id => deleteClient(id)));
            setSelectedClientIds([]);
            setIsBulkDeleteModalOpen(false);
            await loadClients();
        } catch (error) {
            console.error("Failed to delete clients:", error);
            alert("Failed to delete selected clients. Please try again.");
        }
    };

    const filteredClients = useMemo(() => {
        return clients
            .filter(client => client.status !== ClientStatus.DO_NOT_WORK_WITH)
            .filter(client => (statusFilter === 'all' ? true : client.status === statusFilter))
            .filter(client => {
                if (!searchQuery) return true;
                const lowercasedQuery = searchQuery.toLowerCase();
                return client.personalInfo.name.toLowerCase().includes(lowercasedQuery) ||
                    client.personalInfo.email.toLowerCase().includes(lowercasedQuery);
            });
    }, [clients, searchQuery, statusFilter]);

    const statusFilters: ('all' | ClientStatus)[] = ['all', ClientStatus.HOT, ClientStatus.ACTIVE, ClientStatus.COLD];

    const statusCounts = useMemo(() => {
        const counts = {
            [ClientStatus.HOT]: 0,
            [ClientStatus.ACTIVE]: 0,
            [ClientStatus.COLD]: 0,
            [ClientStatus.DO_NOT_WORK_WITH]: 0,
            'all': 0
        };

        clients.forEach(client => {
            if (counts[client.status] !== undefined) {
                counts[client.status]++;
            }
            if (client.status !== ClientStatus.DO_NOT_WORK_WITH) {
                counts['all']++;
            }
        });
        return counts;
    }, [clients]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton type="card" />
                    <Skeleton type="card" />
                    <Skeleton type="card" />
                    <Skeleton type="card" />
                </div>
            );
        }
        if (clients.length === 0) {
            return (
                <div className="text-center p-12 text-gray-500 dark:text-gray-400">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No Clients Yet</h3>
                    <p className="mt-2">Click "+ Add Client" to get started.</p>
                </div>
            );
        }
        if (filteredClients.length === 0) {
            return <div className="text-center p-8 text-gray-500 dark:text-gray-400">No clients match your search or filter.</div>;
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredClients.map(client => <ClientCard key={client.id} client={client} isSelected={selectedClientIds.includes(client.id)} onSelect={handleSelectClient} />)}
            </div>
        );
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">👥 Clients</h1>
                    <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">+ Add Client</Button>
                </div>
                <Card className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center flex-wrap gap-2">
                        {statusFilters.map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${statusFilter === status ? 'bg-brand-primary text-white' : 'bg-gray-200/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            >
                                {status === 'all' ? `All Active (${statusCounts['all']})` : `${status} (${statusCounts[status] || 0})`}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full sm:max-w-xs">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" /></svg>
                        </div>
                        <Input
                            id="client-search"
                            type="search"
                            placeholder="Search clients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="!pl-10 !py-2"
                        />
                    </div>
                </Card>
                {selectedClientIds.length > 0 && (
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-lg flex justify-between items-center animate-fade-in-up">
                        <span className="font-semibold text-blue-800 dark:text-blue-200">{selectedClientIds.length} clients selected</span>
                        <div>
                            <Button variant="danger" onClick={() => setIsBulkDeleteModalOpen(true)} className="!py-1.5 !px-3 text-sm">Delete</Button>
                        </div>
                    </div>
                )}
                {renderContent()}
                <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                    Showing {filteredClients.length} of {clients.filter(c => c.status !== ClientStatus.DO_NOT_WORK_WITH).length} active clients
                </div>
            </div>
            {isModalOpen && <AddClientModal onClose={() => setIsModalOpen(false)} onSubmit={handleAddClient} />}
            <ConfirmationModal
                isOpen={isBulkDeleteModalOpen}
                onClose={() => setIsBulkDeleteModalOpen(false)}
                onConfirm={handleConfirmBulkDelete}
                title="Delete Selected Clients"
                message={`Are you sure you want to permanently delete ${selectedClientIds.length} clients? This action cannot be undone and will delete all associated data.`}
            />
        </>
    );
};

export default ClientList;