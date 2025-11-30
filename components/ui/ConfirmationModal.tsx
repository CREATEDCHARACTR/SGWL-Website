import React from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  confirmButtonVariant?: 'primary' | 'secondary' | 'danger';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Delete',
  confirmButtonVariant = 'danger'
}) => {
  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start justify-center z-[9999] px-4 py-8 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-gray-200/50 dark:border-white/20 rounded-lg shadow-xl w-full max-w-md my-8"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex items-start p-4">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div className="ml-4 text-left">
            <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white" id="modal-title">
              {title}
            </h3>
            <div className="mt-2 max-h-64 overflow-y-auto">
              <p className="text-sm text-gray-500 dark:text-gray-400 pr-2">
                {message}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-black/5 dark:bg-white/5 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 rounded-b-lg">
          <Button variant={confirmButtonVariant} onClick={onConfirm} className="w-full sm:w-auto sm:ml-3">
            {confirmButtonText}
          </Button>
          <Button variant="secondary" onClick={onClose} className="mt-3 w-full sm:mt-0 sm:w-auto">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );

  // Render modal at document root using portal
  return createPortal(modalContent, document.body);
};

export default ConfirmationModal;
