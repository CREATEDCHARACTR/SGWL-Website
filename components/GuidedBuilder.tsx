
import React, { useState, useEffect, useRef } from 'react';
import { Template, QuestionFlowItem, AddonCommand } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import Input from './ui/Input';
import KeyTermsSnapshot from './KeyTermsSnapshot';
import ChatMessage from './ChatMessage';
// import { generateSuggestedAnswers } from '../services/geminiService';

// Static suggestions to replace the live API call
const staticSuggestions = new Map<string, string[]>([
  ["What is the client's full legal name?", ["Jane Doe", "John Doe", "Michael Jackson"]],
  ["What is the client's primary email address?", ["jane.doe@example.com", "john.doe@example.com", "mj.jackson@example.com"]],
  ["What is the name of the person signing for the client?", ["Jane Doe", "John Doe", "Michael Jackson"]],
  ["What is their title? (e.g., 'Marketing Director')", ["Business Owner", "Marketing Manager", "Creative Director"]],
  ["What is a good contact phone number for the client?", ["555-123-4567", "555-987-6543", "555-246-8100"]],
  ["What is the primary location for the sessions?", ["Various Locations", "Studio – 1234 Creative Ave, Virginia Beach, VA", "Client Site – 5678 Business Rd, Norfolk, VA"]],
  ["What is the start date for this agreement?", ["3/30/2026", "4/1/2026", "9/2/2025"]],

  // NEW & UPDATED ENTRIES for Photo/Video Subscription
  ["What is the title for this subscription? (e.g., 'Monthly Content Program — Photo + Video')", ["Monthly Social Media Content", "Brand Photography & Video Retainer", "Real Estate Content Package"]],
  ["How would you describe the service window? (e.g., 'Rolling 30-day periods')", ["Rolling 30-day periods", "Rolling 60-day periods", "Rolling 90-day periods"]],
  ["What is the typical call time for sessions? (e.g., '9:30 AM')", ["09:30 AM", "10:00 AM", "Various Times"]],
  ["What is the turnaround time for photos, in business days?", ["10", "7", "14"]],
  ["What is the turnaround time for video, in business days?", ["14", "21", "10"]],
  ["For how many days will you retain photo project files after delivery?", ["60", "30", "90"]],
  ["For how many days will you retain video project files after delivery?", ["30", "60", "90"]],

  // AI AGENT SUGGESTIONS
  ["What is the title for this project? (e.g., 'AI Chatbot & Website Build')", ["AI Customer Support Agent", "Lead Generation Bot & Website", "Internal Knowledge Base AI"]],
  ["What is the website URL/domain?", ["https://example.com", "TBD", "staging.example.com"]],
  ["Briefly describe the website's purpose.", ["E-commerce store for handmade goods", "Corporate portfolio for a law firm", "SaaS landing page with auth", "Real estate listing platform"]],
  ["List the AI agent functions (e.g., lead gen, scheduling, support).", ["Customer Support Chatbot, Lead Qualification", "Appointment Scheduling, FAQ Answering", "Internal Document Search, Data Analysis", "Personalized Product Recommendations"]],
  ["What is the total base fee for design + AI build?", ["3500", "5000", "8500", "12000"]],
  ["What is the deposit percentage?", ["50", "30", "100"]],
  ["What is the monthly maintenance fee?", ["150", "300", "500", "999"]],
  ["What is the estimated annual renewal fee (domains, APIs)?", ["50", "100", "250", "500"]],
  ["What is the annual fee increase percentage?", ["3", "5", "7", "10"]],
  ["What payment methods are accepted? (e.g., 'Card, ACH')", ["Card, ACH", "ACH Only", "Card, ACH, Check"]],
  ["What is the card processing fee percentage?", ["2.9", "3.0", "3.5"]],
  ["What is the late fee amount (per 30 days)?", ["50", "100", "1.5% of balance"]],
  ["What is the hourly rate for out-of-scope work?", ["125", "150", "200", "250"]],
  ["What is the support response time? (e.g., '2 business days')", ["24 hours", "1 business day", "2 business days", "4 hours (Critical)"]],
  ["What are the support hours? (e.g., 'Mon–Fri 9AM–5PM ET')", ["Mon–Fri 9AM–5PM ET", "24/7", "Mon–Fri 8AM–6PM PT"]],
  ["Acceptance Criteria?", ["Client approval of UI designs and successful UAT of AI agent.", "Website loads in <2s, all forms work, AI answers 90% of test queries correctly.", "Passes all functional tests and security scan."]],
  ["Any special compliance needs? (e.g., GDPR, Colorado AI Act)", ["None", "GDPR (EU Users)", "HIPAA (Health Data)", "CCPA (California)", "Colorado AI Act"]],

  // WEBSITE DEVELOPMENT SUGGESTIONS
  ["What is the client's full legal name?", ["Acme Corp", "John Smith", "Tech Startups Inc."]],
  ["What is the client's primary email address?", ["client@example.com", "contact@acmecorp.com"]],
  ["What is the project title? (e.g., 'Corporate Website Redesign')", ["Corporate Website Redesign", "New E-commerce Store", "Portfolio Site Build"]],
  ["Briefly describe the website's purpose and core features.", ["Marketing site for law firm", "Online store for clothing brand", "SaaS landing page with blog"]],
  ["What is the domain/URL?", ["https://example.com", "TBD", "staging.site.com"]],
  ["What is the estimated page count or sitemap outline?", ["5-10 pages (Home, About, Services, Contact)", "Single page landing site", "20+ pages with blog"]],
  ["Who is responsible for content?", ["Client", "Provider", "Shared"]],
  ["Will the client provide design assets?", ["yes", "no"]],
  ["What is the project start date?", ["Immediately", "Next Monday", "First of next month"]],
  ["What is the target launch date?", ["In 4 weeks", "In 2 months", "TBD"]],
  ["What is the total base fee for design/build?", ["3500", "5000", "8500", "12000"]],
  ["What is the deposit percentage?", ["50", "30", "100"]],
  ["What payment methods are accepted?", ["Card, ACH", "ACH Only", "Card, ACH, Check"]],
  ["What is the card processing fee percentage?", ["2.9", "3.0", "3.5"]],
  ["What is the monthly maintenance fee?", ["150", "300", "500", "999"]],
  ["What is the estimated annual renewal fee?", ["50", "100", "250", "500"]],
  ["What is the annual fee increase percentage?", ["3", "5", "7", "10"]],
  ["What is the hourly rate for out-of-scope work?", ["125", "150", "200", "250"]],
  ["How many revision rounds are included?", ["1", "2", "3"]],
  ["What is the accessibility standard?", ["WCAG 2.2 AA best-effort", "WCAG 2.1 A", "None specific"]],
  ["SEO Disclaimer?", ["best-effort; no ranking guarantees", "Basic on-page SEO included", "No SEO services included"]],
  ["Performance Budget (if applicable)?", ["Load time < 2s", "Page size < 2MB", "None"]],
  ["What is included in the maintenance scope?", ["updates, backups, security, 1 hour minor edits", "updates & backups only", "full management"]],
  ["What is the license type?", ["Client owns final site upon payment; Provider retains pre-existing IP", "Limited License"]],
  ["Portfolio Rights?", ["on", "off", "embargo"]],
  ["Acceptance Criteria?", ["site functions per approved comps and QA checklist", "Client approval"]],
  ["Governing Law State?", ["Virginia", "California", "New York"]],
  ["Venue Location?", ["Virginia Beach, VA", "Los Angeles, CA", "New York, NY"]],
  ["Liability Cap?", ["total fees paid", "12 months fees", "$10,000"]],
  ["Indemnity Scope?", ["Mutual", "Client Only", "Provider Only"]],
  ["Is a DPA required?", ["no", "yes"]],

  // CONTINUING WITH THE REST...
  ["Does this subscription include photography?", ["true", "false"]],
  ["Does this subscription include videography?", ["true", "false"]],
  ["What is the monthly subscription fee?", ["325", "750", "850"]],
  ["What is the minimum term for the subscription, in months?", ["3", "6", "12"]],
  ["How many sessions are included per month?", ["1", "2", "4"]],
  ["How many hours of coverage are included per session?", ["1", "2", "4"]],
  ["What is the total monthly quota for edited photos?", ["Up to 30", "Up to 60", "Up to 120"]],
  ["Approximately how many edited photos will be delivered per session?", ["15", "30", "60"]],
  ["What is the approximate length of the main highlight video in seconds?", ["30", "60", "90", "120"]],
  ["How many days' notice are required for booking a session?", ["3", "7", "14"]],
  ["How many days does the client have to review and accept deliverables before they are considered approved?", ["5", "14", "20"]],
  ["How many rounds of revisions are included for photos?", ["0", "1", "2"]],
  ["How many rounds of revisions are included for the main video edit?", ["1", "2", "3"]],
  ["What is the warranty window for file corrections (in days)?", ["3", "5", "7"]],
  ["What is the policy for unused sessions/quotas?", ["Unused sessions roll over for 30 days into the next month, then expire.", "Unused sessions expire at the end of the month (no rollover).", "Unused sessions roll over while the subscription remains active."]],
  ["What is the overage rate per hour if a session runs long?", ["90", "120", "150"]],
  ["What is the payment schedule?", ["Bills monthly in advance on the 1st of each month", "Bills on the 15th of each month", "Bi-weekly (every two weeks)"]],
  ["How many days' notice are required to cancel the subscription (after the min. term)?", ["7", "14", "30"]],
  ["How many grace days are allowed for non-payment?", ["3", "5", "7"]],
  ["Can you use the final work in your portfolio?", ["on", "off", "embargo"]],
  ["Who is responsible for music licensing?", ["client", "provider"]],
  ["Is raw footage included in the subscription fee?", ["false", "true"]],
  ["Are there any special notes or priorities to include in the SOW?", ["The content creator will perform all duties in a professional manner and ensure that the final deliverables meet the agreed-upon standards."]],
]);


interface GuidedBuilderProps {
  template: Template;
  questionFlow: QuestionFlowItem[];
  addonCommands: AddonCommand[];
  onBack: () => void;
  onCreate: (values: Record<string, any>) => void;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
}

interface HistoryState {
  values: Record<string, any>;
  messages: Message[];
  questionIndex: number;
  isAwaitingInput: boolean;
}


const GuidedBuilder: React.FC<GuidedBuilderProps> = ({ template, questionFlow, addonCommands, onBack, onCreate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [contractValues, setContractValues] = useState<Record<string, any>>({ ...template.defaultValues });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAwaitingInput, setIsAwaitingInput] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [step, setStep] = useState<'asking' | 'review'>('asking');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Initial setup
    const initialQuestionIndex = findNextQuestionIndex(0, { ...template.defaultValues });
    setCurrentQuestionIndex(initialQuestionIndex);
    askNextQuestion(initialQuestionIndex, { ...template.defaultValues });

    // Save initial state to history for undo
    const initialState: HistoryState = {
      values: { ...template.defaultValues },
      messages: [],
      questionIndex: initialQuestionIndex,
      isAwaitingInput: true,
    };
    setHistory([initialState]);
    setHistoryIndex(0);

  }, []);

  useEffect(() => {
    if (isAwaitingInput) {
      setTimeout(() => document.getElementById('userInput')?.focus(), 100);
    }
  }, [isAwaitingInput]);

  const saveStateToHistory = (newState: Partial<HistoryState>) => {
    const currentState = history[historyIndex];
    const nextState: HistoryState = {
      values: newState.values ?? currentState.values,
      messages: newState.messages ?? currentState.messages,
      questionIndex: newState.questionIndex ?? currentState.questionIndex,
      isAwaitingInput: newState.isAwaitingInput ?? currentState.isAwaitingInput,
    };

    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, nextState]);
    setHistoryIndex(newHistory.length);
  };


  const findNextQuestionIndex = (startIndex: number, values: Record<string, any>): number => {
    for (let i = startIndex; i < questionFlow.length; i++) {
      const question = questionFlow[i];
      if (!question.condition || question.condition(values)) {
        return i;
      }
    }
    return -1; // No more questions to ask
  };

  const performRiskCheck = (values: Record<string, any>): string => {
    // This is a simplified check based on a few key fields
    const checks = [
      { q: "Key financial terms (fee, term) are defined.", isOk: values.subscription_monthly_fee && values.subscription_min_term_months },
      { q: "Deliverable quotas are set.", isOk: values.subscription_photo_quota_per_month },
      { q: "Policies for cancellation and overtime are present.", isOk: values.cancellation_notice_days && values.overage_rate_per_hour },
      { q: "If portfolio use requires an embargo, the duration is specified.", isOk: values.portfolio_rights !== 'embargo' || (values.portfolio_rights === 'embargo' && values.embargo_days) },
    ];

    let report = "Alright, I've got everything. Here is a quick final check on the key terms:\n\n";
    checks.forEach(check => {
      report += `• ${check.isOk ? '✅' : '⚠️'} ${check.q}\n`;
    });
    report += "\nEverything looks to be in order. Please review the snapshot on the right one last time. When you're ready, click 'Create Contract'."
    return report;
  }

  const askNextQuestion = async (index: number, currentValues: Record<string, any>) => {
    if (index !== -1 && index < questionFlow.length) {
      const questionItem = questionFlow[index];
      let fullQuestionText = questionItem.question;
      const suggestedValue = questionItem.default ?? template.defaultValues[questionItem.key];

      if (suggestedValue) {
        fullQuestionText += `\n(suggested: "${suggestedValue}")`;
      }
      if (questionItem.enumOptions) {
        fullQuestionText += `\nOptions: ${questionItem.enumOptions.join(', ')}`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: fullQuestionText }]);
      setIsAwaitingInput(true);

      const newSuggestions = staticSuggestions.get(questionItem.question) || [];
      setSuggestions(newSuggestions);

    } else {
      // All questions asked
      const riskCheckMessage = performRiskCheck(currentValues);
      setMessages(prev => [...prev, { sender: 'ai', text: riskCheckMessage }]);
      setIsAwaitingInput(false);
      setCurrentQuestionIndex(-1);
      setStep('review');
      saveStateToHistory({ isAwaitingInput: false, questionIndex: -1 });
    }
  };

  const handleAddonCommand = (command: string) => {
    const addon = addonCommands.find(c => c.command.toLowerCase() === command.toLowerCase());
    if (addon) {
      const updatedValues = addon.action(contractValues);
      setContractValues(updatedValues);
      const addonMessage: Message = { sender: 'ai', text: `✅ Clause "${addon.command}" has been added to the Special Notes.` };
      const newMessages: Message[] = [...messages, addonMessage];
      setMessages(newMessages);
      saveStateToHistory({ values: updatedValues, messages: newMessages });
    } else {
      const availableCommands = addonCommands.map(c => `'${c.command}'`).join(', ');
      const errorMessage: Message = { sender: 'ai', text: `I don't recognize that add-on command. Please try one of the following: ${availableCommands}.` };
      setMessages(prev => [...prev, errorMessage]);
    }
    setUserInput(''); // Clear input after processing command
  }

  const processAnswer = (answer: string) => {
    if (step === 'asking') {
      const currentQuestion = questionFlow[currentQuestionIndex];
      if (currentQuestion) {
        setSuggestions([]); // Clear suggestions
        const valueToStore = answer || String(currentQuestion.default) || String(template.defaultValues[currentQuestion.key]);

        let finalValue: any = valueToStore;

        // Find variable definition to check type
        const variableDef = template.variables.find(v => v.name === currentQuestion.key);

        if (variableDef && (variableDef.type === 'number' || variableDef.type === 'percentage')) {
          finalValue = valueToStore === '' ? '' : Number(valueToStore);
        } else if (currentQuestion.enumOptions?.includes('true') && currentQuestion.enumOptions?.includes('false')) {
          finalValue = valueToStore.toLowerCase() === 'true';
        }

        const newValues = { ...contractValues, [currentQuestion.key]: finalValue };
        setContractValues(newValues);

        const nextIndex = findNextQuestionIndex(currentQuestionIndex + 1, newValues);
        setCurrentQuestionIndex(nextIndex);

        saveStateToHistory({ values: newValues, questionIndex: nextIndex });

        setTimeout(() => askNextQuestion(nextIndex, newValues), 500);
      }
    }
    setUserInput('');
  }

  const handleSuggestionClick = (suggestion: string) => {
    setMessages(prev => [...prev, { sender: 'user', text: suggestion }]);
    setIsAwaitingInput(false);
    processAnswer(suggestion);
  };

  const handleUserSubmit = () => {
    if (!userInput.trim() || !isAwaitingInput) return;

    const userMessage = userInput.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setIsAwaitingInput(false);

    if (userMessage.toLowerCase().startsWith('add ')) {
      const command = userMessage.substring(4).trim();
      handleAddonCommand(command);
      setIsAwaitingInput(true);
      setUserInput('');
      return;
    }

    processAnswer(userMessage);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const prevState = history[newIndex];
      setContractValues(prevState.values);
      setMessages(prevState.messages);
      setCurrentQuestionIndex(prevState.questionIndex);
      setIsAwaitingInput(prevState.isAwaitingInput);
      setUserInput('');
      if (prevState.isAwaitingInput) {
        // Re-ask the question
        askNextQuestion(prevState.questionIndex, prevState.values);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextState = history[newIndex];
      setContractValues(nextState.values);
      setMessages(nextState.messages);
      setCurrentQuestionIndex(nextState.questionIndex);
      setIsAwaitingInput(nextState.isAwaitingInput);
      setUserInput('');
      if (nextState.isAwaitingInput) {
        askNextQuestion(nextState.questionIndex, nextState.values);
      }
    }
  };

  const isFinished = currentQuestionIndex === -1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3">
        <Card>
          {/* Header Section - Sticky at top of card, below main nav */}
          <div className="sticky top-20 z-30 bg-white dark:bg-gray-800 p-8 pb-4 border-b border-gray-100 dark:border-gray-700 rounded-t-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold dark:text-white">Guided Build: <span className="text-brand-primary">{template.name}</span></h2>
              {currentQuestionIndex !== -1 && (
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full whitespace-nowrap ml-4">
                  Question {currentQuestionIndex + 1} of {questionFlow.length}
                </span>
              )}
            </div>
          </div>

          {/* Scrollable Chat Area */}
          <div className="px-8 space-y-4 flex flex-col min-h-[400px]">
            {messages.map((msg, index) => (
              <ChatMessage key={index} sender={msg.sender} text={msg.text} />
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area - Fixed at bottom of card */}
          <div className="p-8 pt-4 bg-white dark:bg-gray-800 rounded-b-xl">
            {isAwaitingInput && suggestions.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2 animate-fade-in">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-3 py-1.5 text-sm font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {step === 'asking' && (
              <div>
                <div className="flex items-center space-x-2">
                  <Input
                    id="userInput"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleUserSubmit()}
                    placeholder={isAwaitingInput ? "Type your answer..." : "..."}
                    disabled={!isAwaitingInput}
                  />
                  <Button onClick={handleUserSubmit} disabled={!isAwaitingInput}>Send</Button>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Button variant="secondary" onClick={handleUndo} disabled={historyIndex < 1} className="!px-3 !py-1.5 text-sm">Undo</Button>
                  <Button variant="secondary" onClick={handleRedo} disabled={historyIndex >= history.length - 1} className="!px-3 !py-1.5 text-sm">Redo</Button>
                </div>
              </div>
            )}
          </div>
        </Card>
        <div className="flex justify-between mt-6">
          <Button variant="secondary" onClick={onBack}>Back</Button>
          <Button onClick={() => onCreate(contractValues)} disabled={!isFinished}>
            {isFinished ? 'Create Contract' : 'Skip to Review'}
          </Button>
        </div>
      </div>
      <div className="lg:col-span-2">
        <KeyTermsSnapshot title="Key Terms Snapshot" data={contractValues} contractType={template.contractType} />
      </div>
    </div>
  );
};

export default GuidedBuilder;
