import React from 'react';
import Button from './Button';

interface KeyboardShortcutsModalProps {
    onClose: () => void;
}

const shortcuts = [
    { keys: ['/'], description: 'Open search' },
    { keys: ['?'], description: 'Show this help menu' },
    { keys: ['Esc'], description: 'Close any open modal or menu' },
    { keys: ['C'], description: 'Go to Contracts' },
    { keys: ['L'], description: 'Go to Clients' },
    { keys: ['A'], description: 'Go to Analytics' },
    { keys: ['E'], description: 'Go to Emails' },
    { keys: ['N'], description: 'Create a new contract' },
];

const ShortcutRow: React.FC<{ keys: string[], description: string }> = ({ keys, description }) => (
    <tr className="border-b dark:border-gray-700">
        <td className="py-2 pr-4">
            {keys.map(key => <kbd key={key} className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">{key}</kbd>)}
        </td>
        <td className="py-2 text-gray-600 dark:text-gray-300">{description}</td>
    </tr>
);

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-modal-backdrop p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg my-8 animate-modal-grow" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold dark:text-white">⌨️ Keyboard Shortcuts</h2>
                </div>
                <div className="p-6">
                    <table className="w-full text-left">
                        <tbody>
                            {shortcuts.map(shortcut => <ShortcutRow key={shortcut.description} {...shortcut} />)}
                        </tbody>
                    </table>
                </div>
                 <div className="p-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end">
                    <Button onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
};

export default KeyboardShortcutsModal;
