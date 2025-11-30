// config-calendar.js
// ⚠️ SECURITY WARNING: This is temporary for development only!
// These credentials should NOT be in production code.

export const GOOGLE_CONFIG = {
  CLIENT_ID: "715545026342-5j2b30fgaiotfnnvecufm4th7ulahhjs.apps.googleusercontent.com",
  API_KEY: "AIzaSyAQ25dpvFIr8ZHtBHS-zjxjHgCrsEg-mRU",
  SCOPES: 'https://www.googleapis.com/auth/calendar',
  CALENDAR_ID: 'primary',
  // IMPORTANT: This must exactly match one of the "Authorized redirect URIs"
  // in your Google Cloud Console credentials for your OAuth 2.0 Client ID.
  REDIRECT_URI: typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? window.location.origin
    : "https://slp-contract-studio-386543848247.us-west1.run.app"
};
