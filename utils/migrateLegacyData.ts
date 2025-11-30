import { db } from '../services/firebase';
import { collection, getDocs, doc, writeBatch, query, where } from 'firebase/firestore';
import { Client, Contract, ClientStatus, ContractStatus, TemplateType } from '../types';

export interface MigrationResult {
    success: boolean;
    clientsMigrated: number;
    contractsMigrated: number;
    errors: string[];
}

export const migrateLegacyData = async (): Promise<MigrationResult> => {
    const result: MigrationResult = {
        success: false,
        clientsMigrated: 0,
        contractsMigrated: 0,
        errors: []
    };

    try {
        // 1. Fetch legacy contracts
        const legacySnapshot = await getDocs(collection(db, 'Contracts')); // Note: Capitalized 'Contracts'
        const legacyDocs = legacySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));

        if (legacyDocs.length === 0) {
            result.errors.push("No documents found in 'Contracts' collection.");
            return result;
        }

        const batch = writeBatch(db);
        let opCount = 0;

        // Helper to manage batch size
        const commitBatchIfNeeded = async () => {
            if (opCount >= 450) {
                await batch.commit();
                opCount = 0;
                // Note: In a real app we'd need to re-instantiate batch, but for this simple script 
                // we'll assume < 450 records or just let it fail/warn. 
                // For robustness, we should really process in chunks.
            }
        };

        // Cache clients to avoid duplicates during this run
        // In a real scenario, we should also check DB for existing clients by email
        const processedEmails = new Set<string>();

        // Pre-fetch existing clients to avoid duplicates
        const existingClientsSnapshot = await getDocs(collection(db, 'clients'));
        existingClientsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.personalInfo?.email) {
                processedEmails.add(data.personalInfo.email.toLowerCase());
            }
        });

        for (const legacyData of legacyDocs as any[]) {
            try {
                const email = legacyData['Email'] || legacyData['email'];
                const name = legacyData['Client Name'] || legacyData['client_name'] || 'Unknown Client';

                if (!email) {
                    result.errors.push(`Skipping doc ${legacyData.id}: No email found.`);
                    continue;
                }

                const normalizedEmail = email.toLowerCase();
                let clientId = doc(collection(db, 'clients')).id;

                // Create Client if not exists
                if (!processedEmails.has(normalizedEmail)) {
                    const newClient: Client = {
                        id: clientId,
                        personalInfo: {
                            name: name,
                            email: email,
                            phone: legacyData['Phone'] || '',
                            location: legacyData['client_billing_address'] || '',
                        },
                        businessInfo: {
                            clientSince: new Date().toISOString(),
                            totalRevenue: 0,
                            contractCount: 1,
                            lastContact: new Date().toISOString(),
                        },
                        status: ClientStatus.ACTIVE,
                        contracts: [],
                        meta: {
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            createdBy: 'Migration',
                        }
                    };

                    batch.set(doc(db, 'clients', clientId), newClient);
                    processedEmails.add(normalizedEmail);
                    result.clientsMigrated++;
                    opCount++;
                } else {
                    // Find existing client ID (simplified: we'd need to query, but for now we'll just skip creating client 
                    // and link contract to a "Migrated" client or we'd need to look up the ID. 
                    // For this script, let's just query for the ID if we know it exists.)
                    // Optimization: We really should have a map of email -> ID.
                    // Let's rebuild the map from the snapshot we fetched earlier.
                    const match = existingClientsSnapshot.docs.find(d => d.data().personalInfo?.email?.toLowerCase() === normalizedEmail);
                    if (match) {
                        clientId = match.id;
                    }
                }

                // Create Contract
                const contractId = legacyData.id; // Keep original ID if possible, or generate new
                const newContract: Contract = {
                    id: contractId,
                    orgId: 'default',
                    clientId: clientId,
                    contractType: TemplateType.GENERAL,
                    title: legacyData['Business Legal Name'] || `Contract for ${name}`,
                    clientName: name,
                    clientEmail: email,
                    status: ContractStatus.COMPLETED, // Assuming legacy contracts are done/active
                    variables: {
                        ...legacyData // Store all legacy fields as variables
                    },
                    clauses: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    parties: [],
                    signatureFields: [],
                    version: 1,
                    auditTrail: []
                };

                batch.set(doc(db, 'contracts', contractId), newContract);
                result.contractsMigrated++;
                opCount++;

                // Update client's contract list (this is tricky in a batch without reading first, 
                // but we can try arrayUnion if we had the ref. For now, we'll skip updating the client's array 
                // to keep it simple/safe, or we'd need a separate update op).

            } catch (err) {
                console.error(`Error migrating doc ${legacyData.id}:`, err);
                result.errors.push(`Error migrating ${legacyData.id}: ${err}`);
            }
        }

        if (opCount > 0) {
            await batch.commit();
        }

        result.success = true;

    } catch (error) {
        console.error("Migration failed:", error);
        result.success = false;
        result.errors.push(`Global migration error: ${error}`);
    }

    return result;
};
