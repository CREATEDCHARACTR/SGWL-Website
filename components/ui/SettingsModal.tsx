import React from 'react';
import { Theme } from '../../App';
import { importData, exportData } from '../../utils/importData';
import { migrateLegacyData } from '../../utils/migrateLegacyData';
import Button from './Button';

interface SettingsModalProps {
    onClose: () => void;
    currentTheme: Theme;
    onThemeChange: (theme: Theme) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, currentTheme, onThemeChange }) => {
    const [importStatus, setImportStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [importMessage, setImportMessage] = React.useState('');

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImportStatus('loading');
        setImportMessage('Reading file...');

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                setImportMessage('Importing data...');
                const result = await importData(json);

                if (result.success) {
                    setImportStatus('success');
                    setImportMessage(`Successfully imported ${result.clientsImported} clients and ${result.contractsImported} contracts.`);
                } else {
                    setImportStatus('error');
                    setImportMessage(`Import failed: ${result.errors.join(', ')}`);
                }
            } catch (error) {
                setImportStatus('error');
                setImportMessage('Invalid JSON file.');
            }
        };
        reader.readAsText(file);
    };

    const ThemeButton: React.FC<{ theme: Theme, label: string }> = ({ theme, label }) => (
        <button
            onClick={() => onThemeChange(theme)}
            className={`flex-1 p-2 rounded-md text-sm font-semibold transition-colors ${currentTheme === theme ? 'bg-brand-primary text-white' : 'bg-gray-200 dark:bg-gray-700'
                }`}
        >
            {label}
        </button>
    );

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md my-8 animate-modal-grow flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b dark:border-gray-700 flex-shrink-0">
                    <h2 className="text-xl font-bold dark:text-white">⚙️ Settings</h2>
                </div>
                <div className="p-6 space-y-6 overflow-y-auto flex-grow">
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Appearance</h3>
                        <div className="flex flex-col gap-2">
                            <div className={`w-full p-4 rounded-lg border-2 cursor-pointer transition-all ${currentTheme === 'light' ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`} onClick={() => onThemeChange('light')}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">Light</span>
                                    {currentTheme === 'light' && <span className="text-brand-primary">✓</span>}
                                </div>
                                <p className="text-sm text-gray-500">Always use light mode</p>
                            </div>
                            <div className={`w-full p-4 rounded-lg border-2 cursor-pointer transition-all ${currentTheme === 'dark' ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`} onClick={() => onThemeChange('dark')}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">Dark</span>
                                    {currentTheme === 'dark' && <span className="text-brand-primary">✓</span>}
                                </div>
                                <p className="text-sm text-gray-500">Always use dark mode</p>
                            </div>
                            <div className={`w-full p-4 rounded-lg border-2 cursor-pointer transition-all ${currentTheme === 'system' ? 'border-brand-primary bg-brand-primary/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`} onClick={() => onThemeChange('system')}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">System</span>
                                    {currentTheme === 'system' && <span className="text-brand-primary">✓</span>}
                                </div>
                                <p className="text-sm text-gray-500">Follows your system settings</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Notifications</h3>
                        <p className="text-sm text-gray-500">Notification settings coming soon.</p>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Data Management</h3>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Import Data</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Import clients and contracts from a JSON backup file.
                            </p>

                            <div className="flex items-center gap-4">
                                <label className="cursor-pointer bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                                    <span>Select JSON File</span>
                                    <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                                </label>

                                {importStatus === 'loading' && <span className="text-sm text-blue-500">Processing...</span>}
                                {importStatus === 'success' && <span className="text-sm text-green-500">{importMessage}</span>}
                                {importStatus === 'error' && <span className="text-sm text-red-500">{importMessage}</span>}
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 mt-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Export Data</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                Download a JSON backup of all your clients and contracts.
                            </p>
                            <Button variant="secondary" onClick={exportData}>
                                Download Backup
                            </Button>
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mt-4">
                            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Migrate Legacy Data</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
                                Automatically import data from your old "Contracts" collection into the new system.
                            </p>
                            <Button onClick={async () => {
                                setImportStatus('loading');
                                setImportMessage('Migrating legacy data...');
                                const result = await migrateLegacyData();
                                if (result.success) {
                                    setImportStatus('success');
                                    setImportMessage(`Migrated ${result.clientsMigrated} clients and ${result.contractsMigrated} contracts.`);
                                } else {
                                    setImportStatus('error');
                                    setImportMessage(`Migration failed: ${result.errors.join(', ')}`);
                                }
                            }}>
                                Start Migration
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end flex-shrink-0 rounded-b-lg">
                    <Button onClick={onClose}>Done</Button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
