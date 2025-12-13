import { Contract, Client, Gallery, EmailTemplate, EmailTemplateCategory } from '../types';

const SENDGRID_API_KEY = import.meta.env.VITE_SENDGRID_API_KEY || '';

interface DeliveryEmailParams {
    toEmail: string;
    toName: string;
    contract: Contract;
    googleDriveUrl: string;
    heroImageUrl: string;
    message?: string;
}

export const sendDeliveryEmail = async (params: DeliveryEmailParams): Promise<boolean> => {
    if (!SENDGRID_API_KEY) {
        console.error('SendGrid API Key is missing');
        return false;
    }

    const { toEmail, toName, contract, googleDriveUrl, heroImageUrl, message } = params;

    const subject = `Your Final Gallery is Ready! - ${contract.title}`;

    // Professional HTML Email Template
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
            .hero { width: 100%; height: 300px; object-fit: cover; display: block; }
            .content { padding: 40px 30px; text-align: center; }
            .logo { font-size: 24px; font-weight: bold; color: #FF6B35; margin-bottom: 20px; display: inline-block; text-decoration: none; }
            h1 { color: #111; margin-bottom: 15px; font-size: 28px; }
            p { margin-bottom: 25px; color: #555; font-size: 16px; }
            .btn { display: inline-block; background-color: #000; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; margin: 20px 0; transition: background-color 0.3s; }
            .btn:hover { background-color: #333; }
            .footer { background-color: #f1f1f1; padding: 20px; text-align: center; font-size: 12px; color: #888; }
            .personal-message { background-color: #f8f9fa; padding: 15px; border-left: 4px solid #000; text-align: left; margin: 20px 0; font-style: italic; }
        </style>
    </head>
    <body>
        <div class="container">
            <a href="${googleDriveUrl}" target="_blank">
                <img src="${heroImageUrl}" alt="Project Preview" class="hero" />
            </a>
            <div class="content">
                <div class="logo">SGWL.</div>
                <h1>Your Photos Are Ready! 📸</h1>
                <p>Hi ${toName},</p>
                <p>I'm excited to share the final results from our session! It was a pleasure working with you on <strong>${contract.title}</strong>.</p>
                
                ${message ? `<div class="personal-message">"${message}"</div>` : ''}

                <p>You can view and download your full gallery by clicking the button below or the image above.</p>
                
                <a href="${googleDriveUrl}" class="btn">View My Gallery</a>
                
                <p>Please let me know if you have any trouble accessing the files. I hope you love them as much as I do!</p>
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} SaulGOOD WEATHER Lowery. All rights reserved.</p>
                <p>Virginia Beach, VA | www.sgwl.tech</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        // Use the local proxy path to avoid CORS errors
        const response = await fetch('/api/sendgrid/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalizations: [{
                    to: [{ email: toEmail, name: toName }],
                    subject: subject,
                }],
                from: { email: 'saul@sgwl.tech', name: 'Saul Lowery' }, // Verify this sender in SendGrid
                content: [{
                    type: 'text/html',
                    value: htmlContent,
                }],
            }),
        });

        if (response.ok) {
            return true;
        } else {
            const errorData = await response.json();
            console.error('SendGrid Error:', errorData);
            return false;
        }
    } catch (error) {
        console.error('Network Error sending email:', error);
        return false;
    }
};

// --- Restored Template Logic for SendGalleryModal ---

import { EMAIL_TEMPLATES, DEFAULT_VALUES } from '../data/emailTemplates';

// ... (existing code)

// --- Restored Template Logic for SendGalleryModal ---

export const getTemplates = (): EmailTemplate[] => {
    return Object.values(EMAIL_TEMPLATES);
};

export const populateTemplate = (templateId: string, client: Client, contract: Contract | null, gallery: Gallery | null): { subject: string, body: string } => {
    const templates = getTemplates();
    const template = templates.find(t => t.id === templateId);

    if (!template) return { subject: '', body: '' };

    let subject = template.subject;
    let body = template.body;

    // Helper to format dates safely
    const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString() : '[Date]';
    const formatCurrency = (amount?: number) => amount ? `$${amount.toLocaleString()}` : '[Amount]';

    // Construct the contract signing link with hash router format
    const contractLink = contract ? `${window.location.origin}/#/sign/${contract.id}` : '[Contract Link]';

    const replacements: Record<string, string> = {
        // Client
        '{clientName}': client.personalInfo.name,

        // Contract
        '{contractType}': contract?.contractType || 'Photography',
        '{sentDate}': formatDate(contract?.createdAt), // Use createdAt as sentDate fallback
        '{contractLink}': contractLink,
        '{contractDetails}': contract?.title || 'Session Details',
        '{expirationDate}': '[Expiration Date]', // TODO: Calculate if needed

        // Session
        '{eventDate}': formatDate(contract?.variables?.shoot_date || contract?.variables?.start_date || contract?.variables?.event_date),
        '{sessionDate}': formatDate(contract?.variables?.shoot_date || contract?.variables?.start_date || contract?.variables?.event_date),
        '{sessionTime}': contract?.variables?.start_time || contract?.variables?.session_time || '[Time]',
        '{sessionLocation}': contract?.variables?.project_location || contract?.variables?.venue || '[Location]',
        '{Location}': contract?.variables?.project_location || contract?.variables?.venue || '[Location]',
        '{sessionDuration}': contract?.variables?.duration || '[Duration]',

        // Gallery
        '{galleryLink}': gallery?.shareSettings?.shareLink || '[Link]',
        '{galleryPassword}': gallery?.shareSettings?.password || 'N/A',
        '{photoCount}': String(gallery?.photos?.length || 0),

        // Payment
        '{paymentAmount}': formatCurrency(contract?.variables?.base_fee ? Number(contract.variables.base_fee) : 0),
        '{invoiceAmount}': formatCurrency(contract?.variables?.base_fee ? Number(contract.variables.base_fee) : 0),
        '{balanceRemaining}': formatCurrency(contract?.variables?.base_fee ? Number(contract.variables.base_fee) : 0), // TODO: Calculate actual balance
        '{dueDate}': '[Due Date]',
        '{invoiceNumber}': contract?.id ? `INV-${contract.id.slice(0, 8).toUpperCase()}` : '[Invoice #]',

        // My Info (Defaults)
        '{myName}': DEFAULT_VALUES.myName,
        '{myEmail}': DEFAULT_VALUES.myEmail,
        '{myPhone}': DEFAULT_VALUES.myPhone,
        '{myWebsite}': DEFAULT_VALUES.myWebsite,
        '{myBusiness}': DEFAULT_VALUES.myBusiness,

        // Misc
        '{weatherCondition}': 'Sunny', // Placeholder
        '{serviceType}': contract?.contractType || 'Photography',
        '{contractTitle}': contract?.title || 'Contract',
        '{servicePackage}': contract?.variables?.service_package || 'As per contract',
        '{investment}': formatCurrency(contract?.variables?.base_fee ? Number(contract.variables.base_fee) : 0),
        '{amount}': (() => {
            const vars = contract?.variables || {};
            // Check for subscription specific fee first
            if (vars.subscription_monthly_fee) {
                return `${formatCurrency(Number(vars.subscription_monthly_fee))}/mo`;
            }

            // Fallback to base_fee
            const fee = vars.base_fee ? Number(vars.base_fee) : 0;
            const formattedFee = formatCurrency(fee);
            const isSubscription = contract?.contractType === 'PHOTO_VIDEO_SUBSCRIPTION' || vars.payment_frequency === 'monthly';

            if (fee === 0) return 'N/A';

            return isSubscription ? `${formattedFee}/mo` : `${formattedFee} (One-time)`;
        })(),
        '{depositDue}': contract?.variables?.base_fee && contract?.variables?.deposit_pct
            ? formatCurrency(Number(contract.variables.base_fee) * (Number(contract.variables.deposit_pct) / 100))
            : 'N/A',
    };

    Object.entries(replacements).forEach(([key, value]) => {
        // Escape special regex characters in key (specifically { and })
        const escapedKey = key.replace(/\{/g, '\\{').replace(/\}/g, '\\}');
        const regex = new RegExp(escapedKey, 'g');
        subject = subject.replace(regex, value);
        body = body.replace(regex, value);
    });

    return { subject, body };
};