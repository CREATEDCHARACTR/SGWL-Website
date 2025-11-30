
import React from 'react';
import Card from './ui/Card';
import { TemplateType } from '../types';

interface KeyTermsSnapshotProps {
    title: string;
    data: Record<string, any>;
    contractType: TemplateType;
}

const KeyTermItem: React.FC<{ label: string, value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row justify-between py-3 border-b border-gray-100 dark:border-gray-700/50">
        <dt className="text-base text-gray-600 dark:text-gray-400">{label}</dt>
        <dd className="text-base font-medium text-gray-900 dark:text-gray-100 text-left sm:text-right">{value || <span className="text-gray-400 dark:text-gray-500">Not set</span>}</dd>
    </div>
);


const KeyTermsSnapshot: React.FC<KeyTermsSnapshotProps> = ({ title, data, contractType }) => {

    const depositAmount = (parseFloat(data.base_fee) * (parseFloat(data.deposit_pct) / 100)).toFixed(2);

    // Helper to avoid "undefined" in strings and provide a fallback
    const val = (v: any, fallback: string | number = '...'): any => v ?? fallback;

    const renderPhotographyTerms = () => (
        <dl>
            <KeyTermItem label="Client Name" value={data.client_legal_name} />
            <KeyTermItem label="Project Title" value={data.project_title} />
            <KeyTermItem label="Service/Package" value={data.service_package} />
            <KeyTermItem label="Shoot Date" value={data.shoot_date} />
            <KeyTermItem label="Base Fee" value={data.base_fee ? `$${parseFloat(data.base_fee).toLocaleString()}` : null} />
            <KeyTermItem label="Deposit" value={!isNaN(parseFloat(depositAmount)) ? `$${parseFloat(depositAmount).toLocaleString()} (${data.deposit_pct || 0}%)` : null} />
            <KeyTermItem label="Deliverables" value={`${data.deliverables_count || '?'} photos`} />
            <KeyTermItem label="Turnaround" value={`${data.turnaround_days || '?'} days`} />
            <KeyTermItem label="Location" value={data.project_location} />
        </dl>
    );

    const renderVideographyTerms = () => (
        <dl>
            <KeyTermItem label="Client Name" value={data.client_legal_name} />
            <KeyTermItem label="Project Title" value={data.project_title} />
            <KeyTermItem label="Shoot Date" value={data.shoot_date} />
            <KeyTermItem label="Base Fee" value={data.base_fee ? `$${parseFloat(data.base_fee).toLocaleString()}` : null} />
            <KeyTermItem label="Deposit" value={!isNaN(parseFloat(depositAmount)) ? `$${parseFloat(depositAmount).toLocaleString()} (${data.deposit_pct || 0}%)` : null} />
            <KeyTermItem label="Main Video" value={`${data.deliverables_main_highlight_length_sec || '?'} sec`} />
            <KeyTermItem label="Social Cuts" value={`${data.social_cuts_count || '?'} videos`} />
            <KeyTermItem label="Delivery" value={`${data.delivery_deadline_days || '?'} days`} />
            <KeyTermItem label="Location" value={data.project_location} />
        </dl>
    );

    const renderWebsiteTerms = () => (
        <dl>
            <KeyTermItem label="Client Name" value={data.client_legal_name} />
            <KeyTermItem label="Project Title" value={data.project_title} />
            <KeyTermItem label="Domain/URL" value={data.domain_url} />
            <KeyTermItem label="Start Date" value={data.start_date} />
            <KeyTermItem label="Target Launch" value={data.target_launch_date} />
            <KeyTermItem label="Base Fee" value={data.base_fee ? `$${parseFloat(data.base_fee).toLocaleString()}` : null} />
            <KeyTermItem label="Deposit" value={!isNaN(parseFloat(depositAmount)) ? `$${parseFloat(depositAmount).toLocaleString()} (${data.deposit_pct || 0}%)` : null} />
            <KeyTermItem label="Maintenance Fee" value={data.monthly_maintenance_fee ? `$${parseFloat(data.monthly_maintenance_fee).toLocaleString()}/mo` : null} />
            <KeyTermItem label="Renewal Fee" value={data.annual_renewal_fee ? `$${parseFloat(data.annual_renewal_fee).toLocaleString()}/yr` : null} />
            <KeyTermItem label="Maintenance Scope" value={data.maintenance_scope} />
            <KeyTermItem label="Accessibility" value={data.accessibility_standard} />
            <KeyTermItem label="License" value={data.license_type} />
        </dl>
    );

    const renderAiAgentTerms = () => (
        <dl>
            <KeyTermItem label="Client Name" value={data.client_legal_name} />
            <KeyTermItem label="Project Title" value={data.project_title} />
            <KeyTermItem label="Website URL" value={data.website_url} />
            <KeyTermItem label="Start Date" value={data.start_date} />
            <KeyTermItem label="Delivery Deadline" value={data.delivery_deadline} />
            <KeyTermItem label="Base Fee" value={data.base_fee ? `$${parseFloat(data.base_fee).toLocaleString()}` : null} />
            <KeyTermItem label="Deposit" value={!isNaN(parseFloat(depositAmount)) ? `$${parseFloat(depositAmount).toLocaleString()} (${data.deposit_pct || 0}%)` : null} />
            <KeyTermItem label="Maintenance Fee" value={data.monthly_maintenance_fee ? `$${parseFloat(data.monthly_maintenance_fee).toLocaleString()}/mo` : null} />
            <KeyTermItem label="Annual Renewal" value={data.annual_renewal_fee ? `$${parseFloat(data.annual_renewal_fee).toLocaleString()}/yr` : null} />
            <KeyTermItem label="AI Functions" value={data.ai_agent_functions} />
            <KeyTermItem label="Support" value={`${data.support_response_time || '?'} (${data.support_hours || '?'})`} />
            <KeyTermItem label="Training Rights" value={data.training_rights_on_client_data} />
            <KeyTermItem label="Portfolio Rights" value={data.portfolio_rights} />
        </dl>
    );

    const renderPhotoVideoSubscriptionTerms = () => {
        const providerInfo = `${val(data.provider_contact_name)}, ${val(data.provider_email)}, ${val(data.provider_phone)}`;
        const clientInfo = `${val(data.client_legal_name)} — ${val(data.client_email, 'N/A')}`;
        const timeline = `Start ${val(data.start_date)}; ${val(data.service_window, 'rolling periods')}; call time ${val(data.call_time, 'TBD')}`;
        const billing = `\$${val(data.subscription_monthly_fee, '0')}/mo, ${val(data.payment_schedule, 'N/A')}; min term ${val(data.subscription_min_term_months, 'N/A')} mo; cancel w/ ${val(data.cancellation_notice_days, 'N/A')} days notice`;
        const quotas = `${val(data.subscription_sessions_per_month, '?')} sessions/mo × ${val(data.subscription_hours_per_session, '?')} hrs; ${val(data.subscription_photo_quota_per_month, '?')} photos/mo; ${val(data.subscription_video_cuts_per_month, '?')} videos/mo`;
        const policies = `Travel: ${val(data.travel_policy, 'N/A')}; Overtime: \$${val(data.overtime_per_30)}/30min`;
        const photo = `~${val(data.photo_deliverables_per_session)} photos/session; Turnaround ${val(data.photo_turnaround_days)} days; RAWs ${data.raws_included ? 'included' : 'not included'}`;
        const video = `~${val(data.video_highlight_length_sec)}s highlight + ${val(data.video_social_cuts_per_session)} cuts; Turnaround ${val(data.video_turnaround_days)} days; ${val(data.revision_rounds_video_main)} revision`;
        const portfolio = `Portfolio: ${val(data.portfolio_rights, 'off')}${data.portfolio_rights === 'embargo' ? ` (${val(data.embargo_days, '?')} days)` : ''}`;
        const acceptance = `Review: ${val(data.acceptance_window_days)} days; Retention: ${val(data.asset_retention_photo_days)}d (photo) / ${val(data.asset_retention_video_days)}d (video)`;

        return (
            <dl>
                <KeyTermItem label="Provider" value={providerInfo} />
                <KeyTermItem label="Client" value={clientInfo} />
                <KeyTermItem label="Project" value={data.project_title} />
                <KeyTermItem label="Timeline" value={timeline} />
                <KeyTermItem label="Location(s)" value={data.project_location} />
                <KeyTermItem label="Subscription" value={billing} />
                <KeyTermItem label="Quotas" value={quotas} />
                <KeyTermItem label="Policies" value={policies} />
                <KeyTermItem label="Photography" value={photo} />
                <KeyTermItem label="Videography" value={video} />
                <KeyTermItem label="Music" value={`${val(data.music_licensing_owner, '?')} handles licensing`} />
                <KeyTermItem label="IP & Portfolio" value={portfolio} />
                <KeyTermItem label="Acceptance" value={acceptance} />
                <KeyTermItem label="Notes" value={data.special_notes} />
            </dl>
        )
    };

    return (
        <Card className="sticky top-8">
            <div className="p-6">
                <h3 className="text-xl font-semibold leading-6 text-gray-900 dark:text-white">{title}</h3>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 max-h-[calc(100vh-10rem)] overflow-y-auto">
                {contractType === TemplateType.PHOTOGRAPHY && renderPhotographyTerms()}
                {contractType === TemplateType.VIDEOGRAPHY && renderVideographyTerms()}
                {contractType === TemplateType.WEBSITE && renderWebsiteTerms()}
                {contractType === TemplateType.AI_AGENT && renderAiAgentTerms()}
                {contractType === TemplateType.PHOTO_VIDEO_SUBSCRIPTION && renderPhotoVideoSubscriptionTerms()}
                {![TemplateType.PHOTOGRAPHY, TemplateType.VIDEOGRAPHY, TemplateType.WEBSITE, TemplateType.AI_AGENT, TemplateType.PHOTO_VIDEO_SUBSCRIPTION].includes(contractType) && (
                    <p className="text-sm text-gray-500">Key terms preview not available for this template type.</p>
                )}
            </div>
        </Card>
    );
};

export default KeyTermsSnapshot;