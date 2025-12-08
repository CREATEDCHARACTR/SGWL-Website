

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getContracts, deleteContract, getInvoices, archiveContract, subscribeToContracts, subscribeToInvoices } from '../services/geminiService';
import { Contract, ContractStatus, Invoice, InvoiceStatus } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import ConfirmationModal from './ui/ConfirmationModal';
import Skeleton from './ui/Skeleton';
import SEO from './SEO';

const getStatusColor = (status: ContractStatus) => {
  const colors: { [key in ContractStatus]: string } = {
    [ContractStatus.DRAFT]: 'bg-status-draft/20 text-status-draft',
    [ContractStatus.SENT]: 'bg-status-sent/20 text-status-sent',
    [ContractStatus.VIEWED]: 'bg-status-viewed/20 text-status-viewed',
    [ContractStatus.REVISION_REQUESTED]: 'bg-status-revision/20 text-status-revision',
    [ContractStatus.PARTIALLY_SIGNED]: 'bg-blue-400/20 text-blue-500',
    [ContractStatus.COMPLETED]: 'bg-status-signed/20 text-status-signed',
    [ContractStatus.DECLINED]: 'bg-status-declined/20 text-status-declined',
    [ContractStatus.EXPIRED]: 'bg-gray-400/20 text-gray-500',
    [ContractStatus.ARCHIVED]: 'bg-gray-300/20 text-gray-600 dark:bg-gray-600/20 dark:text-gray-400',
  };
  return colors[status] || 'bg-gray-200 text-gray-800';
};

const Dashboard: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[] | null>(null);
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null);
  const [contractToArchive, setContractToArchive] = useState<Contract | null>(null);
  const [statusFilter, setStatusFilter] = useState<ContractStatus | 'all'>('all');
  const [selectedContractIds, setSelectedContractIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkArchiveModalOpen, setIsBulkArchiveModalOpen] = useState(false);


  // Web Audio API context for playing sounds
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

  useEffect(() => {
    setIsLoading(true);

    const unsubscribeContracts = subscribeToContracts(
      (fetchedContracts) => {
        setContracts(fetchedContracts);
      },
      (error) => {
        console.error("Dashboard: Error fetching contracts", error);
        // We don't stop loading here because we wait for invoices too, or we can handle it.
        // But critically, we shouldn't let it hang if both fail.
        if (invoices === null) setIsLoading(false);
      }
    );

    const unsubscribeInvoices = subscribeToInvoices(
      (fetchedInvoices) => {
        setInvoices(fetchedInvoices);
        setIsLoading(false); // Ensure loading is false after data arrives
      },
      (error) => {
        console.error("Dashboard: Error fetching invoices", error);
        setIsLoading(false); // Ensure we stop loading on error
      }
    );

    return () => {
      unsubscribeContracts();
      unsubscribeInvoices();
    };
  }, []);

  const playWarningSound = () => {
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(150, audioContext.currentTime); // low frequency
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2); // play for 0.2 seconds
  }

  const openDeleteModal = (contract: Contract) => {
    setContractToDelete(contract);
    playWarningSound();
  };

  const closeDeleteModal = () => {
    setContractToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!contractToDelete) return;

    try {
      await deleteContract(contractToDelete.id);
      setContracts(prevContracts => prevContracts?.filter(c => c.id !== contractToDelete.id) || null);
    } catch (error) {
      console.error("Failed to delete contract:", error);
      // Optionally, show an error message to the user
    } finally {
      closeDeleteModal();
    }
  };

  const openArchiveModal = (contract: Contract) => {
    setContractToArchive(contract);
    playWarningSound();
  };

  const closeArchiveModal = () => {
    setContractToArchive(null);
  };

  const handleConfirmArchive = async () => {
    if (!contractToArchive) return;

    try {
      await archiveContract(contractToArchive.id);
      setContracts(prevContracts => prevContracts?.map(c =>
        c.id === contractToArchive.id ? { ...c, status: ContractStatus.ARCHIVED } : c
      ) || null);
    } catch (error) {
      console.error("Failed to archive contract:", error);
    } finally {
      closeArchiveModal();
    }
  };

  const filteredContracts = contracts?.filter(contract => {
    if (statusFilter === 'all') return contract.status !== ContractStatus.ARCHIVED;
    return contract.status === statusFilter;
  }) || [];

  // Calculate counts for each status
  const statusCounts = contracts?.reduce((acc, contract) => {
    const status = contract.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const allNonArchivedCount = contracts?.filter(c => c.status !== ContractStatus.ARCHIVED).length || 0;

  const handleSelectOne = (id: string) => {
    setSelectedContractIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(contractId => contractId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedContractIds(filteredContracts.map(c => c.id));
    } else {
      setSelectedContractIds([]);
    }
  };

  const handleOpenBulkDeleteModal = () => {
    if (selectedContractIds.length > 0) {
      playWarningSound();
      setIsBulkDeleteModalOpen(true);
    }
  };

  const handleConfirmBulkDelete = async () => {
    try {
      await Promise.all(selectedContractIds.map(id => deleteContract(id)));
      setContracts(prev => prev?.filter(c => !selectedContractIds.includes(c.id)) || null);
      setSelectedContractIds([]);
    } catch (error) {
      console.error("Failed to delete selected contracts:", error);
    } finally {
      setIsBulkDeleteModalOpen(false);
    }
  };

  const handleOpenBulkArchiveModal = () => {
    if (selectedContractIds.length > 0) {
      playWarningSound();
      setIsBulkArchiveModalOpen(true);
    }
  };

  const handleConfirmBulkArchive = async () => {
    try {
      await Promise.all(selectedContractIds.map(id => archiveContract(id)));
      setContracts(prev => prev?.map(c =>
        selectedContractIds.includes(c.id) ? { ...c, status: ContractStatus.ARCHIVED } : c
      ) || null);
      setSelectedContractIds([]);
    } catch (error) {
      console.error("Failed to archive selected contracts:", error);
    } finally {
      setIsBulkArchiveModalOpen(false);
    }
  };

  const metrics = {
    active: contracts?.filter(c => ![ContractStatus.DRAFT, ContractStatus.COMPLETED, ContractStatus.DECLINED, ContractStatus.EXPIRED].includes(c.status)).length || 0,
    pending: contracts?.filter(c => [ContractStatus.SENT, ContractStatus.VIEWED, ContractStatus.REVISION_REQUESTED, ContractStatus.PARTIALLY_SIGNED].includes(c.status)).length || 0,
    outstandingInvoices: invoices?.filter(i => [InvoiceStatus.SENT, InvoiceStatus.VIEWED, InvoiceStatus.OVERDUE].includes(i.status)).length || 0,
    outstandingAmount: invoices?.filter(i => [InvoiceStatus.SENT, InvoiceStatus.VIEWED, InvoiceStatus.OVERDUE].includes(i.status)).reduce((sum, i) => sum + i.total, 0) || 0,
    overdueInvoices: invoices?.filter(i => i.status === InvoiceStatus.OVERDUE).length || 0,
    overdueAmount: invoices?.filter(i => i.status === InvoiceStatus.OVERDUE).reduce((sum, i) => sum + i.total, 0) || 0,
  };

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton type="table" rows={5} />;
    }
    if (filteredContracts.length === 0) {
      return (
        <div className="glass-panel text-center p-12 text-gray-500 dark:text-gray-400">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No Contracts Found</h3>
          <p className="mt-2">
            {statusFilter === 'all'
              ? 'Create your first contract to get started.'
              : `There are no contracts with the status "${statusFilter}".`}
          </p>
          {statusFilter === 'all' && (
            <Link to="/contracts/new">
              <Button className="mt-4">Create Contract</Button>
            </Link>
          )}
        </div>
      );
    }

    return (

      <div className="glass-panel overflow-x-auto">
        {/* Desktop Table View */}
        <table className="hidden md:table min-w-full">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <th scope="col" className="px-6 py-4">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-brand-primary focus:ring-brand-primary"
                  onChange={handleSelectAll}
                  checked={filteredContracts.length > 0 && selectedContractIds.length === filteredContracts.length}
                  aria-label="Select all contracts"
                />
              </th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client</th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Updated</th>
              <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
            {filteredContracts.map((contract) => (
              <tr key={contract.id} className={`transition-colors ${selectedContractIds.includes(contract.id) ? 'bg-brand-primary/10' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>
                <td className="px-6 py-5">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-brand-primary focus:ring-brand-primary"
                    checked={selectedContractIds.includes(contract.id)}
                    onChange={() => handleSelectOne(contract.id)}
                    aria-label={`Select contract ${contract.title}`}
                  />
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-base font-medium text-gray-900 dark:text-gray-100">{contract.title}</td>
                <td className="px-6 py-5 whitespace-nowrap text-base text-gray-500 dark:text-gray-400">{contract.clientName}</td>
                <td className="px-6 py-5 whitespace-nowrap text-base">
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                    {contract.status}
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap text-base text-gray-500 dark:text-gray-400">{new Date(contract.updatedAt).toLocaleDateString()}</td>
                <td className="px-6 py-5 whitespace-nowrap text-right text-base font-medium">
                  <Link to={`/contracts/${contract.id}`} className="text-brand-primary hover:text-blue-700">
                    View
                  </Link>
                  {contract.status !== ContractStatus.ARCHIVED && (
                    <button onClick={() => openArchiveModal(contract)} className="ml-4 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
                      Archive
                    </button>
                  )}
                  <button onClick={() => openDeleteModal(contract)} className="ml-4 text-status-declined hover:text-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 p-4">
          {filteredContracts.map(contract => (
            <div key={contract.id} className={`glass-card p-4 relative transition-all ${selectedContractIds.includes(contract.id) ? 'ring-2 ring-brand-primary dark:ring-brand-accent' : ''}`}>
              <div className="absolute top-4 right-4 z-10">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-brand-primary focus:ring-brand-primary"
                  checked={selectedContractIds.includes(contract.id)}
                  onChange={() => handleSelectOne(contract.id)}
                  aria-label={`Select contract ${contract.title}`}
                />
              </div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{contract.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{contract.clientName}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(contract.status)}`}>
                  {contract.status}
                </span>
                <div className="flex items-center gap-4">
                  <Link to={`/contracts/${contract.id}`} className="text-brand-primary font-medium">View</Link>
                  {contract.status !== ContractStatus.ARCHIVED && (
                    <button onClick={() => openArchiveModal(contract)} className="text-gray-600 dark:text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                    </button>
                  )}
                  <button onClick={() => openDeleteModal(contract)} className="text-red-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const statuses: (ContractStatus | 'all')[] = ['all', ...Object.values(ContractStatus)];

  const getStatusLabel = (status: ContractStatus | 'all') => {
    if (status === 'all') return `All Contracts (${allNonArchivedCount})`;
    const count = statusCounts[status] || 0;
    return `${status} (${count})`;
  };

  return (
    <>
      <SEO title="Dashboard - SaulGOOD WEATHER Lowery" />
      <div className={`space-y-8 ${selectedContractIds.length > 0 ? 'pb-24' : ''}`}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 px-4 sm:px-0">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
          <Link to="/contracts/new">
            <Button className="w-full sm:w-auto shadow-lg shadow-brand-primary/20">New Contract</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4 sm:px-0">
          <div className="glass-card p-4 border-l-4 border-brand-primary">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Contracts</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metrics.active}</p>
          </div>
          <div className="glass-card p-4 border-l-4 border-status-sent">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Signature</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metrics.pending}</p>
          </div>
          <div className="glass-card p-4 border-l-4 border-status-viewed">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Outstanding Invoices</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {metrics.outstandingInvoices} <span className="text-sm font-normal text-gray-500">(${metrics.outstandingAmount.toLocaleString()})</span>
            </p>
          </div>
          <div className="glass-card p-4 border-l-4 border-status-declined">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue Invoices</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {metrics.overdueInvoices} <span className="text-sm font-normal text-gray-500">(${metrics.overdueAmount.toLocaleString()})</span>
            </p>
          </div>
        </div>

        <div className="px-4 sm:px-0">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {statuses.map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${statusFilter === status ? 'bg-brand-primary text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'}`}
              >
                {getStatusLabel(status)}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 sm:px-0">
          {renderContent()}
        </div>
      </div>

      {selectedContractIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg p-4 border-t dark:border-gray-700 z-40 animate-fade-in-up">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <span className="text-base font-semibold text-gray-800 dark:text-gray-200">{selectedContractIds.length} selected</span>
            <div className="flex items-center gap-4">
              <Button variant="secondary" onClick={() => setSelectedContractIds([])}>Deselect All</Button>
              <Button variant="secondary" onClick={handleOpenBulkArchiveModal}>
                Archive Selected
              </Button>
              <Button variant="danger" onClick={handleOpenBulkDeleteModal}>
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!contractToDelete}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Contract"
        message={`Are you sure you want to permanently delete the contract "${contractToDelete?.title}"? This action cannot be undone.`}
      />

      <ConfirmationModal
        isOpen={!!contractToArchive}
        onClose={closeArchiveModal}
        onConfirm={handleConfirmArchive}
        title="Archive Contract"
        message={`Are you sure you want to archive "${contractToArchive?.title}"? It will be moved to the Archives section.`}
        confirmButtonText="Archive"
        confirmButtonVariant="secondary"
      />

      <ConfirmationModal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        onConfirm={handleConfirmBulkDelete}
        title="Delete Selected Contracts"
        message={`Are you sure you want to permanently delete ${selectedContractIds.length} contracts? This action cannot be undone.`}
      />

      <ConfirmationModal
        isOpen={isBulkArchiveModalOpen}
        onClose={() => setIsBulkArchiveModalOpen(false)}
        onConfirm={handleConfirmBulkArchive}
        title="Archive Selected Contracts"
        message={`Are you sure you want to archive ${selectedContractIds.length} contracts? They will be moved to the Archives section.`}
        confirmButtonText="Archive"
        confirmButtonVariant="secondary"
      />
    </>
  );
};

export default Dashboard;