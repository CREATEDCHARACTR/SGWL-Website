import { Template, TemplateType, Contract, ContractStatus, PartyRole, AuditEventType, ClauseDefinition, AuditEvent, Variable, QuestionFlowItem, AddonCommand, VariableType, SignatureFieldKind, Gallery, GalleryStatus, GalleryType } from './types';

export const CLAUSE_LIBRARY: ClauseDefinition[] = [
  { "key": "portfolio_rights", "title": "Portfolio & Credits", "service_types": [TemplateType.PHOTOGRAPHY, TemplateType.VIDEOGRAPHY, TemplateType.AI_AGENT, TemplateType.WEBSITE], "body_md": "Provider may display final works...", "requires_followup_bool": true, "followup_prompt": "Embargo days? (0 for none)" },
  { "key": "model_release", "title": "Model/Appearance Release", "service_types": [TemplateType.PHOTOGRAPHY, TemplateType.VIDEOGRAPHY], "body_md": "Client will secure releases; optional blanket release attached as Exhibit C.", "requires_followup_bool": false },
  { "key": "raw_footage", "title": "Raw-Footage Purchase", "service_types": [TemplateType.VIDEOGRAPHY], "body_md": "Raw footage not included; available via add-on license + drive/transfer fee.", "requires_followup_bool": false },
  { "key": "music_licensing_provider", "title": "Music Licensing by Provider", "service_types": [TemplateType.VIDEOGRAPHY], "body_md": "Provider will source/licence music; pass-through cost + admin fee.", "requires_followup_bool": false },
  { "key": "ip_assignment", "title": "IP Assignment (Web/AI)", "service_types": [TemplateType.AI_AGENT, TemplateType.WEBSITE], "body_md": "Upon full payment, Client owns deliverable code and artifacts; Provider retains non-confidential know-how.", "requires_followup_bool": false },
  { "key": "dpa", "title": "Data Processing Addendum", "service_types": [TemplateType.AI_AGENT, TemplateType.WEBSITE], "body_md": "Parties agree to attached DPA for any PII processing.", "requires_followup_bool": false },
  { "key": "maintenance_retainer", "title": "Maintenance/Retainer", "service_types": [TemplateType.WEBSITE], "body_md": "Monthly retainer scope, rates, and response times as Exhibit D.", "requires_followup_bool": true, "followup_prompt": "Add hours per month and rate." },
  { "key": "wcag_target", "title": "Accessibility Target", "service_types": [TemplateType.WEBSITE], "body_md": "Best-effort to meet WCAG 2.2 AA for agreed templates and components.", "requires_followup_bool": false },
  { "key": "sla", "title": "Service Level Agreement (SLA)", "service_types": [TemplateType.AI_AGENT, TemplateType.WEBSITE], "body_md": "Provider will use commercially reasonable efforts to meet an uptime target of {{uptime_sla_target_pct}}% for Provider-hosted components and will respond to support requests within {{response_time_sla_hours}} business hours.", "requires_followup_bool": true, "followup_prompt": "Set uptime % target and response time in hours." },
  { "key": "training_rights_explicit", "title": "Model Training Rights", "service_types": [TemplateType.AI_AGENT], "body_md": "Client grants Provider a limited, non-exclusive, worldwide, royalty-free license to use Client-provided data for the sole purpose of training and improving the AI models for the benefit of the Client. Data will be anonymized where feasible. Provider will not use Client data to train models for other clients without explicit written consent.", "requires_followup_bool": true, "followup_prompt": "Confirm scope: limited to this client's benefit, or allow for global model improvement with consent?" },
  { "key": "hipaa_notice", "title": "HIPAA / Health Data Notice", "service_types": [TemplateType.AI_AGENT, TemplateType.WEBSITE], "body_md": "Client agrees not to provide, and Provider is not responsible for, any Protected Health Information (PHI) as defined under HIPAA. This service is not HIPAA-compliant unless a separate Business Associate Agreement (BAA) is executed between the parties.", "requires_followup_bool": false },
  { "key": "export_package", "title": "Enhanced Data Export Package", "service_types": [TemplateType.AI_AGENT], "body_md": "Upon termination, Client may opt for an Enhanced Data Export Package. For a one-time fee of ${{export_fee}}, Provider will provide up to {{export_assist_hours_included_extra}} additional hours of support to package and document data, playbooks, and agent configurations for transition.", "requires_followup_bool": true, "followup_prompt": "What is the fee and how many extra hours are included?" },
  { "key": "ad_spend_management", "title": "Ad Spend Management", "service_types": [TemplateType.AI_AGENT], "body_md": "If scope includes management of paid advertising, Client authorizes Provider to manage ad spend on {{ad_platforms}} up to a monthly cap of ${{ad_spend_cap_monthly}}. Client is responsible for direct payment of all ad spend to the platforms.", "requires_followup_bool": true, "followup_prompt": "What is the monthly ad spend cap and on which platforms (e.g., Google, Meta)?" },
  { "key": "call_center_handoff", "title": "Call Center Handoff Protocol", "service_types": [TemplateType.AI_AGENT], "body_md": "The AI agent will escalate complex inquiries to Client's designated human agents during business hours ({{call_center_hours}}). All handoff scripts and protocols, once approved by Client, become {{call_script_ownership}}'s intellectual property.", "requires_followup_bool": true, "followup_prompt": "What are the call center hours and who owns the final handoff scripts?" }
];

export const PHOTOGRAPHY_VARIABLES: Variable[] = [
  { id: 'var_p_1', name: 'business_legal_name', label: 'Provider Legal Name', type: VariableType.TEXT },
  { id: 'var_p_2', name: 'dba_brand', label: 'Provider Brand Name', type: VariableType.TEXT },
  { id: 'var_p_3', name: 'provider_contact_name', label: 'Provider Contact Name', type: VariableType.TEXT },
  { id: 'var_p_4', name: 'provider_email', label: 'Provider Email', type: VariableType.TEXT },
  { id: 'var_p_5', name: 'provider_phone', label: 'Provider Phone', type: VariableType.TEXT },
  { id: 'var_p_6', name: 'client_legal_name', label: 'Client Legal Name', type: VariableType.TEXT },
  { id: 'var_p_7', name: 'client_email', label: 'Client Email', type: VariableType.TEXT },
  { id: 'var_p_8', name: 'client_phone', label: 'Client Phone', type: VariableType.TEXT },
  { id: 'var_p_9', name: 'project_title', label: 'Project Title', type: VariableType.TEXT },
  { id: 'var_p_10', name: 'service_package', label: 'Service Package', type: VariableType.TEXT },
  { id: 'var_p_11', name: 'project_location', label: 'Project Location', type: VariableType.TEXT },
  { id: 'var_p_12', name: 'shoot_date', label: 'Shoot Date', type: VariableType.DATE },
  { id: 'var_p_13', name: 'call_time', label: 'Call Time', type: VariableType.TEXT },
  { id: 'var_p_14', name: 'coverage_hours', label: 'Coverage Hours', type: VariableType.NUMBER },
  { id: 'var_p_15', name: 'base_fee', label: 'Base Fee', type: VariableType.NUMBER },
  { id: 'var_p_16', name: 'deposit_pct', label: 'Deposit %', type: VariableType.PERCENTAGE },
  { id: 'var_p_17', name: 'card_fee_pct', label: 'Card Fee %', type: VariableType.PERCENTAGE },
  { id: 'var_p_18', name: 'late_fee_per_30', label: 'Late Fee ($ per 30 days)', type: VariableType.NUMBER },
  { id: 'var_p_19', name: 'overtime_per_30', label: 'Overtime Rate ($ per 30 min)', type: VariableType.NUMBER },
  { id: 'var_p_20', name: 'travel_policy', label: 'Travel Policy', type: VariableType.TEXT },
  { id: 'var_p_21', name: 'deliverables_count', label: 'Deliverables Count', type: VariableType.NUMBER },
  { id: 'var_p_22', name: 'raws_included', label: 'Raws Included', type: VariableType.TEXT },
  { id: 'var_p_23', name: 'delivery_method', label: 'Delivery Method', type: VariableType.TEXT },
  { id: 'var_p_24', name: 'turnaround_days', label: 'Turnaround (days)', type: VariableType.NUMBER },
  { id: 'var_p_25', name: 'license_type', label: 'License Type', type: VariableType.TEXT },
  { id: 'var_p_26', name: 'model_release_toggle', label: 'Model Release Required', type: VariableType.TEXT },
  { id: 'var_p_27', name: 'portfolio_rights', label: 'Portfolio Rights', type: VariableType.TEXT },
  { id: 'var_p_28', name: 'embargo_days', label: 'Embargo (days)', type: VariableType.NUMBER },
  { id: 'var_p_29', name: 'reschedule_notice_hours', label: 'Reschedule Notice (hours)', type: VariableType.NUMBER },
  { id: 'var_p_30', name: 'reschedule_fee', label: 'Reschedule Fee ($)', type: VariableType.NUMBER },
  { id: 'var_p_31', name: 'cancellation_terms', label: 'Cancellation Terms', type: VariableType.TEXT },
  { id: 'var_p_32', name: 'asset_retention_days', label: 'Asset Retention (days)', type: VariableType.NUMBER },
  { id: 'var_p_33', name: 'change_order_rate', label: 'Change Order Rate ($/hr)', type: VariableType.NUMBER },
  { id: 'var_p_34', name: 'warranty_window_days', label: 'Warranty Window (days)', type: VariableType.NUMBER },
  { id: 'var_p_35', name: 'governing_law_state', label: 'Governing Law State', type: VariableType.TEXT },
  { id: 'var_p_36', name: 'venue_city', label: 'Venue City', type: VariableType.TEXT },
  { id: 'var_p_37', name: 'special_notes', label: 'Special Notes', type: VariableType.TEXT },
  { id: 'var_p_38', name: 'client_contact_name', label: 'Client Contact Name', type: VariableType.TEXT },
  { id: 'var_p_39', name: 'client_contact_title', label: 'Client Contact Title', type: VariableType.TEXT },
];

export const PHOTOGRAPHY_QUESTION_FLOW: QuestionFlowItem[] = [
  { key: 'client_legal_name', question: "What is the client's full legal name?", required: true },
  { key: 'client_email', question: "What is the client's primary email address?", required: true },
  { key: 'client_contact_name', question: "What is the name of the person signing for the client?", required: true },
  { key: 'client_contact_title', question: "What is their title? (e.g., 'Owner', 'CEO')", required: true },
  { key: 'project_title', question: "What is the title for this project? (e.g., 'Brand Headshots & Social Set')", required: true },
  { key: 'service_package', question: "Briefly describe the service package. (e.g., '2-hour on-site portrait session')", required: true },
  { key: 'project_location', question: "Where will the shoot take place?", required: true },
  { key: 'shoot_date', question: "What is the scheduled shoot date?", required: true },
  { key: 'coverage_hours', question: "How many hours of coverage are included?", required: true },
  { key: 'base_fee', question: "What is the total base fee for this project?", required: true },
  { key: 'deposit_pct', question: "What percentage is the deposit?", required: true, default: 50 },
  { key: 'deliverables_count', question: "How many final edited photos will be delivered?", required: true },
  { key: 'turnaround_days', question: "What is the turnaround time in business days?", required: true, default: 10 },
  { key: 'portfolio_rights', question: "What are the portfolio rights?", required: true, enumOptions: ['on', 'off', 'embargo'], default: 'on' },
  { key: 'embargo_days', question: "How many days for the embargo?", required: false, condition: values => values.portfolio_rights === 'embargo', default: 0 },
  { key: 'model_release_toggle', question: "Will you require model/appearance releases for subjects?", required: true, enumOptions: ['yes', 'no'], default: 'yes' },
  { key: 'raws_included', question: "Are RAW, unedited files included in the base fee?", required: true, enumOptions: ['yes', 'no'], default: 'no' },
  { key: 'delivery_method', question: "How will the final photos be delivered?", required: true, default: 'Online gallery download (JPEG, high-res)' },
  { key: 'late_fee_per_30', question: "What is the late fee for waiting time, per 30 minutes?", required: true, default: 50 },
  { key: 'overtime_per_30', question: "What is the overtime rate, per 30 minutes?", required: true, default: 90 },
  { key: 'reschedule_notice_hours', question: "What is the minimum notice required for a no-fee reschedule, in hours?", required: true, default: 72 },
  { key: 'reschedule_fee', question: "What is the fee for rescheduling with less than the required notice?", required: true, default: 150 },
  { key: 'cancellation_terms', question: "What are the cancellation terms?", required: true, default: 'Deposit is non-refundable; cancel within 72 hours of shoot → remaining balance due' },
  { key: 'card_fee_pct', question: "If accepting cards, what is the processing fee percentage?", required: false, default: 3.5 },
  { key: 'travel_policy', question: "What is the travel policy?", required: false, default: 'First 25 miles round-trip included; $2/mi after' },
  { key: 'change_order_rate', question: "What is the hourly rate for change orders?", required: true, default: 120 },
  { key: 'asset_retention_days', question: "How many days will working files be retained after delivery?", required: true, default: 60 },
  { key: 'license_type', question: "Describe the image license granted to the client.", required: true, default: 'Perpetual, non-exclusive business-use license to final edited photos; photographer retains copyright' },
  { key: 'warranty_window_days', question: "What is the warranty window for file corrections (e.g., re-exports) in days?", required: true, default: 7 },
  { key: 'governing_law_state', question: "Which state's law governs this agreement?", required: true, default: 'Virginia' },
  { key: 'venue_city', question: "What is the venue city for any legal disputes?", required: true, default: 'Virginia Beach, VA' },
  { key: 'special_notes', question: "Are there any special notes or addenda to include?", required: false },
];

export const PHOTOGRAPHY_ADDON_COMMANDS: AddonCommand[] = [
  { command: "second shooter", followupKeys: [], followupQuestions: [], action: (values) => ({ ...values, special_notes: `${values.special_notes || ''}\n\nAddendum: Second Shooter. A second photographer may be added subject to availability; fee quoted via Change Order.` }) },
  { command: "print rights", followupKeys: [], followupQuestions: [], action: (values) => ({ ...values, special_notes: `${values.special_notes || ''}\n\nAddendum: Print Rights. Client may print delivered images for personal/business use; resale or third-party licensing not included.` }) },
  { command: "exclusive photographer clause", followupKeys: [], followupQuestions: [], action: (values) => ({ ...values, special_notes: `${values.special_notes || ''}\n\nAddendum: Exclusivity. Client will ensure no other hired photographer interferes with coverage.` }) },
  { command: "rush delivery", followupKeys: [], followupQuestions: [], action: (values) => ({ ...values, special_notes: `${values.special_notes || ''}\n\nAddendum: Rush Delivery. Rush turnaround in ≤3 business days adds 30% to the base fee.` }) },
  { command: "NDA", followupKeys: [], followupQuestions: [], action: (values) => ({ ...values, special_notes: `${values.special_notes || ''}\n\nAddendum: NDA. Parties agree not to disclose non-public project information except as required by law.` }) },
];


export const VIDEOGRAPHY_VARIABLES: Variable[] = [
  { id: 'var_v_1', label: 'Client Legal Name', name: 'client_legal_name', type: VariableType.TEXT },
  { id: 'var_v_2', label: 'Client Email', name: 'client_email', type: VariableType.TEXT },
  { id: 'var_v_3', label: 'Client Phone', name: 'client_phone', type: VariableType.TEXT },
  { id: 'var_v_4', label: 'Project Title', name: 'project_title', type: VariableType.TEXT },
  { id: 'var_v_5', label: 'Project Location', name: 'project_location', type: VariableType.TEXT },
  { id: 'var_v_6', label: 'Shoot Date', name: 'shoot_date', type: VariableType.DATE },
  { id: 'var_v_7', label: 'Service Window', name: 'service_window', type: VariableType.TEXT },
  { id: 'var_v_8', label: 'Call Time', name: 'call_time', type: VariableType.TEXT },
  { id: 'var_v_9', label: 'Filming Window (Hours)', name: 'filming_window_hours', type: VariableType.NUMBER },
  { id: 'var_v_10', label: 'Base Fee', name: 'base_fee', type: VariableType.NUMBER },
  { id: 'var_v_11', label: 'Deposit %', name: 'deposit_pct', type: VariableType.PERCENTAGE },
  { id: 'var_v_12', label: 'Card Fee %', name: 'card_fee_pct', type: VariableType.PERCENTAGE },
  { id: 'var_v_13', label: 'Travel Policy', name: 'travel_policy', type: VariableType.TEXT },
  { id: 'var_v_14', label: 'Late Fee ($ per 30 min)', name: 'late_fee_per_30', type: VariableType.NUMBER },
  { id: 'var_v_15', label: 'Overtime Rate ($ per 30 min)', name: 'overtime_per_30', type: VariableType.NUMBER },
  { id: 'var_v_16', label: 'Main Video Length (sec)', name: 'deliverables_main_highlight_length_sec', type: VariableType.NUMBER },
  { id: 'var_v_17', label: 'Social Cuts Count', name: 'social_cuts_count', type: VariableType.NUMBER },
  { id: 'var_v_18', label: 'Aspect Ratios', name: 'aspect_ratios', type: VariableType.TEXT },
  { id: 'var_v_19', label: 'Delivery Format', name: 'delivery_format', type: VariableType.TEXT },
  { id: 'var_v_20', label: 'Delivery Deadline (days)', name: 'delivery_deadline_days', type: VariableType.NUMBER },
  { id: 'var_v_21', label: 'Acceptance Window (days)', name: 'acceptance_window_days', type: VariableType.NUMBER },
  { id: 'var_v_22', label: 'Revision Rounds (Main Edit)', name: 'revision_rounds_main_edit', type: VariableType.NUMBER },
  { id: 'var_v_23', label: 'Music Licensing Owner', name: 'music_licensing_owner', type: VariableType.TEXT },
  { id: 'var_v_24', label: 'Soundtrack Budget ($)', name: 'soundtrack_budget', type: VariableType.NUMBER },
  { id: 'var_v_25', label: 'Raw Footage Included', name: 'raw_footage_included', type: VariableType.TEXT },
  { id: 'var_v_26', label: 'Raw Footage Buyout Fee ($)', name: 'raw_footage_buyout_fee', type: VariableType.NUMBER },
  { id: 'var_v_27', label: 'License Type', name: 'license_type', type: VariableType.TEXT },
  { id: 'var_v_28', label: 'Portfolio Rights', name: 'portfolio_rights', type: VariableType.TEXT },
  { id: 'var_v_29', label: 'Embargo (days)', name: 'embargo_days', type: VariableType.NUMBER },
  { id: 'var_v_30', label: 'Reschedule Notice (hours)', name: 'reschedule_notice_hours', type: VariableType.NUMBER },
  { id: 'var_v_31', label: 'Reschedule Fee ($)', name: 'reschedule_fee', type: VariableType.NUMBER },
  { id: 'var_v_32', label: 'Cancellation Terms', name: 'cancellation_terms', type: VariableType.TEXT },
  { id: 'var_v_33', label: 'Asset Retention (days)', name: 'asset_retention_days', type: VariableType.NUMBER },
  { id: 'var_v_34', label: 'Change Order Rate ($/hr)', name: 'change_order_rate', type: VariableType.NUMBER },
  { id: 'var_v_35', label: 'Warranty Window (days)', name: 'warranty_window_days', type: VariableType.NUMBER },
  { id: 'var_v_36', label: 'Governing Law State', name: 'governing_law_state', type: VariableType.TEXT },
  { id: 'var_v_37', label: 'Venue City', name: 'venue_city', type: VariableType.TEXT },
  { id: 'var_v_38', label: 'Rush Fee %', name: 'rush_fee_pct', type: VariableType.PERCENTAGE },
  { id: 'var_v_39', label: 'Special Notes', name: 'special_notes', type: VariableType.TEXT },
  { id: 'var_v_40', label: 'Crew Count', name: 'crew_count', type: VariableType.NUMBER },
  { id: 'var_v_41', label: 'Meal Break Provided', name: 'meal_break_provided', type: VariableType.TEXT },
  { id: 'var_v_42', label: 'On-site Contact Name', name: 'on_site_contact_name', type: VariableType.TEXT },
  { id: 'var_v_43', label: 'On-site Contact Phone', name: 'on_site_contact_phone', type: VariableType.TEXT },
];

export const WEBSITE_VARIABLES: Variable[] = [
  // Provider Info
  { id: 'var_w_1', label: 'Business Legal Name', name: 'business_legal_name', type: VariableType.TEXT },
  { id: 'var_w_2', label: 'DBA / Brand', name: 'dba_brand', type: VariableType.TEXT },
  { id: 'var_w_3', label: 'Provider Contact Name', name: 'provider_contact_name', type: VariableType.TEXT },
  { id: 'var_w_4', label: 'Provider Email', name: 'provider_email', type: VariableType.TEXT },
  { id: 'var_w_5', label: 'Provider Phone', name: 'provider_phone', type: VariableType.TEXT },
  // Client Info
  { id: 'var_w_6', label: 'Client Legal Name', name: 'client_legal_name', type: VariableType.TEXT },
  { id: 'var_w_7', label: 'Client Email', name: 'client_email', type: VariableType.TEXT },
  { id: 'var_w_8', label: 'Client Phone', name: 'client_phone', type: VariableType.TEXT },
  // Project Info
  { id: 'var_w_9', label: 'Project Title', name: 'project_title', type: VariableType.TEXT },
  { id: 'var_w_10', label: 'Website Description', name: 'website_description', type: VariableType.TEXT },
  { id: 'var_w_11', label: 'Domain / URL', name: 'domain_url', type: VariableType.TEXT },
  { id: 'var_w_12', label: 'Page Count / Sitemap', name: 'page_count_sitemap', type: VariableType.TEXT },
  { id: 'var_w_13', label: 'Content Responsibility', name: 'content_responsibility', type: VariableType.TEXT },
  { id: 'var_w_14', label: 'Design Assets Provided', name: 'design_assets_provided', type: VariableType.TEXT },
  // Timeline
  { id: 'var_w_15', label: 'Start Date', name: 'start_date', type: VariableType.DATE },
  { id: 'var_w_16', label: 'Target Launch Date', name: 'target_launch_date', type: VariableType.DATE },
  // Fees
  { id: 'var_w_17', label: 'Base Fee', name: 'base_fee', type: VariableType.NUMBER },
  { id: 'var_w_18', label: 'Deposit %', name: 'deposit_pct', type: VariableType.PERCENTAGE },
  { id: 'var_w_19', label: 'Payment Methods', name: 'payment_method_options', type: VariableType.TEXT },
  { id: 'var_w_20', label: 'Card Fee %', name: 'card_fee_pct', type: VariableType.PERCENTAGE },
  { id: 'var_w_21', label: 'Monthly Maintenance Fee', name: 'monthly_maintenance_fee', type: VariableType.NUMBER },
  { id: 'var_w_22', label: 'Annual Renewal Fee', name: 'annual_renewal_fee', type: VariableType.NUMBER },
  { id: 'var_w_23', label: 'Annual Fee Increase %', name: 'annual_fee_increase_pct', type: VariableType.PERCENTAGE },
  { id: 'var_w_24', label: 'Change Order Rate ($/hr)', name: 'change_order_rate', type: VariableType.NUMBER },
  { id: 'var_w_25', label: 'Revisions Included', name: 'revisions_included', type: VariableType.NUMBER },
  // Technical & Legal
  { id: 'var_w_26', label: 'Accessibility Standard', name: 'accessibility_standard', type: VariableType.TEXT },
  { id: 'var_w_27', label: 'SEO Disclaimer', name: 'seo_disclaimer', type: VariableType.TEXT },
  { id: 'var_w_28', label: 'Performance Budget', name: 'performance_budget', type: VariableType.TEXT },
  { id: 'var_w_29', label: 'Maintenance Scope', name: 'maintenance_scope', type: VariableType.TEXT },
  { id: 'var_w_30', label: 'License Type', name: 'license_type', type: VariableType.TEXT },
  { id: 'var_w_31', label: 'Portfolio Rights', name: 'portfolio_rights', type: VariableType.TEXT },
  { id: 'var_w_32', label: 'Acceptance Criteria', name: 'acceptance_criteria', type: VariableType.TEXT },
  { id: 'var_w_33', label: 'Governing Law State', name: 'governing_law_state', type: VariableType.TEXT },
  { id: 'var_w_34', label: 'Venue Location', name: 'venue_location', type: VariableType.TEXT },
  { id: 'var_w_35', label: 'Liability Cap', name: 'cap_on_liability', type: VariableType.TEXT },
  { id: 'var_w_36', label: 'Indemnity Scope', name: 'indemnity_scope', type: VariableType.TEXT },
  { id: 'var_w_37', label: 'DPA Required', name: 'data_processing_addendum', type: VariableType.TEXT },
];

export const WEBSITE_QUESTION_FLOW: QuestionFlowItem[] = [
  { key: 'client_legal_name', question: "What is the client's full legal name?", required: true },
  { key: 'client_email', question: "What is the client's primary email address?", required: true },
  { key: 'client_phone', question: "What is the client's phone number?", required: false },
  { key: 'project_title', question: "What is the project title? (e.g., 'Corporate Website Redesign')", required: true },
  { key: 'website_description', question: "Briefly describe the website's purpose and core features.", required: true },
  { key: 'domain_url', question: "What is the domain/URL?", required: true },
  { key: 'page_count_sitemap', question: "What is the estimated page count or sitemap outline?", required: true },
  { key: 'content_responsibility', question: "Who is responsible for content?", required: true, enumOptions: ['Client', 'Provider', 'Shared'], default: 'Client' },
  { key: 'design_assets_provided', question: "Will the client provide design assets?", required: true, enumOptions: ['yes', 'no'], default: 'yes' },
  { key: 'start_date', question: "What is the project start date?", required: true },
  { key: 'target_launch_date', question: "What is the target launch date?", required: true },
  { key: 'base_fee', question: "What is the total base fee for design/build?", required: true },
  { key: 'deposit_pct', question: "What is the deposit percentage?", required: true, default: 50 },
  { key: 'payment_method_options', question: "What payment methods are accepted?", required: true, default: 'Card, ACH' },
  { key: 'card_fee_pct', question: "What is the card processing fee percentage?", required: true, default: 3.5 },
  { key: 'monthly_maintenance_fee', question: "What is the monthly maintenance fee?", required: true },
  { key: 'annual_renewal_fee', question: "What is the estimated annual renewal fee?", required: true },
  { key: 'annual_fee_increase_pct', question: "What is the annual fee increase percentage?", required: true, default: 5 },
  { key: 'change_order_rate', question: "What is the hourly rate for out-of-scope work?", required: true, default: 150 },
  { key: 'revisions_included', question: "How many revision rounds are included?", required: true, default: 1 },
  { key: 'accessibility_standard', question: "What is the accessibility standard?", required: true, default: 'WCAG 2.2 AA best-effort' },
  { key: 'seo_disclaimer', question: "SEO Disclaimer?", required: true, default: 'best-effort; no ranking guarantees' },
  { key: 'performance_budget', question: "Performance Budget (if applicable)?", required: false },
  { key: 'maintenance_scope', question: "What is included in the maintenance scope?", required: true, default: 'updates, backups, security, 1 hour minor edits' },
  { key: 'license_type', question: "What is the license type?", required: true, default: 'Client owns final site upon payment; Provider retains pre-existing IP' },
  { key: 'portfolio_rights', question: "Portfolio Rights?", required: true, enumOptions: ['on', 'off', 'embargo'], default: 'on' },
  { key: 'acceptance_criteria', question: "Acceptance Criteria?", required: true, default: 'site functions per approved comps and QA checklist' },
  { key: 'governing_law_state', question: "Governing Law State?", required: true, default: 'Virginia' },
  { key: 'venue_location', question: "Venue Location?", required: true, default: 'Virginia Beach, VA' },
  { key: 'cap_on_liability', question: "Liability Cap?", required: true, default: 'total fees paid' },
  { key: 'indemnity_scope', question: "Indemnity Scope?", required: true, default: 'Mutual' },
  { key: 'data_processing_addendum', question: "Is a DPA required?", required: true, enumOptions: ['yes', 'no'], default: 'no' },
];

export const WEBSITE_ADDON_COMMANDS: AddonCommand[] = [];

export const AI_AGENT_VARIABLES: Variable[] = [
  { id: 'var_ai_1', label: 'Business Legal Name', name: 'business_legal_name', type: VariableType.TEXT },
  { id: 'var_ai_2', label: 'DBA / Brand', name: 'dba_brand', type: VariableType.TEXT },
  { id: 'var_ai_3', label: 'Provider Contact Name', name: 'provider_contact_name', type: VariableType.TEXT },
  { id: 'var_ai_4', label: 'Provider Email', name: 'provider_email', type: VariableType.TEXT },
  { id: 'var_ai_5', label: 'Provider Phone', name: 'provider_phone', type: VariableType.TEXT },
  { id: 'var_ai_6', label: 'Client Legal Name', name: 'client_legal_name', type: VariableType.TEXT },
  { id: 'var_ai_7', label: 'Client Email', name: 'client_email', type: VariableType.TEXT },
  { id: 'var_ai_8', label: 'Client Phone', name: 'client_phone', type: VariableType.TEXT },
  { id: 'var_ai_9', label: 'Project Title', name: 'project_title', type: VariableType.TEXT },
  { id: 'var_ai_10', label: 'Website URL', name: 'website_url', type: VariableType.TEXT },
  { id: 'var_ai_11', label: 'Website Description', name: 'website_description', type: VariableType.TEXT },
  { id: 'var_ai_12', label: 'AI Agent Functions', name: 'ai_agent_functions', type: VariableType.TEXT },
  { id: 'var_ai_13', label: 'Start Date', name: 'start_date', type: VariableType.DATE },
  { id: 'var_ai_14', label: 'Delivery Deadline', name: 'delivery_deadline', type: VariableType.DATE },
  { id: 'var_ai_15', label: 'Base Fee', name: 'base_fee', type: VariableType.NUMBER },
  { id: 'var_ai_16', label: 'Deposit %', name: 'deposit_pct', type: VariableType.PERCENTAGE },
  { id: 'var_ai_17', label: 'Monthly Maintenance Fee', name: 'monthly_maintenance_fee', type: VariableType.NUMBER },
  { id: 'var_ai_18', label: 'Annual Renewal Fee', name: 'annual_renewal_fee', type: VariableType.NUMBER },
  { id: 'var_ai_19', label: 'Annual Fee Increase %', name: 'annual_fee_increase_pct', type: VariableType.PERCENTAGE },
  { id: 'var_ai_20', label: 'Payment Methods', name: 'payment_method_options', type: VariableType.TEXT },
  { id: 'var_ai_21', label: 'Card Fee %', name: 'card_fee_pct', type: VariableType.PERCENTAGE },
  { id: 'var_ai_22', label: 'Late Fee Amount', name: 'late_fee_amount', type: VariableType.NUMBER },
  { id: 'var_ai_23', label: 'Hourly Rate', name: 'hourly_rate', type: VariableType.NUMBER },
  { id: 'var_ai_24', label: 'Support Response Time', name: 'support_response_time', type: VariableType.TEXT },
  { id: 'var_ai_25', label: 'Support Hours', name: 'support_hours', type: VariableType.TEXT },
  { id: 'var_ai_26', label: 'Training Rights', name: 'training_rights_on_client_data', type: VariableType.TEXT },
  { id: 'var_ai_27', label: 'Portfolio Rights', name: 'portfolio_rights', type: VariableType.TEXT },
  { id: 'var_ai_28', label: 'Governing Law State', name: 'governing_law_state', type: VariableType.TEXT },
  { id: 'var_ai_29', label: 'Venue Location', name: 'venue_location', type: VariableType.TEXT },
  { id: 'var_ai_30', label: 'Acceptance Criteria', name: 'acceptance_criteria', type: VariableType.TEXT },
  { id: 'var_ai_31', label: 'Compliance Needs', name: 'special_compliance_needs', type: VariableType.TEXT },
  { id: 'var_ai_32', label: 'DPA Required', name: 'data_processing_addendum', type: VariableType.TEXT },
];

export const PHOTO_VIDEO_SUBSCRIPTION_VARIABLES: Variable[] = [
  // Provider Info
  { id: 'pvs_1', name: 'business_legal_name', label: 'Provider Legal Name', type: VariableType.TEXT },
  { id: 'pvs_2', name: 'dba_brand', label: 'Provider Brand Name', type: VariableType.TEXT },
  { id: 'pvs_3', name: 'provider_contact_name', label: 'Provider Contact Name', type: VariableType.TEXT },
  { id: 'pvs_4', name: 'provider_email', label: 'Provider Email', type: VariableType.TEXT },
  { id: 'pvs_5', name: 'provider_phone', label: 'Provider Phone', type: VariableType.TEXT },
  // Client Info
  { id: 'pvs_6', name: 'client_legal_name', label: 'Client Legal Name', type: VariableType.TEXT },
  { id: 'pvs_7', name: 'client_email', label: 'Client Email', type: VariableType.TEXT },
  { id: 'pvs_8', name: 'client_phone', label: 'Client Phone', type: VariableType.TEXT },
  { id: 'pvs_8a', name: 'client_contact_name', label: 'Client Contact Name', type: VariableType.TEXT },
  { id: 'pvs_8b', name: 'client_contact_title', label: 'Client Contact Title', type: VariableType.TEXT },
  // Project Info
  { id: 'pvs_9', name: 'project_title', label: 'Project Title', type: VariableType.TEXT },
  { id: 'pvs_10', name: 'project_location', label: 'Project Location', type: VariableType.TEXT },
  { id: 'pvs_11', name: 'start_date', label: 'Start Date', type: VariableType.DATE },
  { id: 'pvs_12', name: 'service_window', label: 'Service Window', type: VariableType.TEXT },
  { id: 'pvs_13', name: 'call_time', label: 'Call Time', type: VariableType.TEXT },
  // Service Scope
  { id: 'pvs_14', name: 'include_photography', label: 'Include Photography', type: VariableType.TEXT },
  { id: 'pvs_15', name: 'include_videography', label: 'Include Videography', type: VariableType.TEXT },
  // On-Site & Rates
  { id: 'pvs_16', name: 'coverage_hours_per_session', label: 'Coverage Hours per Session', type: VariableType.NUMBER },
  { id: 'pvs_17', name: 'travel_policy', label: 'Travel Policy', type: VariableType.TEXT },
  { id: 'pvs_18', name: 'late_fee_per_30', label: 'Late Fee (per 30 min)', type: VariableType.NUMBER },
  { id: 'pvs_19', name: 'overtime_per_30', label: 'Overtime Rate (per 30 min)', type: VariableType.NUMBER },
  { id: 'pvs_20', name: 'change_order_rate', label: 'Change Order Rate ($/hr)', type: VariableType.NUMBER },
  // Photo Deliverables
  { id: 'pvs_21', name: 'photo_deliverables_per_session', label: 'Photo Deliverables per Session', type: VariableType.NUMBER },
  { id: 'pvs_22', name: 'raws_included', label: 'RAWs Included', type: VariableType.TEXT },
  { id: 'pvs_24', name: 'photo_turnaround_days', label: 'Photo Turnaround (days)', type: VariableType.NUMBER },
  { id: 'pvs_25', name: 'revision_rounds_photo', label: 'Photo Revision Rounds', type: VariableType.NUMBER },
  // Video Deliverables
  { id: 'pvs_26', name: 'video_highlight_length_sec', label: 'Video Highlight Length (sec)', type: VariableType.NUMBER },
  { id: 'pvs_30', name: 'video_turnaround_days', label: 'Video Turnaround (days)', type: VariableType.NUMBER },
  { id: 'pvs_31', name: 'revision_rounds_video_main', label: 'Video Revision Rounds', type: VariableType.NUMBER },
  { id: 'pvs_32', name: 'music_licensing_owner', label: 'Music Licensing Owner', type: VariableType.TEXT },
  { id: 'pvs_33', name: 'soundtrack_budget', label: 'Soundtrack Budget ($)', type: VariableType.NUMBER },
  { id: 'pvs_34', name: 'raw_footage_included', label: 'Raw Footage Included', type: VariableType.TEXT },
  // IP & Legal
  { id: 'pvs_37', name: 'portfolio_rights', label: 'Portfolio Rights', type: VariableType.TEXT },
  { id: 'pvs_38', name: 'embargo_days', label: 'Embargo (days)', type: VariableType.NUMBER },
  { id: 'pvs_39', name: 'model_release_toggle', label: 'Model Releases Required', type: VariableType.TEXT },
  { id: 'pvs_40', name: 'acceptance_window_days', label: 'Acceptance Window (days)', type: VariableType.NUMBER },
  // Subscription Terms
  { id: 'pvs_41', name: 'subscription_monthly_fee', label: 'Monthly Fee ($)', type: VariableType.NUMBER },
  { id: 'pvs_42', name: 'subscription_min_term_months', label: 'Minimum Term (months)', type: VariableType.NUMBER },
  { id: 'pvs_44', name: 'subscription_sessions_per_month', label: 'Sessions per Month', type: VariableType.NUMBER },
  { id: 'pvs_45', name: 'subscription_hours_per_session', label: 'Hours per Session', type: VariableType.NUMBER },
  { id: 'pvs_46', name: 'subscription_photo_quota_per_month', label: 'Monthly Photo Quota', type: VariableType.NUMBER },
  { id: 'pvs_48', name: 'rollover_policy', label: 'Rollover Policy', type: VariableType.TEXT },
  { id: 'pvs_49', name: 'overage_rate_per_hour', label: 'Overage Rate ($/hr)', type: VariableType.NUMBER },
  { id: 'pvs_50', name: 'payment_schedule', label: 'Payment Schedule', type: VariableType.TEXT },
  { id: 'pvs_51', name: 'cancellation_notice_days', label: 'Cancellation Notice (days)', type: VariableType.NUMBER },
  { id: 'pvs_52', name: 'nonpayment_grace_days', label: 'Non-payment Grace (days)', type: VariableType.NUMBER },
  { id: 'pvs_53', name: 'booking_notice_days', label: 'Booking Notice (days)', type: VariableType.NUMBER },
  // Admin & General
  { id: 'pvs_54', name: 'asset_retention_photo_days', label: 'Photo Asset Retention (days)', type: VariableType.NUMBER },
  { id: 'pvs_55', name: 'asset_retention_video_days', label: 'Video Asset Retention (days)', type: VariableType.NUMBER },
  { id: 'pvs_56', name: 'warranty_window_days', label: 'Warranty Window (days)', type: VariableType.NUMBER },
  { id: 'pvs_59', name: 'special_notes', label: 'Special Notes', type: VariableType.TEXT },
];

export const PHOTO_VIDEO_SUBSCRIPTION_QUESTION_FLOW: QuestionFlowItem[] = [
  { key: 'client_legal_name', question: "What is the client's full legal name?", required: true },
  { key: 'client_email', question: "What is the client's primary email address?", required: true },
  { key: 'client_contact_name', question: "What is the name of the person signing for the client?", required: true },
  { key: 'client_contact_title', question: "What is their title? (e.g., 'Marketing Director')", required: true },
  { key: 'client_phone', question: "What is a good contact phone number for the client?", required: false },
  { key: 'project_title', question: "What is the title for this subscription? (e.g., 'Monthly Content Program — Photo + Video')", required: true },
  { key: 'project_location', question: "What is the primary location for the sessions?", required: true },
  { key: 'start_date', question: "What is the start date for this agreement?", required: true },
  { key: 'service_window', question: "How would you describe the service window? (e.g., 'Rolling 30-day periods')", required: false, default: 'Rolling 30-day periods' },
  { key: 'call_time', question: "What is the typical call time for sessions? (e.g., '9:30 AM')", required: false, default: '9:30 AM' },
  { key: 'include_photography', question: "Does this subscription include photography?", required: true, enumOptions: ['true', 'false'], default: 'true' },
  { key: 'include_videography', question: "Does this subscription include videography?", required: true, enumOptions: ['true', 'false'], default: 'true' },
  { key: 'subscription_monthly_fee', question: "What is the monthly subscription fee?", required: true },
  { key: 'subscription_min_term_months', question: "What is the minimum term for the subscription, in months?", required: true },
  { key: 'subscription_sessions_per_month', question: "How many sessions are included per month?", required: true },
  { key: 'subscription_hours_per_session', question: "How many hours of coverage are included per session?", required: true },
  { key: 'subscription_photo_quota_per_month', question: "What is the total monthly quota for edited photos?", required: true },
  { key: 'photo_deliverables_per_session', question: "Approximately how many edited photos will be delivered per session?", required: true, default: 15 },
  { key: 'video_highlight_length_sec', question: "What is the approximate length of the main highlight video in seconds?", required: true, default: 60 },
  { key: 'booking_notice_days', question: "How many days' notice are required for booking a session?", required: true },
  { key: 'acceptance_window_days', question: "How many days does the client have to review and accept deliverables before they are considered approved?", required: true, default: 5 },
  { key: 'revision_rounds_photo', question: "How many rounds of revisions are included for photos?", required: true, default: 0 },
  { key: 'revision_rounds_video_main', question: "How many rounds of revisions are included for the main video edit?", required: true, default: 1 },
  { key: 'photo_turnaround_days', question: "What is the turnaround time for photos, in business days?", required: true, default: 10, condition: values => values.include_photography },
  { key: 'video_turnaround_days', question: "What is the turnaround time for video, in business days?", required: true, default: 14, condition: values => values.include_videography },
  { key: 'asset_retention_photo_days', question: "For how many days will you retain photo project files after delivery?", required: true, default: 60, condition: values => values.include_photography },
  { key: 'asset_retention_video_days', question: "For how many days will you retain video project files after delivery?", required: true, default: 30, condition: values => values.include_videography },
  { key: 'warranty_window_days', question: "What is the warranty window for file corrections (in days)?", required: true, default: 7 },
  { key: 'rollover_policy', question: "What is the policy for unused sessions/quotas?", required: true, default: 'Unused sessions from the previous month expire 30 days after the start of the following month.' },
  { key: 'overage_rate_per_hour', question: "What is the overage rate per hour if a session runs long?", required: true },
  { key: 'payment_schedule', question: "What is the payment schedule?", required: true, default: 'Bills monthly in advance on the 1st' },
  { key: 'cancellation_notice_days', question: "How many days' notice are required to cancel the subscription (after the min. term)?", required: true },
  { key: 'nonpayment_grace_days', question: "How many grace days are allowed for non-payment?", required: true },
  { key: 'portfolio_rights', question: "Can you use the final work in your portfolio?", required: true, enumOptions: ['on', 'off', 'embargo'], default: 'on' },
  { key: 'embargo_days', question: "How many days should you wait before using the work in your portfolio?", required: true, condition: values => values.portfolio_rights === 'embargo', default: 30 },
  { key: 'music_licensing_owner', question: "Who is responsible for music licensing?", required: true, enumOptions: ['client', 'provider'], default: 'client' },
  { key: 'raw_footage_included', question: "Is raw footage included in the subscription fee?", required: true, enumOptions: ['true', 'false'], default: 'false' },
  { key: 'special_notes', question: "Are there any special notes or priorities to include in the SOW?", required: false },
];

export const PHOTO_VIDEO_SUBSCRIPTION_ADDON_COMMANDS: AddonCommand[] = [];

export const AI_AGENT_QUESTION_FLOW: QuestionFlowItem[] = [
  { key: 'client_legal_name', question: "What is the client's full legal name?", required: true },
  { key: 'client_email', question: "What is the client's primary email address?", required: true },
  { key: 'client_phone', question: "What is the client's phone number?", required: false },
  { key: 'project_title', question: "What is the title for this project? (e.g., 'AI Chatbot & Website Build')", required: true },
  { key: 'website_url', question: "What is the website URL/domain?", required: true },
  { key: 'website_description', question: "Briefly describe the website's purpose.", required: true },
  { key: 'ai_agent_functions', question: "List the AI agent functions (e.g., lead gen, scheduling, support).", required: true },
  { key: 'start_date', question: "What is the start date?", required: true },
  { key: 'delivery_deadline', question: "What is the target delivery deadline?", required: true },
  { key: 'base_fee', question: "What is the total base fee for design + AI build?", required: true },
  { key: 'deposit_pct', question: "What is the deposit percentage?", required: true, default: 50 },
  { key: 'monthly_maintenance_fee', question: "What is the monthly maintenance fee?", required: true },
  { key: 'annual_renewal_fee', question: "What is the estimated annual renewal fee (domains, APIs)?", required: true },
  { key: 'annual_fee_increase_pct', question: "What is the annual fee increase percentage?", required: true, default: 5 },
  { key: 'payment_method_options', question: "What payment methods are accepted? (e.g., 'Card, ACH')", required: true, default: 'Card, ACH' },
  { key: 'card_fee_pct', question: "What is the card processing fee percentage?", required: true, default: 3.5 },
  { key: 'late_fee_amount', question: "What is the late fee amount (per 30 days)?", required: true, default: 50 },
  { key: 'hourly_rate', question: "What is the hourly rate for out-of-scope work?", required: true, default: 150 },
  { key: 'support_response_time', question: "What is the support response time? (e.g., '2 business days')", required: true, default: '2 business days' },
  { key: 'support_hours', question: "What are the support hours? (e.g., 'Mon–Fri 9AM–5PM ET')", required: true, default: 'Mon–Fri 9AM–5PM ET' },
  { key: 'training_rights_on_client_data', question: "Can you use client data for training?", required: true, enumOptions: ['no', 'limited aggregated', 'yes with consent'], default: 'no' },
  { key: 'portfolio_rights', question: "Can you use the final site in your portfolio?", required: true, enumOptions: ['on', 'off'], default: 'on' },
  { key: 'governing_law_state', question: "Governing Law State?", required: true, default: 'Virginia' },
  { key: 'venue_location', question: "Venue Location?", required: true, default: 'Virginia Beach, VA' },
  { key: 'acceptance_criteria', question: "Acceptance Criteria?", required: true, default: 'meets approved designs and functions, and AI agents perform specified tasks' },
  { key: 'special_compliance_needs', question: "Any special compliance needs? (e.g., GDPR, Colorado AI Act)", required: false },
  { key: 'data_processing_addendum', question: "Is a Data Processing Addendum (DPA) required?", required: true, enumOptions: ['yes', 'no'], default: 'no' },
];

export const AI_AGENT_ADDON_COMMANDS: AddonCommand[] = [
  { command: "uptime sla", followupKeys: ['uptime_sla_target_pct'], followupQuestions: ["What is the uptime SLA target percentage?"], action: (values) => ({ ...values, has_uptime_sla: true, uptime_sla_target_pct: values.uptime_sla_target_pct || 99.9 }) },
  { command: "ad spend", followupKeys: ['ad_spend_cap_monthly'], followupQuestions: ["What is the monthly ad spend cap?"], action: (values) => ({ ...values, manage_ad_spend: true, ad_spend_cap_monthly: values.ad_spend_cap_monthly || 1000 }) },
];

export const INITIAL_TEMPLATES_DATA: Template[] = [
  {
    id: 'template_photo_std_1',
    contractType: TemplateType.PHOTOGRAPHY,
    name: 'Photography Services',
    description: ['Events', 'Portraits', 'Product Shots'],
    quickDraftFields: ['client_legal_name', 'project_title', 'service_package', 'shoot_date', 'base_fee', 'deposit_pct', 'deliverables_count', 'turnaround_days', 'project_location'],
    bodyMd: `# PHOTOGRAPHY SERVICES AGREEMENT

This Photography Services Agreement ("Agreement") is made and entered into as of the date of the last signature below (the "Effective Date"), by and between {{business_legal_name}} d/b/a {{dba_brand}} ("Provider") and {{client_legal_name}} ("Client"). The parties agree as follows:

## SERVICES & SCOPE
Provider agrees to provide professional photography services for the project titled "{{project_title}}" (the "Services"). The Services will include {{service_package}}. The primary work location will be {{project_location}} unless mutually agreed otherwise in writing.

## TERM & SCHEDULE
The Services shall be performed on {{shoot_date}}, commencing at approximately {{call_time}} for a scheduled duration of {{coverage_hours}} hours.

## FEES & PAYMENT
Client agrees to pay Provider a total fee of \${{base_fee}}. A non-refundable deposit of {{deposit_pct}}% is due upon execution of this Agreement to reserve the date. The remaining balance is due prior to the delivery of the final images. Payments made via credit card may incur a {{card_fee_pct}}% processing fee.

## DELIVERABLES
Provider will deliver approximately {{deliverables_count}} high-resolution, edited digital images to Client via {{delivery_method}}. The estimated delivery timeframe is {{turnaround_days}} business days from the shoot date. Raw, unedited images are not included unless specified.

## INTELLECTUAL PROPERTY
Provider shall retain all rights, title, and interest, including copyright, in and to all images created. Upon full payment, Provider grants Client a {{license_type}} to use the final, delivered images for their intended business purposes.

## CANCELLATION & RESCHEDULING
If Client wishes to reschedule, a minimum of {{reschedule_notice_hours}} hours' notice is required to transfer the deposit to a new date. Cancellations or reschedules with less notice will forfeit the deposit. {{cancellation_terms}}.

## GENERAL PROVISIONS
This Agreement is governed by the laws of the State of {{governing_law_state}}. Any disputes arising from this Agreement shall be resolved in the jurisdiction of {{venue_city}}. This document constitutes the entire agreement between the parties. Any amendments must be made in writing and signed by both parties.
{{special_notes}}

---

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.

### PROVIDER
{{business_legal_name}} (d/b/a {{dba_brand}})

Signature: {{signature_placeholder_provider}}__________________________________
Name: {{provider_contact_name}}
Date: {{date_placeholder_provider}}__________________________________

### CLIENT
{{client_legal_name}}

Signature: {{signature_placeholder_client}}__________________________________
Name: {{client_contact_name}}
Title: {{client_contact_title}}
Date: {{date_placeholder_client}}__________________________________
`,
    variables: PHOTOGRAPHY_VARIABLES,
    clauses: [],
    defaultValues: {
      business_legal_name: "Saul C Lowery Jr",
      dba_brand: "Saul Lowery Productions",
      provider_contact_name: "Saul Lowery",
      provider_email: "sloweryinc@gmail.com",
      provider_phone: "407-864-0563",
      deposit_pct: 50,
      card_fee_pct: 3.5,
      late_fee_per_30: 50,
      overtime_per_30: 90,
      travel_policy: "First 25 miles round-trip included; $2/mi after",
      deliverables_count: 20,
      raws_included: 'no',
      delivery_method: "Online gallery download (JPEG, high-res)",
      turnaround_days: 10,
      license_type: "Perpetual, non-exclusive business-use license to final edited photos; photographer retains copyright",
      model_release_toggle: 'yes',
      portfolio_rights: "on",
      embargo_days: 0,
      reschedule_notice_hours: 72,
      reschedule_fee: 150,
      cancellation_terms: "Deposit is non-refundable; cancel within 72 hours of shoot → remaining balance due",
      asset_retention_days: 60,
      change_order_rate: 120,
      warranty_window_days: 7,
      governing_law_state: "Virginia",
      venue_city: "Virginia Beach, VA",
    },
  },
  {
    id: 'template_video_std_1',
    contractType: TemplateType.VIDEOGRAPHY,
    name: 'Videography Services',
    description: ['Corporate Video', 'Weddings', 'Events'],
    quickDraftFields: ['client_legal_name', 'project_title', 'shoot_date', 'base_fee', 'deposit_pct', 'deliverables_main_highlight_length_sec', 'social_cuts_count', 'delivery_deadline_days', 'project_location'],
    bodyMd: `# VIDEOGRAPHY SERVICES AGREEMENT

This Videography Services Agreement ("Agreement") is made between {{business_legal_name}} ("Provider") and {{client_legal_name}} ("Client").

## SCOPE OF SERVICES
Provider will create a video for the project titled "{{project_title}}". Services include filming on {{shoot_date}} at {{project_location}}, editing, and final delivery.

## DELIVERABLES
Final deliverables will include one main highlight video of approximately {{deliverables_main_highlight_length_sec}} seconds and {{social_cuts_count}} shorter social media cuts. Delivery is scheduled within {{delivery_deadline_days}} business days.

## PAYMENT TERMS
The total fee for the services is \${{base_fee}}. A {{deposit_pct}}% deposit is required to secure the booking. The final balance is due upon completion and prior to delivery of the final video files.

## OWNERSHIP AND USAGE
Provider retains copyright to all raw footage. Upon final payment, Client is granted a license to use the final video deliverables for their intended marketing and communication purposes.

---
### PROVIDER
{{business_legal_name}}

Signature: {{signature_placeholder_provider}}__________________________________
Name: {{provider_contact_name}}
Date: {{date_placeholder_provider}}__________________________________

### CLIENT
{{client_legal_name}}

Signature: {{signature_placeholder_client}}__________________________________
Name: {{client_contact_name}}
Title: {{client_contact_title}}
Date: {{date_placeholder_client}}__________________________________
`,
    variables: VIDEOGRAPHY_VARIABLES,
    clauses: [],
    defaultValues: {
      'business_legal_name': 'Saul C Lowery Jr',
      'provider_name': 'Saul Lowery Films',
      'deposit_pct': 50,
      'delivery_deadline_days': 21,
      'social_cuts_count': 3,
    },
  },
  {
    id: 'template_web_std_1',
    contractType: TemplateType.WEBSITE,
    name: 'Website Development & Maintenance',
    description: ['Custom Design', 'Development', 'Maintenance'],
    quickDraftFields: ['client_legal_name', 'project_title', 'domain_url', 'start_date', 'base_fee', 'deposit_pct', 'monthly_maintenance_fee', 'target_launch_date'],
    bodyMd: `# Website Development & Maintenance Services Agreement

1) Title & Parties

This Website Development & Maintenance Services Agreement (“Agreement”) is entered into as of {{effective_date}} by and between {{business_legal_name}} d/b/a {{dba_brand}} (“Provider”) and {{client_legal_name}} (“Client”). Provider and Client may be referred to individually as a “Party” and collectively as the “Parties”.

2) Scope of Work

2.1 Project Overview. Provider will design and develop a custom website for Client located at {{domain_url}} (the “Services”). The Services are described in Exhibit A — Statement of Work (SOW).

2.2 Deliverables. Deliverables may include, as applicable:
• A responsive website built to Client’s approved design.
• Content management system (CMS) configuration.
• Integration of specified third-party tools (e.g., analytics, forms).
• Training and documentation on how to operate the website.
• Ongoing maintenance and support services as outlined in Section 8.

2.3 Exclusions. Services do not include third-party hosting fees, domain registration fees, paid plugins/apps, or legal advice. Custom development beyond the SOW will require a signed Change Order (Exhibit B) at the rate set forth in the Variables Table or a new quotation.

3) Fees & Payment

3.1 Project Fee. The total fee for the design and build described in Exhibit A is \${{base_fee}}, plus any applicable taxes and third-party costs.

3.2 Deposit & Schedule. A deposit of {{deposit_pct}}% of the Project Fee is due upon signing. The remaining balance is due upon Provider’s completion of the deliverables and prior to launch or delivery of files. Card payments incur an additional {{card_fee_pct}}% processing fee.

3.3 Monthly Maintenance Fee. Client agrees to pay \${{monthly_maintenance_fee}} per month for website maintenance, hosting, security updates, and ongoing support. Monthly fees commence when the website goes live. The monthly maintenance fee may increase annually by {{annual_fee_increase_pct}}% with at least 30 days’ notice.

3.4 Annual Renewal Fee. Client is responsible for annual renewal of domain names, SSL certificates, and any licensed software. The expected annual renewal cost is \${{annual_renewal_fee}}; Provider will invoice Client for these expenses.

3.5 Out-of-Scope Work. Tasks not included in monthly maintenance (e.g., new features, significant redesigns) will be billed at \${{change_order_rate}} per hour or at a mutually agreed fixed price via Change Order.

4) Changes & Additional Services

4.1 Change Orders. Client may request changes to the scope or deliverables by submitting a Change Order. Provider will specify the cost and schedule impact. Both Parties must sign the Change Order before work begins.

5) Client Responsibilities

5.1 Content & Access. Client will supply all website content, branding assets, and access credentials in a timely manner.

5.2 Rights to Data. Client warrants that it owns or has the rights to provide all data and content supplied to Provider.

6) Intellectual Property & License

6.1 Ownership. Upon full payment, Client owns the final website files and assets. Provider retains ownership of its pre-existing materials, processes, and know-how.

6.2 License. {{license_type}}

6.3 Portfolio Display. Provider may showcase the final website in its portfolio and marketing materials, unless Client requests an embargo period or opts out: {{portfolio_rights}}.

7) Maintenance & Support

7.1 Included Services. The monthly maintenance fee covers: {{maintenance_scope}}.

7.2 Response Times. Provider will make commercially reasonable efforts to respond to support requests within 2 business days.

8) Compliance & Warranties

8.1 Accessibility. Provider will use best efforts to build the website to the following standard: {{accessibility_standard}}. However, Provider does not guarantee full compliance with all accessibility laws.

8.2 SEO. {{seo_disclaimer}}

8.3 Performance. {{performance_budget}}

9) Term & Termination

9.1 Term. This Agreement begins on the effective date and continues until completion of the SOW and payment of all amounts due. Monthly maintenance services continue on a month-to-month basis until terminated by either Party.

9.2 Termination. Either Party may terminate the maintenance portion of this Agreement by providing 30 days’ written notice.

10) General Provisions

10.1 Governing Law. This Agreement is governed by the laws of {{governing_law_state}}. Any dispute shall be brought in {{venue_location}}.

10.2 Liability Cap. Provider’s total liability is limited to: {{cap_on_liability}}.

10.3 Indemnity. {{indemnity_scope}} indemnification for third-party claims.

10.4 DPA. DPA Required: {{data_processing_addendum}}.

Exhibit A — Statement of Work (SOW)
• Project Title: {{project_title}}
• Description: {{website_description}}
• Domain: {{domain_url}}
• Sitemap: {{page_count_sitemap}}
• Timeline: Start on {{start_date}}; target launch by {{target_launch_date}}.
• Acceptance Criteria: {{acceptance_criteria}}.
• Maintenance Scope: {{maintenance_scope}}
• Monthly Maintenance Fee: \${{monthly_maintenance_fee}}
• Annual Renewal Fee: \${{annual_renewal_fee}}

---

Provider: {{business_legal_name}} (d/b/a {{dba_brand}})

By: {{signature_placeholder_provider}}___________________________________
Name: {{provider_contact_name}}
Title: ________________________________
Date: {{date_placeholder_provider}}________________________________

Client: {{client_legal_name}}

By: {{signature_placeholder_client}}___________________________________
Name: ________________________________
Title: ________________________________
Date: {{date_placeholder_client}}________________________________
`,
    variables: WEBSITE_VARIABLES,
    questionFlow: WEBSITE_QUESTION_FLOW,
    clauses: [],
    defaultValues: {
      business_legal_name: "Saul Lowery Productions",
      dba_brand: "Saul Lowery Productions",
      provider_contact_name: "Saul Lowery",
      provider_email: "saul@slp.com",
      provider_phone: "555-0123",
      deposit_pct: 50,
      annual_fee_increase_pct: 5,
      card_fee_pct: 3.5,
      change_order_rate: 150,
      revisions_included: 1,
      accessibility_standard: "WCAG 2.2 AA best-effort",
      seo_disclaimer: "best-effort; no ranking guarantees",
      maintenance_scope: "updates, backups, security, 1 hour minor edits",
      license_type: "Client owns final site upon payment; Provider retains pre-existing IP",
      portfolio_rights: "on",
      acceptance_criteria: "site functions per approved comps and QA checklist",
      governing_law_state: "Virginia",
      venue_location: "Virginia Beach, VA",
      cap_on_liability: "total fees paid",
      indemnity_scope: "Mutual",
      data_processing_addendum: "no",
      payment_method_options: "Card, ACH",
    },
  },
  {
    id: 'template_ai_std_1',
    contractType: TemplateType.AI_AGENT,
    name: 'AI Agent & Website Development',
    description: ['Custom Website', 'AI Agent Configuration', 'Ongoing Maintenance'],
    quickDraftFields: ['client_legal_name', 'project_title', 'website_url', 'start_date', 'base_fee', 'monthly_maintenance_fee', 'ai_agent_functions', 'delivery_deadline'],
    bodyMd: `# AI Agent & Website Development Agreement

1) Title & Parties

This AI Agent & Website Development Agreement (“Agreement”) is entered into as of {{effective_date}} by and between {{business_legal_name}} d/b/a {{dba_brand}} (“Provider”) and {{client_legal_name}} (“Client”).  Provider and Client may be referred to individually as a “Party” and collectively as the “Parties”.

2) Scope of Work

2.1 Project Overview.  Provider will design and develop a custom website for Client located at {{website_url}} and build/configure one or more AI agents to automate Client’s specified tasks (collectively, the “Services”).  The Services are described in Exhibit A — Statement of Work (SOW).

2.2 Deliverables.  Deliverables may include, as applicable:
	•	A responsive website built to Client’s approved design, including content management and integrations.
	•	AI agents configured to perform tasks selected by Client (e.g., lead generation, scheduling, customer support chatbots, data analysis).
	•	Training and documentation on how to operate the website and AI agents.
	•	Ongoing maintenance and support services as outlined in Section 8.

2.3 Exclusions.  Services do not include third-party hosting fees, domain registration fees, paid plugins/apps, paid AI API usage, or legal advice.  Custom development beyond the SOW will require a signed Change Order (Exhibit B) at the rate set forth in the Variables Table or a new quotation.

3) Fees & Payment

3.1 Project Fee.  The total fee for the design and build described in Exhibit A is \${{base_fee}}, plus any applicable taxes and third-party costs.

3.2 Deposit & Schedule.  A deposit of {{deposit_pct}}% of the Project Fee is due upon signing.  The remaining balance is due upon Provider’s completion of the deliverables and prior to launch or delivery of files.  Card payments incur an additional {{card_fee_pct}}% processing fee.

3.3 Monthly Maintenance Fee.  Client agrees to pay \${{monthly_maintenance_fee}} per month for website and AI agent maintenance, hosting, security updates, and ongoing support.  Monthly fees commence when the website and AI agents go live.  The monthly maintenance fee may increase annually by {{annual_fee_increase_pct}}% with at least 30 days’ notice to reflect changes in vendor pricing and operating costs.

3.4 Annual Renewal Fee.  Client is responsible for annual renewal of domain names, SSL certificates, and any licensed software or API subscriptions.  The expected annual renewal cost is \${{annual_renewal_fee}}; Provider will invoice Client for these expenses.

3.5 Out-of-Scope Work.  Tasks not included in monthly maintenance (e.g., new features, significant redesigns, additional AI agents) will be billed at \${{hourly_rate}} per hour or at a mutually agreed fixed price via Change Order.

3.6 Late Payments.  Late payments are subject to a late fee of \${{late_fee_amount}} per 30 days outstanding.  Provider may suspend services for non-payment.

4) Changes & Additional Services

4.1 Change Orders.  Client may request changes to the scope or deliverables by submitting a Change Order.  Provider will specify the cost and schedule impact.  Both Parties must sign the Change Order before work begins.

4.2 Add-Ons.  Client may opt to purchase additional services such as AI training sessions, data migrations, or integration with new platforms.  These items will be quoted separately.

5) Client Responsibilities

5.1 Content & Access.  Client will supply all website content, branding assets, and access credentials (e.g., domain registrar, hosting account, API keys) in a timely manner.

5.2 Rights to Data.  Client warrants that it owns or has the rights to provide all data, content, and training materials supplied to Provider.  Client is responsible for obtaining any required permissions or releases.

5.3 Use of AI Agents.  Client agrees to use the AI agents responsibly and in compliance with all applicable laws.  Client will not intentionally use the AI to make high-risk decisions (e.g., hiring, lending, healthcare) without consulting legal counsel.

6) Inputs, Outputs & Data Usage

6.1 Inputs.  Provider may require Client to provide data to train or configure the AI agent(s).  The Parties agree that inputs may include personal data, confidential business information, or other proprietary data.  Provider will use commercially reasonable measures to protect this data and will only process it as needed to perform the Services.

6.2 Outputs & Ownership.  Upon full payment, Client owns the website files and AI agent configurations delivered under this Agreement.  Provider retains ownership of its pre-existing materials, processes, and know-how.  The Parties acknowledge that the outputs generated by the AI agents belong to Client; however, Client is responsible for reviewing and validating outputs.

6.3 Training Rights.  Provider will not use Client data to train or improve its models outside this engagement unless Client gives written consent: {{training_rights_on_client_data}}.

6.4 Third-Party Services.  Certain AI components may rely on third-party platforms (e.g., OpenAI, Google).  Client agrees to be bound by those third-party terms and acknowledges that Provider is not liable for outages or changes to third-party services.

7) Intellectual Property & License

7.1 Ownership.  Client obtains a perpetual, non-exclusive, worldwide license to use the deliverables for its business purposes.  Provider retains all rights to pre-existing materials, frameworks, generic templates, and know-how.

7.2 IP Representations.  Provider represents that it has the rights to grant the licenses herein and that the Services do not knowingly infringe third-party rights.

7.3 Portfolio Display.  Provider may showcase the final website and AI agent outputs in its portfolio and marketing materials, unless Client requests an embargo period or opts out: {{portfolio_rights}}.

8) Maintenance & Support

8.1 Included Services.  The monthly maintenance fee covers routine tasks such as plugin and library updates, security monitoring, bug fixes, AI agent performance tuning, backups, minor content updates, and reasonable email support during business hours.

8.2 Excluded Services.  Major redesigns, new AI agents, significant content creation, custom development, emergency recovery due to unauthorized changes, or third-party software licensing fees are not included and will be billed separately.

8.3 Response Times.  Provider will make commercially reasonable efforts to respond to support requests within {{support_response_time}} and to resolve issues according to priority.  Downtime of third-party services is outside Provider’s control and is excluded from any uptime guarantee.

8.4 Annual Increases.  To account for vendor pricing changes and inflation, the monthly maintenance fee may increase by {{annual_fee_increase_pct}}% annually with notice.

9) Compliance & Privacy

9.1 Legal Compliance.  Each Party will comply with all applicable laws, including privacy regulations and emerging AI laws.  Provider does not guarantee that the Services will meet any future legal requirements that were unknown at the effective date; the Parties will negotiate changes if laws or regulations materially impact the Services.

9.2 Data Processing Addendum.  If Client data includes personal information regulated by privacy laws, the Parties will execute a Data Processing Addendum (Exhibit C). DPA Required: {{data_processing_addendum}}.

9.3 Confidentiality.  Each Party will keep the other’s confidential information strictly confidential and will not disclose it except as required by law or to perform this Agreement.

10) Warranties & Disclaimers

10.1 Performance Warranty.  Provider will perform the Services in a professional and workmanlike manner.

10.2 Disclaimer.  Except for the express warranties herein, the Services are provided “as is.”  Provider does not warrant that the AI agents will be error-free, unbiased, or achieve any specific results.  Client acknowledges that AI systems are evolving and may produce unexpected or inaccurate outputs.

11) Indemnification & Liability

11.1 Indemnification.  Each Party will indemnify and hold the other harmless from claims arising from its own breach, negligence, or misconduct.

11.2 Limitation of Liability.  To the maximum extent permitted by law, each Party’s total liability under this Agreement is limited to the total fees paid.  Neither Party shall be liable for indirect, incidental, or consequential damages.

12) Term & Termination

12.1 Term.  This Agreement begins on the effective date and continues until completion of the SOW and payment of all amounts due.  Monthly maintenance services continue on a month-to-month basis until terminated by either Party.

12.2 Termination for Convenience.  Either Party may terminate the maintenance portion of this Agreement by providing 30 days’ written notice after the completion of the SOW.  Deposit amounts for the project build are non-refundable.

12.3 Termination for Cause.  Either Party may terminate for material breach after giving the breaching Party notice and a 14-day cure period.

12.4 Effect of Termination.  Upon termination, Client must pay all amounts due, and Provider will deliver all completed work as of the termination date.  Maintenance fees are due through the effective termination date.

13) Force Majeure

Neither Party is liable for delays or failure to perform due to events beyond their reasonable control (e.g., natural disasters, acts of war, changes in law, third-party service failures).

14) Independent Contractor & Subcontracting

Provider is an independent contractor and may use subcontractors or third-party vendors to perform portions of the Services.  Provider remains responsible for subcontractors’ work.

15) Governing Law & Venue

This Agreement is governed by the laws of {{governing_law_state}}.  Any dispute arising out of this Agreement shall be brought in the state or federal courts located in {{venue_location}}.

16) Entire Agreement & Amendments

This Agreement, including its Exhibits, constitutes the entire understanding between the Parties and supersedes all prior agreements.  Amendments must be in writing and signed by both Parties.

17) E-Signature

The Parties agree that electronic signatures are valid and enforceable.  By signing electronically, each Party consents to do business electronically and acknowledges that electronic records (including IP addresses and timestamps) may be retained as proof of execution.

Exhibit A — Statement of Work (SOW)
	•	Project Title: {{project_title}}
	•	Description of Website: {{website_description}}
	•	AI Agent Functions: {{ai_agent_functions}}
	•	Timeline: Start on {{start_date}}; target launch by {{delivery_deadline}}.
	•	Deliverables: Detailed list of pages, features, integrations, AI agent tasks, and training materials.
	•	Acceptance Criteria: {{acceptance_criteria}}.
	•	Maintenance Scope: Includes updates, backups, security scans, minor content changes, and AI tuning.
	•	Support Hours: {{support_hours}}
	•	Monthly Maintenance Fee: \${{monthly_maintenance_fee}}
	•	Annual Renewal Fee: \${{annual_renewal_fee}}
	•	Add-Ons: List any optional services (e.g., additional AI agents, SEO, marketing automation).

Exhibit B — Change Order Form
	•	Change Request #: __________
	•	Description of Change: _____________________________________
	•	Pricing Method: □ Fixed Price $_____  □ Hourly at \${{hourly_rate}}
	•	Schedule Impact: □ None  □ Revised deadline: _________
	•	Client Approval (Signature & Date): _________________________
	•	Provider Approval (Signature & Date): ________________________

Exhibit C — Data Processing Addendum (if required)

If Client provides personal data regulated by privacy laws (e.g., GDPR, CCPA), the Parties agree to execute a Data Processing Addendum (DPA) that addresses roles (controller/processor), processing purpose, data subject rights, security measures, subprocessors, data breach notification, and cross-border transfers.

---

Provider: {{business_legal_name}} (d/b/a {{dba_brand}})

By: {{signature_placeholder_provider}}___________________________________
Name: {{provider_contact_name}}
Title: ________________________________
Date: {{date_placeholder_provider}}________________________________

Client: {{client_legal_name}}

By: {{signature_placeholder_client}}___________________________________
Name: ________________________________
Title: ________________________________
Date: {{date_placeholder_client}}________________________________
`,
    variables: AI_AGENT_VARIABLES,
    clauses: [],
    defaultValues: {
      business_legal_name: "Saul Lowery Productions",
      dba_brand: "Saul Lowery Productions",
      provider_contact_name: "Saul Lowery",
      provider_email: "saul@slp.com",
      provider_phone: "555-0123",
      deposit_pct: 50,
      annual_fee_increase_pct: 5,
      card_fee_pct: 3.5,
      late_fee_amount: 50,
      hourly_rate: 150,
      support_response_time: "2 business days",
      support_hours: "Mon–Fri 9AM–5PM ET",
      training_rights_on_client_data: "no",
      portfolio_rights: "on",
      governing_law_state: "Virginia",
      venue_location: "Virginia Beach, VA",
      acceptance_criteria: "meets approved designs and functions, and AI agents perform specified tasks",
      data_processing_addendum: "no",
      payment_method_options: "Card, ACH",
    },
  },
  {
    id: 'template_pv_sub_1',
    contractType: TemplateType.PHOTO_VIDEO_SUBSCRIPTION,
    name: 'Subscription Photo + Video',
    description: ['Social Media', 'Content Marketing', 'Real Estate'],
    quickDraftFields: [
      'client_legal_name', 'client_email', 'project_title', 'start_date',
      'subscription_monthly_fee', 'subscription_min_term_months',
      'subscription_sessions_per_month', 'subscription_hours_per_session',
      'subscription_photo_quota_per_month'
    ],
    bodyMd: `# SUBSCRIPTION PHOTO & VIDEO AGREEMENT

This Subscription Photography & Videography Services Agreement ("Agreement") is made between {{business_legal_name}}, {{dba_brand}} ("Content Creator") and {{client_legal_name}} ("Client").

## 1. Purpose & Scope
this contract is for services and products related to content creation via Photo and Video Production. Work occurs at {{project_location}}, unless otherwise scheduled.

## 2. Term, Renewal & Start
Start date: {{start_date}}. Minimum term: {{subscription_min_term_months}} months. After the minimum term, this Agreement will expire. A new contract must be negotiated for services to continue. Either party can provide notice of non-renewal with {{cancellation_notice_days}} days’ written notice before the end of the term.

## 3. Subscription Structure (Sessions & Quotas)
Per month: {{subscription_sessions_per_month}} sessions, each targeting {{subscription_hours_per_session}} hours on site; booking requires {{booking_notice_days}} days’ notice. Monthly quotas: {{subscription_photo_quota_per_month}} edited photos. {{rollover_policy}}. Overage beyond session hours is billed at \${{overage_rate_per_hour}}/hr (see Section 6).

## 4. Coverage, Access & On-Site Readiness
Client ensures access, permissions, parking, and a decision-maker on site at each session. If venue rules limit coverage, Content Creator will adjust reasonably; impacts may alter deliverables.

## 5. Fees, Billing & Payment Timing
The fee is \${{subscription_monthly_fee}}/month, billed in advance on the 1st of each month. Nonpayment grace: {{nonpayment_grace_days}} days. Content Creator may pause services after the grace period until payment posts. Taxes, permits, and third-party fees are Client responsibilities.

## 6. Changes, Waiting & Overtime
Client-requested changes outside scope require a signed Change Order at \${{change_order_rate}}/hr or fixed quote. Waiting caused by Client/venue is \${{late_fee_per_30}} per 30 minutes. Overtime beyond the scheduled session window is \${{overtime_per_30}} per 30 minutes, prepaid to continue.

## 7. Travel & Locations
Travel policy: {{travel_policy}}. Additional sites are welcome and may affect schedule and budget.

## 8. Deliverables — Photography
Per session: ~{{photo_deliverables_per_session}} edited photos (color-corrected; light retouch on selects). Content will be delivered via digital file through Google Drive within {{photo_turnaround_days}} business days of the session, subject to timely Client inputs.

## 9. Deliverables — Videography
Per session: ~{{video_highlight_length_sec}}-second highlight video. Content will be delivered via digital file through Google Drive within {{video_turnaround_days}} business days of the session, subject to timely Client inputs.

## 10. Revisions, Acceptance & Quality
Included revisions: {{revision_rounds_photo}} photo rounds; {{revision_rounds_video_main}} rounds on the main video edit (text, trims, music timing, color tweaks). Upon each handoff, Client has {{acceptance_window_days}} days to submit one consolidated change list aligned to scope; otherwise the deliverables are deemed accepted.

## 11. Music, Stock & Third-Party Licenses
The {{music_licensing_owner}} handles music licensing (library purchases and terms). Content Creator will pass through third-party license terms for any stock used at Client’s request.

## 12. Intellectual Property & License
Content Creator retains ownership of raw images, footage, project files, and working materials. This contract gives Client a broad business-use license. RAWs and raw footage are not included; a raw-footage buyout can be quoted upon request.

## 13. Portfolio, Credits & Releases
The Content Creator may display final works as they see fit. Client will secure model/appearance releases when needed; a general release is attached as Exhibit C.

## 14. Confidentiality & Privacy
Content Creator will keep non-public Client information confidential and use reasonable security practices.

## 15. Data & File Retention
Content Creator retains working files for {{asset_retention_photo_days}} days (photos) and {{asset_retention_video_days}} days (video) after each monthly delivery, then may purge them. Archival services are available by separate agreement.

## 16. Warranties & Disclaimers
Content Creator will perform in a professional manner consistent with industry practice. Content Creator does not guarantee sales or social algorithm outcomes. Weather, venue rules, and subject no-shows can impact results.

## 17. Warranty Window
For {{warranty_window_days}} days after delivery, Content Creator will remedy file corruption or export errors (re-export/re-upload only).

## 18. Indemnification & Liability
If Content Creator is unable to perform the services in this contract due to any cause outside of their control, Client agrees to indemnify Content Creator for any loss, damage, or liability; however, Content Creator will return in full all payments made by Client.

## 19. Governing Law, Venue & Entire Agreement
This Agreement is governed by Virginia law. Exclusive jurisdiction for any disputes shall be in Virginia Beach. This Agreement (with Exhibits) is the entire understanding; amendments must be in signed writing, including e-signature. Counterparts and electronic signatures are valid.

---

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.

### CONTENT CREATOR
{{business_legal_name}}

Signature: {{signature_placeholder_provider}}__________________________________
Name: {{provider_contact_name}}
Date: {{date_placeholder_provider}}__________________________________

### CLIENT
{{client_legal_name}}

Signature: {{signature_placeholder_client}}__________________________________
Name: {{client_contact_name}}
Title: {{client_contact_title}}
Date: {{date_placeholder_client}}__________________________________

<div class="page-break"></div>
---

# EXHIBIT C — MODEL / APPEARANCE RELEASE (General)

For good and valuable consideration, the receipt and sufficiency of which are acknowledged, I (“Model”) irrevocably grant to SaulGOOD WEATHER Lowery LLC (“Company”), the Client named below (“Client”), and their licensees, assignees, and distributors (together, “Authorized Parties”) the right to photograph, film, and otherwise record my image, likeness, voice, and performance in connection with [Project Title / Date] (the “Materials”).
	1.	Rights Granted. Authorized Parties may use, reproduce, edit, adapt, crop, composite, publish, display, distribute, transmit, and create derivative works from the Materials, in whole or in part, in any and all media now known or hereafter developed, for commercial and promotional purposes related to the Project, including Company portfolio/showreel/website/social. Territory: worldwide. Term: perpetual. No obligation to use.
	2.	Attribution & Biographical Info. Authorized Parties may use my name, likeness, voice, handle, and brief biographical information in connection with the Materials and the Project.
	3.	Sensitive-Use Safeguard. The Materials will not be used in a defamatory, pornographic, or unlawful manner, or in a way that falsely implies my personal endorsement of harmful or deceptive products/services.
	4.	Compensation. I waive any further compensation related to the permitted uses set out in this Release. Any separate talent/model payments, if applicable, are solely between the Client and the Model; Company is not responsible for such payments.
	5.	Approvals. I waive any right to inspect or approve the Materials or final uses.
	6.	Ownership. Except for rights expressly granted here, Company retains ownership in the recordings and production files.
	7.	Minors. If the Model is a minor, the undersigned parent/guardian represents legal authority to sign, consents on the minor’s behalf, and agrees to these terms.
	8.	Release. I release and hold harmless Authorized Parties from claims arising out of permitted uses of the Materials, except claims caused by unauthorized or unlawful use.
	9.	Assignment/Sublicense. Authorized Parties may assign or sublicense rights as reasonably necessary to produce, distribute, exhibit, and promote the Project (e.g., editors, platforms, networks, ad partners).
	10.	Governing Law & Venue. This Release is governed by the laws of Virginia, with venue in Virginia Beach, VA.
	11.	Electronic Signature Consent. By signing electronically, I consent to do business electronically and agree that my electronic signature is valid and enforceable. I understand a record of my consent, IP address, and timestamps may be retained as part of a certificate of completion.

Client Name (for this contract): __________________________________________
Model (print): ____________________________   Signature: ________________   Date: ______
Email: ____________________________   Phone: ____________________________
If Minor: Name: __________________  DOB: ______  Parent/Guardian (print): __________________
Relationship to Minor: ____________   Signature: ______________   Date: ______
Location of Signing: _______________________________
`,
    variables: PHOTO_VIDEO_SUBSCRIPTION_VARIABLES,
    clauses: [],
    defaultValues: {
      "business_legal_name": "SaulGOOD WEATHER Lowery",
      "dba_brand": "Also known as Saul Covington Lowery Jr",
      "provider_contact_name": "Saul Covington Lowery Jr",
      "provider_email": "sloweryinc@gmail.com",
      "provider_phone": "407-864-0563",
      "include_photography": true,
      "include_videography": true,
      "coverage_hours_per_session": 3,
      "travel_policy": "First 25 miles round-trip included; $2/mi after",
      "late_fee_per_30": 50,
      "overtime_per_30": 90,
      "change_order_rate": 120,
      "photo_deliverables_per_session": 15,
      "raws_included": false,
      "photo_turnaround_days": 10,
      "revision_rounds_photo": 0,
      "video_highlight_length_sec": 60,
      "video_turnaround_days": 14,
      "revision_rounds_video_main": 1,
      "music_licensing_owner": "client",
      "raw_footage_included": false,
      "portfolio_rights": "on",
      "embargo_days": 0,
      "model_release_toggle": true,
      "acceptance_window_days": 5,
      "subscription_min_term_months": 3,
      "subscription_sessions_per_month": 2,
      "subscription_hours_per_session": 3,
      "subscription_photo_quota_per_month": 30,
      "booking_notice_days": 7,
      "rollover_policy": "Unused sessions from the previous month expire 30 days after the start of the following month.",
      "overage_rate_per_hour": 120,
      "payment_schedule": "Bills monthly in advance on the 1st",
      "cancellation_notice_days": 30,
      "nonpayment_grace_days": 7,
      "asset_retention_photo_days": 60,
      "asset_retention_video_days": 30,
      "warranty_window_days": 7,
      "governing_law_state": "Virginia",
      "venue_city": "Virginia Beach, VA"
    },
  },
];

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'contract_1',
    orgId: 'org_123',
    contractType: TemplateType.PHOTOGRAPHY,
    title: 'Wedding Photography',
    clientName: 'Alice Johnson',
    clientEmail: 'alice@example.com',
    status: ContractStatus.COMPLETED,
    variables: { client_legal_name: 'Alice Johnson', project_title: 'Wedding Photography', shoot_date: '2024-08-15' },
    clauses: [],
    createdAt: '2024-05-10T09:00:00Z',
    updatedAt: '2024-05-15T14:30:00Z',
    parties: [{ id: 'p1', contractId: 'contract_1', role: PartyRole.PROVIDER, name: 'Saul Lowery', email: 'saul@slp.com' }, { id: 'p2', contractId: 'contract_1', role: PartyRole.CLIENT, name: 'Alice Johnson', email: 'alice@example.com' }],
    signatureFields: [],
    version: 1,
    history: [],
    auditTrail: [
      { id: 'aud_c1_1', eventType: AuditEventType.CREATED, createdAt: '2024-05-10T09:00:00Z', ip: '192.168.1.1', userAgent: 'Chrome/125.0.0.0' },
      { id: 'aud_c1_2', eventType: AuditEventType.SENT, createdAt: '2024-05-10T09:05:00Z', ip: '192.168.1.1', userAgent: 'Chrome/125.0.0.0', meta: { to: 'alice@example.com' } },
      { id: 'aud_c1_3', eventType: AuditEventType.VIEWED, createdAt: '2024-05-11T11:30:00Z', ip: '203.0.113.55', userAgent: 'Safari/17.0.0.0', meta: { party: 'Alice Johnson' } },
      { id: 'aud_c1_4', eventType: AuditEventType.SIGNED, createdAt: '2024-05-12T09:00:00Z', ip: '203.0.113.55', userAgent: 'Safari/17.0.0.0', meta: { party: 'Alice Johnson' } },
    ],
    nextSteps: [],
    requirements: [],
    followUps: [],
    revisionRequests: [],
  },
  {
    id: 'contract_2',
    orgId: 'org_123',
    contractType: TemplateType.WEBSITE,
    title: 'E-commerce Site Build',
    clientName: 'Bob Williams',
    clientEmail: 'bob@example.com',
    status: ContractStatus.SENT,
    variables: { client_legal_name: 'Bob Williams', project_title: 'E-commerce Site Build', project_domain: 'bobswidgets.com' },
    clauses: [],
    createdAt: '2024-06-20T11:00:00Z',
    updatedAt: '2024-06-21T16:00:00Z',
    parties: [{ id: 'p3', contractId: 'contract_2', role: PartyRole.PROVIDER, name: 'Saul Lowery', email: 'saul@slp.com' }, { id: 'p4', contractId: 'contract_2', role: PartyRole.CLIENT, name: 'Bob Williams', email: 'bob@example.com' }],
    signatureFields: [],
    version: 1,
    history: [],
    auditTrail: [
      { id: 'aud_c2_1', eventType: AuditEventType.CREATED, createdAt: '2024-06-20T11:00:00Z', ip: '192.168.1.1', userAgent: 'Chrome/125.0.0.0' },
      { id: 'aud_c2_2', eventType: AuditEventType.SENT, createdAt: '2024-06-21T16:00:00Z', ip: '192.168.1.1', userAgent: 'Chrome/125.0.0.0', meta: { to: 'bob@example.com' } },
    ],
    nextSteps: [],
    requirements: [],
    followUps: [],
    revisionRequests: [],
  },
  {
    id: 'mock-token', // Used for e2e tests
    orgId: 'org_123',
    contractType: TemplateType.PHOTOGRAPHY,
    title: 'Photography Services Agreement',
    clientName: 'E2E Test Client',
    clientEmail: 'test@example.com',
    status: ContractStatus.SENT,
    variables: { client_legal_name: 'E2E Test Client', project_title: 'Product Photoshoot' },
    clauses: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    parties: [
      { id: 'party_provider_e2e', contractId: 'mock-token', role: PartyRole.PROVIDER, name: 'Saul Lowery', email: 'saul@slp.com' },
      { id: 'party_client_e2e', contractId: 'mock-token', role: PartyRole.CLIENT, name: 'E2E Test Client', email: 'test@example.com' },
    ],
    signatureFields: [
      { id: 'field_client_sig', partyId: 'party_client_e2e', kind: SignatureFieldKind.SIGNATURE, page: 1, x: 15, y: 80, width: 25, height: 8 },
      { id: 'field_client_check', partyId: 'party_client_e2e', kind: SignatureFieldKind.CHECKBOX, page: 1, x: 15, y: 70, width: 15, height: 4 },
    ],
    fieldValues: {
      'field_provider_sig': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', // a dummy 1x1 transparent pixel
    },
    version: 1,
    history: [],
    auditTrail: [
      { id: 'aud_e2e_1', eventType: AuditEventType.CREATED, createdAt: new Date().toISOString(), ip: '192.168.1.1', userAgent: 'Chrome/125.0.0.0' },
      { id: 'aud_e2e_2', eventType: AuditEventType.SENT, createdAt: new Date().toISOString(), ip: '192.168.1.1', userAgent: 'Chrome/125.0.0.0', meta: { to: 'test@example.com' } },
    ],
    nextSteps: [],
    requirements: [],
    followUps: [],
    revisionRequests: [],
  },
];

export const MOCK_GALLERIES: Gallery[] = [
  {
    id: 'gallery_1',
    contractId: 'contract_1',
    clientId: 'client_123',
    galleryInfo: {
      name: 'Wedding Highlights',
      description: 'Beautiful moments from the ceremony and reception.',
      type: GalleryType.FINAL,
      status: GalleryStatus.PUBLISHED,
      publishedAt: '2024-05-20T10:00:00Z',
      createdAt: '2024-05-18T09:00:00Z',
      deliveryUrl: 'https://drive.google.com/drive/folders/example',
      instructions: 'Please download all high-res files within 30 days.',
    },
    photos: [
      {
        photoId: 'p1',
        filename: 'wedding_01.jpg',
        uploadedAt: '2024-05-18T09:05:00Z',
        edited: true,
        favorite: false,
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
      },
      {
        photoId: 'p2',
        filename: 'wedding_02.jpg',
        uploadedAt: '2024-05-18T09:06:00Z',
        edited: true,
        favorite: true,
        url: 'https://images.unsplash.com/photo-1511285560982-1356c11d4606?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1511285560982-1356c11d4606?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
      },
      {
        photoId: 'p3',
        filename: 'wedding_03.jpg',
        uploadedAt: '2024-05-18T09:07:00Z',
        edited: true,
        favorite: false,
        url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
      },
      {
        photoId: 'p4',
        filename: 'wedding_04.jpg',
        uploadedAt: '2024-05-18T09:08:00Z',
        edited: true,
        favorite: false,
        url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
      },
      {
        photoId: 'p5',
        filename: 'wedding_05.jpg',
        uploadedAt: '2024-05-18T09:09:00Z',
        edited: true,
        favorite: true,
        url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        thumbnailUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60',
      }
    ],
    photoCounts: {
      total: 5,
      edited: 5,
    },
    shareSettings: {
      shareLink: 'http://localhost:3000/gallery/gallery_1',
      passwordProtected: false,
      downloadsEnabled: true,
    },
    analytics: {
      totalViews: 120,
      uniqueViewers: 45,
      totalDownloads: 15,
      accessLog: [],
    },
    meta: {
      createdBy: 'Saul Lowery',
      lastModified: '2024-05-20T10:00:00Z',
    },
  },
];