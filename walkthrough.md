# Walkthrough - AI Agent & Website Development Contract

I have implemented the new **AI Agent & Website Development** contract template, integrated into the "Guided Build" and "Quick Draft" workflows.

## Features Implemented

### 1. New Contract Template
*   **Template Name:** AI Agent & Website Development
*   **Description:** Covers custom website design, AI agent configuration, and ongoing maintenance.
*   **Key Sections:**
    *   Scope of Work (Website + AI Agents)
    *   Fees & Payment (Build, Monthly Maintenance, Annual Renewal)
    *   Intellectual Property (Client owns deliverables, Provider owns pre-existing IP)
    *   Data Usage & Training Rights
    *   Compliance & Privacy (DPA option)

### 2. Guided Build Flow
*   **Conversational Interface:** Asks questions one by one to collect all necessary variables.
*   **Key Variables Collected:**
    *   Client Info (Name, Email, Phone)
    *   Project Details (Title, URL, Description, AI Functions)
    *   Financials (Base Fee, Deposit, Maintenance, Renewal, Hourly Rate)
    *   Legal/Compliance (Training Rights, Portfolio Rights, DPA, Governing Law)
*   **Logic:**
    *   Supports optional questions (e.g., Phone).
    *   Supports default values (e.g., 50% deposit, Virginia law).
    *   Supports enum options (e.g., Training Rights: No / Limited / Yes).

### 3. Key Terms Snapshot
*   **Real-time Summary:** The "Key Terms Snapshot" panel now supports the AI Agent contract type.
*   **Displays:**
    *   Client & Project Info
    *   Financial Breakdown (Base, Deposit, Maintenance, Renewal)
    *   AI Functions & Support SLAs
    *   Rights & Compliance Flags

## Verification

### Manual Verification Steps
1.  **Navigate to New Contract:** Select "AI Agent & Website Development".
2.  **Choose Guided Build:** The conversational wizard starts.
3.  **Answer Questions:**
    *   "What is the client's full legal name?" -> Updates Client Name in Snapshot.
    *   "What is the website URL?" -> Updates Website URL in Snapshot.
    *   "What is the monthly maintenance fee?" -> Updates Maintenance Fee in Snapshot.
4.  **Review Contract:**
    *   The generated contract includes the "AI Agent & Website Development Agreement" title.
    *   Section 3 clearly distinguishes between "Project Fee", "Monthly Maintenance Fee", and "Annual Renewal Fee".
    *   Section 6.3 reflects the chosen "Training Rights" option.

### Browser Verification
*   Verified that the "Guided Build" correctly loads the specific question flow for AI Agents.
*   Verified that the "Key Terms Snapshot" renders the correct fields for this template type.

## Artifacts
*   `constants.ts`: Updated with `AI_AGENT_VARIABLES`, `AI_AGENT_QUESTION_FLOW`, and `template_ai_std_1`.
*   `KeyTermsSnapshot.tsx`: Updated `renderAiAgentTerms` to display relevant variables.
*   `services/db.ts`: Updated to force-sync the new template definition to the database.

## Website Development Contract Update

I have updated the "Website Development" contract template to match your detailed requirements.

### Changes Implemented
- **Comprehensive Variables:** Added 30+ new variables covering project scope, fees (base, deposit, maintenance, renewal), timeline, and legal terms (accessibility, licensing, indemnity).
- **Detailed Contract Body:** Replaced the previous template with your provided text, ensuring all variables are correctly mapped and signature placeholders are included.
- **Enhanced Question Flow:** Updated the guided build to ask questions one at a time with relevant suggestions (e.g., "WCAG 2.2 AA" for accessibility).
- **Key Terms Snapshot:** Updated the sidebar summary to display critical terms like Maintenance Fee, Renewal Fee, and Launch Date.

### Verification
- **Code Review:** Confirmed that `constants.ts`, `KeyTermsSnapshot.tsx`, and `GuidedBuilder.tsx` are correctly updated.
- **Browser Verification:** Attempted to verify the flow in the browser, but encountered tool stability issues. **Please manually verify by creating a new "Website Development" contract.**

### Next Steps
- Create a new "Website Development" contract to see the changes in action.
- Verify that the "Key Terms Snapshot" updates as you answer questions.
- Check the final contract text for accuracy.
