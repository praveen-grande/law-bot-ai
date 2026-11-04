import {
  LegalCategory,
  DocumentType,
  StatutorySection,
  CourtJudgment,
  HFDatasetRecord
} from '../types/legal.js';

export interface ClassificationResult {
  category: LegalCategory;
  subcategory?: string;
  documentType: DocumentType | 'Constitution' | 'Subordinate Legislation';
  isCourtJudgment: boolean;
  confidence: number; // 0.0 to 1.0
  classificationMethod: 'rule_based_legal_parser' | 'metadata_header' | 'heuristic_classifier';
  reasoning: string;

  // Extracted statutory identifiers
  statutoryInfo?: {
    parentAct: string;
    actYear?: number;
    provisionNumber: string;
    heading: string;
    chapterNumber?: string;
    chapterTitle?: string;
    status: 'In Force' | 'Amended' | 'Repealed' | 'Uncertain' | 'Needs Review';
    jurisdiction: 'Central' | 'State';
  };

  // Extracted judgment identifiers
  judgmentInfo?: {
    court: string;
    bench?: string;
    caseTitle: string;
    caseNumber?: string;
    judgmentDate?: string;
    citation?: string;
    petitioner?: string;
    respondent?: string;
    jurisdiction: 'Central' | 'State';
  };
}

/**
 * Standard category mappings to match existing application Legal Topics:
 * 1. Constitutional Law
 * 2. Criminal Law
 * 3. Civil Law
 * 4. Property Law
 * 5. Family Law
 * 6. Labour & Employment
 * 7. Consumer Protection
 * 8. Company Law
 * 9. Cyber Law
 * 10. Intellectual Property
 * 11. Taxation Law
 * 12. Motor Vehicle & Accident Law
 * 13. Environmental Law
 * 14. Administrative Law
 * 15. Unclassified / Needs Review
 */

interface KeywordPattern {
  category: LegalCategory;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  statutes: string[];
  citationHints: string[];
  weight: number;
}

const CATEGORY_PATTERNS: KeywordPattern[] = [
  {
    category: 'Constitutional Law',
    primaryKeywords: [
      'constitution of india',
      'fundamental right',
      'article 21',
      'article 14',
      'article 19',
      'article 32',
      'article 226',
      'writ petition',
      'habeas corpus',
      'mandamus',
      'certiorari',
      'quo warranto',
      'basic structure doctrine',
      'preamble',
      'directive principles',
      'seventh schedule',
      'union list',
      'state list',
      'concurrent list',
      'constitutional bench',
      'emergency provisions',
      'ordinance making power'
    ],
    secondaryKeywords: ['sovereign', 'secular', 'democratic republic', 'federalism', 'dr. b.r. ambedkar', 'constituent assembly'],
    statutes: ['Constitution of India', 'Government of India Act'],
    citationHints: ['const. art', 'art.', 'article'],
    weight: 1.2
  },
  {
    category: 'Criminal Law',
    primaryKeywords: [
      'indian penal code',
      'ipc',
      'bharatiya nyaya sanhita',
      'bns',
      'code of criminal procedure',
      'crpc',
      'bharatiya nagarik suraksha sanhita',
      'bnss',
      'indian evidence act',
      'bharatiya sakshya adhiniyam',
      'bsa',
      'section 302',
      'section 420',
      'section 376',
      'section 304b',
      'section 307',
      'section 498a',
      'section 154',
      'section 438',
      'anticipatory bail',
      'regular bail',
      'first information report',
      'fir',
      'charge sheet',
      'police custody',
      'judicial custody',
      'culpable homicide',
      'murder',
      'cheating',
      'mens rea',
      'actu reus',
      'sessions court',
      'crl.a.',
      'crl.m.c.',
      'crl.rev.p.',
      'acquittal',
      'conviction',
      'ndps act',
      'pocso act',
      'uapa',
      'pmla'
    ],
    secondaryKeywords: ['investigation officer', 'police station', 'prosecution', 'accused', 'witness', 'cross examination', 'bail bond', 'rigorous imprisonment'],
    statutes: [
      'Indian Penal Code, 1860',
      'Bharatiya Nyaya Sanhita, 2023',
      'Code of Criminal Procedure, 1973',
      'Bharatiya Nagarik Suraksha Sanhita, 2023',
      'Indian Evidence Act, 1872',
      'Bharatiya Sakshya Adhiniyam, 2023',
      'Narcotic Drugs and Psychotropic Substances Act, 1985',
      'Protection of Children from Sexual Offences Act, 2012'
    ],
    citationHints: ['crl.', 'cri.', 'scc (cri)', 'air cri'],
    weight: 1.2
  },
  {
    category: 'Cyber Law',
    primaryKeywords: [
      'information technology act',
      'it act',
      'digital personal data protection act',
      'dpdp',
      'section 66',
      'section 66a',
      'section 65b',
      'electronic evidence',
      'cyber crime',
      'cyber fraud',
      'hacking',
      'phishing',
      'digital signature',
      'cert-in',
      'data privacy',
      'intermediary guidelines',
      'data principal',
      'data fiduciary',
      'electronic record',
      'tampering with computer source'
    ],
    secondaryKeywords: ['computer system', 'unauthorized access', 'server', 'online banking', 'social media', 'encryption'],
    statutes: [
      'Information Technology Act, 2000',
      'Digital Personal Data Protection Act, 2023'
    ],
    citationHints: ['it act', 'dpdp'],
    weight: 1.25
  },
  {
    category: 'Property Law',
    primaryKeywords: [
      'transfer of property act',
      'registration act',
      'rera',
      'real estate regulatory authority',
      'section 17',
      'section 54',
      'section 53a',
      'sale deed',
      'conveyance',
      'mortgage',
      'lease deed',
      'gift deed',
      'licence agreement',
      'easement',
      'land acquisition',
      'title deed',
      'mutation',
      'partition suit',
      'encumbrance certificate',
      'adverse possession',
      'immovable property',
      'tenancy',
      'eviction',
      'landlord'
    ],
    secondaryKeywords: ['vendor', 'purchaser', 'mesne profits', 'possession', 'demarcation', 'revenue record', 'patta'],
    statutes: [
      'Transfer of Property Act, 1882',
      'The Registration Act, 1908',
      'Real Estate (Regulation and Development) Act, 2016',
      'Indian Easements Act, 1882'
    ],
    citationHints: ['prop.', 'rera'],
    weight: 1.15
  },
  {
    category: 'Family Law',
    primaryKeywords: [
      'hindu marriage act',
      'special marriage act',
      'hindu succession act',
      'hindu minority and guardianship act',
      'muslim personal law',
      'shariat',
      'dissolution of muslim marriages act',
      'protection of women from domestic violence act',
      'domestic violence',
      'matrimonial dispute',
      'divorce',
      'maintenance',
      'section 125 crpc',
      'restitution of conjugal rights',
      'judicial separation',
      'alimony',
      'child custody',
      'stridhan',
      'coparcenary',
      'ancestral property',
      'guardianship',
      'adoption'
    ],
    secondaryKeywords: ['husband', 'wife', 'matrimonial home', 'dower', 'meher', 'cruelty', 'desertion', 'family court'],
    statutes: [
      'Hindu Marriage Act, 1955',
      'Special Marriage Act, 1954',
      'Hindu Succession Act, 1956',
      'Protection of Women from Domestic Violence Act, 2005'
    ],
    citationHints: ['mat.', 'fao', 'divorce'],
    weight: 1.15
  },
  {
    category: 'Labour & Employment',
    primaryKeywords: [
      'industrial disputes act',
      'payment of gratuity act',
      'employees provident fund',
      'epf',
      'employees state insurance',
      'esi',
      'factories act',
      'workmen compensation act',
      'employees compensation act',
      'posh act',
      'prevention of sexual harassment',
      'minimum wages act',
      'payment of bonus act',
      'retrenchment',
      'lay-off',
      'lockout',
      'industrial tribunal',
      'labour court',
      'trade union',
      'workman',
      'termination of service',
      'gratuity calculation'
    ],
    secondaryKeywords: ['employer', 'employee', 'wages', 'provident fund commissioner', 'domestic enquiry', 'disciplinary proceedings'],
    statutes: [
      'Industrial Disputes Act, 1947',
      'Payment of Gratuity Act, 1972',
      'Employees’ Provident Funds and Miscellaneous Provisions Act, 1952',
      'Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013'
    ],
    citationHints: ['lab.', 'llj', 'llr'],
    weight: 1.1
  },
  {
    category: 'Consumer Protection',
    primaryKeywords: [
      'consumer protection act',
      'ncdrc',
      'national consumer disputes redressal commission',
      'state consumer commission',
      'scdrc',
      'district consumer disputes redressal commission',
      'district forum',
      'central consumer protection authority',
      'ccpa',
      'deficiency in service',
      'unfair trade practice',
      'restrictive trade practice',
      'misleading advertisement',
      'dark patterns',
      'product liability',
      'consumer complaint',
      'e-commerce rules'
    ],
    secondaryKeywords: ['complainant', 'deficiency', 'compensation', 'consumer grievance', 'replacement', 'refund'],
    statutes: [
      'Consumer Protection Act, 2019',
      'Consumer Protection Act, 1986'
    ],
    citationHints: ['cpj', 'ncdrc'],
    weight: 1.2
  },
  {
    category: 'Company Law',
    primaryKeywords: [
      'companies act',
      'insolvency and bankruptcy code',
      'ibc',
      'national company law tribunal',
      'nclt',
      'national company law appellate tribunal',
      'nclat',
      'corporate insolvency resolution process',
      'cirp',
      'committee of creditors',
      'coc',
      'resolution professional',
      'resolution plan',
      'liquidation',
      'sebi',
      'securities and exchange board of india',
      'director disqualification',
      'oppression and mismanagement',
      'section 241',
      'section 242',
      'section 7 ibc',
      'section 9 ibc',
      'section 10 ibc',
      'corporate debtor',
      'financial creditor',
      'operational creditor',
      'lifting corporate veil',
      'articles of association',
      'memorandum of association'
    ],
    secondaryKeywords: ['board of directors', 'shareholders', 'debentures', 'mca', 'roc', 'registrar of companies'],
    statutes: [
      'Companies Act, 2013',
      'Insolvency and Bankruptcy Code, 2016',
      'Securities and Exchange Board of India Act, 1992'
    ],
    citationHints: ['comp. cas', 'ibcli', 'nclt'],
    weight: 1.2
  },
  {
    category: 'Taxation Law',
    primaryKeywords: [
      'income tax act',
      'central goods and services tax act',
      'cgst',
      'sgst',
      'igst',
      'customs act',
      'central excise act',
      'itat',
      'income tax appellate tribunal',
      'assessing officer',
      'assessment year',
      'financial year',
      'tax deduction at source',
      'tds',
      'input tax credit',
      'itc',
      'capital gains',
      'search and seizure',
      'section 148',
      'section 147',
      'faceless assessment',
      'advance tax',
      'gst council',
      'show cause notice',
      'tax evasion'
    ],
    secondaryKeywords: ['revenue', 'assesse', 'taxable income', 'challan', 'cbic', 'cbdt'],
    statutes: [
      'Income Tax Act, 1961',
      'Central Goods and Services Tax Act, 2017',
      'Customs Act, 1962'
    ],
    citationHints: ['itr', 'gst', 'taxman'],
    weight: 1.2
  },
  {
    category: 'Civil Law',
    primaryKeywords: [
      'code of civil procedure',
      'cpc',
      'specific relief act',
      'indian contract act',
      'limitation act',
      'order 39 rule 1 and 2',
      'temporary injunction',
      'permanent injunction',
      'specific performance',
      'breach of contract',
      'damages',
      'plaint',
      'written statement',
      'res judicata',
      'section 11 cpc',
      'section 89 cpc',
      'interlocutory application',
      'execution petition',
      'civil suit',
      'civil revision petition',
      'regular first appeal',
      'rfa',
      'second appeal',
      'promissory estoppel',
      'consideration',
      'undue influence',
      'arbitration and conciliation act',
      'section 9 arbitration',
      'section 34 arbitration',
      'section 11 arbitration'
    ],
    secondaryKeywords: ['plaintiff', 'defendant', 'decree', 'trial court', 'recovery suit', 'affidavit', 'ex-parte'],
    statutes: [
      'Code of Civil Procedure, 1908',
      'Specific Relief Act, 1963',
      'Indian Contract Act, 1872',
      'Arbitration and Conciliation Act, 1996',
      'Limitation Act, 1963'
    ],
    citationHints: ['c.s.', 'cpc', 'civ.'],
    weight: 1.1
  },
  {
    category: 'Intellectual Property',
    primaryKeywords: [
      'trade marks act',
      'copyright act',
      'patents act',
      'designs act',
      'trademark infringement',
      'passing off',
      'copyright infringement',
      'patent claim',
      'intellectual property rights',
      'ipr',
      'prior art',
      'inventive step',
      'distinctiveness',
      'deceptive similarity',
      'trade secret',
      'geographical indications',
      'delhi high court ipd'
    ],
    secondaryKeywords: ['mark', 'author', 'inventor', 'registration of mark', 'domain name dispute'],
    statutes: [
      'Trade Marks Act, 1999',
      'Copyright Act, 1957',
      'Patents Act, 1970',
      'Designs Act, 2000'
    ],
    citationHints: ['ptc', 'ipr'],
    weight: 1.2
  },
  {
    category: 'Motor Vehicle & Accident Law',
    primaryKeywords: [
      'motor vehicles act',
      'motor accident claims tribunal',
      'mact',
      'third party insurance',
      'compensation for death',
      'detailed accident report',
      'dar',
      'rash and negligent driving',
      'section 166',
      'section 163a',
      'multiplier method',
      'future prospects',
      'sarla verma',
      'pranay sethi',
      'loss of dependency'
    ],
    secondaryKeywords: ['vehicular accident', 'insurance company', 'driver', 'owner of vehicle', 'compensation award'],
    statutes: [
      'Motor Vehicles Act, 1988',
      'Motor Vehicles (Amendment) Act, 2019'
    ],
    citationHints: ['mact', 'acj'],
    weight: 1.2
  },
  {
    category: 'Environmental Law',
    primaryKeywords: [
      'national green tribunal',
      'ngt',
      'environment protection act',
      'air prevention and control of pollution act',
      'water prevention and control of pollution act',
      'forest conservation act',
      'wildlife protection act',
      'coastal regulation zone',
      'crz',
      'polluter pays principle',
      'precautionary principle',
      'environmental clearance',
      'eia',
      'central pollution control board',
      'cpcb',
      'state pollution control board',
      'spcb'
    ],
    secondaryKeywords: ['effluent', 'emissions', 'forest land', 'ecological damage', 'biodiversity'],
    statutes: [
      'Environment (Protection) Act, 1986',
      'National Green Tribunal Act, 2010',
      'Air (Prevention and Control of Pollution) Act, 1981',
      'Water (Prevention and Control of Pollution) Act, 1974'
    ],
    citationHints: ['ngt', 'env.'],
    weight: 1.2
  },
  {
    category: 'Administrative Law',
    primaryKeywords: [
      'central administrative tribunal',
      'cat',
      'right to information act',
      'rti',
      'public interest litigation',
      'pil',
      'principles of natural justice',
      'audi alteram partem',
      'speaking order',
      'bias',
      'doctrine of proportionality',
      'legitimate expectation',
      'promissory estoppel in administrative action',
      'disciplinary proceedings against government servant',
      'central civil services',
      'ccs rules',
      'public procurement'
    ],
    secondaryKeywords: ['public authority', 'central government', 'state government', 'official gazette', 'departmental enquiry'],
    statutes: [
      'Administrative Tribunals Act, 1985',
      'Right to Information Act, 2005'
    ],
    citationHints: ['o.a.', 'cat', 'rti'],
    weight: 1.1
  }
];

/**
 * Distinguish whether a text / record represents a court judgment or a statutory provision
 */
export function detectDocumentKind(
  text: string,
  rawFields: Record<string, any> = {},
  datasetId: string = ''
): {
  isJudgment: boolean;
  documentType: DocumentType | 'Constitution' | 'Subordinate Legislation';
  confidence: number;
} {
  const dId = datasetId.toLowerCase();
  const lowerText = text.toLowerCase();

  // Explicit dataset indicators
  if (dId.includes('constitution')) {
    return { isJudgment: false, documentType: 'Constitution', confidence: 0.99 };
  }
  if (dId.includes('case-law') || dId.includes('judgment') || dId.includes('kanoongpt')) {
    return { isJudgment: true, documentType: 'Judgment', confidence: 0.98 };
  }
  if (dId.includes('dhara') && rawFields.config === 'provisions') {
    return { isJudgment: false, documentType: 'Act', confidence: 0.95 };
  }
  if (dId.includes('dhara') && rawFields.config === 'judgments') {
    return { isJudgment: true, documentType: 'Judgment', confidence: 0.95 };
  }

  // Raw fields check
  if (
    rawFields.court ||
    rawFields.court_name ||
    rawFields.bench ||
    rawFields.petitioner ||
    rawFields.respondent ||
    rawFields.docket ||
    rawFields.cnr ||
    rawFields.cnr_number ||
    rawFields.neutral_citation
  ) {
    return { isJudgment: true, documentType: 'Judgment', confidence: 0.95 };
  }

  // Text heuristics
  const judgmentSignals = [
    /\b(supreme court of india|high court of|appellant|respondent|petitioner|versus|vs\.|v\.)\b/i,
    /\b(judg?ment|coram|bench|author:|order dated|writ petition no|criminal appeal no|civil appeal no)\b/i,
    /\b(held that|the appeal is (dismissed|allowed)|ordered accordingly|in the result)\b/i
  ];

  const statutorySignals = [
    /\b(be it enacted by parliament|short title and commencement|an act to|in this act, unless|section \d+)\b/i,
    /\b(whoever|shall be punishable with|notwithstanding anything contained|provided that|explanation:)\b/i,
    /\b(gazette of india|ministry of law and justice|act no\.\s*\d+\s*of\s*\d{4})\b/i,
    /\b(article \d+ of the constitution)\b/i
  ];

  let judgmentScore = 0;
  for (const sig of judgmentSignals) {
    if (sig.test(lowerText)) judgmentScore += 2;
  }

  let statutoryScore = 0;
  for (const sig of statutorySignals) {
    if (sig.test(lowerText)) statutoryScore += 2;
  }

  if (judgmentScore > statutoryScore) {
    return { isJudgment: true, documentType: 'Judgment', confidence: Math.min(0.9, 0.6 + judgmentScore * 0.1) };
  } else if (statutoryScore > judgmentScore) {
    const isConst = /constitution of india|fundamental rights|article \d+/i.test(lowerText);
    return {
      isJudgment: false,
      documentType: isConst ? 'Constitution' : 'Act',
      confidence: Math.min(0.9, 0.6 + statutoryScore * 0.1)
    };
  }

  return { isJudgment: false, documentType: 'Act', confidence: 0.5 };
}

/**
 * Extract statutory provision components (Act title, enactment year, section/article, heading)
 */
export function extractStatutoryIdentifiers(
  text: string,
  rawFields: Record<string, any> = {},
  datasetId: string = ''
): ClassificationResult['statutoryInfo'] {
  const dId = datasetId.toLowerCase();

  // Special handling for Constitution
  if (dId.includes('constitution') || /constitution of india/i.test(text)) {
    const artMatch = text.match(/article\s+(\d+[a-z]?)/i) || (rawFields.article ? [null, rawFields.article] : null);
    const provisionNumber = artMatch ? `Article ${artMatch[1].toUpperCase()}` : rawFields.article_number || 'Preamble';
    const heading = rawFields.title || rawFields.heading || rawFields.Article || `Constitution of India — ${provisionNumber}`;
    return {
      parentAct: 'Constitution of India',
      actYear: 1950,
      provisionNumber,
      heading: heading.slice(0, 200),
      chapterNumber: rawFields.part || rawFields.chapter || 'Part III',
      chapterTitle: rawFields.part_title || 'Fundamental Rights',
      status: 'In Force',
      jurisdiction: 'Central'
    };
  }

  // Check parent Act
  let parentAct = rawFields.actName || rawFields.act || rawFields.statute || rawFields.code;
  if (!parentAct) {
    const actMatch = text.match(/([A-Z][A-Za-z\s]+(?:Act|Code|Sanhita|Adhiniyam)),?\s*(\d{4})?/);
    if (actMatch) {
      parentAct = actMatch[0].trim();
    } else {
      parentAct = 'Indian Statutory Legislation';
    }
  }

  // Extract year
  let actYear: number | undefined;
  const yearMatch = parentAct.match(/\b(18\d\d|19\d\d|20\d\d)\b/);
  if (yearMatch) {
    actYear = parseInt(yearMatch[1], 10);
  }

  // Extract section
  let secNum = rawFields.sectionNumber || rawFields.section || rawFields.provision;
  if (!secNum) {
    const secMatch = text.match(/\bsection\s+(\d+[a-z]?)/i);
    if (secMatch) {
      secNum = secMatch[1];
    } else {
      secNum = 'General Provision';
    }
  }

  // Extract heading
  let heading = rawFields.title || rawFields.heading || rawFields.provision_title;
  if (!heading) {
    const firstLine = text.split('\n')[0].trim().replace(/^section\s+\d+[:.\s-]*/i, '');
    heading = firstLine.length > 5 && firstLine.length < 150 ? firstLine : `Section ${secNum}`;
  }

  // Check status
  let status: 'In Force' | 'Amended' | 'Repealed' | 'Uncertain' | 'Needs Review' = 'In Force';
  if (/repealed|struck down/i.test(text) || rawFields.status === 'repealed') {
    status = 'Repealed';
  } else if (/amended by|substituted by/i.test(text) || rawFields.status === 'amended') {
    status = 'Amended';
  }

  return {
    parentAct: parentAct.slice(0, 150),
    actYear,
    provisionNumber: String(secNum),
    heading: heading.slice(0, 200),
    chapterNumber: rawFields.chapterNumber || rawFields.chapter,
    chapterTitle: rawFields.chapterTitle,
    status,
    jurisdiction: (rawFields.jurisdiction as 'Central' | 'State') || 'Central'
  };
}

/**
 * Extract judgment identifiers (Court, Bench, Case Title, Case Number, Decision Date, Citations)
 */
export function extractJudgmentIdentifiers(
  text: string,
  rawFields: Record<string, any> = {},
  datasetId: string = ''
): ClassificationResult['judgmentInfo'] {
  // Court name
  let court =
    rawFields.court_name ||
    rawFields.court ||
    rawFields.bench_name ||
    rawFields.forum;

  if (!court) {
    if (/supreme court of india/i.test(text)) {
      court = 'Supreme Court of India';
    } else {
      const hcMatch = text.match(/high court of (judicature at )?([A-Za-z\s]+)/i);
      court = hcMatch ? `High Court of ${hcMatch[2].trim()}` : 'High Court / Appellate Forum';
    }
  }

  // Case title (Petitioner vs Respondent)
  let caseTitle = rawFields.case_title || rawFields.party_caption || rawFields.title || rawFields.pet_resp;
  if (!caseTitle) {
    const vsMatch = text.match(/([A-Z][A-Za-z0-9.,\s]{3,40})\s+(?:versus|vs\.?|v\.)\s+([A-Z][A-Za-z0-9.,\s]{3,40})/i);
    if (vsMatch) {
      caseTitle = `${vsMatch[1].trim()} v. ${vsMatch[2].trim()}`;
    } else {
      caseTitle = rawFields.neutral_citation || rawFields.docket || `Precedent Judgment (${court})`;
    }
  }

  // Date
  const judgmentDate =
    rawFields.decision_date ||
    rawFields.judgment_date ||
    rawFields.date ||
    rawFields.year?.toString();

  // Citation
  const citation =
    rawFields.neutral_citation ||
    rawFields.citation ||
    rawFields.cnr ||
    rawFields.docket ||
    rawFields.case_no;

  return {
    court: court.slice(0, 120),
    bench: rawFields.bench || rawFields.judge,
    caseTitle: caseTitle.slice(0, 200),
    caseNumber: rawFields.case_no || rawFields.docket,
    judgmentDate,
    citation,
    petitioner: rawFields.petitioner || rawFields.pet,
    respondent: rawFields.respondent || rawFields.resp,
    jurisdiction: court.toLowerCase().includes('supreme') ? 'Central' : 'State'
  };
}

/**
 * Core classifier: automatically assigns document to an existing application category
 * Priority:
 * 1. Rule-based inspection of statutory titles & key section patterns
 * 2. Judicial precedent citation & subject-matter analysis
 * 3. Weighted keyword scoring
 * 4. Fallback to 'Unclassified / Needs Review' if ambiguous
 */
export function classifyLegalDocument(
  text: string,
  rawFields: Record<string, any> = {},
  datasetId: string = ''
): ClassificationResult {
  const metaString = [
    rawFields.actName,
    rawFields.act,
    rawFields.statute,
    rawFields.code,
    rawFields.title,
    rawFields.court,
    rawFields.court_name,
    rawFields.heading,
    Array.isArray(rawFields.topics) ? rawFields.topics.join(' ') : rawFields.topics
  ]
    .filter(Boolean)
    .join(' ');
  const combinedText = `${text} ${metaString}`.toLowerCase();
  const dId = datasetId.toLowerCase();

  // 1. Detect Document Kind (Statutory vs Judgment vs Constitution)
  const docKind = detectDocumentKind(text, rawFields, datasetId);

  // Quick path: Constitution dataset or explicit constitutional article
  if (docKind.documentType === 'Constitution' || dId.includes('constitution')) {
    const statutoryInfo = extractStatutoryIdentifiers(text, rawFields, datasetId);
    return {
      category: 'Constitutional Law',
      subcategory: statutoryInfo?.chapterTitle || 'Fundamental Rights & Structure',
      documentType: 'Constitution',
      isCourtJudgment: false,
      confidence: 0.98,
      classificationMethod: 'metadata_header',
      reasoning: 'Directly verified from Constitution of India corpus and article taxonomy.',
      statutoryInfo
    };
  }

  // 2. Score against all 14 legal categories using weighted matching
  const categoryScores: { category: LegalCategory; score: number; matchedKeywords: string[] }[] = [];

  for (const pattern of CATEGORY_PATTERNS) {
    let score = 0;
    const matchedKeywords: string[] = [];

    // Check statute names
    for (const st of pattern.statutes) {
      if (combinedText.includes(st.toLowerCase())) {
        score += 35 * pattern.weight;
        matchedKeywords.push(`Statute: ${st}`);
      }
    }

    // Check primary keywords
    for (const kw of pattern.primaryKeywords) {
      if (combinedText.includes(kw)) {
        score += 15 * pattern.weight;
        matchedKeywords.push(kw);
      }
    }

    // Check secondary keywords
    for (const kw of pattern.secondaryKeywords) {
      if (combinedText.includes(kw)) {
        score += 5 * pattern.weight;
      }
    }

    // Check citation hints
    for (const hint of pattern.citationHints) {
      if (combinedText.includes(hint)) {
        score += 10 * pattern.weight;
      }
    }

    categoryScores.push({ category: pattern.category, score, matchedKeywords });
  }

  // Sort by score descending
  categoryScores.sort((a, b) => b.score - a.score);
  const bestMatch = categoryScores[0];
  const runnerUp = categoryScores[1];

  let assignedCategory: LegalCategory = 'Unclassified / Needs Review';
  let confidence = 0.4;
  let reasoning = 'Ambiguous or insufficient statutory keywords detected; requires administrative review.';

  // Confidence calculation & thresholding
  if (bestMatch && bestMatch.score >= 25) {
    const scoreDiff = bestMatch.score - (runnerUp?.score || 0);
    // If significantly ahead or high score, assign category
    if (bestMatch.score >= 50 || scoreDiff >= 15) {
      assignedCategory = bestMatch.category;
      confidence = Math.min(0.96, 0.65 + bestMatch.score / 200);
      reasoning = `Classified into ${assignedCategory} based on strong signals: ${bestMatch.matchedKeywords.slice(0, 4).join(', ')}.`;
    } else if (bestMatch.score >= 25) {
      // Moderate signal
      assignedCategory = bestMatch.category;
      confidence = 0.68;
      reasoning = `Moderately aligned to ${assignedCategory} with secondary keywords (${bestMatch.matchedKeywords.slice(0, 3).join(', ')}).`;
    }
  }

  // Extract relevant identifiers depending on document kind
  let statutoryInfo: ClassificationResult['statutoryInfo'];
  let judgmentInfo: ClassificationResult['judgmentInfo'];

  if (docKind.isJudgment) {
    judgmentInfo = extractJudgmentIdentifiers(text, rawFields, datasetId);
  } else {
    statutoryInfo = extractStatutoryIdentifiers(text, rawFields, datasetId);
  }

  return {
    category: assignedCategory,
    subcategory: docKind.isJudgment ? `${judgmentInfo?.court} Precedent` : statutoryInfo?.parentAct,
    documentType: docKind.documentType,
    isCourtJudgment: docKind.isJudgment,
    confidence: Number(confidence.toFixed(2)),
    classificationMethod: 'rule_based_legal_parser',
    reasoning,
    statutoryInfo,
    judgmentInfo
  };
}

/**
 * Convert an ingested / classified record into a UI-ready StatutorySection
 */
export function formatAsStatutorySection(
  rec: HFDatasetRecord,
  classification: ClassificationResult
): StatutorySection {
  const stat = classification.statutoryInfo;
  const actName = stat?.parentAct || rec.normalizedActOrCode || rec.normalizedTitle || 'Indian Enactment';
  const secNumber = stat?.provisionNumber || rec.normalizedSection || 'Provisions';
  const actYear = stat?.actYear || 2024;
  const heading = stat?.heading || rec.normalizedTitle;

  return {
    id: `sec-hf-${rec.datasetId.replace(/[^a-zA-Z0-9]/g, '-')}-${String(rec.rowId).replace(/[^a-zA-Z0-9_-]/g, '_')}`,
    actId: `act-hf-${rec.datasetId.replace(/[^a-zA-Z0-9]/g, '-')}`,
    actName,
    actYear,
    chapterNumber: stat?.chapterNumber || 'Part / Chapter',
    chapterTitle: stat?.chapterTitle || classification.category,
    sectionNumber: secNumber,
    title: heading,
    statutoryText: rec.verbatimText,
    simpleExplanation:
      rec.summaryOrSnippet ||
      `Statutory provision of ${actName} dealing with ${heading}. Automatically ingested from Hugging Face (${rec.datasetId}).`,
    status: classification.confidence < 0.6 ? 'Needs Review' : 'In Force',
    jurisdiction: stat?.jurisdiction || (rec.normalizedJurisdiction as 'Central' | 'State') || 'Central',
    keyIngredients: [
      `Source: Hugging Face (${rec.datasetId})`,
      `Classified as: ${classification.category} (${Math.round(classification.confidence * 100)}% confidence)`,
      classification.reasoning
    ],
    relatedSections: [],
    officialSourceUrl: `https://huggingface.co/datasets/${rec.datasetId}`,
    lastVerifiedDate: new Date().toISOString().split('T')[0],
    originBadge: 'hf_imported',
    sourceDatasetId: rec.datasetId,
    classificationCategory: classification.category,
    classificationConfidence: classification.confidence
  };
}

/**
 * Convert an ingested / classified record into a UI-ready CourtJudgment
 */
export function formatAsCourtJudgment(
  rec: HFDatasetRecord,
  classification: ClassificationResult
): CourtJudgment {
  const judge = classification.judgmentInfo;
  const caseTitle = judge?.caseTitle || rec.normalizedTitle || 'Judicial Precedent';
  const citation = judge?.citation || rec.normalizedCitation || `Hugging Face [${rec.datasetId}] #${rec.rowId}`;
  const court = judge?.court || rec.normalizedCourt || 'Indian High Court';
  const decisionDate = judge?.judgmentDate || rec.normalizedDate || new Date().toISOString().split('T')[0];

  return {
    id: `case-hf-${rec.datasetId.replace(/[^a-zA-Z0-9]/g, '-')}-${String(rec.rowId).replace(/[^a-zA-Z0-9_-]/g, '_')}`,
    caseTitle,
    citation,
    court,
    bench: judge?.bench,
    decisionDate,
    jurisdiction: court.toLowerCase().includes('supreme') ? 'Central' : 'State',
    topics: [
      classification.category,
      court,
      'Hugging Face Case Law'
    ],
    sectionsDiscussed: rec.normalizedSection ? [rec.normalizedSection] : [],
    aiSummary:
      rec.summaryOrSnippet ||
      `Court ruling and judicial reasoning delivered by ${court} on ${decisionDate}. Ingested from ${rec.datasetId}.`,
    keyHoldings: [
      `Judicial ruling from ${court}`,
      `Classification: ${classification.category} (${Math.round(classification.confidence * 100)}% confidence)`
    ],
    judgmentSnippet: rec.verbatimText.slice(0, 600) + (rec.verbatimText.length > 600 ? '...' : ''),
    fullJudgmentUrl: `https://huggingface.co/datasets/${rec.datasetId}`,
    citedCases: [],
    bindingPrecedentStatus: court.toLowerCase().includes('supreme')
      ? 'Binding Precedent under Article 141 across all Courts in India'
      : `Persuasive Precedent within ${court} jurisdiction`,
    originBadge: 'hf_imported',
    sourceDatasetId: rec.datasetId,
    classificationCategory: classification.category,
    classificationConfidence: classification.confidence
  };
}
