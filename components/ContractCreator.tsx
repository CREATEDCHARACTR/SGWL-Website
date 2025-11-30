import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Template, Contract, ContractStatus, PartyRole, Variable, TemplateType, Client, ClientStatus, ReferralSource } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import KeyTermsSnapshot from './KeyTermsSnapshot';
import { createContract, getTemplates, updateClient, fetchClients, createClient, getContracts } from '../services/geminiService';
import GuidedBuilder from './GuidedBuilder';
import {
    AI_AGENT_QUESTION_FLOW,
    AI_AGENT_ADDON_COMMANDS,
    PHOTO_VIDEO_SUBSCRIPTION_QUESTION_FLOW,
    PHOTO_VIDEO_SUBSCRIPTION_ADDON_COMMANDS,
    PHOTOGRAPHY_QUESTION_FLOW,
    PHOTOGRAPHY_ADDON_COMMANDS,
    WEBSITE_QUESTION_FLOW,
    WEBSITE_ADDON_COMMANDS
} from '../constants';

const ServicePicker: React.FC<{ onSelect: (template: Template) => void }> = ({ onSelect }) => {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadTemplates = async () => {
            setIsLoading(true);
            try {
                const fetchedTemplates = await getTemplates();
                setTemplates(fetchedTemplates);
            } catch (error) {
                console.error("Failed to load templates:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadTemplates();
    }, []);

    return (
        <Card>
            <div className="p-8">
                <h2 className="text-2xl font-semibold mb-2 dark:text-white">Start a New Contract</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">Select a service to begin.</p>
                {isLoading ? (
                    <div className="text-center p-8 text-gray-500 dark:text-gray-400">Loading templates...</div>
                ) : templates.length === 0 ? (
                    <div className="text-center p-8 text-gray-500 dark:text-gray-400">No templates found. Go to the Templates section to create one.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {templates.filter(template => template.contractType).map(template => (
                            <div key={template.id} className="flex flex-col p-4 border dark:border-gray-700 rounded-lg hover:shadow-md hover:border-brand-primary dark:hover:bg-gray-700/50 transition-all">
                                <h3 className="font-bold text-lg mb-2 dark:text-white">{template.name}</h3>
                                <ul className="space-y-1 text-sm text-gray-500 dark:text-gray-400 list-disc list-inside flex-grow">
                                    {template.description.map(d => <li key={d}>{d}</li>)}
                                </ul>
                                <Button onClick={() => onSelect(template)} className="mt-4 w-full">
                                    Use This
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    )
};

const ModeSelector: React.FC<{ serviceName: string, onSelect: (mode: 'quick' | 'guided') => void, onBack: () => void }> = ({ serviceName, onSelect, onBack }) => (
    <Card>
        <div className="p-10 text-center">
            <h2 className="text-3xl font-bold mb-2 dark:text-white">New {serviceName} Contract</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">How would you like to build this contract?</p>
            <div className="flex flex-col md:flex-row justify-center gap-6">
                <button onClick={() => onSelect('quick')} className="p-8 border dark:border-gray-700 rounded-xl text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-brand-primary transition w-full md:w-96">
                    <h3 className="font-bold text-2xl dark:text-white">🚀 Quick Draft</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-base">Fill in ~8 core fields to generate a standard contract in 60 seconds.</p>
                </button>
                <button onClick={() => onSelect('guided')} className="p-8 border dark:border-gray-700 rounded-xl text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-brand-primary transition w-full md:w-96">
                    <h3 className="font-bold text-2xl dark:text-white">💬 Guided Build</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-base">A conversational wizard asks you questions one by one to build a more custom contract.</p>
                </button>
            </div>
            <div className="mt-8">
                <Button variant="secondary" onClick={onBack}>Back to Services</Button>
            </div>
        </div>
    </Card>
);

const QuickDraftForm: React.FC<{
    template: Template;
    onBack: () => void;
    onCreate: (values: Record<string, any>) => void;
}> = ({ template, onBack, onCreate }) => {

    const [values, setValues] = useState<Record<string, any>>(() => {
        const initialVals: Record<string, any> = {};
        template.quickDraftFields?.forEach(fieldName => {
            if (template.defaultValues[fieldName] !== undefined) {
                initialVals[fieldName] = template.defaultValues[fieldName];
            }
        });
        return initialVals;
    });

    const handleChange = (id: string, value: any) => {
        setValues(prev => {
            const newValues = { ...prev, [id]: value };
            // If engagement_type is changed for this specific template, clear out the other type's core financial fields
            if (id === 'engagement_type' && template.contractType === TemplateType.PHOTO_VIDEO_SUBSCRIPTION) {
                if (value === 'project') {
                    delete newValues.subscription_monthly_fee;
                    delete newValues.subscription_min_term_months;
                } else if (value === 'subscription') {
                    delete newValues.base_fee;
                    delete newValues.deposit_pct;
                }
            }
            return newValues;
        });
    };

    const allQuickDraftFields: Variable[] = template.quickDraftFields
        ? template.quickDraftFields
            .map(fieldName => template.variables.find(v => v.name === fieldName))
            .filter((v): v is Variable => !!v)
        : [];

    const isSubscriptionMode = template.contractType === TemplateType.PHOTO_VIDEO_SUBSCRIPTION && values.engagement_type === 'subscription';

    const renderField = (field: Variable) => {
        if (field.name === 'engagement_type' && template.contractType === TemplateType.PHOTO_VIDEO_SUBSCRIPTION) {
            return (
                <div key={field.id}>
                    <label htmlFor={field.name} className="block text-base font-medium text-gray-700 dark:text-gray-300 mb-2">{field.label}</label>
                    <select
                        id={field.name}
                        value={values[field.name] || 'project'}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm p-2"
                    >
                        <option value="project">Project (One-off)</option>
                        <option value="subscription">Subscription (Monthly)</option>
                    </select>
                </div>
            );
        }

        return (
            <Input
                key={field.id}
                id={field.name}
                label={field.label}
                type={field.type === 'percentage' ? 'number' : field.type}
                value={values[field.name] || ''}
                onChange={(e) => {
                    const val = e.target.value;
                    const isNum = field.type === 'number' || field.type === 'percentage';
                    handleChange(field.name, isNum ? (val === '' ? '' : Number(val)) : val);
                }}
                placeholder={String(template.defaultValues[field.name] || '')}
            />
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
                <Card>
                    <div className="p-8">
                        <h2 className="text-2xl font-semibold mb-6 dark:text-white">Quick Draft: <span className="text-brand-primary">{template.name}</span></h2>
                        <div className="space-y-4">
                            {allQuickDraftFields.map(field => {
                                if (template.contractType === TemplateType.PHOTO_VIDEO_SUBSCRIPTION) {
                                    if (isSubscriptionMode) {
                                        // In subscription mode, hide project-specific financial fields
                                        if (field.name === 'base_fee' || field.name === 'deposit_pct') return null;
                                    } else {
                                        // In project mode, hide subscription-specific financial fields
                                        if (field.name === 'subscription_monthly_fee' || field.name === 'subscription_min_term_months') return null;
                                    }
                                }
                                return renderField(field);
                            })}
                        </div>
                    </div>
                </Card>
                <div className="flex justify-between mt-6">
                    <Button variant="secondary" onClick={onBack}>Back</Button>
                    <Button onClick={() => onCreate(values)}>Create & Review</Button>
                </div>
            </div>
            <div className="lg:col-span-2">
                <KeyTermsSnapshot title="Key Terms Snapshot" data={values} contractType={template.contractType} />
            </div>
        </div>
    )
}

const ContractCreator: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'service' | 'mode' | 'draft'>('service');
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const [draftMode, setDraftMode] = useState<'quick' | 'guided' | null>(null);

    const handleSelectService = (template: Template) => {
        setSelectedTemplate(template);
        setStep('mode');
    };

    const handleSelectMode = (mode: 'quick' | 'guided') => {
        setDraftMode(mode);
        setStep('draft');
    };

    const findOrCreateClient = async (values: Record<string, any>): Promise<Client> => {
        const { client_legal_name, client_email, client_phone } = values;
        const now = new Date().toISOString();
        const allClients = await fetchClients();
        const safeClientEmail = (client_email || '').toLowerCase();
        let client = allClients.find(c => (c.personalInfo.email || '').toLowerCase() === safeClientEmail);

        if (client) {
            return client;
        }

        const newClientData: Omit<Client, 'id'> = {
            personalInfo: {
                name: client_legal_name,
                email: client_email,
                phone: client_phone,
            },
            businessInfo: {
                referralSource: ReferralSource.OTHER,
                clientSince: now,
                totalRevenue: 0,
                contractCount: 0,
                lastContact: now,
            },
            status: ClientStatus.HOT,
            contracts: [],
            meta: {
                createdAt: now,
                updatedAt: now,
                createdBy: 'Auto-Created',
            }
        };
        return await createClient(newClientData);
    };

    const handleCreateContract = async (values: Record<string, any>) => {
        if (!selectedTemplate) {
            console.error("Attempted to create a contract without a selected template.");
            return;
        }
        const newContractId = `contract_${Date.now()}`;
        const now = new Date().toISOString();

        const allContracts = await getContracts();
        const serialNumber = String(allContracts.length + 1).padStart(3, '0');
        const contractType = selectedTemplate.name;
        const clientName = values.client_legal_name || 'Client';
        const newTitle = `${contractType} - ${clientName} - ${serialNumber}`;

        const client = await findOrCreateClient(values);

        const newContract: Contract = {
            id: newContractId,
            orgId: 'org_123', // Mock orgId
            clientId: client.id,
            contractType: selectedTemplate.contractType,
            title: newTitle,
            clientName: values.client_legal_name || 'N/A',
            clientEmail: values.client_email || 'N/A',
            status: ContractStatus.DRAFT,
            variables: {
                ...selectedTemplate.defaultValues,
                ...values,
            },
            clauses: [],
            createdAt: now,
            updatedAt: now,
            parties: [
                { id: `party_${Date.now()}`, contractId: newContractId, role: PartyRole.PROVIDER, name: selectedTemplate.defaultValues.provider_contact_name || 'Saul Lowery', email: selectedTemplate.defaultValues.provider_email || 'saul@slp.com' },
                { id: `party_${Date.now() + 1}`, contractId: newContractId, role: PartyRole.CLIENT, name: values.client_legal_name || 'N/A', email: values.client_email || 'N/A' },
            ],
            signatureFields: [],
            version: 1,
            revisionRequests: [],
            nextSteps: [],
            requirements: [],
            followUps: [],
        };

        await createContract(newContract);

        // Update client status to Hot
        const updatedClient: Client = {
            ...client,
            status: ClientStatus.HOT,
            businessInfo: {
                ...client.businessInfo,
                lastContact: now,
                contractCount: (client.businessInfo.contractCount || 0) + 1,
            },
            contracts: [...client.contracts, newContractId],
        };
        await updateClient(updatedClient);

        navigate(`/contracts/${newContractId}`);
    };

    const resetFlow = () => {
        setStep('service');
        setSelectedTemplate(null);
        setDraftMode(null);
    }

    const backToMode = () => {
        setStep('mode');
        setDraftMode(null);
    }

    const renderGuidedBuilder = () => {
        if (!selectedTemplate) return null;

        switch (selectedTemplate.contractType) {
            case TemplateType.PHOTOGRAPHY:
                return (
                    <GuidedBuilder
                        template={selectedTemplate}
                        questionFlow={PHOTOGRAPHY_QUESTION_FLOW}
                        addonCommands={PHOTOGRAPHY_ADDON_COMMANDS}
                        onBack={backToMode}
                        onCreate={handleCreateContract}
                    />
                );
            case TemplateType.AI_AGENT:
                return (
                    <GuidedBuilder
                        template={selectedTemplate}
                        questionFlow={AI_AGENT_QUESTION_FLOW}
                        addonCommands={AI_AGENT_ADDON_COMMANDS}
                        onBack={backToMode}
                        onCreate={handleCreateContract}
                    />
                );
            case TemplateType.PHOTO_VIDEO_SUBSCRIPTION:
                return (
                    <GuidedBuilder
                        template={selectedTemplate}
                        questionFlow={PHOTO_VIDEO_SUBSCRIPTION_QUESTION_FLOW}
                        addonCommands={PHOTO_VIDEO_SUBSCRIPTION_ADDON_COMMANDS}
                        onBack={backToMode}
                        onCreate={handleCreateContract}
                    />
                );
            case TemplateType.WEBSITE:
                return (
                    <GuidedBuilder
                        template={selectedTemplate}
                        questionFlow={WEBSITE_QUESTION_FLOW}
                        addonCommands={WEBSITE_ADDON_COMMANDS}
                        onBack={backToMode}
                        onCreate={handleCreateContract}
                    />
                );
            default:
                return (
                    <div className="text-center p-8">
                        <p>Guided Build is not available for this template type yet.</p>
                        <Button onClick={backToMode} className="mt-4">Go Back</Button>
                    </div>
                );
        }
    };


    return (
        <div className="max-w-7xl mx-auto">
            {step === 'service' && <ServicePicker onSelect={handleSelectService} />}

            {step === 'mode' && selectedTemplate && (
                <ModeSelector
                    serviceName={selectedTemplate.name}
                    onSelect={handleSelectMode}
                    onBack={resetFlow}
                />
            )}

            {step === 'draft' && draftMode === 'quick' && selectedTemplate && (
                <QuickDraftForm
                    template={selectedTemplate}
                    onBack={backToMode}
                    onCreate={handleCreateContract}
                />
            )}

            {step === 'draft' && draftMode === 'guided' && renderGuidedBuilder()}
        </div>
    );
};

export default ContractCreator;