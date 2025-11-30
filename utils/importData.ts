import { db } from '../services/firebase';
import { collection, doc, writeBatch, getDocs } from 'firebase/firestore';
import { Client, Contract, ClientStatus, ContractStatus, TemplateType, PartyRole, AuditEventType, SignatureFieldKind } from '../types';

export interface ImportResult {
    success: boolean;
    clientsImported: number;
    contractsImported: number;
    errors: string[];
}

export const importData = async (jsonData: any): Promise<ImportResult> => {
    const result: ImportResult = {
        success: false,
        clientsImported: 0,
        contractsImported: 0,
        errors: []
    };

    try {
        const batch = writeBatch(db);
        let operationCount = 0;
        const BATCH_LIMIT = 450; // Firestore limit is 500, keeping a buffer

        // Helper to commit batch if limit reached
        const checkAndCommitBatch = async () => {
            if (operationCount >= BATCH_LIMIT) {
                await batch.commit();
                operationCount = 0;
                // Create new batch? writeBatch returns a new batch instance, 
                // but we can't easily swap the reference inside this scope if we just call writeBatch(db) again 
                // without re-assigning. 
                // Actually, for simplicity in this utility, let's just process in chunks if needed, 
                // or assume the user won't have massive data for this specific "studio" app yet.
                // If they do, we should implement a loop.
                // For now, let's just use one batch and warn if it's too big, or better, implement simple chunking.
            }
        };

        // We'll actually use a simpler approach: collect all operations and then batch them in chunks.
        const operations: { type: 'set', ref: any, data: any }[] = [];

        // Process Clients
        if (jsonData.clients) {
            const clients = Array.isArray(jsonData.clients) ? jsonData.clients : Object.values(jsonData.clients);

            for (const clientData of clients as any[]) {
                try {
                    const clientId = clientData.id || doc(collection(db, 'clients')).id;

                    const newClient: Client = {
                        id: clientId,
                        personalInfo: {
                            name: clientData.name || clientData.personalInfo?.name || 'Unknown Client',
                            email: clientData.email || clientData.personalInfo?.email || '',
                            phone: clientData.phone || clientData.personalInfo?.phone,
                            location: clientData.address || clientData.personalInfo?.location,
                        },
                        businessInfo: {
                            clientSince: clientData.clientSince || new Date().toISOString(),
                            totalRevenue: clientData.totalRevenue || 0,
                            contractCount: clientData.contractCount || 0,
                            lastContact: clientData.lastContact || new Date().toISOString(),
                        },
                        status: clientData.status || ClientStatus.ACTIVE,
                        contracts: clientData.contracts || [],
                        meta: {
                            createdAt: clientData.createdAt || new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            createdBy: 'Import',
                        }
                    };

                    operations.push({
                        type: 'set',
                        ref: doc(db, 'clients', clientId),
                        data: newClient
                    });
                    result.clientsImported++;

                } catch (err) {
                    console.error("Error parsing client:", err);
                    result.errors.push(`Failed to parse client: ${err}`);
                }
            }
        }

        // Process Contracts
        if (jsonData.contracts) {
            const contracts = Array.isArray(jsonData.contracts) ? jsonData.contracts : Object.values(jsonData.contracts);

            for (const contractData of contracts as any[]) {
                try {
                    const contractId = contractData.id || doc(collection(db, 'contracts')).id;

                    // Map legacy status if needed
                    let status = contractData.status || ContractStatus.DRAFT;

                    const newContract: Contract = {
                        id: contractId,
                        orgId: 'default', // Default org
                        clientId: contractData.clientId,
                        contractType: contractData.contractType || TemplateType.GENERAL,
                        title: contractData.title || 'Imported Contract',
                        clientName: contractData.clientName || 'Unknown Client',
                        clientEmail: contractData.clientEmail || '',
                        status: status,
                        variables: contractData.variables || {},
                        clauses: contractData.clauses || [],
                        createdAt: contractData.createdAt || new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        parties: contractData.parties || [],
                        signatureFields: contractData.signatureFields || [],
                        version: contractData.version || 1,
                        auditTrail: contractData.auditTrail || []
                    };

                    operations.push({
                        type: 'set',
                        ref: doc(db, 'contracts', contractId),
                        data: newContract
                    });
                    result.contractsImported++;

                } catch (err) {
                    console.error("Error parsing contract:", err);
                    result.errors.push(`Failed to parse contract: ${err}`);
                }
            }
        }

        // Execute Batches
        const chunks = [];
        for (let i = 0; i < operations.length; i += BATCH_LIMIT) {
            chunks.push(operations.slice(i, i + BATCH_LIMIT));
        }

        for (const chunk of chunks) {
            const batch = writeBatch(db);
            chunk.forEach(op => {
                batch.set(op.ref, op.data);
            });
            await batch.commit();
        }

        result.success = true;

    } catch (error) {
        console.error("Import failed:", error);
        result.success = false;
        result.errors.push(`Global import error: ${error}`);
    }

    return result;
};

export const exportData = async (): Promise<void> => {
    try {
        const clientsSnapshot = await getDocs(collection(db, 'clients'));
        const contractsSnapshot = await getDocs(collection(db, 'contracts'));

        const clients = clientsSnapshot.docs.map(doc => doc.data());
        const contracts = contractsSnapshot.docs.map(doc => doc.data());

        const data = {
            clients,
            contracts,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };

        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `slp_studio_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Export failed:", error);
        alert("Failed to export data. See console for details.");
    }
};
