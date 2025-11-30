import { GOOGLE_CONFIG } from '../config-calendar.js';
import { Session } from '../types';

/**
 * Builds the URL for the Google OAuth 2.0 consent screen, initiating the authorization code flow.
 */
export const getGoogleAuthUrl = (): string => {
    const params = new URLSearchParams({
        client_id: GOOGLE_CONFIG.CLIENT_ID,
        redirect_uri: GOOGLE_CONFIG.REDIRECT_URI,
        response_type: 'code',
        scope: GOOGLE_CONFIG.SCOPES,
        access_type: 'offline', // Required to get a refresh token for long-term access
        prompt: 'consent',      // Forces the consent screen to be shown, ensuring a refresh token is issued
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

/**
 * Exchanges an authorization code for access and refresh tokens.
 *
 * ⚠️ SECURITY WARNING: This is a placeholder function for demonstration.
 * In a real production application, this entire function MUST be executed on a secure backend server
 * (e.g., a Firebase Cloud Function) to protect your CLIENT_SECRET.
 * The frontend should send the 'code' to your backend, and the backend would then perform this exchange.
 *
 * @param code The authorization code received from Google's redirect.
 * @returns A promise that resolves to an object indicating success or failure.
 */
export const exchangeCodeForTokens = async (code: string): Promise<{ success: boolean; error?: string }> => {
    console.log("--- SIMULATING TOKEN EXCHANGE ---");
    console.log("Authorization Code:", code);
    console.warn("In a real app, this code would be sent to a secure backend to be exchanged for tokens.");

    // This is where you would make a POST request from your backend to:
    // 'https://oauth2.googleapis.com/token'
    // with a body including your client_id, client_secret, code, grant_type='authorization_code', and redirect_uri.

    // For demonstration purposes, we will simulate a successful exchange.
    return new Promise(resolve => {
        setTimeout(() => {
            // In a real scenario, your backend would receive and securely store access_token, refresh_token, etc.,
            // likely in Firestore associated with the user.
            // Here, we just store a flag in localStorage indicating authentication is complete.
            localStorage.setItem('google_auth_token', JSON.stringify({ authenticated: true, timestamp: Date.now() }));
            console.log("--- SIMULATION COMPLETE: Stored dummy auth flag in localStorage. ---");
            resolve({ success: true });
        }, 1500); // Simulate network delay
    });
};

/**
 * Creates a Google Calendar event.
 *
 * NOTE: This is a placeholder. A real implementation would:
 * 1. Be a backend function.
 * 2. Retrieve the user's stored access/refresh tokens from a database (e.g., Firestore).
 * 3. Use the tokens to make an authenticated API call to Google Calendar.
 */
export const createGoogleCalendarEvent = async (session: Session): Promise<any> => {
    console.warn("Placeholder: createGoogleCalendarEvent called. In a real app, this would be a backend call.");
    
    // Simulate a successful API call for UI purposes
    return Promise.resolve({
        id: `simulated_event_${Date.now()}`,
        htmlLink: '#',
        summary: session.sessionDetails.type,
    });
};
