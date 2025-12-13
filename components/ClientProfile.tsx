import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchClientById, fetchContractsByClientId, updateClient, deleteClient } from '../services/geminiService';
import { Client, Contract, ContractStatus, ClientStatus, DoNotWorkWithInfo, DoNotWorkWithReason } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import ClientSessionsList from './ClientSessionsList';
import DoNotWorkWithModal from './ui/DoNotWorkWithModal';
import EmailComposerModal from './ui/EmailComposerModal';
import ConfirmationModal from './ui/ConfirmationModal';
import EditClientModal from './ui/EditClientModal';

const getStatusColor = (status: ContractStatus) => {
    const colors: { [key in ContractStatus]: string } = {
        [ContractStatus.DRAFT]: 'text-status-draft',
        [ContractStatus.SENT]: 'text-status-sent',
        [ContractStatus.VIEWED]: 'text-status-viewed',
        [ContractStatus.REVISION_REQUESTED]: 'text-status-revision',
        [ContractStatus.PARTIALLY_SIGNED]: 'text-blue-500',
        [ContractStatus.COMPLETED]: 'text-status-signed',
        [ContractStatus.DECLINED]: 'text-status-declined',
        [ContractStatus.EXPIRED]: 'text-gray-500',
        [ContractStatus.ARCHIVED]: 'text-gray-400',
    };
    return colors[status] || 'text-gray-800';
};

const StatCard: React.FC<{ icon: string, label: string, value: string | number }> = ({ icon, label, value }) => (
    <Card className="p-4 flex-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">{icon} {label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
    </Card>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-base font-medium transition-colors rounded-t-lg focus:outline-none ${active
            ? 'border-b-2 border-brand-primary text-brand-primary'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
    >
        {children}
    </button>
);

const ClientProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [client, setClient] = useState<Client | null>(null);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditingNotes, setIsEditingNotes] = useState(false);
    const [notes, setNotes] = useState('');
    const [activeTab, setActiveTab] = useState<'details' | 'contracts' | 'sessions'>('details');
    const [isDnwModalOpen, setIsDnwModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);


    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const clientData = await fetchClientById(id);
                if (clientData) {
                    setClient(clientData);
                    setNotes(clientData.notes || '');
                    const contractsData = await fetchContractsByClientId(id);
                    setContracts(contractsData);
                }
            } catch (error) {
                console.error("Failed to load client profile:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleSaveNotes = async () => {
        if (!client) return;
        const updatedClient = { ...client, notes, meta: { ...client.meta, updatedAt: new Date().toISOString() } };
        try {
            await updateClient(updatedClient);
            setClient(updatedClient);
            setIsEditingNotes(false);
        } catch (error) {
            console.error("Failed to save notes:", error);
        }
    };

    const handleStatusChange = async (newStatus: ClientStatus) => {
        if (!client) return;
        if (newStatus === ClientStatus.DO_NOT_WORK_WITH) {
            setIsDnwModalOpen(true);
            return;
        }

        const updatedClient: Client = {
            ...client,
            status: newStatus,
            doNotWorkWithInfo: null, // Use null instead of undefined
            meta: { ...client.meta, updatedAt: new Date().toISOString() },
        };
        await updateClient(updatedClient);
        setClient(updatedClient);
    };

    const handleSetDoNotWorkWith = async (info: DoNotWorkWithInfo) => {
        if (!client) return;
        const updatedClient: Client = {
            ...client,
            status: ClientStatus.DO_NOT_WORK_WITH,
            doNotWorkWithInfo: info,
            meta: { ...client.meta, updatedAt: new Date().toISOString() },
        };
        await updateClient(updatedClient);
        setClient(updatedClient);
        setIsDnwModalOpen(false);
    };

    const handleDeleteClient = async () => {
        if (!client) return;
        try {
            await deleteClient(client.id);
            navigate('/clients');
        } catch (error) {
            console.error("Failed to delete client:", error);
            alert("Failed to delete client. Please try again.");
        }
    };

    const handleUpdateClient = async (updatedClient: Client) => {
        try {
            await updateClient(updatedClient);
            setClient(updatedClient);
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Failed to update client:", error);
            alert("Failed to update client. Please try again.");
        }
    };


    if (isLoading) {
        return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading client profile...</div>;
    }

    if (!client) {
        return <div className="text-center p-8 text-gray-500 dark:text-gray-400">Client not found.</div>;
    }

    const renderDetailsTab = () => (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <StatCard icon="📋" label="Contracts" value={client.businessInfo.contractCount} />
                <StatCard icon="💰" label="Revenue" value={`$${client.businessInfo.totalRevenue.toLocaleString()}`} />
                <StatCard icon="📅" label="Since" value={new Date(client.businessInfo.clientSince).toLocaleDateString()} />
            </div>
            <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">📝 Notes</h3>
                <Card className="p-6">
                    {isEditingNotes ? (
                        <div>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full h-32 p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white"
                                placeholder="Add notes about this client..."
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <Button variant="secondary" onClick={() => setIsEditingNotes(false)}>Cancel</Button>
                                <Button onClick={handleSaveNotes}>Save Notes</Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {client.notes || <span className="text-gray-400">No notes yet.</span>}
                            </p>
                            <Button variant="secondary" className="mt-4" onClick={() => setIsEditingNotes(true)}>
                                {client.notes ? 'Edit Notes' : 'Add Notes'}
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h3>
                <Card className="p-6 border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-red-800 dark:text-red-200">Delete Client</h4>
                            <p className="text-sm text-red-600 dark:text-red-300">Permanently delete this client and all associated data.</p>
                        </div>
                        <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>Delete Client</Button>
                    </div>
                </Card>
            </div>
        </div>
    );

    const renderContractsTab = () => (
        <div className="space-y-4">
            {contracts.length > 0 ? (
                contracts.map(contract => (
                    <Card key={contract.id} className="p-4 sm:p-6 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{contract.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Signed: {new Date(contract.createdAt).toLocaleDateString()} &bull;
                                ${Number(contract.variables.base_fee || 0).toLocaleString()} &bull;
                                <span className={`font-semibold ${getStatusColor(contract.status)}`}> {contract.status}</span>
                            </p>
                        </div>
                        <Link to={`/contracts/${contract.id}`}>
                            <Button variant="secondary">View Contract</Button>
                        </Link>
                    </Card>
                ))
            ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No contracts found for this client.</p>
            )}
        </div>
    );

    return (
        <>
            <div className="space-y-6">
                {client.status === ClientStatus.DO_NOT_WORK_WITH && (
                    <Card className="p-4 bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700">
                        <h3 className="text-lg font-bold text-red-800 dark:text-red-200">⛔ Do Not Work With</h3>
                        <p className="text-red-700 dark:text-red-300 mt-1">
                            <strong>Reason:</strong> {client.doNotWorkWithInfo?.reason}
                        </p>
                        <p className="text-red-700 dark:text-red-300 mt-1">
                            <strong>Details:</strong> {client.doNotWorkWithInfo?.details}
                        </p>
                    </Card>
                )}
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                    <div>
                        <Link to="/clients" className="text-brand-primary hover:underline mb-2 inline-block">&larr; Back to Clients</Link>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">👤 {client.personalInfo.name}</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                            {client.personalInfo.email} &bull; {client.personalInfo.phone || 'No phone'}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            📍 {client.personalInfo.location || 'N/A'} &bull; 💼 Referred by: {client.businessInfo.referralSource || 'N/A'}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="secondary" onClick={() => setIsEditModalOpen(true)}>Edit Profile</Button>
                        <Button onClick={() => setIsEmailModalOpen(true)}>📧 Send Email</Button>
                        <div className="w-52">
                            <label htmlFor="client-status" className="sr-only">Client Status</label>
                            <select
                                id="client-status"
                                value={client.status}
                                onChange={(e) => handleStatusChange(e.target.value as ClientStatus)}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-base p-3"
                            >
                                {Object.values(ClientStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        <TabButton active={activeTab === 'details'} onClick={() => setActiveTab('details')}>Details</TabButton>
                        <TabButton active={activeTab === 'contracts'} onClick={() => setActiveTab('contracts')}>Contracts</TabButton>
                        <TabButton active={activeTab === 'sessions'} onClick={() => setActiveTab('sessions')}>Sessions</TabButton>
                    </nav>
                </div>

                <div className="mt-6">
                    {activeTab === 'details' && renderDetailsTab()}
                    {activeTab === 'contracts' && renderContractsTab()}
                    {activeTab === 'sessions' && <ClientSessionsList client={client} contracts={contracts} />}
                </div>
            </div>
            {isDnwModalOpen && <DoNotWorkWithModal onClose={() => setIsDnwModalOpen(false)} onSubmit={handleSetDoNotWorkWith} />}
            {isEmailModalOpen && <EmailComposerModal client={client} contracts={contracts} isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} />}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteClient}
                title="Delete Client"
                message={`Are you sure you want to permanently delete ${client.personalInfo.name}? This action cannot be undone.`}
            />
            {isEditModalOpen && (
                <EditClientModal
                    client={client}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleUpdateClient}
                />
            )}
        </>
    );
};

export default ClientProfile;