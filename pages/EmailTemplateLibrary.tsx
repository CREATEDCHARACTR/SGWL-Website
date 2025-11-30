import React, { useState, useMemo } from 'react';
import { EmailTemplate, EmailTemplateCategory } from '../types';
import { getTemplates } from '../services/emailService';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const EmailTemplatePreviewModal: React.FC<{ template: EmailTemplate, onClose: () => void }> = ({ template, onClose }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl my-8">
            <div className="p-4 border-b dark:border-gray-700">
                <h3 className="font-bold text-lg dark:text-white">{template.name}</h3>
                <p className="text-sm text-gray-500">{template.category}</p>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                    <label className="text-xs font-bold uppercase text-gray-500">Subject</label>
                    <p className="p-2 bg-gray-100 dark:bg-gray-700 rounded mt-1">{template.subject}</p>
                </div>
                <div>
                    <label className="text-xs font-bold uppercase text-gray-500">Body</label>
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded mt-1 whitespace-pre-wrap text-sm">{template.body}</div>
                </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end">
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </div>
        </div>
    </div>
);


const EmailTemplateLibrary: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

    const allTemplates = useMemo(() => getTemplates(), []);

    const filteredTemplates = useMemo(() => {
        if (!searchQuery) return allTemplates;
        const lowercasedQuery = searchQuery.toLowerCase();
        return allTemplates.filter(t =>
            t.name.toLowerCase().includes(lowercasedQuery) ||
            t.subject.toLowerCase().includes(lowercasedQuery) ||
            t.body.toLowerCase().includes(lowercasedQuery)
        );
    }, [allTemplates, searchQuery]);

    const groupedTemplates = useMemo(() => {
        return filteredTemplates.reduce((acc, template) => {
            const category = template.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(template);
            return acc;
        }, {} as Record<string, EmailTemplate[]>);
    }, [filteredTemplates]);

    const handleCopy = (template: EmailTemplate) => {
        navigator.clipboard.writeText(template.body);
        // Add a visual feedback if needed
    };

    return (
        <>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white">📧 Email Templates</h1>
                    <Button onClick={() => alert('New Template creation coming soon!')}>+ New Template</Button>
                </div>

                <Card className="p-4 sm:p-6">
                    <Input
                        id="search-templates"
                        type="search"
                        placeholder="Search templates by name, subject, or content..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </Card>

                <div className="space-y-8">
                    {Object.entries(groupedTemplates).length > 0 ? (
                        (Object.entries(groupedTemplates) as [string, EmailTemplate[]][]).map(([category, templatesInCategory]) => (
                            <div key={category}>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 pb-2 border-b-2 dark:border-gray-700">
                                    {category} ({templatesInCategory.length})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {templatesInCategory.map(template => (
                                        <Card key={template.id} className="flex flex-col">
                                            <div className="p-6 flex-grow">
                                                <h3 className="font-bold text-lg dark:text-white">{template.name}</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                                    Subject: {template.subject}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl border-t dark:border-gray-700 flex justify-end items-center gap-2">
                                                <Button variant="secondary" className="text-sm !py-1.5 !px-3" onClick={() => setSelectedTemplate(template)}>Preview</Button>
                                                <Button variant="secondary" className="text-sm !py-1.5 !px-3" onClick={() => handleCopy(template)}>Copy</Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-xl text-gray-500">No templates match your search.</p>
                        </div>
                    )}
                </div>
            </div>
            {selectedTemplate && <EmailTemplatePreviewModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />}
        </>
    );
};

export default EmailTemplateLibrary;