import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ContractCreator from './components/ContractCreator';
import ContractDetail from './components/ContractDetail';
import SignerPortal from './components/SignerPortal';
import TemplateDashboard from './components/TemplateDashboard';
import TemplateEditor from './components/TemplateEditor';
import { initializeDatabase } from './services/db';
import { auth } from './services/firebase';
import ContractEditor from './components/ContractEditor';
import ClientList from './components/ClientList';
import ClientProfile from './components/ClientProfile';
import CalendarPage from './pages/CalendarPage';
import CalendarCallbackPage from './pages/CalendarCallbackPage';
import EmailTemplateLibrary from './pages/EmailTemplateLibrary';
import PublicGalleryPage from './pages/PublicGalleryPage';
import PortfolioPage from './pages/PortfolioPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SearchModal from './components/ui/SearchModal';
import SettingsModal from './components/ui/SettingsModal';
import KeyboardShortcutsModal from './components/ui/KeyboardShortcutsModal';
import BottomNav from './components/ui/BottomNav';
import InvoiceList from './components/InvoiceList';
import InvoiceCreator from './components/InvoiceCreator';
import InvoiceDetail from './components/InvoiceDetail';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import GalleriesList from './components/GalleriesList';
import PublicLayout from './components/PublicLayout';
import LoginPage from './pages/LoginPage';

export type Theme = 'light' | 'dark' | 'system';

const useTheme = (): [Theme, (theme: Theme) => void] => {
  const [theme, setTheme] = useState<Theme>((localStorage.getItem('theme') as Theme) || 'system');

  const applyTheme = useCallback((selectedTheme: Theme) => {
    localStorage.setItem('theme', selectedTheme);
    if (selectedTheme === 'dark' || (selectedTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, applyTheme]);

  return [theme, setTheme];
};

const KeyboardShortcuts: React.FC<{ onOpenShortcuts: () => void, onOpenSearch: () => void }> = ({ onOpenShortcuts, onOpenSearch }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isEditing = (event.target as HTMLElement).tagName === 'INPUT' || (event.target as HTMLElement).tagName === 'TEXTAREA';

      if (event.key === '?' && !isEditing) {
        event.preventDefault();
        onOpenShortcuts();
      }
      if ((event.key === '/' || (event.metaKey && event.key === 'k')) && !isEditing) {
        event.preventDefault();
        onOpenSearch();
      }
      // Navigation shortcuts
      if (!isEditing && !event.metaKey && !event.ctrlKey) {
        switch (event.key.toLowerCase()) {
          case 'c': navigate('/dashboard'); break;
          case 'l': navigate('/clients'); break;
          case 'a': navigate('/analytics'); break;
          case 'e': navigate('/emails'); break;
          case 'n': navigate('/contracts/new'); break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, onOpenShortcuts, onOpenSearch]);

  return null;
};


const Background: React.FC = () => (
  <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full bg-brand-secondary dark:bg-gray-900">
      <div className="absolute top-[-20rem] -left-24 h-[40rem] w-[40rem] rounded-full bg-gradient-to-br from-blue-200 to-purple-200 opacity-40 dark:from-blue-900/50 dark:to-purple-900/50 blur-3xl" />
      <div className="absolute bottom-[-15rem] -right-24 h-[40rem] w-[40rem] rounded-full bg-gradient-to-br from-pink-200 to-amber-200 opacity-40 dark:from-pink-900/50 dark:to-amber-900/50 blur-3xl" />
    </div>
  </div>
);


const AdminLayout: React.FC<{ onOpenSearch: () => void; onOpenSettings: () => void; }> = ({ onOpenSearch, onOpenSettings }) => {
  return (
    <>
      <Header onOpenSearch={onOpenSearch} onOpenSettings={onOpenSettings} />
      <main className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto">
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
};


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [theme, setTheme] = useTheme();
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [authCode, setAuthCode] = useState<string | null>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  useEffect(() => {
    // Auth listener
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setIsAuthenticated(!!user);
      setIsAuthLoading(false);

      // Initialize DB only after auth state is known
      // If user is logged in, we can try to seed/access DB
      // If not, we still mark DB as "initialized" (checked) so the app renders
      if (user) {
        try {
          await initializeDatabase();
        } catch (error) {
          console.error("Failed to initialize database:", error);
        }
      }
      setIsDbInitialized(true);
    });

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setAuthCode(code);
    }

    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = () => {
    window.history.replaceState({}, document.title, window.location.pathname);
    window.location.hash = '/calendar';
    setAuthCode(null);
  };

  if (authCode) {
    return <CalendarCallbackPage code={authCode} onSuccess={handleAuthSuccess} />;
  }

  if (!isDbInitialized || isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-secondary dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400">
          {!isDbInitialized ? 'Loading a place where ideas become reality...' : 'Checking Authentication...'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-gray-800 dark:text-gray-200 isolate">
      <Background />
      <HashRouter>
        <KeyboardShortcuts onOpenShortcuts={() => setIsShortcutsOpen(true)} onOpenSearch={() => setIsSearchOpen(true)} />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/gallery" element={<PublicGalleryPage />} />
            <Route path="/gallery/:id" element={<PublicGalleryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign/:token" element={<SignerPortal />} />
          </Route>

          {/* Admin Routes */}
          <Route element={isAuthenticated ? <AdminLayout onOpenSearch={() => setIsSearchOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} /> : <Navigate to="/login" />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/clients/:id" element={<ClientProfile />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/emails" element={<EmailTemplateLibrary />} />
            <Route path="/contracts/new" element={<ContractCreator />} />
            <Route path="/contracts/:id" element={<ContractDetail />} />
            <Route path="/contracts/:id/edit" element={<ContractEditor />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoices/new" element={<InvoiceCreator />} />
            <Route path="/invoices/:id" element={<InvoiceDetail />} />
            <Route path="/galleries" element={<GalleriesList />} />
            <Route path="/templates" element={<TemplateDashboard />} />
            <Route path="/templates/new" element={<TemplateEditor />} />
            <Route path="/templates/:id/edit" element={<TemplateEditor />} />
          </Route>
        </Routes>
      </HashRouter>

      {isSearchOpen && <SearchModal onClose={() => setIsSearchOpen(false)} />}
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} currentTheme={theme} onThemeChange={setTheme} />}
      {isShortcutsOpen && <KeyboardShortcutsModal onClose={() => setIsShortcutsOpen(false)} />}
    </div>
  );
};

export default App;