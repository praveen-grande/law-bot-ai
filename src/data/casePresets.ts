import { CaseSubmissionInput } from '../types/legal';

export const STATE_HIGH_COURT_MAP: Record<string, string> = {
  'All India / Central': 'Supreme Court of India & Jurisdictional High Court',
  'Andhra Pradesh': 'High Court of Andhra Pradesh (Amaravati)',
  'Telangana': 'High Court for the State of Telangana (Hyderabad)',
  'Maharashtra': 'Bombay High Court',
  'Delhi (NCT)': 'High Court of Delhi',
  'Karnataka': 'High Court of Karnataka (Bengaluru)',
  'Tamil Nadu': 'Madras High Court',
  'Uttar Pradesh': 'Allahabad High Court',
  'West Bengal': 'Calcutta High Court',
  'Gujarat': 'High Court of Gujarat (Ahmedabad)',
  'Rajasthan': 'Rajasthan High Court (Jodhpur / Jaipur)',
  'Kerala': 'High Court of Kerala (Ernakulam)',
  'Madhya Pradesh': 'High Court of Madhya Pradesh (Jabalpur)',
  'Bihar': 'Patna High Court',
  'Punjab': 'Punjab and Haryana High Court (Chandigarh)',
  'Haryana': 'Punjab and Haryana High Court (Chandigarh)',
  'Odisha': 'Orissa High Court (Cuttack)',
  'Assam': 'Gauhati High Court'
};

export interface PresetCaseScenario {
  id: string;
  label: string;
  badge: string;
  input: CaseSubmissionInput;
}

export const REPRESENTATIVE_CASE_PRESETS: PresetCaseScenario[] = [
  {
    id: 'preset-money-recovery',
    label: '1. Money Recovery & Cheque Bounce',
    badge: 'Civil / NI Act 138',
    input: {
      caseDescription:
        'I supplied industrial electrical goods worth ₹8,50,000 to a wholesale buyer in Mumbai under a written invoice and supply contract. After 60 days of credit, the buyer issued a cheque for ₹8,50,000 drawn on his bank account, which was dishonoured last week with the bank return memo stating "Insufficient Funds". Despite WhatsApp reminders, the buyer is refusing to pay the outstanding amount.',
      stateOrUt: 'Maharashtra',
      jurisdiction: 'Central',
      caseCategory: 'Auto-Classify',
      importantDates: '2025-01-10',
      availableEvidence:
        'Signed Purchase Order, Tax Invoices, Delivery Challan, Dishonoured Cheque leaf, Bank Return Memo dated 10 Jan 2025, WhatsApp chat reminders'
    }
  },
  {
    id: 'preset-property-dispute',
    label: '2. Property Ownership & Unregistered Sale',
    badge: 'Property / Registration Act',
    input: {
      caseDescription:
        'I paid ₹35,00,000 to a landowner in Hyderabad in March 2023 to purchase a residential plot and signed an unregistered Agreement to Sell on ₹100 stamp paper along with a notarized General Power of Attorney (GPA). Now the seller is claiming that ownership never transferred to me because there is no registered Sale Deed, and he is trying to sell the plot to a third party.',
      stateOrUt: 'Telangana',
      jurisdiction: 'Central',
      caseCategory: 'Auto-Classify',
      importantDates: '2023-03-15',
      availableEvidence:
        'Unregistered Agreement to Sell on ₹100 stamp paper, Notarized General Power of Attorney (GPA), RTGS Bank Transfer Receipts for ₹35,00,000'
    }
  },
  {
    id: 'preset-workplace-salary',
    label: '3. Workplace Unpaid Salary Dispute',
    badge: 'Labour & Employment',
    input: {
      caseDescription:
        'I worked as a full-time technical technician at a manufacturing unit in Delhi for 3 years earning ₹22,000 per month. My employer withheld my earned salary for the last 4 months totaling ₹88,000 without any disciplinary inquiry or valid deduction notice, and terminated my access when I demanded my unpaid wages.',
      stateOrUt: 'Delhi (NCT)',
      jurisdiction: 'Central',
      caseCategory: 'Auto-Classify',
      importantDates: '2024-11-01',
      availableEvidence:
        'Appointment Letter, Salary Slips for prior months, Bank Account Statement showing 4 months non-credit of wages, Email demands sent to HR'
    }
  },
  {
    id: 'preset-criminal-cheating',
    label: '4. Alleged Criminal Cheating & Arrest Apprehension',
    badge: 'Criminal Law (BNS vs IPC)',
    input: {
      caseDescription:
        'A business vendor in Bengaluru filed a police complaint against me in August 2024 alleging that I cheated him of ₹12,00,000 by inducing him to deliver raw materials. In reality, we had a genuine 2-year commercial supply relationship and my payment was delayed only due to a sudden factory fire. Police have called me to the station and I fear arrest.',
      stateOrUt: 'Karnataka',
      jurisdiction: 'Central',
      caseCategory: 'Auto-Classify',
      importantDates: '2024-08-20',
      availableEvidence:
        'Past 2 years bank payment ledger showing ₹40 Lakhs paid earlier, Fire Brigade incident report, Insurance claim copy, Commercial supply contract'
    }
  },
  {
    id: 'preset-constitutional-rights',
    label: '5. Constitutional Rights & Arbitrary State Order',
    badge: 'Constitutional Law (Art. 14, 19, 21)',
    input: {
      caseDescription:
        'A state municipal authority passed a summary order shutting down my independent digital news portal and confiscating office computers without issuing any show-cause notice, hearing, or citing any statutory rule, simply because we published an investigative report questioning local civic tender irregularities.',
      stateOrUt: 'Uttar Pradesh',
      jurisdiction: 'Central',
      caseCategory: 'Auto-Classify',
      importantDates: '2024-09-12',
      availableEvidence:
        'Copy of unreasoned closure order, Seizure panchnama without statutory reference, Published investigative news article, Registration certificate of portal'
    }
  }
];
