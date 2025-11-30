
import React from 'react';

interface ChatMessageProps {
  sender: 'ai' | 'user';
  text: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ sender, text }) => {
  const isAi = sender === 'ai';
  
  const bubbleClasses = isAi
    ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 self-start rounded-r-lg rounded-bl-lg'
    : 'bg-brand-primary text-white self-end rounded-l-lg rounded-br-lg';

  const containerClasses = `flex ${isAi ? 'justify-start' : 'justify-end'} mb-4`;

  return (
    <div className={containerClasses}>
      <div className={`max-w-md lg:max-w-lg px-4 py-3 rounded-lg shadow-sm ${bubbleClasses}`}>
        <p className="text-base" style={{ whiteSpace: 'pre-wrap' }}>{text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;