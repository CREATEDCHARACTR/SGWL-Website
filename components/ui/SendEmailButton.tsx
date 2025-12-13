import React from 'react';
import { Contract } from '../../types';
import { populateTemplate } from '../../services/emailService';

interface SendEmailButtonProps {
  contract: Contract;
  onUnsignedAttempt?: () => void; // Called when trying to send without admin signature
  isAdminSigned?: boolean; // Whether the admin has signed
}

const SendEmailButton: React.FC<SendEmailButtonProps> = ({ contract, onUnsignedAttempt, isAdminSigned = true }) => {
  const handleSendEmail = () => {
    // Check if admin has signed (if the check is provided)
    if (!isAdminSigned && onUnsignedAttempt) {
      onUnsignedAttempt();
      return;
    }

    // Use the new template logic
    const { subject, body } = populateTemplate('contract_send_out',
      { personalInfo: { name: contract.clientName, email: contract.clientEmail, phone: '' }, businessInfo: {} as any, status: 'Hot' as any, contracts: [], meta: {} as any, id: contract.clientId }, // Mock client object if needed, or fetch it
      contract,
      null
    );

    const mailtoLink = `mailto:${contract.clientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  };

  return (
    <button
      onClick={handleSendEmail}
      className="w-full inline-flex items-center justify-center rounded-lg px-6 py-3 text-lg font-bold text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 bg-[linear-gradient(to_right,#FF6B35,#F7B801)] hover:scale-105 transform transition-transform duration-200"
    >
      <span role="img" aria-label="email icon" className="mr-2">📧</span>
      Send Contract to Client
    </button>
  );
};

export default SendEmailButton;

