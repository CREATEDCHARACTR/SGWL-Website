import { EmailTemplate, EmailTemplateCategory } from '../types';

type EmailTemplatesCollection = {
    [key: string]: Omit<EmailTemplate, 'id'> & { id: string };
};

export const EMAIL_TEMPLATES: EmailTemplatesCollection = {
    contractFollowUp: {
        id: 'contract_followup',
        category: EmailTemplateCategory.CONTRACT,
        name: 'Contract Follow-Up (Unsigned)',
        subject: 'Following up on your {contractType} contract',
        body: `Hi {clientName},

I wanted to follow up on the {contractType} contract I sent on {sentDate}. Have you had a chance to review it?

The contract includes everything we discussed:
• {contractDetails}

If you have any questions or need any changes, I’m happy to discuss! Just reply to this email or give me a call.

You can review and sign the contract here:
{contractLink}

Looking forward to working with you!

Best regards,
{myName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{myBusiness}
Photography - Videography - Content Creation
📧 {myEmail}
📱 {myPhone}
🌐 {myWebsite}
📍 Virginia Beach, VA`,
        variables: ['clientName', 'contractType', 'sentDate', 'contractLink', 'contractDetails']
    },
    contractSendOut: {
        id: 'contract_send_out',
        category: EmailTemplateCategory.CONTRACT,
        name: 'Contract Send-out',
        subject: 'Contract for {contractType}: {contractTitle} from {myBusiness}',
        body: `Hi {clientName},

Your contract for {contractType} has been prepared and is ready for your review and signature.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 CONTRACT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Service: {contractType}
Event Date: {eventDate}
Location: {Location}
Fee: {amount}
Deposit Due: {depositDue}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✍️ NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Click the link below to review your contract
2. Read through the terms carefully
3. Sign electronically when you're ready
4. You'll receive a signed copy immediately

🔗 CONTRACT LINK:
{contractLink}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 WHAT'S INCLUDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This contract outlines everything we discussed:
• Session details and timeline
• Deliverables and turnaround time
• Payment terms and schedule
• Usage rights and licensing
• Cancellation and weather policies

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 QUESTIONS?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Just reply to this email or text me anytime!
I'm here to help and answer any questions you might have.

Looking forward to working with you!

Best regards,
{myName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{myBusiness}
📧 {myEmail}
📱 {myPhone}
🌐 {myWebsite}
📸 Based in Virginia Beach, VA

Specializing in Photography | Videography | Content Creation | Brand Specialist | AI agent Services | Branded Music`,
        variables: ['clientName', 'contractType', 'contractTitle', 'eventDate', 'Location', 'amount', 'depositDue', 'contractLink']
    },
    contractReminder: {
        id: 'contract_reminder',
        category: EmailTemplateCategory.CONTRACT,
        name: 'Contract Reminder (3 Days)',
        subject: 'Quick reminder about your {contractType} contract',
        body: `Hi {clientName},

Just a quick reminder that I sent your {contractType} contract on {sentDate}.
I know things get busy! If you have any questions or concerns about the contract, I’m here to help.

Review and sign here: {contractLink}

Thanks!
{myName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{myBusiness} | {myEmail} | {myPhone}`,
        variables: ['clientName', 'contractType', 'sentDate', 'contractLink']
    },
    contractThankYou: {
        id: 'contract_thankyou',
        category: EmailTemplateCategory.CONTRACT,
        name: 'Contract Thank You (Signed)',
        subject: "Thank you for signing! Here's what's next",
        body: `Hi {clientName},

Thank you so much for signing the {contractType} contract! I’m excited to work with you.

Here’s what happens next:
1. You’ll receive a calendar invite for your session on {sessionDate}
2. I’ll send you prep details 24 hours before
3. If you have any questions before then, just reach out!

Looking forward to it!

Best,
{myName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{myBusiness} | {myEmail} | {myPhone}`,
        variables: ['clientName', 'contractType', 'sessionDate']
    },
    revisionConfirmation: {
        id: 'revision_confirmation',
        category: EmailTemplateCategory.CONTRACT,
        name: 'Revision Confirmation',
        subject: 'Your {contractType} contract has been updated',
        body: `Hi {clientName},

I’ve updated your {contractType} contract based on your feedback.

Changes made:
{revisionDetails}

Please review the updated contract here: {contractLink}

Let me know if you’d like any other changes!

Best,
{myName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{myBusiness} | {myEmail} | {myPhone}`,
        variables: ['clientName', 'contractType', 'revisionDetails', 'contractLink']
    },
    contractExpiring: {
        id: 'contract_expiring',
        category: EmailTemplateCategory.CONTRACT,
        name: 'Contract Expiring Soon',
        subject: 'Your contract proposal expires in 7 days',
        body: `Hi {clientName},

I wanted to give you a heads up that your {contractType} contract proposal will expire on {expirationDate}.

If you’d like to move forward, please review and sign before then: {contractLink}

If you need more time or have questions, just let me know - I’m happy to extend the deadline or discuss any concerns.

Best,
{myName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{myBusiness} | {myEmail} | {myPhone}`,
        variables: ['clientName', 'contractType', 'expirationDate', 'contractLink']
    },
    paymentReminder: {
        id: 'payment_reminder',
        category: EmailTemplateCategory.PAYMENT,
        name: 'Payment Reminder (Due Soon)',
        subject: 'Payment reminder - {paymentDescription} due {dueDate}',
        body: `Hi {clientName},

This is a friendly reminder that your {paymentDescription} payment of {paymentAmount} is due on {dueDate}.

Payment can be made via:
• Credit/Debit Card
• Zelle: {myPhone}
• Cash or Check

If you’ve already sent payment, thank you! You can disregard this reminder.
Questions? Just reply to this email.

Thanks!
{myName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{myBusiness} | {myEmail} | {myPhone}`,
        variables: ['clientName', 'paymentDescription', 'paymentAmount', 'dueDate']
    },
    paymentOverdue: {
        id: 'payment_overdue',
        category: EmailTemplateCategory.PAYMENT,
        name: 'Payment Reminder (Overdue)',
        subject: 'Overdue payment - Action required',
        body: `Hi {clientName},

Your {paymentDescription} payment of {paymentAmount} was due on {dueDate} and is now {daysOverdue} days overdue.

To avoid any service delays, please submit payment as soon as possible.

If you’re experiencing any issues or need to discuss payment arrangements, please let me know.

Payment methods:
• Credit/Debit Card
• Zelle: {myPhone}

Thank you,
{myName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{myBusiness} | {myEmail} | {myPhone}`,
        variables: ['clientName', 'paymentDescription', 'paymentAmount', 'dueDate', 'daysOverdue']
    },
    paymentThankYou: {
        id: 'payment_thankyou',
        category: EmailTemplateCategory.PAYMENT,
        name: 'Payment Thank You',
        subject: 'Payment received - Thank you!',
        body: `Hi {clientName},

Thank you for your payment of {paymentAmount}! Receipt is attached.

Payment details:
• Amount: {paymentAmount}
• Date: {paymentDate}
• Method: {paymentMethod}
• Receipt #: {receiptNumber}

Balance remaining: {balanceRemaining}

Thanks for your business!

Best,
{myName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{myBusiness} | {myEmail} | {myPhone}`,
        variables: ['clientName', 'paymentAmount', 'paymentDate', 'paymentMethod', 'receiptNumber', 'balanceRemaining']
    },
    invoiceAttached: {
        id: 'invoice_attached',
        category: EmailTemplateCategory.PAYMENT,
        name: 'Invoice Attached',
        subject: 'Invoice for {serviceType}',
        body: `Hi {clientName},

Please find attached your invoice for {serviceType}.

Invoice details:
• Amount due: {invoiceAmount}
• Due date: {dueDate}
• Invoice #: {invoiceNumber}

Payment can be made via credit card, Zelle ({myPhone}), or cash/check.

Let me know if you have any questions!

Thanks,
{myName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{myBusiness} | {myEmail} | {myPhone}`,
        variables: ['clientName', 'serviceType', 'invoiceAmount', 'dueDate', 'invoiceNumber']
    },
    sessionReminder: {
        id: 'session_reminder',
        category: EmailTemplateCategory.SESSION,
        name: 'Session Reminder (24 Hours)',
        subject: 'Reminder: Your {sessionType} session tomorrow!',
        body: `Hi {clientName},

Just a friendly reminder that your {sessionType} session is tomorrow!

Session details:
📅 Date: {sessionDate}
⏰ Time: {sessionTime}
📍 Location: {sessionLocation}
⏱️ Duration: {sessionDuration}

What to bring:
• Any props or special items
• Water and snacks
• Comfortable clothes

Weather looks {weatherCondition}!

See you tomorrow!
{myName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{myBusiness} | {myEmail} | {myPhone}`,
        variables: ['clientName', 'sessionType', 'sessionDate', 'sessionTime', 'sessionLocation', 'sessionDuration', 'weatherCondition']
    },
    sessionConfirmation: {
        id: 'session_confirmation',
        category: EmailTemplateCategory.SESSION,
        name: 'Session Confirmation',
        subject: 'Your {sessionType} is confirmed for {sessionDate}',
        body: `Hi {clientName},

Your {sessionType} session is confirmed!

Details:
📅 Date: {sessionDate}
⏰ Time: {sessionTime}
📍 Location: {sessionLocation}
⏱️ Duration: {sessionDuration}

I’ll send you a reminder 24 hours before with prep details.
Looking forward to it!

Best,
{myName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{myBusiness} | {myEmail} | {myPhone}`,
        variables: ['clientName', 'sessionType', 'sessionDate', 'sessionTime', 'sessionLocation', 'sessionDuration']
    },
    sessionPrep: {
        id: 'session_prep',
        category: EmailTemplateCategory.SESSION,
        name: 'Session Prep Details',
        subject: 'Getting ready for your session - Tips & Details',
        body: `Hi {clientName},

Your session is coming up on {sessionDate}! Here are some tips to prepare:

What to wear:
• Solid colors photograph best
• Avoid busy patterns
• Bring backup outfit options

What to bring:
• Any props or meaningful items
• Water and snacks
• Touch-up makeup

Location & Timing:
📍 {sessionLocation}
⏰ Arrive 10 minutes early
🅿️ Parking: {parkingDetails}

Weather:
{weatherCondition} - We’ll monitor and adjust if needed

Questions? Text or call me: {myPhone}

Excited for your session!
{myName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{myBusiness} | {myEmail} | {myPhone}`,
        variables: ['clientName', 'sessionDate', 'sessionLocation', 'parkingDetails', 'weatherCondition']
    },
    weatherDelay: {
        id: 'weather_delay',
        category: EmailTemplateCategory.SESSION,
        name: 'Weather Delay Notice',
        subject: 'Weather update for your session',
        body: `Hi {clientName},

Unfortunately, the weather forecast for {sessionDate} isn’t looking great for an outdoor session ({weatherCondition}).
I’d like to reschedule to ensure we get the best photos possible.

Available dates:
• {rescheduleOption1}
• {rescheduleOption2}
• {rescheduleOption3}

Which works best for you? Or suggest another date that works!

Sorry for the inconvenience!

Best,
{myName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{myBusiness} | {myEmail} | {myPhone}`,
        variables: ['clientName', 'sessionDate', 'weatherCondition', 'rescheduleOption1', 'rescheduleOption2', 'rescheduleOption3']
    },
    haventHeardFromYou: {
        id: 'havent_heard',
        category: EmailTemplateCategory.REENGAGEMENT,
        name: "Haven't Heard From You",
        subject: 'Haven\'t heard from you - Still interested?',
        body: `Hi {clientName},

I wanted to check in since I haven’t heard from you in a while.
Are you still interested in {serviceType}? If so, I’d love to work with you!

If timing isn’t right, no worries - just let me know and I’ll follow up in a few months.

Feel free to reach out anytime!

Best,
{myName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{myBusiness} | {myEmail} | {myPhone}`,
        variables: ['clientName', 'serviceType']
    },
    specialOffer: {
        id: 'special_offer',
        category: EmailTemplateCategory.REENGAGEMENT,
        name: 'Special Offer for Returning Clients',
        subject: 'Special offer just for you!',
        body: `Hi {clientName},

I’m offering a special discount for returning clients!
Get {discountAmount} off your next session when you book by {expirationDate}.

Services available:
• Portrait sessions
• Family photography
• Event coverage
• Monthly content creation

I loved working with you before and would love to do it again!
Interested? Just reply to this email!

Best,
{myName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{myBusiness} | {myEmail} | {myPhone}`,
        variables: ['clientName', 'discountAmount', 'expirationDate']
    },
    justCheckingIn: {
        id: 'checking_in',
        category: EmailTemplateCategory.REENGAGEMENT,
        name: 'Just Checking In',
        subject: 'Just checking in!',
        body: `Hi {clientName},

Just wanted to check in and see how everything is going!
Are you happy with the photos from your last session? Need anything else from me?

If you ever need more photos or know anyone looking for a photographer, I’d love to hear from you!

Hope you’re doing well!

Best,
{myName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{myBusiness} | {myEmail} | {myPhone}`,
        variables: ['clientName']
    },
    sessionThankYou: {
        id: 'session_thankyou',
        category: EmailTemplateCategory.POST_SESSION,
        name: 'Session Thank You',
        subject: 'Thank you for an amazing session!',
        body: `Hi {clientName},

Thank you so much for your session yesterday! I had a great time and got some amazing shots.

Timeline:
• Your photos will be ready in {editingTimeline}
• I’ll send you a gallery link when they’re done
• You’ll be able to download and share your favorites

Can’t wait to show you the results!

Best,
{myName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{myBusiness} | {myEmail} | {myPhone}`,
        variables: ['clientName', 'editingTimeline']
    },
    photosReady: {
        id: 'photos_ready',
        category: EmailTemplateCategory.POST_SESSION,
        name: 'Photos Ready for Review',
        subject: 'Your photos are ready! 🎉',
        body: `Hi {clientName},

Great news - your photos are ready!

View and download your gallery here: {galleryLink}

Gallery details:
• {photoCount} edited photos
• Available until: {expirationDate}
• Download high-resolution files
• Share with friends and family

Print options available if you’d like!

Enjoy!

Best,
{myName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{myBusiness} | {myEmail} | {myPhone}`,
        variables: ['clientName', 'galleryLink', 'photoCount', 'expirationDate']
    },
    requestTestimonial: {
        id: 'request_testimonial',
        category: EmailTemplateCategory.POST_SESSION,
        name: 'Request Testimonial/Review',
        subject: 'Would you mind sharing your experience?',
        body: `Hi {clientName},

I hope you’re loving your photos!

If you have a minute, would you mind leaving a review? It really helps my business!

Leave a review here:
• Google: {googleReviewLink}
• Facebook: {facebookReviewLink}

Or just reply to this email with your feedback - I’d love to hear what you thought!

Thanks so much!

Best,
{myName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{myBusiness} | {myEmail} | {myPhone}`,
        variables: ['clientName', 'googleReviewLink', 'facebookReviewLink']
    },
    referralRequest: {
        id: 'referral_request',
        category: EmailTemplateCategory.POST_SESSION,
        name: 'Referral Request',
        subject: 'Know anyone who needs photography?',
        body: `Hi {clientName},

I’m so glad you’re happy with your photos!

If you know anyone looking for photography, I’d love it if you could pass my name along.
For every referral that books with me, you’ll get {referralDiscount} off your next session!

Easy sharing:
• Forward this email
• Share my website: {myWebsite}
• Tag me on Instagram: @saulgoodweather

Thanks for your support!

Best,
{myName}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{myBusiness} | {myEmail} | {myPhone}`,
        variables: ['clientName', 'referralDiscount', 'myWebsite']
    }
};

export const DEFAULT_VALUES: Record<string, string> = {
    myName: 'Saul Lowery',
    myEmail: 'saul@sgwl.tech',
    myPhone: '(407) 864-6668',
    myWebsite: 'www.sgwl.tech',
    myBusiness: 'SaulGOOD WEATHER Lowery'
};