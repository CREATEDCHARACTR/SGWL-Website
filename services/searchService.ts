import { fetchClients, getContracts } from './geminiService';
import { Client, Contract } from '../types';

interface SearchResults {
    clients: Client[];
    contracts: Contract[];
}

export const searchAll = async (query: string): Promise<SearchResults> => {
    const lowercasedQuery = query.toLowerCase();
    if (lowercasedQuery.length < 2) {
        return { clients: [], contracts: [] };
    }

    try {
        const [clients, contracts] = await Promise.all([
            fetchClients(),
            getContracts()
        ]);

        const filteredClients = clients.filter(client =>
            client.personalInfo.name.toLowerCase().includes(lowercasedQuery) ||
            client.personalInfo.email.toLowerCase().includes(lowercasedQuery)
        );

        const filteredContracts = contracts.filter(contract =>
            contract.title.toLowerCase().includes(lowercasedQuery) ||
            contract.clientName.toLowerCase().includes(lowercasedQuery)
        );

        return {
            clients: filteredClients,
            contracts: filteredContracts,
        };

    } catch (error) {
        console.error("Error during global search:", error);
        return { clients: [], contracts: [] };
    }
};
