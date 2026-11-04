import {
  StatutorySection,
  CourtJudgment,
  LegalSource,
  LegalTopic,
  FeedbackReport,
  SyncJobLog,
  UploadedLegalDocument
} from '../types/legal';

export const OFFICIAL_SOURCES: LegalSource[] = [
  {
    id: 'src-1',
    name: 'India Code Digital Repository',
    authority: 'Ministry of Law and Justice, Govt. of India',
    domain: 'indiacode.nic.in',
    category: 'Legislation',
    jurisdiction: 'Central',
    status: 'Success',
    lastSync: '2 days ago',
    docCount: 14250,
    syncFrequency: 'Every 10 days',
    notes: 'Central Acts, statutory rules and historical amendment gazettes.'
  },
  {
    id: 'src-2',
    name: 'Supreme Court of India (Judgments Portal)',
    authority: 'Supreme Court of India (Registry)',
    domain: 'sci.gov.in',
    category: 'Judiciary',
    jurisdiction: 'Central',
    status: 'Success',
    lastSync: '1 day ago',
    docCount: 38400,
    syncFrequency: 'Every 10 days',
    notes: 'Reportable and non-reportable judgments, orders, and Constitution Bench verdicts.'
  },
  {
    id: 'src-3',
    name: 'The Gazette of India (eGazette)',
    authority: 'Department of Publication, Ministry of Housing and Urban Affairs',
    domain: 'egazette.gov.in',
    category: 'Gazette',
    jurisdiction: 'Central',
    status: 'Running',
    lastSync: 'Sync in progress',
    docCount: 18900,
    syncFrequency: 'Every 10 days',
    notes: 'Extraordinary notifications, statutory orders, commencement notifications.'
  },
  {
    id: 'src-4',
    name: 'High Court of Delhi & High Court of Bombay',
    authority: 'State High Court Registries',
    domain: 'delhihighcourt.nic.in',
    category: 'Judiciary',
    jurisdiction: 'State',
    status: 'Success',
    lastSync: '3 days ago',
    docCount: 42100,
    syncFrequency: 'Every 10 days',
    notes: 'Commercial appellate division rulings, criminal appeals, writ petitions.'
  },
  {
    id: 'src-5',
    name: 'Ministry of Consumer Affairs & CCPA',
    authority: 'Central Consumer Protection Authority',
    domain: 'consumeraffairs.nic.in',
    category: 'Ministry',
    jurisdiction: 'Central',
    status: 'Success',
    lastSync: '5 days ago',
    docCount: 3410,
    syncFrequency: 'Monthly',
    notes: 'Consumer protection rules, dark patterns guidelines, misleading advertisement rules.'
  }
];

export const STATUTORY_SECTIONS: StatutorySection[] = [
  {
    id: 'sec-ipc-420',
    actId: 'act-ipc-1860',
    actName: 'Indian Penal Code, 1860',
    actYear: 1860,
    chapterNumber: 'Chapter XVII',
    chapterTitle: 'Offences Against Property',
    sectionNumber: '420',
    title: 'Cheating and dishonestly inducing delivery of property',
    statutoryText: `Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.`,
    simpleExplanation: `This section applies when a person cheats another person and, as a result of that cheating, dishonestly induces the other person to deliver property or to make, alter or destroy a valuable security. Under Indian law, mere failure to fulfill a promise or breach of civil contract is NOT an offence under Section 420 unless dishonest/fraudulent intention existed at the very inception of the transaction.`,
    simpleExplanationTe: `ఈ సెక్షన్ ఒక వ్యక్తి మోసపూరితంగా మరొకరిని నమ్మించి వారి ఆస్తిని లేదా సెక్యూరిటీని కాజేసినప్పుడు వర్తిస్తుంది. కేవలం కాంట్రాక్ట్ ఉల్లంఘన మాత్రమే కాకుండా, ప్రారంభంలోనే మోసపూరిత ఉద్దేశం ఉండడం తప్పనిసరి. గరిష్టంగా 7 సంవత్సరాల వరకు జైలు శిక్ష మరియు జరిమానా విధించవచ్చు.`,
    simpleExplanationHi: `यह धारा तब लागू होती है जब कोई व्यक्ति किसी को धोखा देकर बेईमानी से उसकी संपत्ति देने के लिए प्रेरित करता है या किसी मूल्यवान प्रतिभूति को बनाने/बदलने के लिए मजबूर करता है। मात्र अनुबंध का उल्लंघन अपराध नहीं है; लेन-देन की शुरुआत से ही बेईमान इरादा होना अनिवार्य है। अधिकतम 7 साल की कैद और जुर्माना हो सकता है।`,
    status: 'In Force',
    jurisdiction: 'Central',
    punishment: 'Up to 7 years imprisonment + fine',
    keyIngredients: [
      'Deception of any person by fraudulent or dishonest inducement',
      'Dishonestly inducing that person to deliver property or make/alter a valuable security',
      'Guilty intention (mens rea) present at the very beginning of the act',
      'Distinction from simple breach of civil agreement'
    ],
    relatedSections: ['415', '417', '418', '419', '421'],
    amendmentHistory: [
      'Amended by Act 3 of 1895, s. 1.',
      'Transitioned to Section 318(4) under Bharatiya Nyaya Sanhita (BNS), 2023 for offences after July 1, 2024.'
    ],
    officialSourceUrl: 'https://indiacode.nic.in/handle/123456789/2263',
    lastVerifiedDate: '2024-07-01'
  },
  {
    id: 'sec-ipc-415',
    actId: 'act-ipc-1860',
    actName: 'Indian Penal Code, 1860',
    actYear: 1860,
    chapterNumber: 'Chapter XVII',
    chapterTitle: 'Offences Against Property',
    sectionNumber: '415',
    title: 'Cheating',
    statutoryText: `Whoever, by deceiving any person, fraudulently or dishonestly induces the person so deceived to deliver any property to any person, or to consent that any person shall retain any property, or intentionally induces the person so deceived to do or omit to do anything which he would not do or omit if he were not so deceived, and which act or omission causes or is likely to cause damage or harm to that person in body, mind, reputation or property, is said to "cheat".`,
    simpleExplanation: `Section 415 defines the foundational offense of cheating. It covers both property delivery and acts or omissions causing harm to mind, body, reputation or property due to intentional deception. Section 420 is an aggravated form of Section 415 specifically focused on delivery of property or valuable security.`,
    simpleExplanationTe: `సెక్షన్ 415 మోసం అనే ప్రాథమిక నేరాన్ని నిర్వచిస్తుంది. ఇందులో ఆస్తిని ఇవ్వడమే కాకుండా, శరీరానికి, మనస్సుకు, పరువుకు లేదా ఆస్తికి హాని కలిగించే విధంగా మోసపూరిత ప్రేరణ కూడా చేరుతుంది.`,
    simpleExplanationHi: `धारा 415 धोखाधड़ी के मूल अपराध को परिभाषित करती है। इसमें शरीर, मन, प्रतिष्ठा या संपत्ति को नुकसान पहुँचाने वाले किसी भी धोखे को शामिल किया गया है।`,
    status: 'In Force',
    jurisdiction: 'Central',
    punishment: 'Defined here; punished under Section 417 (up to 1 year imprisonment or fine or both)',
    keyIngredients: [
      'Deception of any person',
      'Fraudulently or dishonestly inducing delivery of property OR intentionally inducing an act/omission',
      'Harm or likelihood of harm in body, mind, reputation, or property'
    ],
    relatedSections: ['417', '418', '419', '420'],
    officialSourceUrl: 'https://indiacode.nic.in/handle/123456789/2263',
    lastVerifiedDate: '2024-07-01'
  },
  {
    id: 'sec-reg-17',
    actId: 'act-reg-1908',
    actName: 'The Registration Act, 1908',
    actYear: 1908,
    chapterNumber: 'Part III',
    chapterTitle: 'Of Registrable Documents',
    sectionNumber: '17',
    title: 'Documents of which registration is compulsory',
    statutoryText: `The following documents shall be registered: (a) instruments of gift of immovable property; (b) other non-testamentary instruments which purport or operate to create, declare, assign, limit or extinguish any right, title or interest of value one hundred rupees and upwards, to or in immovable property; (c) non-testamentary instruments which acknowledge receipt of consideration; (d) leases of immovable property from year to year, or for any term exceeding one year, or reserving a yearly rent...`,
    simpleExplanation: `Section 17 makes registration legally mandatory for key property documents including sale deeds, gifts of immovable property, leases exceeding one year, and non-testamentary instruments transferring rights valued at ₹100 or more. Under Section 49, an unregistered document requiring registration cannot affect the immovable property or be received as evidence of the transaction.`,
    simpleExplanationTe: `రిజిస్ట్రేషన్ చట్టం సెక్షన్ 17 ప్రకారం స్థిరాస్తి విక్రయాలు, బహుమతి పత్రాలు, ఒక సంవత్సరానికి మించిన లీజులు తప్పనిసరిగా రిజిస్టర్ చేయబడాలి. రిజిస్ట్రేషన్ లేని పత్రాలు చెల్లుబాటు కావు.`,
    simpleExplanationHi: `पंजीकरण अधिनियम की धारा 17 के तहत अचल संपत्ति के हस्तांतरण, बिक्री विलेख, 1 वर्ष से अधिक के पट्टे और उपहार का अनिवार्य पंजीकरण आवश्यक है।`,
    status: 'In Force',
    jurisdiction: 'Central',
    keyIngredients: [
      'Gifts of immovable property',
      'Instruments creating or extinguishing rights in immovable property exceeding ₹100',
      'Leases from year to year or exceeding 1 year',
      'Contracts to transfer for consideration (Section 17(1A))'
    ],
    relatedSections: ['49', '18'],
    officialSourceUrl: 'https://indiacode.nic.in/handle/123456789/2190',
    lastVerifiedDate: '2024-05-15'
  },
  {
    id: 'sec-crpc-438',
    actId: 'act-crpc-1973',
    actName: 'Code of Criminal Procedure, 1973',
    actYear: 1973,
    chapterNumber: 'Chapter XXXIII',
    chapterTitle: 'Provisions as to Bail and Bonds',
    sectionNumber: '438',
    title: 'Direction for grant of bail to person apprehending arrest (Anticipatory Bail)',
    statutoryText: `Where any person has reason to believe that he may be arrested on accusation of having committed a non-bailable offence, he may apply to the High Court or the Court of Session for a direction under this section that in the event of such arrest he shall be released on bail.`,
    simpleExplanation: `Anticipatory bail is pre-arrest protection granted by a Sessions Court or High Court when an individual genuinely apprehends arrest for a non-bailable offence. The court evaluates the nature of the accusation, antecedents of the applicant, flight risk, and whether the accusation is made with the object of injuring or humiliating the applicant. Transitioned to Section 482 of the Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023.`,
    simpleExplanationTe: `పోలీసులు అరెస్టు చేసే అవకాశం ఉందని భావించినప్పుడు సెషన్స్ కోర్టు లేదా హైకోర్టు నుండి ముందస్తు బెయిల్ (యాంటిసిపేటరీ బెయిల్) కోరవచ్చు.`,
    simpleExplanationHi: `गिरफ्तारी की आशंका होने पर सत्र न्यायालय या उच्च न्यायालय से अग्रिम जमानत (Anticipatory Bail) प्राप्त करने का कानूनी अधिकार प्रदान करता है।`,
    status: 'In Force',
    jurisdiction: 'Central',
    keyIngredients: [
      'Reason to believe arrest is imminent for a non-bailable offence',
      'Jurisdiction lies with Court of Session or High Court',
      'Court considers nature of accusation, criminal history, and flight risk',
      'Interim protective directions can be issued with conditions'
    ],
    relatedSections: ['437', '439', '41A'],
    officialSourceUrl: 'https://indiacode.nic.in/handle/123456789/16225',
    lastVerifiedDate: '2024-07-01'
  },
  {
    id: 'sec-const-21',
    actId: 'act-const-1950',
    actName: 'Constitution of India',
    actYear: 1950,
    chapterNumber: 'Part III',
    chapterTitle: 'Fundamental Rights',
    sectionNumber: 'Article 21',
    title: 'Protection of life and personal liberty',
    statutoryText: `No person shall be deprived of his life or personal liberty except according to procedure established by law.`,
    simpleExplanation: `Article 21 is the golden cornerstone of Indian Constitutional Law. Through expansive judicial interpretations by the Supreme Court (Maneka Gandhi, Francis Coralie, Puttaswamy), 'Life' means life with human dignity, encompassing the right to privacy, clean environment, speedy trial, livelihood, and legal aid. 'Procedure established by law' must be just, fair, and reasonable.`,
    simpleExplanationTe: `భారత రాజ్యాంగంలోని 21వ అధికరణం జీవించే హక్కు మరియు వ్యక్తిగత స్వేచ్ఛను అందిస్తుంది. చట్టబద్ధమైన ప్రక్రియ లేకుండా ఎవరి జీవించే హక్కును హరించలేరు. గోప్యత మరియు గౌరవప్రదమైన జీవనం ఇందులో భాగం.`,
    simpleExplanationHi: `अनुच्छेद 21 जीवन और व्यक्तिगत स्वतंत्रता के अधिकार की रक्षा करता है। इसमें सम्मानपूर्वक जीने का अधिकार, निजता का अधिकार और निष्पक्ष कानूनी प्रक्रिया शामिल हैं।`,
    status: 'In Force',
    jurisdiction: 'Central',
    keyIngredients: [
      'Universal protection to both citizens and non-citizens',
      'Expansive meaning: dignity, privacy, health, fair trial',
      'Procedure established by law must be fair, just, and reasonable (substantive due process)'
    ],
    relatedSections: ['Article 14', 'Article 19', 'Article 32', 'Article 226'],
    officialSourceUrl: 'https://legislative.gov.in/constitution-of-india/',
    lastVerifiedDate: '2024-01-01'
  },
  {
    id: 'sec-it-66a',
    actId: 'act-it-2000',
    actName: 'Information Technology Act, 2000',
    actYear: 2000,
    chapterNumber: 'Chapter XI',
    chapterTitle: 'Offences',
    sectionNumber: '66A',
    title: 'Punishment for sending offensive messages through communication service, etc.',
    statutoryText: `Any person who sends, by means of a computer resource or a communication device,- (a) any information that is grossly offensive or has menacing character; or (b) any information which he knows to be false, but for the purpose of causing annoyance, inconvenience, danger, obstruction, insult, injury, criminal intimidation, enmity, hatred or ill will...`,
    simpleExplanation: `IMPORTANT LEGAL NOTE: Section 66A of the IT Act was STRUCK DOWN as UNCONSTITUTIONAL in its entirety by the Supreme Court of India in the landmark case of Shreya Singhal v. Union of India (2015) 5 SCC 1 for violating Article 19(1)(a) (freedom of speech) due to vagueness and overbreadth. It is NO LONGER ENFORCEABLE law. Continued police registration under 66A was strictly condemned by the Supreme Court in 2021.`,
    simpleExplanationTe: `గమనిక: శ్రేయా సింఘాల్ కేసులో సుప్రీంకోర్టు సెక్షన్ 66A ను రాజ్యాంగ విరుద్ధమని రద్దు చేసింది. దీని ప్రకారం ఇప్పుడు ఎవరినీ అరెస్టు చేయలేరు.`,
    simpleExplanationHi: `महत्वपूर्ण कानूनी सूचना: सुप्रीम कोर्ट ने 'श्रेया सिंघल बनाम भारत संघ' (2015) में धारा 66A को असंवैधानिक घोषित करते हुए पूरी तरह निरस्त कर दिया था। यह अब कानूनन शून्य है।`,
    status: 'Repealed',
    jurisdiction: 'Central',
    keyIngredients: [
      'Struck down by Supreme Court of India on 24 March 2015',
      'Violated Freedom of Speech and Expression under Article 19(1)(a)',
      'No prosecution can be initiated or sustained under this section'
    ],
    relatedSections: ['66', '67', '79'],
    amendmentHistory: ['Declared unconstitutional by Supreme Court in Shreya Singhal (2015)'],
    officialSourceUrl: 'https://indiacode.nic.in/handle/123456789/1999',
    lastVerifiedDate: '2024-01-01'
  }
];

export const COURT_JUDGMENTS: CourtJudgment[] = [
  {
    id: 'case-rajesh-shah-2020',
    caseTitle: 'State of Maharashtra v. Rajesh Shah',
    citation: '(2020) 5 SCC 123',
    court: 'Supreme Court of India',
    bench: 'Division Bench (Hon’ble Supreme Court)',
    decisionDate: '15 Jan 2020',
    jurisdiction: 'Central',
    state: 'Maharashtra',
    topics: ['Criminal Law', 'IPC 420', 'Cheating', 'Contractual Breach vs Criminal Fraud'],
    sectionsDiscussed: ['IPC Section 420', 'IPC Section 415', 'CrPC Section 482'],
    aiSummary: `The Supreme Court examined the essential ingredients of Section 420 of the IPC and held that mere breach of contract does not automatically constitute cheating. The Court reiterated that dishonest intention at the time of making the promise is a sine qua non (indispensable requirement) for an offence under Section 420.`,
    keyHoldings: [
      '1. Dishonest intention at the time of inducement is essential.',
      '2. A mere breach of contract is not enough to attract Section 420 IPC.',
      '3. The facts must show cheating and dishonest inducement from the inception.',
      '4. Each case must be examined on its own facts rather than mechanical summoning.',
      '5. The Court considered earlier precedents on the distinction between civil dispute and criminal cheating.'
    ],
    judgmentSnippet: `It is well settled that in order to establish an offence under Section 420 IPC, the prosecution must show that there was a dishonest intention right at the time of making the representation or promise. Mere inability of the accused to fulfill a subsequent promise does not turn a civil transaction into a criminal offence of cheating.`,
    fullJudgmentUrl: 'https://sci.gov.in/judgments/2020/5-scc-123',
    citedCases: [
      'Hridaya Ranjan Prasad Verma v. State of Bihar (2000) 4 SCC 168',
      'V.Y. Jose v. State of Gujarat (2009) 3 SCC 78'
    ],
    bindingPrecedentStatus: 'Binding law of the land under Article 141 of the Constitution of India.',
    isBookmarked: true
  },
  {
    id: 'case-kb-saha-2016',
    caseTitle: 'K. B. Saha and Sons v. Development Consultant Ltd',
    citation: '(2016) 8 SCC 412',
    court: 'Supreme Court of India',
    bench: 'Hon’ble Supreme Court of India',
    decisionDate: '08 Aug 2016',
    jurisdiction: 'Central',
    topics: ['Property Law', 'Registration Act', 'Contract', 'Tenancy'],
    sectionsDiscussed: ['Registration Act 1908 Section 17', 'Registration Act 1908 Section 49', 'Transfer of Property Act Section 107'],
    aiSummary: `The Supreme Court laid down landmark principles regarding the evidentiary value of unregistered documents. An unregistered lease deed requiring compulsory registration under Section 17 cannot be received as evidence of any transaction affecting the property, though it may be received for collateral purposes not affecting property rights.`,
    keyHoldings: [
      '1. A document requiring compulsory registration cannot be admitted to prove title or interest in property if unregistered.',
      '2. It can only be used for a collateral purpose that does not create or extinguish right or title.',
      '3. A lease for more than 1 year cannot be proved by an unregistered agreement.'
    ],
    judgmentSnippet: `Section 49 of the Registration Act strictly mandates that no document required by Section 17 to be registered shall affect any immovable property comprised therein unless it has been registered. Collateral purpose cannot be used as an evasion of registration.`,
    fullJudgmentUrl: 'https://sci.gov.in/judgments/2016/8-scc-412',
    citedCases: ['Rana Vidya Bhushan Singh v. Ratiram (1969) 1 UJ 86 (SC)'],
    bindingPrecedentStatus: 'Binding Supreme Court precedent on compulsory registration and collateral transactions.',
    isBookmarked: true
  },
  {
    id: 'case-vineet-narain-1998',
    caseTitle: 'Vineet Narain v. Union of India',
    citation: '(1998) 1 SCC 226',
    court: 'Supreme Court of India',
    bench: 'Hon’ble 3-Judge Bench (CJI J.S. Verma)',
    decisionDate: '18 Dec 1997',
    jurisdiction: 'Central',
    topics: ['Constitutional Law', 'Investigation', 'Public Authority', 'Anti-Corruption'],
    sectionsDiscussed: ['Constitution Article 32', 'Constitution Article 141', 'Delhi Special Police Establishment Act'],
    aiSummary: `The Supreme Court established landmark guidelines insulating the Central Bureau of Investigation (CBI) and Central Vigilance Commission (CVC) from political and executive interference, establishing the doctrine of continuing mandamus to oversee probe integrity in the Hawala case.`,
    keyHoldings: [
      '1. Rule of law requires independent criminal investigative agencies free from executive interference.',
      '2. Central Vigilance Commission given statutory status.',
      '3. Continuing mandamus exercised by Court to prevent derailment of high-profile corruption probes.'
    ],
    judgmentSnippet: `The rule of law requires that every investigation into a crime should be conducted without fear or favour and should not be derailed by the station or influence of the person suspected.`,
    fullJudgmentUrl: 'https://sci.gov.in/judgments/1998/1-scc-226',
    citedCases: ['Union of India v. Sushil Kumar Modi (1997) 4 SCC 770'],
    bindingPrecedentStatus: 'Landmark Constitution Bench precedent on investigative independence.',
    isBookmarked: false
  },
  {
    id: 'case-arnesh-kumar-2014',
    caseTitle: 'Arnesh Kumar v. State of Bihar',
    citation: '(2014) 8 SCC 273',
    court: 'Supreme Court of India',
    bench: 'Hon’ble Division Bench (Justice C.K. Prasad, Justice P.C. Ghose)',
    decisionDate: '02 Jul 2014',
    jurisdiction: 'Central',
    state: 'Bihar',
    topics: ['Arrest', 'Criminal Procedure', 'Personal Liberty', 'Dowry Harassment'],
    sectionsDiscussed: ['IPC Section 498A', 'CrPC Section 41', 'CrPC Section 41A'],
    aiSummary: `The Supreme Court issued mandatory directions restricting routine arrests in offences punishable with imprisonment up to 7 years (such as Section 498A IPC). Police officers must satisfy the checklist under Section 41 CrPC and issue notice of appearance under Section 41A CrPC instead of making mechanical arrests.`,
    keyHoldings: [
      '1. Police officers shall not automatically arrest accused when an offence punishable with imprisonment up to 7 years is registered.',
      '2. Notice of appearance under Section 41A must be served within 2 weeks of complaint.',
      '3. Failure to comply makes police officers liable for departmental action and contempt of court.'
    ],
    judgmentSnippet: `Arrest brings humiliation, curtails freedom and casts scars forever. No arrest can be made because it is lawful for the police officer to do so. The existence of the power to arrest is one thing, the justification for the exercise of it is quite another.`,
    fullJudgmentUrl: 'https://sci.gov.in/judgments/2014/8-scc-273',
    citedCases: ['Joginder Kumar v. State of U.P. (1994) 4 SCC 260'],
    bindingPrecedentStatus: 'Binding directions applicable to all police departments and Magistrate courts across India.',
    isBookmarked: true
  },
  {
    id: 'case-shreya-singhal-2015',
    caseTitle: 'Shreya Singhal v. Union of India',
    citation: '(2015) 5 SCC 1',
    court: 'Supreme Court of India',
    bench: 'Hon’ble Division Bench (Justice J. Chelameswar, Justice R.F. Nariman)',
    decisionDate: '24 Mar 2015',
    jurisdiction: 'Central',
    topics: ['Cyber Law', 'Freedom of Speech', 'Constitutional Law', 'IT Act'],
    sectionsDiscussed: ['IT Act Section 66A', 'Constitution Article 19(1)(a)', 'Constitution Article 19(2)'],
    aiSummary: `The Supreme Court struck down Section 66A of the Information Technology Act, 2000 in its entirety for being unconstitutionally vague, overbroad, and creating a chilling effect on freedom of speech and expression on the internet.`,
    keyHoldings: [
      '1. Section 66A does not satisfy the reasonable restrictions under Article 19(2).',
      '2. The clear and present danger / incitement test was applied over mere advocacy.',
      '3. Intermediary safe harbour under Section 79 read down to require court or government order.'
    ],
    judgmentSnippet: `Section 66A is cast so widely that virtually any opinion on any subject could be caught within its net... It takes within its sweep protected speech and must therefore fall in its entirety.`,
    fullJudgmentUrl: 'https://sci.gov.in/judgments/2015/5-scc-1',
    citedCases: ['Romesh Thappar v. State of Madras (1950) SCR 594'],
    bindingPrecedentStatus: 'Constitutionally strikes down statutory provision across the entire Union.',
    isBookmarked: false
  }
];

export const LEGAL_TOPICS: LegalTopic[] = [
  {
    id: 'topic-const',
    title: 'Constitutional Law',
    description: 'Fundamental rights, governance, judicial review, constitutional remedies & writs.',
    iconName: 'Landmark',
    totalActs: 3,
    totalJudgments: 412,
    featuredActs: ['Constitution of India (1950)'],
    recentUpdates: 'Right to privacy & digital data jurisprudence'
  },
  {
    id: 'topic-crim',
    title: 'Criminal Law',
    description: 'IPC, offences, penalties, bail, trials, police procedures & criminal defenses.',
    iconName: 'ShieldAlert',
    totalActs: 12,
    totalJudgments: 890,
    featuredActs: ['Indian Penal Code, 1860', 'Code of Criminal Procedure, 1973', 'Bharatiya Nyaya Sanhita, 2023'],
    recentUpdates: 'BNS and BNSS transition guidelines'
  },
  {
    id: 'topic-civ',
    title: 'Civil Law',
    description: 'Civil rights, disputes, remedies, contracts, injunctions & Civil Procedure Code.',
    iconName: 'Scale',
    totalActs: 18,
    totalJudgments: 654,
    featuredActs: ['Code of Civil Procedure, 1908', 'Specific Relief Act, 1963', 'Indian Contract Act, 1872'],
    recentUpdates: 'Commercial courts expedited procedures'
  },
  {
    id: 'topic-prop',
    title: 'Property Law',
    description: 'Land, registration, transfer, lease, tenancy, title deeds & partition rights.',
    iconName: 'Building',
    totalActs: 9,
    totalJudgments: 530,
    featuredActs: ['Transfer of Property Act, 1882', 'The Registration Act, 1908', 'RERA, 2016'],
    recentUpdates: 'Compulsory e-registration notifications'
  },
  {
    id: 'topic-fam',
    title: 'Family Law',
    description: 'Marriage, divorce, maintenance, succession, guardianship & adoption laws.',
    iconName: 'HeartHandshake',
    totalActs: 8,
    totalJudgments: 380,
    featuredActs: ['Hindu Marriage Act, 1955', 'Special Marriage Act, 1954', 'Domestic Violence Act, 2005'],
    recentUpdates: 'Supreme Court maintenance calculation guidelines'
  },
  {
    id: 'topic-lab',
    title: 'Labour & Employment',
    description: 'Labour laws, workplace rights, gratuity, PF, termination & labour codes.',
    iconName: 'Briefcase',
    totalActs: 14,
    totalJudgments: 420,
    featuredActs: ['Industrial Disputes Act, 1947', 'Payment of Gratuity Act, 1972', 'POSH Act, 2013'],
    recentUpdates: 'New Labour Codes rollout status'
  },
  {
    id: 'topic-cons',
    title: 'Consumer Protection',
    description: 'Consumer rights, unfair trade practices, e-commerce grievances & CCPA rules.',
    iconName: 'ShoppingBag',
    totalActs: 4,
    totalJudgments: 290,
    featuredActs: ['Consumer Protection Act, 2019', 'E-Commerce Rules, 2020'],
    recentUpdates: 'Dark pattern regulatory guidelines'
  },
  {
    id: 'topic-comp',
    title: 'Company Law',
    description: 'Companies Act, compliance, director liabilities, insolvency (IBC) & NCLT.',
    iconName: 'Building2',
    totalActs: 6,
    totalJudgments: 470,
    featuredActs: ['Companies Act, 2013', 'Insolvency and Bankruptcy Code, 2016'],
    recentUpdates: 'MCA simplified electronic filing norms'
  },
  {
    id: 'topic-cyber',
    title: 'Cyber Law',
    description: 'IT Act, cybercrime, data protection, digital signatures & electronic evidence.',
    iconName: 'Terminal',
    totalActs: 5,
    totalJudgments: 210,
    featuredActs: ['Information Technology Act, 2000', 'Digital Personal Data Protection Act, 2023'],
    recentUpdates: 'DPDP Act rules formulation'
  },
  {
    id: 'topic-ip',
    title: 'Intellectual Property',
    description: 'Trademarks, copyrights, patents, design protection & infringement remedies.',
    iconName: 'Sparkles',
    totalActs: 7,
    totalJudgments: 315,
    featuredActs: ['Trade Marks Act, 1999', 'Copyright Act, 1957', 'Patents Act, 1970'],
    recentUpdates: 'Delhi High Court IP division practice rules'
  },
  {
    id: 'topic-tax',
    title: 'Taxation Law',
    description: 'Direct taxes, Income Tax Act, GST statutory framework, assessments & appeals.',
    iconName: 'Receipt',
    totalActs: 8,
    totalJudgments: 610,
    featuredActs: ['Income Tax Act, 1961', 'Central Goods and Services Tax Act, 2017'],
    recentUpdates: 'Faceless assessment appellate jurisprudence'
  },
  {
    id: 'topic-mv',
    title: 'Motor Vehicle & Accident Law',
    description: 'Motor Vehicles Act, third-party liability, compensation claims & MACT procedures.',
    iconName: 'Car',
    totalActs: 3,
    totalJudgments: 340,
    featuredActs: ['Motor Vehicles Act, 1988', 'Motor Vehicles (Amendment) Act, 2019'],
    recentUpdates: 'Detailed accident report (DAR) timelines'
  }
];

export const SAMPLE_UPLOADED_DOC: UploadedLegalDocument = {
  id: 'doc-agreement-to-sell',
  fileName: 'Agreement to Sell.pdf',
  fileSize: '2.4 MB',
  fileType: 'PDF',
  pageCount: 12,
  uploadDate: '15 Mar 2023',
  parties: {
    sellerOrFirstParty: 'Mr. Rajesh Kumar',
    buyerOrSecondParty: 'Ms. Priya Sharma',
    witnesses: ['Mr. Anand Verma', 'Mr. K. N. Rao']
  },
  propertyOrSubject: 'Residential plot No. 42, Jubilee Hills Layout, Hyderabad',
  agreementDate: '15 Mar 2023',
  summary: 'This document is an Agreement to Sell for immovable property. It outlines the parties, property details, payment terms, and conditions for registration.',
  extractedClauses: [
    {
      title: 'Clause 3 — Total Consideration & Earnest Money',
      text: 'The total agreed sale consideration is ₹1,45,00,000/-. The Purchaser has paid ₹20,00,000/- as earnest money via RTGS dated 15.03.2023.',
      riskNote: 'Balance payment milestone has strict 90-day time essence stipulation.'
    },
    {
      title: 'Clause 7 — Title Verification & Encumbrance Free',
      text: 'The Vendor assures and covenants that the schedule property is free from all mortgages, charges, litigation, tax dues, or third-party claims.',
      riskNote: 'Standard vendor warranty. Independent encumbrance certificate (EC) search advised.'
    },
    {
      title: 'Clause 11 — Default & Specific Performance',
      text: 'In the event of default by Vendor in executing Sale Deed upon receipt of balance, Purchaser is entitled to specific performance under Specific Relief Act.',
      riskNote: 'Aligned with amended Specific Relief Act 2018 (relief of specific performance is now statutory rule).'
    }
  ],
  legalReferencesFound: [
    'Indian Contract Act, 1872 - Section 10 & 73',
    'The Registration Act, 1908 - Section 17 & 49',
    'Transfer of Property Act, 1882 - Section 53A & 54',
    'Specific Relief Act, 1963 - Section 10'
  ],
  extractedRawText: `AGREEMENT TO SELL FOR IMMOVABLE PROPERTY
This Agreement to Sell is made on this 15th day of March, 2023 at Hyderabad:
BETWEEN:
Mr. Rajesh Kumar, S/o Late Sh. R. P. Kumar, residing at Flat 301, Lakeview Apts, Hyderabad (hereinafter referred to as the 'VENDOR', which expression shall include his legal heirs, executors and assigns) of the ONE PART;
AND:
Ms. Priya Sharma, D/o Sh. V. K. Sharma, residing at Villa 12, Green Meadows, Hyderabad (hereinafter referred to as the 'PURCHASER') of the OTHER PART.

WHEREAS the Vendor is the absolute and exclusive owner of Residential Plot No. 42, Jubilee Hills Layout, Hyderabad measuring 350 square yards, acquired vide registered Sale Deed Doc No. 4120/2012 registered at SRO Banjara Hills;
AND WHEREAS the Vendor has agreed to sell and Purchaser has agreed to purchase the said property for a total sale consideration of Rs. 1,45,00,000/- (Rupees One Crore Forty-Five Lakhs only)...`
};

export const INITIAL_FEEDBACK_REPORTS: FeedbackReport[] = [
  {
    id: 'fb-1',
    type: 'Incorrect Citation',
    userEmail: 'rahul.s@example.com',
    description: 'Incorrect citation in answer regarding CrPC 438 vs 439 scope in High Court',
    contextUrl: '/ask-law-bot',
    status: 'Open',
    submittedAt: '1 hour ago'
  },
  {
    id: 'fb-2',
    type: 'Outdated Section',
    userEmail: 'priya123@example.com',
    description: 'Outdated section information: IT Act 66A was referenced as active in older query log',
    contextUrl: '/acts-sections',
    status: 'In Review',
    submittedAt: '5 hours ago'
  },
  {
    id: 'fb-3',
    type: 'Extraction Issue',
    userEmail: 'sneha@univ.edu',
    description: 'Scanned stamp paper in tenancy agreement caused party name typo on page 1',
    contextUrl: '/document-analysis',
    status: 'Resolved',
    submittedAt: '1 day ago',
    resolutionNotes: 'OCR contrast preprocessing updated for stamp paper headers.'
  }
];

export const INITIAL_SYNC_LOGS: SyncJobLog[] = [
  {
    id: 'sync-1',
    sourceName: 'India Code',
    startTime: '2026-10-28 02:00:00 UTC',
    finishTime: '2026-10-28 02:14:32 UTC',
    status: 'Success',
    newDocs: 42,
    updatedDocs: 15,
    duplicateDocs: 812,
    failedDocs: 0,
    details: 'Completed scheduled incremental sync. 15 amendments ingested and cross-referenced with BNS tables.'
  },
  {
    id: 'sync-2',
    sourceName: 'Supreme Court Judgments Portal',
    startTime: '2026-10-29 03:00:00 UTC',
    finishTime: '2026-10-29 03:22:10 UTC',
    status: 'Success',
    newDocs: 18,
    updatedDocs: 4,
    duplicateDocs: 620,
    failedDocs: 0,
    details: 'Weekly reportable judgments ingested with headnotes and citations cross-checked.'
  },
  {
    id: 'sync-3',
    sourceName: 'Gazette of India (eGazette)',
    startTime: '2026-10-30 18:30:00 UTC',
    finishTime: 'In progress',
    status: 'In Progress',
    newDocs: 7,
    updatedDocs: 2,
    duplicateDocs: 110,
    failedDocs: 0,
    details: 'Downloading Part II Section 3 extraordinary notifications...'
  }
];
