
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clause, Variable, Template, TemplateType, VariableType } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import { generateClauseSuggestion, getTemplateById, createTemplate, updateTemplate } from '../services/geminiService';

const VariablesTable: React.FC<{ variables: Variable[], onUpdate: (vars: Variable[]) => void }> = ({ variables, onUpdate }) => {
    const addVariable = () => {
        const newVar: Variable = {
            id: `var_${Date.now()}`,
            label: 'New Variable',
            name: 'new_variable',
            type: VariableType.TEXT
        };
        onUpdate([...variables, newVar]);
    }
    
    const baseInputClasses = "p-2 border rounded md:col-span-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white";

    return (
        <div className="space-y-2">
            {variables.map((v, i) => (
                <div key={v.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                    <input type="text" value={v.label} placeholder="Label" className={baseInputClasses} onChange={(e) => {
                        const newVars = [...variables];
                        newVars[i].label = e.target.value;
                        onUpdate(newVars);
                    }} />
                    <input type="text" value={v.name} placeholder="Name (e.g. client_name)" className={baseInputClasses} onChange={(e) => {
                        const newVars = [...variables];
                        newVars[i].name = e.target.value.toLowerCase().replace(/\s/g, '_');
                        onUpdate(newVars);
                    }} />
                    <select value={v.type} className={baseInputClasses} onChange={(e) => {
                        const newVars = [...variables];
                        newVars[i].type = e.target.value as VariableType;
                        onUpdate(newVars);
                    }}>
                        <option value={VariableType.TEXT}>Text</option>
                        <option value={VariableType.NUMBER}>Number</option>
                        <option value={VariableType.DATE}>Date</option>
                        <option value={VariableType.PERCENTAGE}>Percentage</option>
                    </select>
                    <Button variant="danger" onClick={() => onUpdate(variables.filter(vr => vr.id !== v.id))} className="text-xs !p-1 h-8">Remove</Button>
                </div>
            ))}
            <Button variant="secondary" onClick={addVariable} className="w-full mt-2">+ Add Variable</Button>
        </div>
    )
};

const ClauseToggle: React.FC<{ clause: Clause, onUpdate: (clause: Clause) => void, onDelete: (id: string) => void }> = ({ clause, onUpdate, onDelete }) => (
    <details className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md group">
        <summary className="flex items-center justify-between cursor-pointer">
            <span className="font-medium">{clause.label}</span>
            <div className="flex items-center space-x-2">
                 <button onClick={(e) => {e.preventDefault(); onDelete(clause.id)}} className="text-red-500 hover:text-red-700 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">DELETE</button>
                <span className="text-sm text-gray-500 dark:text-gray-400">Default</span>
                <input type="checkbox" checked={clause.defaultEnabled} onChange={e => onUpdate({ ...clause, defaultEnabled: e.target.checked })} className="h-4 w-4 rounded border-gray-300 dark:border-gray-500 text-brand-primary focus:ring-brand-primary dark:bg-gray-600" />
            </div>
        </summary>
        <div className="mt-4 pt-2 border-t dark:border-gray-600">
            <textarea value={clause.content} onChange={e => onUpdate({...clause, content: e.target.value})} className="w-full h-24 p-2 border rounded text-sm bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
        </div>
    </details>
);

const blankTemplate: Template = {
  id: `template_${Date.now()}`,
  name: '',
  contractType: TemplateType.GENERAL,
  description: [],
  bodyMd: `# New Contract Template

Start writing your contract content here. Use variables like {{variable_name}} to insert dynamic data.`,
  clauses: [],
  variables: [],
  defaultValues: {},
};

const TemplateEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Template | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id === 'new') {
        setTemplate(blankTemplate);
    } else {
        const fetchTemplate = async () => {
            const fetchedTemplate = await getTemplateById(id);
            if(fetchedTemplate) {
                setTemplate(fetchedTemplate);
            } else {
                // Handle not found
                navigate('/templates');
            }
        }
        fetchTemplate();
    }
  }, [id, navigate]);

  const handleGenerateClause = async () => {
    setIsGenerating(true);
    setAiSuggestion('');
    const suggestion = await generateClauseSuggestion(aiPrompt);
    setAiSuggestion(suggestion);
    setIsGenerating(false);
  };
  
  const addClause = () => {
    if (!template) return;
    const newClause: Clause = {
      id: `clause_${Date.now()}`,
      name: `custom_clause_${template.clauses.length + 1}`,
      label: "New Custom Clause",
      defaultEnabled: true,
      content: aiSuggestion
    };
    setTemplate(prev => prev ? ({ ...prev, clauses: [...prev.clauses, newClause] }) : null);
    setIsAiModalOpen(false);
    setAiPrompt('');
    setAiSuggestion('');
  }
  
  const handleSave = async () => {
    if (!template) return;
    setIsSaving(true);
    if (id === 'new') {
        await createTemplate(template);
    } else {
        await updateTemplate(template);
    }
    setIsSaving(false);
    navigate('/templates');
  };

  if (!template) {
      return <div>Loading template...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{id === 'new' ? 'Create New Template' : 'Edit Template'}</h1>
        <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Template'}</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                     <Input id="template_name" label="Template Name" value={template.name} onChange={(e) => setTemplate({...template, name: e.target.value})} placeholder="e.g., Standard Photography Agreement" />
                     <div>
                         <label htmlFor="template_type" className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                         <select id="template_type" value={template.contractType} onChange={(e) => setTemplate({...template, contractType: e.target.value as TemplateType})} className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-base p-3">
                            {Object.values(TemplateType).map(type => <option key={type} value={type}>{type}</option>)}
                         </select>
                     </div>
                </div>
                 <Input id="template_desc" label="Description (comma-separated)" value={template.description.join(', ')} onChange={(e) => setTemplate({...template, description: e.target.value.split(',').map(s => s.trim())})} placeholder="e.g., Events, portraits, product shots" />
            </div>
          </Card>
          <Card>
            <div className="p-8">
              <h2 className="text-2xl font-semibold mb-6 dark:text-white">Template Content</h2>
              <textarea
                value={template.bodyMd}
                onChange={(e) => setTemplate({ ...template, bodyMd: e.target.value })}
                className="w-full h-[500px] p-4 border rounded-lg font-mono text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                placeholder="Enter contract body in Markdown..."
              />
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <div className="p-8">
              <h3 className="text-lg font-semibold mb-4 dark:text-white">Variables</h3>
              <VariablesTable variables={template.variables} onUpdate={(vars) => setTemplate({...template, variables: vars})} />
            </div>
          </Card>
          <Card>
            <div className="p-8 space-y-4">
              <h3 className="text-lg font-semibold dark:text-white">Optional Clauses</h3>
              {template.clauses.map(clause => (
                <ClauseToggle key={clause.id} clause={clause} onUpdate={(updatedClause) => {
                  setTemplate(prev => prev ? ({
                    ...prev,
                    clauses: prev.clauses.map(c => c.id === updatedClause.id ? updatedClause : c)
                  }) : null)
                }} onDelete={(clauseId) => setTemplate(prev => prev ? ({...prev, clauses: prev.clauses.filter(c => c.id !== clauseId)}) : null)} />
              ))}
               <Button variant="secondary" className="w-full mt-2" onClick={() => setIsAiModalOpen(true)}>
                + Add Clause with AI
              </Button>
            </div>
          </Card>
        </div>
      </div>
      
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 px-4 py-8 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg my-8">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Generate Clause with AI</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Describe the clause you need, and our AI assistant will draft it for you. (This is not legal advice).</p>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., 'A clause about late payment fees of 5% per month'"
              className="w-full h-24 p-2 border rounded mb-4 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 dark:text-white"
              disabled={isGenerating}
            />
            <Button onClick={handleGenerateClause} disabled={isGenerating || !aiPrompt}>
              {isGenerating ? 'Generating...' : 'Generate Suggestion'}
            </Button>
            {aiSuggestion && (
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded max-h-72 overflow-y-auto">
                <p className="text-sm font-semibold mb-2 dark:text-white">Suggestion:</p>
                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{aiSuggestion}</p>
                 <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="secondary" onClick={handleGenerateClause} disabled={isGenerating}>Regenerate</Button>
                  <Button onClick={addClause} disabled={isGenerating}>Add Clause to Template</Button>
                </div>
              </div>
            )}
            <div className="flex justify-end mt-6">
              <Button variant="secondary" onClick={() => setIsAiModalOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateEditor;