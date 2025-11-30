import { Contract, Template, Client, Session, ClientStatus, Notification, NotificationType, Gallery, Goal, Invoice } from '../types';
import { MOCK_CONTRACTS, INITIAL_TEMPLATES_DATA, MOCK_GALLERIES } from '../constants';
import { db } from './firebase';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    writeBatch,
    Timestamp,
    deleteDoc,
    query,
    where,
    updateDoc,
    arrayUnion,
    onSnapshot,
    Unsubscribe,
} from 'firebase/firestore';

const contractsCollection = collection(db, 'contracts');
const templatesCollection = collection(db, 'templates');
const clientsCollection = collection(db, 'clients');
const sessionsCollection = collection(db, 'sessions');
const notificationsCollection = collection(db, 'notifications');
const galleriesCollection = collection(db, 'galleries');
const goalsCollection = collection(db, 'goals');
const invoicesCollection = collection(db, 'invoices');
const metaCollection = collection(db, '_meta');


const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: 'notif_1',
        type: NotificationType.CONTRACT_UNSIGNED,
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        title: 'Contract Unsigned - 3 Days',
        message: "Jane Doe's 'Wedding Photography' contract was sent 3 days ago and has not been signed.",
        clientId: 'client_123',
        contractId: 'contract_1',
    },
    {
        id: 'notif_2',
        type: NotificationType.CLIENT_UNCONTACTED,
        isRead: false,
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        title: 'Client Not Contacted - 35 Days',
        message: "Michael Jackson was last contacted over 30 days ago. It's time to re-engage.",
        clientId: 'client_456',
    }
];


// --- Firestore Data Converters ---

const fromFirestore = (docData: any): any => {
    const data = { ...docData };
    for (const key in data) {
        if (data[key] instanceof Timestamp) {
            data[key] = data[key].toDate().toISOString();
        }
        // Recursively check nested objects
        if (typeof data[key] === 'object' && data[key] !== null && !Array.isArray(data[key])) {
            data[key] = fromFirestore(data[key]);
        }
    }
    return data;
};

const toFirestore = (data: any): any => {
    const firestoreReadyData = { ...data };
    const dateKeys = ['createdAt', 'updatedAt', 'clientSince', 'lastContact', 'dateTime', 'inviteSentAt', 'publishedAt', 'lastAccessed', 'expirationDate', 'uploadedAt', 'editedAt', 'start', 'end'];

    // This function recursively finds and converts date strings to Timestamps
    const convertDates = (obj: any) => {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (dateKeys.includes(key) && typeof obj[key] === 'string') {
                    obj[key] = Timestamp.fromDate(new Date(obj[key]));
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    convertDates(obj[key]); // Recurse into nested objects
                }
            }
        }
    };

    convertDates(firestoreReadyData);

    return firestoreReadyData;
}


// --- Client Migration Logic ---
const runClientMigration = async (): Promise<void> => {
    console.log("Starting client data migration...");
    const batch = writeBatch(db);
    const contractsSnapshot = await getDocs(contractsCollection);
    const allContracts = contractsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Contract[];

    const clientsByEmail = new Map<string, Partial<Client>>();

    console.log(`Processing ${allContracts.length} contracts...`);

    // 1. Group contracts by client email
    for (const contract of allContracts) {
        const email = (contract.clientEmail || contract.variables?.client_email)?.toLowerCase();
        if (!email) {
            console.warn(`Contract ${contract.id} is missing client email. Skipping.`);
            continue;
        }

        if (!clientsByEmail.has(email)) {
            clientsByEmail.set(email, {
                id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                personalInfo: {
                    name: contract.clientName || contract.variables?.client_legal_name,
                    email: email,
                    phone: contract.variables?.client_phone,
                },
                contracts: [],
            });
        }
        const client = clientsByEmail.get(email)!;
        client.contracts!.push(contract.id);

        // Update contract with a temporary client ID, will be replaced with final ID later
        const contractRef = doc(db, 'contracts', contract.id);
        batch.update(contractRef, { clientId: client.id });
    }

    // 2. Calculate aggregates and finalize client data
    for (const [email, client] of clientsByEmail.entries()) {
        const clientContracts = allContracts.filter(c => client.contracts!.includes(c.id));

        let totalRevenue = 0;
        let clientSince = new Date().toISOString();
        let lastContact = new Date(0).toISOString();

        clientContracts.forEach(c => {
            if (c.variables?.base_fee) {
                totalRevenue += Number(c.variables.base_fee);
            }
            if (c.createdAt < clientSince) {
                clientSince = c.createdAt;
            }
            if (c.updatedAt > lastContact) {
                lastContact = c.updatedAt;
            }
        });

        const now = new Date().toISOString();
        const finalClient: Client = {
            id: client.id!,
            personalInfo: client.personalInfo!,
            status: ClientStatus.ACTIVE,
            contracts: client.contracts!,
            sessions: [], // Initialize sessions
            businessInfo: {
                totalRevenue,
                contractCount: clientContracts.length,
                clientSince,
                lastContact,
            },
            meta: {
                createdAt: now,
                updatedAt: now,
                createdBy: 'Migration Script'
            }
        };

        const clientRef = doc(db, 'clients', finalClient.id);
        batch.set(clientRef, toFirestore(finalClient));
    }

    // 3. Mark migration as complete
    const migrationStatusRef = doc(metaCollection, 'migrationStatus');
    batch.set(migrationStatusRef, { clientMigrationV1Complete: true });

    await batch.commit();
    console.log("Client data migration completed successfully.");
};


// --- Seeding Logic ---

let isInitialized = false;

export const initializeDatabase = async (): Promise<void> => {
    if (isInitialized) return;

    console.log("Initializing and checking database seed...");
    try {
        const templatesSnapshot = await getDocs(templatesCollection);
        const contractsSnapshot = await getDocs(contractsCollection);
        const notificationsSnapshot = await getDocs(notificationsCollection);
        const galleriesSnapshot = await getDocs(galleriesCollection);
        const batch = writeBatch(db);
        let needsCommit = false;

        if (templatesSnapshot.empty) {
            console.log("Seeding Firestore 'templates' collection...");
            INITIAL_TEMPLATES_DATA.forEach(template => {
                const docRef = doc(db, 'templates', template.id);
                batch.set(docRef, toFirestore(template));
            });
            needsCommit = true;
        } else {
            // Force update AI Agent template to ensure latest changes are applied
            const aiTemplate = INITIAL_TEMPLATES_DATA.find(t => t.id === 'template_ai_std_1');
            if (aiTemplate) {
                const docRef = doc(db, 'templates', aiTemplate.id);
                batch.set(docRef, toFirestore(aiTemplate));
                needsCommit = true;
                console.log("Force updating AI Agent template...");
            }

            // Force update Website Dev template to ensure latest changes are applied
            const webTemplate = INITIAL_TEMPLATES_DATA.find(t => t.id === 'template_web_std_1');
            if (webTemplate) {
                const docRef = doc(db, 'templates', webTemplate.id);
                batch.set(docRef, toFirestore(webTemplate));
                needsCommit = true;
                console.log("Force updating Website Dev template (RETRY 2)...");
            }
        }

        if (contractsSnapshot.empty) {
            console.log("Seeding Firestore 'contracts' collection...");
            MOCK_CONTRACTS.forEach(contract => {
                const docRef = doc(db, 'contracts', contract.id);
                batch.set(docRef, toFirestore(contract));
            });
            needsCommit = true;
        }

        if (notificationsSnapshot.empty) {
            console.log("Seeding Firestore 'notifications' collection...");
            MOCK_NOTIFICATIONS.forEach(notif => {
                const docRef = doc(db, 'notifications', notif.id);
                batch.set(docRef, toFirestore(notif));
            });
            needsCommit = true;
        }

        if (galleriesSnapshot.empty) {
            console.log("Seeding Firestore 'galleries' collection...");
            MOCK_GALLERIES.forEach(gallery => {
                const docRef = doc(db, 'galleries', gallery.id);
                batch.set(docRef, toFirestore(gallery));
            });
            needsCommit = true;
        }

        if (needsCommit) {
            await batch.commit();
            console.log("Database seeded successfully.");
        } else {
            console.log("Database already contains data. Seeding skipped.");
        }

        // Run one-time migration if not already completed
        const migrationStatusRef = doc(metaCollection, 'migrationStatus');
        const migrationStatusDoc = await getDoc(migrationStatusRef);
        if (!migrationStatusDoc.exists() || !migrationStatusDoc.data()?.clientMigrationV1Complete) {
            await runClientMigration();
        }


        isInitialized = true;
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};


// --- Contract Functions ---

export const fetchContracts = async (): Promise<Contract[]> => {
    const querySnapshot = await getDocs(contractsCollection);
    return querySnapshot.docs.map(doc => fromFirestore({ id: doc.id, ...doc.data() }) as Contract);
};

export const fetchContractsByClientId = async (clientId: string): Promise<Contract[]> => {
    const q = query(contractsCollection, where("clientId", "==", clientId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => fromFirestore({ id: doc.id, ...doc.data() }) as Contract);
};

export const fetchContractById = async (id: string | undefined): Promise<Contract | undefined> => {
    if (!id) return undefined;
    const docRef = doc(db, 'contracts', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return fromFirestore({ id: docSnap.id, ...docSnap.data() }) as Contract;
    } else {
        return undefined;
    }
};

export const updateContract = async (contractToUpdate: Contract): Promise<Contract> => {
    const docRef = doc(db, 'contracts', contractToUpdate.id);
    await setDoc(docRef, toFirestore(contractToUpdate), { merge: true });
    return contractToUpdate;
};

export const createContract = async (newContract: Contract): Promise<Contract> => {
    const docRef = doc(db, 'contracts', newContract.id);
    await setDoc(docRef, toFirestore(newContract));
    return newContract;
}

export const deleteContract = async (id: string): Promise<void> => {
    const docRef = doc(db, 'contracts', id);
    await deleteDoc(docRef);
};

export const subscribeToContracts = (callback: (contracts: Contract[]) => void): Unsubscribe => {
    return onSnapshot(contractsCollection, (snapshot) => {
        const contracts = snapshot.docs.map(doc => fromFirestore({ id: doc.id, ...doc.data() }) as Contract);
        callback(contracts);
    });
};

// --- Template Functions ---

export const fetchTemplates = async (): Promise<Template[]> => {
    const querySnapshot = await getDocs(templatesCollection);
    return querySnapshot.docs.map(doc => fromFirestore({ id: doc.id, ...doc.data() }) as Template);
}

export const fetchTemplateById = async (id: string | undefined): Promise<Template | undefined> => {
    if (!id) return undefined;
    const docRef = doc(db, 'templates', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return fromFirestore({ id: docSnap.id, ...docSnap.data() }) as Template;
    } else {
        return undefined;
    }
}

export const createTemplate = async (newTemplate: Template): Promise<Template> => {
    const docRef = doc(db, 'templates', newTemplate.id);
    await setDoc(docRef, toFirestore(newTemplate));
    return newTemplate;
}

export const updateTemplate = async (templateToUpdate: Template): Promise<Template> => {
    const docRef = doc(db, 'templates', templateToUpdate.id);
    await setDoc(docRef, toFirestore(templateToUpdate), { merge: true });
    return templateToUpdate;
}

// --- Client Functions ---

export const fetchClients = async (): Promise<Client[]> => {
    const querySnapshot = await getDocs(clientsCollection);
    return querySnapshot.docs.map(doc => fromFirestore({ id: doc.id, ...doc.data() }) as Client);
};

export const subscribeToClients = (callback: (clients: Client[]) => void): Unsubscribe => {
    return onSnapshot(clientsCollection, (snapshot) => {
        const clients = snapshot.docs.map(doc => fromFirestore({ id: doc.id, ...doc.data() }) as Client);
        callback(clients);
    });
};

export const fetchClientById = async (id: string | undefined): Promise<Client | undefined> => {
    if (!id) return undefined;
    const docRef = doc(db, 'clients', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return fromFirestore({ id: docSnap.id, ...docSnap.data() }) as Client;
    }
    return undefined;
};

export const createClient = async (newClient: Omit<Client, 'id'>): Promise<Client> => {
    const id = `client_${Date.now()}`;
    const clientWithId: Client = { ...newClient, id, status: newClient.status || ClientStatus.ACTIVE };
    const docRef = doc(db, 'clients', id);
    await setDoc(docRef, toFirestore(clientWithId));
    return clientWithId;
};

export const updateClient = async (clientToUpdate: Client): Promise<Client> => {
    const docRef = doc(db, 'clients', clientToUpdate.id);
    await setDoc(docRef, toFirestore(clientToUpdate), { merge: true });
    return clientToUpdate;
};

export const deleteClient = async (id: string): Promise<void> => {
    const docRef = doc(db, 'clients', id);
    await deleteDoc(docRef);
};

// --- Session Functions ---
export const createSession = async (sessionData: Omit<Session, 'id'>): Promise<Session> => {
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSession: Session = { id, ...sessionData };

    const sessionRef = doc(db, 'sessions', id);
    await setDoc(sessionRef, toFirestore(newSession));

    // Also update the client to link this session
    const clientRef = doc(db, 'clients', newSession.clientId);
    await updateDoc(clientRef, {
        sessions: arrayUnion(id)
    });

    return newSession;
};

export const updateSession = async (sessionId: string, data: Partial<Session>): Promise<void> => {
    const sessionRef = doc(db, 'sessions', sessionId);
    await updateDoc(sessionRef, toFirestore(data));
};

export const fetchSessionsByClientId = async (clientId: string): Promise<Session[]> => {
    const q = query(sessionsCollection, where("clientId", "==", clientId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => fromFirestore({ id: doc.id, ...doc.data() }) as Session);
};

export const fetchAllSessions = async (): Promise<Session[]> => {
    const querySnapshot = await getDocs(sessionsCollection);
    return querySnapshot.docs.map(doc => fromFirestore({ id: doc.id, ...doc.data() }) as Session);
};

export const deleteSession = async (sessionId: string): Promise<void> => {
    // Note: This doesn't remove the session ID from the client's array for historical purposes.
    // A more complex implementation might handle that differently.
    const sessionRef = doc(db, 'sessions', sessionId);
    await deleteDoc(sessionRef);
};

// --- Notification Functions ---

export const fetchNotifications = async (): Promise<Notification[]> => {
    const querySnapshot = await getDocs(notificationsCollection);
    const notifications = querySnapshot.docs.map(doc => fromFirestore({ id: doc.id, ...doc.data() }) as Notification);
    return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const createNotification = async (notificationData: Omit<Notification, 'id'>): Promise<Notification> => {
    const id = `notif_${Date.now()}`;
    const newNotification: Notification = { ...notificationData, id };
    const docRef = doc(db, 'notifications', id);
    await setDoc(docRef, toFirestore(newNotification));
    return newNotification;
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
    const q = query(notificationsCollection, where("isRead", "==", false));
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);
    querySnapshot.forEach(document => {
        batch.update(document.ref, { isRead: true });
    });
    await batch.commit();
};

export const deleteAllNotifications = async (): Promise<void> => {
    const querySnapshot = await getDocs(notificationsCollection);

    // Firestore batch limit is 500 operations
    const BATCH_SIZE = 450; // Safety margin
    const chunks = [];

    for (let i = 0; i < querySnapshot.docs.length; i += BATCH_SIZE) {
        chunks.push(querySnapshot.docs.slice(i, i + BATCH_SIZE));
    }

    for (const chunk of chunks) {
        const batch = writeBatch(db);
        chunk.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    }
};



// --- Gallery Functions ---

export const createGallery = async (galleryData: Omit<Gallery, 'id'>): Promise<Gallery> => {
    const id = `gallery_${Date.now()}`;
    const newGallery: Gallery = { ...galleryData, id };

    const galleryRef = doc(db, 'galleries', id);
    await setDoc(galleryRef, toFirestore(newGallery));

    // Link this gallery to its contract
    const contractRef = doc(db, 'contracts', newGallery.contractId);
    await updateDoc(contractRef, {
        galleryIds: arrayUnion(id)
    });

    return newGallery;
};

export const fetchGalleriesByContractId = async (contractId: string): Promise<Gallery[]> => {
    const q = query(galleriesCollection, where("contractId", "==", contractId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => fromFirestore({ id: doc.id, ...doc.data() }) as Gallery);
};

export const fetchAllGalleries = async (): Promise<Gallery[]> => {
    const querySnapshot = await getDocs(galleriesCollection);
    return querySnapshot.docs.map(doc => fromFirestore({ id: doc.id, ...doc.data() }) as Gallery);
};

export const fetchGalleryById = async (id: string | undefined): Promise<Gallery | undefined> => {
    if (!id) return undefined;
    const docRef = doc(db, 'galleries', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return fromFirestore({ id: docSnap.id, ...docSnap.data() }) as Gallery;
    }
    return undefined;
};

export const updateGallery = async (galleryId: string, data: Partial<Gallery>): Promise<void> => {
    const galleryRef = doc(db, 'galleries', galleryId);
    await updateDoc(galleryRef, toFirestore(data));
};

export const deleteGallery = async (galleryId: string): Promise<void> => {
    const galleryRef = doc(db, 'galleries', galleryId);
    await deleteDoc(galleryRef);
    // Note: Does not remove from contract's galleryIds array. A more robust solution might do this.
};

// --- Analytics (Placeholder Functions) ---

export const trackGalleryView = async (galleryId: string) => {
    console.log(`Analytics: Tracking view for gallery ${galleryId}`);
    // In a real app, this would be an updateDoc call to increment a counter
    // and add a log entry to the gallery's analytics sub-collection or field.
};

export const trackGalleryDownload = async (galleryId: string) => {
    console.log(`Analytics: Tracking download for gallery ${galleryId}`);
};

// --- Goal Functions ---
export const fetchGoals = async (): Promise<Goal[]> => {
    const querySnapshot = await getDocs(goalsCollection);
    return querySnapshot.docs.map(doc => fromFirestore({ id: doc.id, ...doc.data() }) as Goal);
};

export const createGoal = async (goalData: Omit<Goal, 'id'>): Promise<Goal> => {
    const id = `goal_${Date.now()}`;
    const newGoal: Goal = { ...goalData, id };
    const docRef = doc(db, 'goals', id);
    await setDoc(docRef, toFirestore(newGoal));
    return newGoal;
};

export const updateGoal = async (goal: Goal): Promise<void> => {
    const docRef = doc(db, 'goals', goal.id);
    await setDoc(docRef, toFirestore(goal), { merge: true });
};

export const deleteGoal = async (goalId: string): Promise<void> => {
    const docRef = doc(db, 'goals', goalId);
    await deleteDoc(docRef);
};

// --- Invoice Functions ---

export const fetchInvoices = async (): Promise<Invoice[]> => {
    const querySnapshot = await getDocs(invoicesCollection);
    return querySnapshot.docs.map(doc => fromFirestore({ id: doc.id, ...doc.data() }) as Invoice);
};

export const fetchInvoiceById = async (id: string | undefined): Promise<Invoice | undefined> => {
    if (!id) return undefined;
    const docRef = doc(db, 'invoices', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return fromFirestore({ id: docSnap.id, ...docSnap.data() }) as Invoice;
    }
    return undefined;
};

export const fetchInvoicesByClientId = async (clientId: string): Promise<Invoice[]> => {
    const q = query(invoicesCollection, where("clientId", "==", clientId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => fromFirestore({ id: doc.id, ...doc.data() }) as Invoice);
};

export const createInvoice = async (newInvoice: Invoice): Promise<Invoice> => {
    const docRef = doc(db, 'invoices', newInvoice.id);
    await setDoc(docRef, toFirestore(newInvoice));
    return newInvoice;
};

export const updateInvoice = async (invoiceToUpdate: Invoice): Promise<Invoice> => {
    const docRef = doc(db, 'invoices', invoiceToUpdate.id);
    await setDoc(docRef, toFirestore(invoiceToUpdate), { merge: true });
    return invoiceToUpdate;
};

export const deleteInvoice = async (id: string): Promise<void> => {
    const docRef = doc(db, 'invoices', id);
    await deleteDoc(docRef);
};

export const subscribeToInvoices = (callback: (invoices: Invoice[]) => void): Unsubscribe => {
    return onSnapshot(invoicesCollection, (snapshot) => {
        const invoices = snapshot.docs.map(doc => fromFirestore({ id: doc.id, ...doc.data() }) as Invoice);
        callback(invoices);
    });
};