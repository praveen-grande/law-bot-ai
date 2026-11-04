export interface SampleLegalDocumentPreset {
  id: string;
  label: string;
  badge: string;
  categoryGroup: 'valid_indian_legal' | 'validation_edge_case';
  fileName: string;
  fileType: 'PDF' | 'DOCX' | 'TXT' | 'SCANNED_PDF';
  fileSizeBytes: number;
  rawText: string;
}

export const SAMPLE_LEGAL_DOCUMENT_PRESETS: SampleLegalDocumentPreset[] = [
  {
    id: 'sample-agreement-to-sell-v1',
    label: '1. Unregistered Agreement to Sell (Property)',
    badge: 'PDF · 3 Pages · Property Contract',
    categoryGroup: 'valid_indian_legal',
    fileName: 'Agreement_to_Sell_Jubilee_Hills_2023.pdf',
    fileType: 'PDF',
    fileSizeBytes: 2458600,
    rawText: `[PAGE 1]
AGREEMENT TO SELL FOR IMMOVABLE PROPERTY (UNREGISTERED STAMP PAPER ₹100)
This Agreement to Sell is executed on this 15th day of March, 2023 at Hyderabad, Telangana:

BETWEEN:
Mr. Rajesh Kumar, S/o Late Sh. R. P. Kumar, aged 54 years, residing at Flat 301, Lakeview Apartments, Banjara Hills, Hyderabad (hereinafter referred to as the "VENDOR" / "SELLER", which expression shall include his heirs, legal representatives, and assigns) of the ONE PART;

AND:
Ms. Priya Sharma, D/o Sh. V. K. Sharma, aged 38 years, residing at Villa 12, Green Meadows, Gachibowli, Hyderabad (hereinafter referred to as the "PURCHASER" / "BUYER") of the OTHER PART.

WHEREAS the Vendor is the absolute owner of Residential Plot No. 42, Jubilee Hills Layout, Hyderabad, admeasuring 350 Square Yards, acquired vide Registered Sale Deed Document No. 4120/2012 at SRO Banjara Hills.

Clause 1 — Grant and Agreement to Convey
The Vendor hereby agrees to sell and convey the schedule property to the Purchaser free from all encumbrances, mortgages, court attachments, or revenue dues.

Clause 2 — Total Sale Consideration & Earnest Money Advance
The total agreed sale consideration for the schedule property is ₹1,45,00,000/- (Rupees One Crore Forty-Five Lakhs Only). The Purchaser has today paid an advance earnest money of ₹20,00,000/- (Rupees Twenty Lakhs Only) via RTGS UTR No. HDFCR52023031500981 dated 15.03.2023, receipt whereof the Vendor hereby acknowledges.

[PAGE 2]
Clause 3 — Balance Payment & Contradictory Amount Reference
The Purchaser shall pay the balance consideration of ₹1,20,00,000/- (Rupees One Crore Twenty Lakhs Only) within 90 days from the date of this Agreement, i.e., on or before 13th June, 2023, at the time of execution of the Sale Deed.

Clause 4 — Possession Without Registration
The Vendor has handed over symbolic and physical possession of Plot No. 42 to the Purchaser today upon execution of this ₹100 unregistered stamp paper agreement, and the parties agree that no separate registered conveyance deed shall be necessary if full payment is made.

Clause 5 — One-Sided Forfeiture & Termination by Vendor
In the event the Purchaser delays payment of any installment by even 3 days for any reason whatsoever, the Vendor shall have the absolute, unilateral right to cancel this Agreement immediately and forfeit the entire ₹20,00,000/- earnest money without prior notice, whereas if the Vendor delays execution, the Vendor shall have no liability for interest or damages.

Clause 6 — Unlimited Indemnity by Purchaser
The Purchaser shall indemnify and hold harmless the Vendor against all past, present, or future municipal tax claims, third-party title litigation, and unlimited consequential losses of any kind relating to the property.

[PAGE 3]
Clause 7 — Specific Performance & Dispute Resolution
Subject to Clause 5, in the event of default by the Vendor in executing the registered Sale Deed upon tender of balance consideration, the Purchaser shall be entitled to enforce specific performance under the Specific Relief Act, 1963 before the Civil Courts at Hyderabad.

SCHEDULE OF PROPERTY
All that piece and parcel of Residential Plot No. 42, admeasuring 350 Sq. Yards, situated at Jubilee Hills Layout, Ward No. 8, Hyderabad, Telangana.

IN WITNESS WHEREOF the parties have signed this Agreement on 15th March, 2023:
VENDOR SIGNATURE: [Signed: Rajesh Kumar]
PURCHASER SIGNATURE: [Signed: Priya Sharma]
WITNESS 1: Mr. Anand Verma
WITNESS 2: [SIGNATURE MISSING — BLANK LINE]`
  },
  {
    id: 'sample-agreement-to-sell-v2',
    label: '2. Revised Agreement to Sell (Version 2 for Diff)',
    badge: 'DOCX · 3 Pages · Version 2',
    categoryGroup: 'valid_indian_legal',
    fileName: 'Agreement_to_Sell_Jubilee_Hills_Revised_v2.docx',
    fileType: 'DOCX',
    fileSizeBytes: 1840200,
    rawText: `[PAGE 1]
AGREEMENT TO SELL FOR IMMOVABLE PROPERTY (REVISED DRAFT V2)
This Agreement to Sell is executed on this 20th day of March, 2023 at Hyderabad, Telangana:

BETWEEN:
Mr. Rajesh Kumar (hereinafter referred to as the "VENDOR" / "SELLER") of the ONE PART;
AND:
Ms. Priya Sharma (hereinafter referred to as the "PURCHASER" / "BUYER") of the OTHER PART.

Clause 1 — Grant and Agreement to Convey
The Vendor hereby agrees to sell Residential Plot No. 42, Jubilee Hills Layout, Hyderabad (350 Sq. Yards) to the Purchaser free from all encumbrances.

Clause 2 — Total Sale Consideration & Earnest Money Advance
The total agreed sale consideration is ₹1,45,00,000/- (Rupees One Crore Forty-Five Lakhs Only). The Purchaser has paid ₹20,00,000/- via RTGS dated 15.03.2023.

[PAGE 2]
Clause 3 — Corrected Balance Payment & 120-Day Completion Window
The Purchaser shall pay the exact remaining balance consideration of ₹1,25,00,000/- (Rupees One Crore Twenty-Five Lakhs Only) within 120 days from the date of this Agreement, i.e., on or before 18th July, 2023, simultaneously with the execution and registration of the Sale Deed before the Sub-Registrar under Section 17 of the Registration Act, 1908.

Clause 4 — Possession Upon Registered Sale Deed
Vacant physical possession of the schedule property shall be delivered by the Vendor to the Purchaser upon execution and registration of the formal Sale Deed under Section 54 of the Transfer of Property Act, 1882.

Clause 5 — Mutual Cure Notice & Balanced Termination
In the event of delay by either party, the non-defaulting party shall issue a 15-day written cure notice. Only genuine pre-estimated earnest money up to 10% may be adjusted upon proven default of the Purchaser, and if the Vendor defaults, the Vendor shall refund the advance with 12% per annum interest.

[PAGE 3]
Clause 7 — Specific Performance & Dispute Resolution
Either party shall be entitled to seek Specific Performance under Section 10 of the Specific Relief Act, 1963 before the competent Civil Courts at Hyderabad.

IN WITNESS WHEREOF the parties have signed this Agreement on 20th March, 2023:
VENDOR SIGNATURE: [Signed: Rajesh Kumar]
PURCHASER SIGNATURE: [Signed: Priya Sharma]
WITNESS 1: Mr. Anand Verma
WITNESS 2: Mr. K. N. Rao`
  },
  {
    id: 'sample-ni138-demand-notice',
    label: '3. Section 138 NI Act Legal Demand Notice',
    badge: 'PDF · 2 Pages · Cheque Bounce Notice',
    categoryGroup: 'valid_indian_legal',
    fileName: 'Legal_Demand_Notice_Sec138_NI_Act_Jan2025.pdf',
    fileType: 'PDF',
    fileSizeBytes: 940120,
    rawText: `[PAGE 1]
STATUTORY LEGAL DEMAND NOTICE UNDER SECTION 138(b) OF THE NEGOTIABLE INSTRUMENTS ACT, 1881
Date of Notice: 18th January, 2025
Ref No.: LN/2025/MUM/138-09

To,
M/s Horizon Retail Traders Pvt. Ltd.,
Represented by its Director Mr. Vikram Mehta,
Plot 14, Andheri Industrial Estate, Mumbai – 400053, Maharashtra.

Under instructions from and on behalf of my client M/s Sterling Electricals India Ltd., having its registered office at Nariman Point, Mumbai ("My Client"), I hereby serve upon you the following mandatory statutory notice:

Clause 1 — Supply of Goods & Legally Enforceable Debt
That pursuant to Purchase Order No. PO-2024-882 dated 10th October, 2024 and Tax Invoice No. INV-991, My Client supplied industrial transformers worth ₹8,50,000/- (Rupees Eight Lakhs Fifty Thousand Only) which were duly received by you without demur.

Clause 2 — Issuance & Dishonour of Cheque
That in discharge of your legally enforceable debt and liability, you issued Cheque No. 445892 dated 05th January, 2025 for ₹8,50,000/- drawn on State Bank of India, Andheri Branch. When presented by My Client through its banker HDFC Bank, Fort Branch, the said cheque was returned unpaid on 10th January, 2025 vide Bank Return Memo with the endorsement "INSUFFICIENT FUNDS".

[PAGE 2]
Clause 3 — Statutory 15-Day Demand under Proviso (b) to Section 138
You are hereby called upon to make payment of the dishonoured cheque amount of ₹8,50,000/- (Rupees Eight Lakhs Fifty Thousand Only) within 15 (fifteen) days from the date of receipt of this statutory notice, failing which My Client shall be constrained to initiate criminal prosecution against you under Section 138 read with Section 141 of the Negotiable Instruments Act, 1881 before the competent Metropolitan Magistrate Court at Mumbai, besides filing a Summary Suit under Order XXXVII CPC for recovery with 18% interest.

Advocate Signature: [Signed: Adv. R. K. Deshmukh, High Court Bombay]`
  },
  {
    id: 'sample-scanned-lease-ocr',
    label: '4. Scanned Commercial Lease (OCR & Risks)',
    badge: 'SCANNED PDF · OCR · Commercial Lease',
    categoryGroup: 'valid_indian_legal',
    fileName: 'Scanned_Commercial_Lease_Bengaluru_2024.pdf',
    fileType: 'SCANNED_PDF',
    fileSizeBytes: 4120000,
    rawText: `[PAGE 1]
COMMERCIAL LEASE DEED (SCANNED STAMP PAPER — OCR EXTRACTED)
This Lease Deed is made at Bengaluru, Karnataka on this 01st day of August, 2024:

BETWEEN:
M/s Prestige Tech Spaces LLP ("LESSOR")
AND:
M/s NextGen Software Solutions Pvt. Ltd. ("LESSEE").

Clause 1 — Lease Term Exceeding One Year Without Registration
The Lessor hereby demises Office Unit 402, Cyber Park, Whitefield, Bengaluru for a fixed lease term of 5 (Five) Years commencing from 01st August, 2024 to 31st July, 2029. To save stamp duty, the parties agree not to register this Lease Deed before the Sub-Registrar.

Clause 2 — Monthly Rent & Conflicting Security Deposit
The Lessee shall pay a monthly rent of ₹1,50,000/- (Rupees One Lakh Fifty Thousand Only) on or before the 5th day of every calendar month. The Lessee has paid an interest-free security deposit of ₹15,00,000/- under this Clause, whereas Schedule B on Page 2 states the security deposit paid is ₹9,00,000/-.

[PAGE 2]
[OCR_WARNING: Low scan contrast detected on top margin of Page 2 — Stamp vendor serial number partially illegible: [UNCERTAIN_OCR: KA-BLR-2024-??89]]

Clause 3 — Unilateral Lock-in & Non-Refundable Deposit
The Lessee is bound by a strict 5-year lock-in period. If the Lessee vacates the premises for any reason—including structural collapse or fire—the Lessor shall forfeit the entire security deposit and the Lessee must still pay rent for all remaining 60 months.

Clause 4 — Dispute Resolution & Governing Law
Any dispute under this Lease shall be governed by the Transfer of Property Act, 1882 and The Registration Act, 1908, subject to the exclusive jurisdiction of courts at Bengaluru, Karnataka.

SCHEDULE B — FINANCIAL SUMMARY TABLE
Monthly Rent: ₹1,50,000/- | Security Deposit Paid: ₹9,00,000/- | Escalation: 15% per annum
LESSOR SIGNATURE: [Signed] | LESSEE SIGNATURE: [Signed]`
  },
  {
    id: 'sample-sc-judgment-2023',
    label: '5. Supreme Court Judgment (2023 INSC 683)',
    badge: 'PDF · 2 Pages · Court Judgment',
    categoryGroup: 'valid_indian_legal',
    fileName: 'Supreme_Court_Judgment_Mohd_Wajid_2023_INSC_683.pdf',
    fileType: 'PDF',
    fileSizeBytes: 1520400,
    rawText: `[PAGE 1]
IN THE SUPREME COURT OF INDIA
CRIMINAL APPELLATE JURISDICTION
CRIMINAL APPEAL NO. 2340 OF 2023 (Neutral Citation: 2023 INSC 683)
Date of Judgment: 08th August, 2023

BETWEEN:
Mohd. Wajid & Anr. ... Appellants
VERSUS
State of U.P. & Ors. ... Respondents

Bench: Hon'ble Mr. Justice J.B. Pardiwala and Hon'ble Mr. Justice Manoj Misra

Paragraph 1 — Issue Before the Court
This appeal arises from an order of the High Court of Judicature at Allahabad refusing to quash criminal proceedings under Section 482 of the Code of Criminal Procedure, 1973 (now Section 528 of the Bharatiya Nagarik Suraksha Sanhita, 2023) arising out of an FIR alleging offences under Sections 420, 406, and 506 of the Indian Penal Code, 1860.

[PAGE 2]
Paragraph 2 — Ratio Decidendi & Holding on Civil Disputes Cloaked as Criminal FIRs
Whenever an accused approaches the High Court under Section 482 CrPC seeking quashing of an FIR on the ground that the allegations disclose purely a civil or commercial breach of contract without fraudulent intention at the inception under Section 420 IPC (now Section 318 BNS, 2023), the Court owes a duty to look into the FIR with care and read between the lines. Criminal prosecution cannot be used as an instrument of harassment or pressure to settle a civil dispute or recover money.

Paragraph 3 — Final Order
The appeal is allowed. The impugned order of the High Court is set aside and the First Information Report registered at Police Station Kotwali, District Saharanpur is hereby quashed.`
  },
  {
    id: 'sample-bns-statutory-act',
    label: '6. Indian Statute Excerpt (BNS 2023 & IPC Transition)',
    badge: 'PDF · 2 Pages · Statutory Act',
    categoryGroup: 'valid_indian_legal',
    fileName: 'Bharatiya_Nyaya_Sanhita_2023_Cheating_Provisions.pdf',
    fileType: 'PDF',
    fileSizeBytes: 890000,
    rawText: `[PAGE 1]
THE GAZETTE OF INDIA EXTRAORDINARY — PART II, SECTION 1
MINISTRY OF LAW AND JUSTICE (Legislative Department)
THE BHARATIYA NYAYA SANHITA, 2023 (ACT NO. 45 OF 2023)
Enactment Date: 25th December, 2023 | Commencement Date: 01st July, 2024 (S.O. 850(E))

CHAPTER XVII — OF OFFENCES AGAINST PROPERTY: OF CHEATING

Section 318 — Cheating and Dishonestly Inducing Delivery of Property
(1) Whoever, by deceiving any person, fraudulently or dishonestly induces the person so deceived to deliver any property to any person, or to consent that any person shall retain any property, is said to cheat.
Explanation: A dishonest concealment of facts is a deception within the meaning of this section.

[PAGE 2]
Section 318(4) — Aggravated Cheating Inducing Delivery of Property or Valuable Security
Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.

Section 358 — Repeal and Savings
The Indian Penal Code, 1860 is hereby repealed, provided that such repeal shall not affect any investigation, legal proceeding, or remedy in respect of any offence committed prior to 01st July, 2024.`
  },
  {
    id: 'sample-non-legal-recipe',
    label: '7. [Test Rejection] Culinary Recipe & Travel Guide PDF',
    badge: 'NON-LEGAL · Rejects Without Indexing',
    categoryGroup: 'validation_edge_case',
    fileName: 'Hyderabadi_Biryani_Recipe_And_Travel_Guide.pdf',
    fileType: 'PDF',
    fileSizeBytes: 640000,
    rawText: `[PAGE 1]
AUTHENTIC HYDERABADI KACCHI DUM BIRYANI RECIPE & CHARMINAR FOOD WALK GUIDE
Preparation Time: 90 Minutes | Cooking Time: 45 Minutes | Servings: 6 People

Ingredients for Marinade:
- 1 kg tender goat meat or chicken cut into medium pieces
- 500 grams aged basmati rice soaked for 40 minutes
- 1 cup thick yogurt, 2 tablespoons ginger-garlic paste, saffron strands soaked in warm milk, fresh mint leaves, coriander, fried onions (birista), and whole garam masala spices.

Cooking Instructions:
1. Marinate the meat with yogurt, spices, fried onions, and lemon juice for at least 2 hours.
2. Parboil the basmati rice up to 70% doneness in salted water infused with cardamom, cloves, and bay leaf.
3. Layer the raw marinated meat at the bottom of a heavy-bottomed handi, top with parboiled rice, saffron milk, and ghee, seal with dough, and cook on slow dum heat for 45 minutes.`
  },
  {
    id: 'sample-technical-manual-trap',
    label: '8. [Test Keyword Trap] Server Technical Manual',
    badge: 'NON-LEGAL · Has "section"/"agreement" words',
    categoryGroup: 'validation_edge_case',
    fileName: 'Kubernetes_Cluster_Technical_Manual_v4.pdf',
    fileType: 'PDF',
    fileSizeBytes: 1120000,
    rawText: `[PAGE 1]
DISTRIBUTED LINUX KERNEL & KUBERNETES CLUSTER OPERATIONS MANUAL (RELEASE 4.2)
Section 1 — Consensus Protocol Agreement & Raft Leader Election
In a distributed database cluster, all worker nodes must reach quorum agreement on the current log index before committing a transaction to solid-state storage. Refer to Section 4 of the hardware installation worksheet for rack cooling airflow velocity.

Section 2 — Tennis Court Wi-Fi Mesh & Mother-in-Law Guest VLAN Setup
When configuring the campus Wi-Fi access points near the recreational tennis court or food court, ensure that the 5 GHz channel width is set to 40 MHz and that Ohm's law and Moore's law performance benchmarks are logged in Prometheus.`
  },
  {
    id: 'sample-uncertain-supporting-evidence',
    label: '9. [Test Clarification] Supporting Receipt / Statement',
    badge: 'CLARIFICATION · Requests Case Link',
    categoryGroup: 'validation_edge_case',
    fileName: 'Hospital_Billing_And_Payment_Statement_2025.pdf',
    fileType: 'PDF',
    fileSizeBytes: 510000,
    rawText: `[PAGE 1]
APOLLO MULTISPECIALITY HOSPITAL — INPATIENT BILLING & PAYMENT RECEIPT
Patient Name: Mr. Suresh Nair | Admission Date: 12th January, 2025 | Discharge Date: 19th January, 2025
Invoice No.: HOSP-BLR-2025-8841

Itemized Charges:
1. Orthopaedic Surgery & Implant Charges: ₹2,40,000/-
2. ICU & Room Charges (7 Days): ₹70,000/-
3. Pharmacy & Diagnostics: ₹45,000/-
Total Bill Paid via NEFT Ref No. SBIN225019991: ₹3,55,000/-
Remarks: Insurer cashless pre-authorization was rejected citing pre-existing condition exclusion.`
  },
  {
    id: 'sample-foreign-law-contract',
    label: '10. [Test Foreign Law] Delaware US SaaS Agreement',
    badge: 'FOREIGN LAW · US Delaware Jurisdiction',
    categoryGroup: 'validation_edge_case',
    fileName: 'Delaware_Cloud_SaaS_Agreement_US_Law.pdf',
    fileType: 'PDF',
    fileSizeBytes: 980000,
    rawText: `[PAGE 1]
MASTER SOFTWARE AS A SERVICE (SAAS) SUBSCRIPTION AGREEMENT
This Master Subscription Agreement is entered into as of February 10, 2025 between CloudScale Inc., a Delaware corporation with offices at 400 Market Street, San Francisco, California, USA ("Provider"), and Acme Retail Corp., a New York corporation ("Customer").

Clause 1 — Subscription Fees & US Dollar Payment
Customer shall pay an annual subscription fee of $48,000 USD within thirty (30) days of invoice date. Late payments shall accrue interest at 1.5% per month under the Uniform Commercial Code (UCC).

Clause 2 — Governing Law & Exclusive US Venue
This Agreement and any dispute arising hereunder shall be governed by and construed solely in accordance with the laws of the State of Delaware, United States of America, without regard to conflict of law principles. The parties submit to the exclusive jurisdiction of the state and federal courts located in Wilmington, Delaware, USA.`
  }
];
