import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { searchAll } from '../../services/searchService';
import { Client, Contract } from '../../types';

interface SearchModalProps {
    onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ clients: Client[], contracts: Contract[] } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleSearch = async () => {
            if (query.length < 2) {
                setResults(null);
                return;
            }
            setIsLoading(true);
            const searchResults = await searchAll(query);
            setResults(searchResults);
            setIsLoading(false);
        };

        const debounce = setTimeout(() => {
            handleSearch();
        }, 300);

        return () => clearTimeout(debounce);
    }, [query]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl my-8 animate-modal-grow" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b dark:border-gray-700">
                    <input
                        type="search"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search across clients, contracts, emails..."
                        className="w-full bg-transparent text-lg p-2 focus:outline-none dark:text-white"
                        autoFocus
                    />
                </div>
                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {isLoading && <p className="text-gray-500">Searching...</p>}
                    {!isLoading && !results && query.length < 2 && <p className="text-gray-500">Enter at least 2 characters to search.</p>}
                    {!isLoading && results && results.clients.length === 0 && results.contracts.length === 0 && <p className="text-gray-500">No results found for "{query}".</p>}
                    
                    {results && results.clients.length > 0 && (
                        <div className="mb-4">
                            <h3 className="font-bold text-sm uppercase text-gray-500 mb-2">Clients</h3>
                            <ul className="divide-y dark:divide-gray-700">
                                {results.clients.map(client => (
                                    <li key={client.id}><Link to={`/clients/${client.id}`} onClick={onClose} className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">{client.personalInfo.name}</Link></li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {results && results.contracts.length > 0 && (
                        <div>
                            <h3 className="font-bold text-sm uppercase text-gray-500 mb-2">Contracts</h3>
                            <ul className="divide-y dark:divide-gray-700">
                                {results.contracts.map(contract => (
                                    <li key={contract.id}><Link to={`/contracts/${contract.id}`} onClick={onClose} className="block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">{contract.title} - <span className="text-gray-500">{contract.clientName}</span></Link></li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
