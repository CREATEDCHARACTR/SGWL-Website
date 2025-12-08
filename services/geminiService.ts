import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Contract, Template, Client, Session, Notification, Gallery, Goal, Invoice } from '../types';
import * as db from './db';

// Ensure you have your API key set in environment variables
// In a real app, this would be handled securely on the server-side.
// For this frontend example, we assume it's available, but warn against production use.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn("Gemini API key not found in VITE_GEMINI_API_KEY. AI features will be disabled.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// --- Contract Persistence Logic using DB service ---

export const getContracts = async (): Promise<Contract[]> => {
    return await db.fetchContracts();
};

export const subscribeToContracts = (callback: (contracts: Contract[]) => void, onError?: (error: any) => void): () => void => {
    return db.subscribeToContracts(callback, onError);
};

export const getContractById = async (id: string | undefined): Promise<Contract | undefined> => {
    return await db.fetchContractById(id);
};

export const fetchContractsByClientId = async (clientId: string): Promise<Contract[]> => {
    return await db.fetchContractsByClientId(clientId);
};

export const createContract = async (newContract: Contract): Promise<void> => {
    await db.createContract(newContract);
};

export const updateContract = async (contractToUpdate: Contract): Promise<void> => {
    await db.updateContract(contractToUpdate);
};

export const deleteContract = async (id: string): Promise<void> => {
    await db.deleteContract(id);
};

export const archiveContract = async (id: string): Promise<void> => {
    const contract = await db.fetchContractById(id);
    if (!contract) throw new Error('Contract not found');

    const archivedContract = {
        ...contract,
        status: 'Archived' as any,
        updatedAt: new Date().toISOString(),
        auditTrail: [
            ...(contract.auditTrail || []),
            {
                id: `aud_${Date.now()}`,
                eventType: 'archived' as any,
                createdAt: new Date().toISOString(),
                meta: { previousStatus: contract.status },
                ip: '0.0.0.0',
                userAgent: 'System',
            }
        ]
    };

    await db.updateContract(archivedContract);
};

export const unarchiveContract = async (id: string, targetStatus?: string): Promise<void> => {
    const contract = await db.fetchContractById(id);
    if (!contract) throw new Error('Contract not found');

    // Default to Draft if no target status provided
    const newStatus = targetStatus || 'Draft';

    const unarchivedContract = {
        ...contract,
        status: newStatus as any,
        updatedAt: new Date().toISOString(),
        auditTrail: [
            ...(contract.auditTrail || []),
            {
                id: `aud_${Date.now()}`,
                eventType: 'unarchived' as any,
                createdAt: new Date().toISOString(),
                meta: { newStatus },
                ip: '0.0.0.0',
                userAgent: 'System',
            }
        ]
    };

    await db.updateContract(unarchivedContract);
};


// --- Template Persistence Logic ---

export const getTemplates = async (): Promise<Template[]> => {
    return await db.fetchTemplates();
};

export const getTemplateById = async (id: string | undefined): Promise<Template | undefined> => {
    return await db.fetchTemplateById(id);
};

export const createTemplate = async (newTemplate: Template): Promise<void> => {
    await db.createTemplate(newTemplate);
};

export const updateTemplate = async (templateToUpdate: Template): Promise<void> => {
    await db.updateTemplate(templateToUpdate);
};

// --- Client Persistence Logic ---
export const fetchClients = async (): Promise<Client[]> => {
    return await db.fetchClients();
};

export const subscribeToClients = (callback: (clients: Client[]) => void, onError?: (error: any) => void): () => void => {
    return db.subscribeToClients(callback, onError);
};

export const fetchClientById = async (id: string | undefined): Promise<Client | undefined> => {
    return await db.fetchClientById(id);
};

export const createClient = async (newClient: Omit<Client, 'id'>): Promise<Client> => {
    return await db.createClient(newClient);
};

export const updateClient = async (clientToUpdate: Client): Promise<void> => {
    await db.updateClient(clientToUpdate);
};

export const deleteClient = async (id: string): Promise<void> => {
    await db.deleteClient(id);
};

// --- Session Persistence Logic ---
export const createSession = async (sessionData: Omit<Session, 'id'>): Promise<Session> => {
    return await db.createSession(sessionData);
};

export const updateSession = async (sessionId: string, data: Partial<Session>): Promise<void> => {
    return await db.updateSession(sessionId, data);
};

export const fetchSessionsByClientId = async (clientId: string): Promise<Session[]> => {
    return await db.fetchSessionsByClientId(clientId);
};

export const fetchAllSessions = async (): Promise<Session[]> => {
    return await db.fetchAllSessions();
};

export const deleteSession = async (sessionId: string): Promise<void> => {
    return await db.deleteSession(sessionId);
};


// --- Notification Persistence Logic ---
export const fetchNotifications = async (): Promise<Notification[]> => {
    return await db.fetchNotifications();
};

export const createNotification = async (notificationData: Omit<Notification, 'id'>): Promise<Notification> => {
    return await db.createNotification(notificationData);
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
    return await db.markAllNotificationsAsRead();
};

// --- Gallery Persistence Logic ---
export const createGallery = async (galleryData: Omit<Gallery, 'id'>): Promise<Gallery> => {
    return await db.createGallery(galleryData);
};

export const updateGallery = async (galleryId: string, data: Partial<Gallery>): Promise<void> => {
    await db.updateGallery(galleryId, data);
};

export const deleteGallery = async (galleryId: string): Promise<void> => {
    await db.deleteGallery(galleryId);
};
export const fetchGalleriesByContractId = async (contractId: string): Promise<Gallery[]> => {
    return await db.fetchGalleriesByContractId(contractId);
};
export const fetchAllGalleries = async (): Promise<Gallery[]> => {
    return await db.fetchAllGalleries();
};
export const fetchGalleryById = async (id: string | undefined): Promise<Gallery | undefined> => {
    return await db.fetchGalleryById(id);
};

export const trackGalleryView = async (galleryId: string) => {
    return await db.trackGalleryView(galleryId);
};
export const trackGalleryDownload = async (galleryId: string) => {
    return await db.trackGalleryDownload(galleryId);
};

// --- Goal Persistence Logic ---
export const fetchGoals = async (): Promise<Goal[]> => {
    return await db.fetchGoals();
};
export const createGoal = async (goalData: Omit<Goal, 'id'>): Promise<Goal> => {
    return await db.createGoal(goalData);
};
export const updateGoal = async (goal: Goal): Promise<void> => {
    return await db.updateGoal(goal);
};
export const deleteGoal = async (goalId: string): Promise<void> => {
    return await db.deleteGoal(goalId);
};


// --- End Contract Persistence Logic ---


export const generateClauseSuggestion = async (prompt: string): Promise<string> => {
    if (!ai) {
        return Promise.resolve("AI service is not configured. Please add the VITE_GEMINI_API_KEY environment variable.");
    }

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a helpful assistant for a contract creation app. Your goal is to write clear, plain-English contract clauses. Do NOT provide legal advice. Based on the following prompt, generate a single contract clause.

        Prompt: "${prompt}"`,
            config: {
                temperature: 0.7,
                topP: 1,
                topK: 32,
                maxOutputTokens: 256,
            },
        });

        return response.text;
    } catch (error) {
        console.error("Error generating clause suggestion:", error);
        return "There was an error generating the suggestion. Please try again.";
    }
};

export const generateSuggestedAnswers = async (question: string, templateName: string, clientName: string): Promise<string[]> => {
    if (!ai) {
        return Promise.resolve([]);
    }

    try {
        const prompt = `You are a helpful contract assistant. For the following user question, provide three distinct, concise, and realistic example answers. Return a JSON array of 3 strings.

        Contract Type: "${templateName}"
        Client Name: "${clientName || 'not specified yet'}"
        Question: "${question}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING,
                    },
                },
                temperature: 0.8,
            },
        });

        const jsonStr = response.text.trim();
        const suggestions = JSON.parse(jsonStr);

        if (Array.isArray(suggestions) && suggestions.every(s => typeof s === 'string')) {
            return suggestions.slice(0, 3); // Ensure only 3 are returned
        }
        return [];

    } catch (error) {
        console.error("Error generating suggested answers:", error);
        return []; // Return empty array on error
    }
};

// --- Invoice Persistence Logic ---

export const getInvoices = async (): Promise<Invoice[]> => {
    return await db.fetchInvoices();
};

export const subscribeToInvoices = (callback: (invoices: Invoice[]) => void, onError?: (error: any) => void): () => void => {
    return db.subscribeToInvoices(callback, onError);
};

export const getInvoiceById = async (id: string | undefined): Promise<Invoice | undefined> => {
    return await db.fetchInvoiceById(id);
};

export const getInvoicesByClientId = async (clientId: string): Promise<Invoice[]> => {
    return await db.fetchInvoicesByClientId(clientId);
};

export const createInvoice = async (newInvoice: Invoice): Promise<void> => {
    await db.createInvoice(newInvoice);
};

export const updateInvoice = async (invoiceToUpdate: Invoice): Promise<void> => {
    await db.updateInvoice(invoiceToUpdate);
};

export const deleteInvoice = async (id: string): Promise<void> => {
    await db.deleteInvoice(id);
};