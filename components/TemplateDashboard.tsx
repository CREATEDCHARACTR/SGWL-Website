import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTemplates } from '../services/geminiService';
import { Template } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';

const TemplateDashboard: React.FC = () => {
  const [templates, setTemplates] = useState<Template[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const fetchedTemplates = await getTemplates();
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error("Failed to load templates:", error);
        setTemplates([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadTemplates();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contract Templates</h1>
        <Link to="/templates/new">
          <Button className="w-full sm:w-auto">Create Template</Button>
        </Link>
      </div>

       {isLoading ? (
        <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading templates...</div>
      ) : !templates || templates.length === 0 ? (
        <div className="text-center p-8 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold dark:text-white">No Templates Found</h3>
            <p className="mt-2">Get started by creating your first reusable contract template.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="flex flex-col">
              <div className="p-6 flex-grow">
                 <span className="px-2 py-1 text-xs font-semibold rounded-full bg-brand-primary/10 text-brand-primary">{template.contractType}</span>
                <h2 className="text-lg font-semibold mt-2 dark:text-white">{template.name}</h2>
                 <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-400 list-disc list-inside mt-2">
                    {template.description.map(d => <li key={d}>{d}</li>)}
                </ul>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl border-t dark:border-gray-700">
                 <Link to={`/templates/${template.id}/edit`}>
                    <Button variant="secondary" className="w-full">Edit Template</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateDashboard;