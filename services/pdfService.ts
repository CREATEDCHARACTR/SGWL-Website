import React from 'react';
import { createRoot } from 'react-dom/client';
import { Contract, TemplateType, Invoice } from '../types';
import ContractPreview from '../components/ContractPreview';
import InvoicePdfTemplate from '../components/InvoicePdfTemplate';

declare const html2pdf: any;

const sanitizeForFilename = (name: string): string => name.replace(/[^a-z0-9]/gi, '_').toLowerCase();

const buildFilename = (contractType: TemplateType, clientName: string): string => {
    const date = new Date();
    const dateStamp = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return `${sanitizeForFilename(contractType)}_${sanitizeForFilename(clientName)}_${dateStamp}.pdf`;
};

/**
 * Generates and downloads a PDF of the contract. This new implementation
 * renders all content, including signatures as base64 images, directly into
 * the HTML and uses html2pdf to capture the final result, ensuring signatures
 * are always included.
 * @param contract The contract object to be converted to PDF.
 */
export const downloadPdf = async (contract: Contract): Promise<void> => {
    if (typeof html2pdf === 'undefined') {
        console.error('html2pdf.js is not loaded.');
        alert('PDF generation library is not available. Please check your connection and try again.');
        return;
    }

    const filename = buildFilename(contract.contractType, contract.clientName);

    // Create a temporary container to render the contract off-screen
    const renderContainer = document.createElement('div');
    renderContainer.style.position = 'fixed';
    renderContainer.style.left = '-9999px';
    renderContainer.style.top = '-9999px';
    document.body.appendChild(renderContainer);

    try {
        // Updated options as per the required fix for image rendering
        const pdfOptions = {
            margin: 10,
            filename,
            image: { type: 'png', quality: 1.0 }, // Use PNG for better signature quality
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false,
                letterRendering: true,
                scrollY: 0,
                allowTaint: true,      // CRITICAL: Allow canvas data URLs
                backgroundColor: '#ffffff', // Ensure a white background for images
            },
            jsPDF: {
                unit: 'mm',
                format: 'letter',
                orientation: 'portrait',
            },
            pagebreak: {
                mode: ['avoid-all', 'css'],
                before: '.page-break',
                after: '.page-break'
            }
        };

        // Create the source element for html2pdf
        const sourceElement = document.createElement('div');
        sourceElement.className = 'pdf-contract-root';
        sourceElement.style.background = 'white';
        sourceElement.style.width = '718px'; // A fixed width for 'letter' size to ensure consistency
        sourceElement.style.padding = '40px';
        sourceElement.style.boxSizing = 'border-box';

        renderContainer.appendChild(sourceElement);

        // Render the ContractPreview which now includes signature images
        const reactRoot = createRoot(sourceElement);
        await new Promise<void>(resolve => {
            reactRoot.render(
                React.createElement(ContractPreview, { contract, mode: 'pdf' })
            );
            // Wait for images and layout to settle before capturing
            setTimeout(resolve, 500);
        });

        // Generate and save the PDF directly from the composed HTML
        await html2pdf().set(pdfOptions).from(sourceElement).save();

    } catch (error) {
        console.error('Failed to generate PDF:', error);
        alert('An error occurred while generating the PDF. Please try again.');
    } finally {
        // Clean up the temporary container
        document.body.removeChild(renderContainer);
    }
};

export const downloadInvoicePdf = async (invoice: Invoice): Promise<void> => {
    if (typeof html2pdf === 'undefined') {
        console.error('html2pdf.js is not loaded.');
        alert('PDF generation library is not available. Please check your connection and try again.');
        return;
    }

    const filename = `Invoice_${invoice.invoiceNumber}.pdf`;

    // Create a temporary container to render the invoice off-screen
    const renderContainer = document.createElement('div');
    renderContainer.style.position = 'fixed';
    renderContainer.style.left = '-9999px';
    renderContainer.style.top = '-9999px';
    document.body.appendChild(renderContainer);

    try {
        const pdfOptions = {
            margin: 0,
            filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: false,
                letterRendering: true,
                scrollY: 0,
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
            },
        };

        // Create the source element for html2pdf
        const sourceElement = document.createElement('div');
        sourceElement.style.background = 'white';
        sourceElement.style.width = '800px'; // Fixed width for template

        renderContainer.appendChild(sourceElement);

        // Render the InvoicePdfTemplate
        const reactRoot = createRoot(sourceElement);
        await new Promise<void>(resolve => {
            reactRoot.render(
                React.createElement(InvoicePdfTemplate, { invoice })
            );
            // Wait for layout to settle
            setTimeout(resolve, 500);
        });

        // Generate and save the PDF
        await html2pdf().set(pdfOptions).from(sourceElement).save();

    } catch (error) {
        console.error('Failed to generate PDF:', error);
        alert('An error occurred while generating the PDF. Please try again.');
    } finally {
        document.body.removeChild(renderContainer);
    }
};
