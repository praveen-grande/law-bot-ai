import { SupportedLanguage } from '../types/legal';

export interface TranslationDictionary {
  nav: {
    govIndia: string;
    ministry: string;
    portalSubtitle: string;
    searchPlaceholder: string;
    searchBtn: string;
    verifiedStamp: string;
    motto: string;
    roleCitizen: string;
    roleAdmin: string;
    roleSuperAdmin: string;
    selectRole: string;
    citizenDesc: string;
    adminDesc: string;
    superAdminDesc: string;
    signIn: string;
    accessPortal: string;
    signOut: string;
    profilePreferences: string;
    savedResearch: string;
    fontLabel: string;
  };
  sidebar: {
    newQuery: string;
    sectionCitizen: string;
    dashboard: string;
    askLawBot: string;
    legalSearch: string;
    sectionStatutes: string;
    actsSections: string;
    caseLawExplorer: string;
    docAnalysis: string;
    legalTopics: string;
    lawComparison: string;
    myResearch: string;
    chatHistory: string;
    helpSupport: string;
    sectionAdmin: string;
    adminDesk: string;
    usersRegistry: string;
    sourceSyncRegistry: string;
    legalDatasets: string;
    systemHealth: string;
    sectionSuperAdmin: string;
    superAdminConsole: string;
    jurisdictionFooter: string;
    footerVerified: string;
  };
  dashboard: {
    workspaceTag: string;
    welcomeBack: string;
    welcomeSubtitle: string;
    askLawBotBtn: string;
    uploadDocBtn: string;
    quickToolsTitle: string;
    savedDossier: string;
    savedSections: string;
    savedJudgments: string;
    savedDocuments: string;
    recentQueriesTitle: string;
    viewAll: string;
    historyBtn: string;
  };
  landing: {
    emblemMinistry: string;
    heroTitle: string;
    heroSubtitle: string;
    searchPlaceholderLanding: string;
    searchBtn: string;
    popularLabel: string;
    statActs: string;
    statJudgments: string;
    statLanguages: string;
    statGrounding: string;
    pillarsTitle: string;
    pillarsSubtitle: string;
    pillarActs: string;
    pillarActsDesc: string;
    pillarCase: string;
    pillarCaseDesc: string;
    pillarAI: string;
    pillarAIDesc: string;
    pillarDoc: string;
    pillarDocDesc: string;
    viewActs: string;
    viewJudgments: string;
    viewConsultation: string;
    viewDoc: string;
    sourceReposTitle: string;
  };
  auth: {
    portalAuthTitle: string;
    portalAuthDesc: string;
    citizenRule: string;
    adminRule: string;
    leastPrivRule: string;
    citizenTab: string;
    adminTab: string;
    citizenBoxTitle: string;
    citizenBoxDesc: string;
    googleNameLabel: string;
    googleEmailLabel: string;
    googleSignInBtn: string;
    presetLabel: string;
    adminBoxTitle: string;
    adminBoxDesc: string;
    officialEmailLabel: string;
    officialPasswordLabel: string;
    officialSignInBtn: string;
    presetsTitle: string;
    backHome: string;
  };
  askLawBot: {
    deskTitle: string;
    deskSubtitle: string;
    officialAI: string;
    howAssist: string;
    howAssistDesc: string;
    userQueryLabel: string;
    statutoryClarification: string;
    ministryVerified: string;
    viewInActs: string;
    copy: string;
    groundedSources: string;
    viewBtn: string;
    sendBtn: string;
    quickQueries: string;
    inputPlaceholder: string;
    disclaimer: string;
    closeBtn: string;
    citationRecordTitle: string;
    titleLabel: string;
    authorityLabel: string;
    sectionRefLabel: string;
    sourceRepoLabel: string;
    copiedToast: string;
    searchingState: string;
  };
  acts: {
    explorerTitle: string;
    repoLink: string;
    searchPlaceholder: string;
    sectionPrefix: string;
    prescribedPenalty: string;
    simpleExplanation: string;
    keyIngredients: string;
    bookmark: string;
    bookmarked: string;
    share: string;
    copyCitation: string;
    statutoryTextLabel: string;
  };
  cases: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    searchBtn: string;
    courtLabel: string;
    allCourts: string;
    topicLabel: string;
    allTopics: string;
    resultsFound: string;
  };
  search: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    searchBtn: string;
    tabAll: string;
    tabActs: string;
    tabJudgments: string;
    tabNotifications: string;
  };
  admin: {
    superAdminTitle: string;
    superAdminSubtitle: string;
    userMgmtTitle: string;
    feedbackTitle: string;
    sourcesTitle: string;
    healthTitle: string;
    opsConsoleTitle: string;
  };
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    nav: {
      govIndia: 'Government of India',
      ministry: 'Ministry of Law & Justice',
      portalSubtitle: 'National Legal Intelligence & Statutory Portal',
      searchPlaceholder: 'Search Central/State Acts, Section numbers, or Supreme Court citations...',
      searchBtn: 'Search',
      verifiedStamp: 'NIC / e-Courts Verified',
      motto: 'Satyameva Jayate',
      roleCitizen: 'Citizen / Advocate',
      roleAdmin: 'Operations Admin',
      roleSuperAdmin: 'Super Admin',
      selectRole: 'Select Official Role',
      citizenDesc: 'Google SSO verified citizen access',
      adminDesc: 'Official credential access, logs & sync',
      superAdminDesc: 'Admin provisioning & statutory registry',
      signIn: 'Sign In',
      accessPortal: 'Access Portal',
      signOut: 'Sign Out',
      profilePreferences: 'Profile & Preferences',
      savedResearch: 'Saved Research',
      fontLabel: 'Font:'
    },
    sidebar: {
      newQuery: '+ New Legal Query',
      sectionCitizen: 'CITIZEN SERVICES',
      dashboard: 'Dashboard',
      askLawBot: 'Ask Law Bot',
      legalSearch: 'Legal Search',
      sectionStatutes: 'STATUTORY REPOSITORY',
      actsSections: 'Acts & Sections',
      caseLawExplorer: 'Case Law Explorer',
      docAnalysis: 'Document Analysis',
      legalTopics: 'Legal Topics',
      lawComparison: 'Law Comparison',
      myResearch: 'My Research',
      chatHistory: 'Chat History',
      helpSupport: 'Helpdesk & Support',
      sectionAdmin: 'ADMINISTRATIVE CONTROL',
      adminDesk: 'Admin Dashboard',
      usersRegistry: 'Users Registry',
      sourceSyncRegistry: 'Source Sync Registry',
      legalDatasets: 'Legal Datasets',
      systemHealth: 'System Health & Logs',
      sectionSuperAdmin: 'SUPER ADMIN',
      superAdminConsole: 'Super Admin Console',
      jurisdictionFooter: 'India Code / e-Courts Grid',
      footerVerified: 'Verified against Ministry of Law & Justice official records.'
    },
    dashboard: {
      workspaceTag: 'National Judicial Intelligence Workspace',
      welcomeBack: 'Welcome',
      welcomeSubtitle: 'Citizen / Advocate Research Desk. Direct access to 25,000+ Indian Acts, Supreme Court judgments, and statutory contracts analysis.',
      askLawBotBtn: 'Ask Law Bot',
      uploadDocBtn: 'Upload Document',
      quickToolsTitle: 'QUICK LEGAL RESEARCH TOOLS',
      savedDossier: 'SAVED RESEARCH DOSSIER',
      savedSections: 'Saved Sections',
      savedJudgments: 'Judgments',
      savedDocuments: 'Documents',
      recentQueriesTitle: 'RECENT RESEARCH QUERIES',
      viewAll: 'View All',
      historyBtn: 'History'
    },
    landing: {
      emblemMinistry: 'Ministry of Law & Justice, Govt. of India',
      heroTitle: 'National Legal Intelligence Portal',
      heroSubtitle: 'Search verified Indian statutory codes, Supreme Court & High Court judgments, and legal notifications with evidence-grounded AI citations.',
      searchPlaceholderLanding: 'Ask a legal question... (e.g., Explain IPC Section 420 in simple language)',
      searchBtn: 'Search',
      popularLabel: 'Popular Topics:',
      statActs: 'Acts & Statutory Rules',
      statJudgments: 'Reported Judgments',
      statLanguages: 'Active Languages',
      statGrounding: 'Official Grounding',
      pillarsTitle: 'Comprehensive Legal Architecture for India',
      pillarsSubtitle: 'Structured access to legislation, binding judicial authorities, and statutory contract assessment.',
      pillarActs: 'Acts & Sections Explorer',
      pillarActsDesc: 'Explore India Code statutes, section texts, amendments, and simplified explanations.',
      pillarCase: 'Case Law & Precedents',
      pillarCaseDesc: 'Search landmark rulings from the Supreme Court of India and High Courts with headnotes.',
      pillarAI: 'AI Legal Assistant',
      pillarAIDesc: 'Ask nuanced legal inquiries and obtain evidence-backed answers with statutory cross-links.',
      pillarDoc: 'Document Analysis',
      pillarDocDesc: 'Upload agreements, petitions, or notices for statutory risk scanning and compliance audit.',
      viewActs: 'View Acts',
      viewJudgments: 'Search Judgments',
      viewConsultation: 'Start Consultation',
      viewDoc: 'Analyze Document',
      sourceReposTitle: 'Official Statutory Source Repositories'
    },
    auth: {
      portalAuthTitle: 'National Judicial Portal Authentication',
      portalAuthDesc: 'Single gateway for citizen legal research, advocate briefs, and department administrative consoles.',
      citizenRule: 'Citizens & Advocates: Strict Google Single Sign-On (SSO).',
      adminRule: 'Admin & Super Admin: Official department credentials only (no Google auth).',
      leastPrivRule: 'Least-Privilege: Super Admin provisions and revokes administrative access.',
      citizenTab: 'Citizen / Advocate (Google)',
      adminTab: 'Department Official (Admin Creds)',
      citizenBoxTitle: 'Citizen Single Sign-On (Google Authentication)',
      citizenBoxDesc: 'General citizens, researchers, and practicing advocates authenticate directly with Google account.',
      googleNameLabel: 'Google Account Name',
      googleEmailLabel: 'Google Email Address',
      googleSignInBtn: 'Sign In with Google',
      presetLabel: 'Preset Citizen Account:',
      adminBoxTitle: 'Official Department Credentials',
      adminBoxDesc: 'Admins and Super Admins authenticate strictly with username/password. Google authentication is disallowed for administrative access.',
      officialEmailLabel: 'Official Email ID',
      officialPasswordLabel: 'Official Password',
      officialSignInBtn: 'Official Sign In',
      presetsTitle: 'Official Credentials (Presets):',
      backHome: '← Back to National Portal'
    },
    askLawBot: {
      deskTitle: 'National Statutory Consultation Desk',
      deskSubtitle: 'Citing verified Indian statutes from India Code & Supreme Court precedents',
      officialAI: 'Official AI',
      howAssist: 'How can Law Bot assist your legal research today?',
      howAssistDesc: 'Ask about Indian legal provisions, landmark case judgments, difference between civil breach and criminal fraud, or statutory procedures.',
      userQueryLabel: 'Citizen Query:',
      statutoryClarification: 'Statutory Clarification',
      ministryVerified: 'Ministry Verified',
      viewInActs: 'Read full statutory text in Acts Explorer',
      copy: 'Copy',
      groundedSources: 'Official Grounded Sources',
      viewBtn: 'View',
      sendBtn: 'Send',
      quickQueries: 'Quick Queries:',
      inputPlaceholder: 'Ask a legal question... (e.g., Can bail be granted under Section 420 IPC?)',
      disclaimer: 'Law Bot AI answers are grounded in official Indian statutes and judgments. Always verify critical facts with legal counsel.',
      closeBtn: 'Close',
      citationRecordTitle: 'Official Citation Record',
      titleLabel: 'Title:',
      authorityLabel: 'Issuing Authority / Court:',
      sectionRefLabel: 'Reference Section / Citation:',
      sourceRepoLabel: 'Official Source Repository:',
      copiedToast: 'Legal text copied to clipboard.',
      searchingState: 'Searching India Code database and Supreme Court precedents...'
    },
    acts: {
      explorerTitle: 'Acts & Sections',
      repoLink: 'India Code Official Repository',
      searchPlaceholder: 'Search sections in Act...',
      sectionPrefix: 'Section',
      prescribedPenalty: 'Prescribed Penalty:',
      simpleExplanation: 'Explanation in Simple Language',
      keyIngredients: 'Key Legal Ingredients:',
      bookmark: 'Bookmark',
      bookmarked: 'Bookmarked',
      share: 'Share',
      copyCitation: 'Copy Citation',
      statutoryTextLabel: 'Official Statutory Text (As enacted in the Gazette of India)'
    },
    cases: {
      title: 'Case Law Explorer',
      subtitle: 'Search reportable Supreme Court of India and High Court decisions, citations, and official judicial headnotes.',
      searchPlaceholder: 'Search case name, citation, legal issue (e.g. State of Maharashtra v. Rajesh Shah)...',
      searchBtn: 'Search',
      courtLabel: 'Court:',
      allCourts: 'All Courts',
      topicLabel: 'Legal Topic:',
      allTopics: 'All Topics',
      resultsFound: 'reportable judgments found'
    },
    search: {
      title: 'Legal Search',
      subtitle: 'Search Central & State Acts, Parliament legislation, Supreme Court precedents, and Gazette notifications.',
      searchPlaceholder: 'Search by Act, Section, Case name, citation, or legal keywords (e.g., Section 420, Fraud, Cheating)...',
      searchBtn: 'Search',
      tabAll: 'All',
      tabActs: 'Acts & Rules',
      tabJudgments: 'Judgments',
      tabNotifications: 'Notifications'
    },
    admin: {
      superAdminTitle: 'Super Admin Console',
      superAdminSubtitle: 'Sole authority to provision Admin credentials, manage statutory datasets, and govern legal RAG grounding.',
      userMgmtTitle: 'User Access & Role Management',
      feedbackTitle: 'Queries & Feedback Moderation',
      sourcesTitle: 'Legal Source Registry & Synchronization',
      healthTitle: 'System Health & Operational Telemetry',
      opsConsoleTitle: 'Operations Admin Console'
    }
  },

  hi: {
    nav: {
      govIndia: 'भारत सरकार',
      ministry: 'विधि एवं न्याय मंत्रालय',
      portalSubtitle: 'राष्ट्रीय विधिक आसूचना एवं सांविधिक पोर्टल',
      searchPlaceholder: 'केंद्रीय/राज्य अधिनियम, धारा संख्या या सर्वोच्च न्यायालय के निर्णय खोजें...',
      searchBtn: 'खोजें',
      verifiedStamp: 'एनआईसी / ई-कोर्ट्स सत्यापित',
      motto: 'सत्यमेव जयते',
      roleCitizen: 'नागरिक / अधिवक्ता',
      roleAdmin: 'विधिक अधिकारी',
      roleSuperAdmin: 'शीर्ष नियंत्रक (सुपर एडमिन)',
      selectRole: 'पोर्टल भूमिका चयन',
      citizenDesc: 'गूगल एसएसओ द्वारा सत्यापित नागरिक प्रवेश',
      adminDesc: 'विभागीय क्रेडेंशियल, लॉग्स एवं सिंक',
      superAdminDesc: 'एडमिन क्रेडेंशियल एवं सांविधिक रजिस्ट्री',
      signIn: 'प्रवेश',
      accessPortal: 'पोर्टल खोलें',
      signOut: 'लॉग आउट',
      profilePreferences: 'प्रोफ़ाइल एवं प्राथमिकताएं',
      savedResearch: 'मेरी विधिक फ़ाइलें',
      fontLabel: 'अक्षर:'
    },
    sidebar: {
      newQuery: '+ नया विधिक परामर्श',
      sectionCitizen: 'नागरिक सेवाएं',
      dashboard: 'डैशबोर्ड',
      askLawBot: 'विधिक सलाहकार',
      legalSearch: 'विधिक खोज',
      sectionStatutes: 'सांविधिक संग्रह',
      actsSections: 'अधिनियम एवं धाराएं',
      caseLawExplorer: 'निर्णय एवं नज़ीरें',
      docAnalysis: 'दस्तावेज़ विश्लेषण',
      legalTopics: 'विधिक विषय',
      lawComparison: 'प्रावधान तुलना',
      myResearch: 'मेरी विधिक फाइल',
      chatHistory: 'सत्र इतिहास',
      helpSupport: 'नागरिक सहायता',
      sectionAdmin: 'प्रशासनिक नियंत्रण',
      adminDesk: 'प्रशासनिक डैशबोर्ड',
      usersRegistry: 'उपयोगकर्ता पंजीयन',
      sourceSyncRegistry: 'स्रोत तुल्यकालन',
      legalDatasets: 'डेटासेट प्रबंधन',
      systemHealth: 'सिस्टम स्वास्थ्य',
      sectionSuperAdmin: 'शीर्ष नियंत्रण',
      superAdminConsole: 'सुपर एडमिन कंसोल',
      jurisdictionFooter: 'भारत कोड / ई-कोर्ट्स ग्रिड',
      footerVerified: 'विधि एवं न्याय मंत्रालय, भारत सरकार के आधिकारिक स्रोतों से सत्यापित।'
    },
    dashboard: {
      workspaceTag: 'विधिक कार्यक्षेत्र',
      welcomeBack: 'स्वागत है',
      welcomeSubtitle: 'नागरिक एवं अधिवक्ता अनुसंधान पटल। 25,000+ भारतीय अधिनियमों, उच्चतम न्यायालय के निर्णयों और अनुबंध विश्लेषण तक सीधी पहुंच।',
      askLawBotBtn: 'विधिक प्रश्न पूछें',
      uploadDocBtn: 'दस्तावेज़ अपलोड करें',
      quickToolsTitle: 'त्वरित विधिक अनुसंधान सेवाएं',
      savedDossier: 'विधिक संकलन',
      savedSections: 'सुरक्षित धाराएं',
      savedJudgments: 'न्यायिक निर्णय',
      savedDocuments: 'दस्तावेज़',
      recentQueriesTitle: 'हाल की विधिक पूछताछ',
      viewAll: 'सभी देखें',
      historyBtn: 'सत्र इतिहास'
    },
    landing: {
      emblemMinistry: 'विधि एवं न्याय मंत्रालय, भारत सरकार',
      heroTitle: 'राष्ट्रीय विधिक आसूचना पोर्टल',
      heroSubtitle: 'भारतीय संसद के अधिनियम, सर्वोच्च न्यायालय एवं उच्च न्यायालयों के विधि-निर्णयों का आधिकारिक डिजिटल भंडार।',
      searchPlaceholderLanding: 'विधिक प्रश्न पूछें... (उदा. भारतीय दंड संहिता की धारा 420 की सरल व्याख्या)',
      searchBtn: 'खोजें',
      popularLabel: 'अक्सर पूछे जाने वाले विषय:',
      statActs: 'अधिनियम एवं नियम',
      statJudgments: 'न्यायिक निर्णय',
      statLanguages: 'सक्रिय भाषाएं',
      statGrounding: 'आधिकारिक स्रोत सत्यापन',
      pillarsTitle: 'भारत की संपूर्ण विधिक संरचना',
      pillarsSubtitle: 'कानूनों, बाध्यकारी अदालती फैसलों और कानूनी दस्तावेजों की संरचित पहुंच।',
      pillarActs: 'अधिनियम एवं धाराएं अन्वेषक',
      pillarActsDesc: 'भारत कोड संहिताओं, धाराओं के मूल पाठ, संशोधनों और सरल व्याख्याओं का अध्ययन करें।',
      pillarCase: 'निर्णय एवं न्यायिक नज़ीरें',
      pillarCaseDesc: 'भारत के सर्वोच्च न्यायालय और उच्च न्यायालयों के ऐतिहासिक निर्णयों की खोज करें।',
      pillarAI: 'एआई विधिक सहायक',
      pillarAIDesc: 'जटिल कानूनी प्रश्न पूछें और आधिकारिक अधिनियमों के संदर्भ के साथ सटीक उत्तर प्राप्त करें।',
      pillarDoc: 'दस्तावेज़ एवं अनुबंध विश्लेषण',
      pillarDocDesc: 'कानूनी जोखिमों और अनुपालन जांच के लिए अनुबंधों और समझौतों का त्वरित विश्लेषण।',
      viewActs: 'अधिनियम देखें',
      viewJudgments: 'निर्णय खोजें',
      viewConsultation: 'परामर्श शुरू करें',
      viewDoc: 'दस्तावेज़ जांचें',
      sourceReposTitle: 'आधिकारिक सांविधिक स्रोत एवं रजिस्ट्री'
    },
    auth: {
      portalAuthTitle: 'राष्ट्रीय विधिक पोर्टल प्रमाणीकरण',
      portalAuthDesc: 'नागरिक विधिक अनुसंधान, अधिवक्ता कार्य और विभागीय प्रशासनिक कंसोल का एकल प्रवेश द्वार।',
      citizenRule: 'नागरिक एवं अधिवक्ता: केवल गूगल सिंगल साइन-ऑन (SSO)।',
      adminRule: 'एडमिन एवं सुपर एडमिन: केवल आधिकारिक विभागीय क्रेडेंशियल (गूगल लॉगिन निषिद्ध)।',
      leastPrivRule: 'न्यूनतम विशेषाधिकार: केवल सुपर एडमिन ही प्रशासनिक क्रेडेंशियल बना सकता है।',
      citizenTab: 'नागरिक / अधिवक्ता (गूगल)',
      adminTab: 'विभागीय अधिकारी (क्रेडेंशियल)',
      citizenBoxTitle: 'नागरिक एकल साइन-ऑन (गूगल प्रमाणीकरण)',
      citizenBoxDesc: 'आम नागरिक, शोधकर्ता और अधिवक्ता सीधे गूगल खाते से लॉगिन करते हैं।',
      googleNameLabel: 'गूगल खाता नाम',
      googleEmailLabel: 'गूगल ईमेल पता',
      googleSignInBtn: 'गूगल से लॉगिन करें',
      presetLabel: 'निर्धारित नागरिक खाता:',
      adminBoxTitle: 'आधिकारिक विभागीय क्रेडेंशियल',
      adminBoxDesc: 'एडमिन और सुपर एडमिन क्रेडेंशियल से लॉगिन करते हैं। प्रशासनिक कार्यों के लिए गूगल लॉगिन उपलब्ध नहीं है।',
      officialEmailLabel: 'आधिकारिक ईमेल आईडी',
      officialPasswordLabel: 'आधिकारिक पासवर्ड',
      officialSignInBtn: 'प्रशासनिक लॉगिन',
      presetsTitle: 'आधिकारिक क्रेडेंशियल्स:',
      backHome: '← वापस मुख्य पोर्टल'
    },
    askLawBot: {
      deskTitle: 'राष्ट्रीय सांविधिक परामर्श डेस्क',
      deskSubtitle: 'भारत कोड और सर्वोच्च न्यायालय के सत्यापित स्रोतों से उद्धृत',
      officialAI: 'आधिकारिक एआई',
      howAssist: 'लॉ बॉट आज आपके विधिक अनुसंधान में कैसे सहायता कर सकता है?',
      howAssistDesc: 'भारतीय कानूनी प्रावधानों, ऐतिहासिक निर्णयों, दीवानी और आपराधिक मामलों के अंतर अथवा प्रक्रियाओं के बारे में पूछें।',
      userQueryLabel: 'नागरिक प्रश्न:',
      statutoryClarification: 'सांविधिक स्पष्टीकरण',
      ministryVerified: 'मंत्रालय सत्यापित',
      viewInActs: 'अधिनियम अन्वेषक में पूरा पाठ पढ़ें',
      copy: 'प्रतिलिपि',
      groundedSources: 'सत्यापित सांविधिक स्रोत',
      viewBtn: 'विवरण',
      sendBtn: 'भेजें',
      quickQueries: 'शीघ्र प्रश्न:',
      inputPlaceholder: 'विधिक प्रश्न पूछें... (उदा. क्या धारा 420 में जमानत मिल सकती है?)',
      disclaimer: 'लॉ बॉट एआई के उत्तर आधिकारिक भारतीय अधिनियमों और निर्णयों पर आधारित हैं। महत्वपूर्ण मामलों में अधिवक्ता से सलाह अवश्य लें।',
      closeBtn: 'बंद करें',
      citationRecordTitle: 'सांविधिक साक्ष्य रिकॉर्ड',
      titleLabel: 'शीर्षक:',
      authorityLabel: 'न्यायालय / प्राधिकरण:',
      sectionRefLabel: 'धारा / निर्णय संदर्भ:',
      sourceRepoLabel: 'आधिकारिक स्रोत भंडार:',
      copiedToast: 'विधिक पाठ क्लिपबोर्ड में कॉपी किया गया।',
      searchingState: 'भारत कोड और सर्वोच्च न्यायालय के निर्णयों की खोज जारी है...'
    },
    acts: {
      explorerTitle: 'अधिनियम एवं धाराएं',
      repoLink: 'भारत कोड आधिकारिक भंडार',
      searchPlaceholder: 'अधिनियम में धारा खोजें...',
      sectionPrefix: 'धारा',
      prescribedPenalty: 'दण्ड प्रावधान:',
      simpleExplanation: 'सरल व्याख्या',
      keyIngredients: 'आवश्यक विधिक तत्व:',
      bookmark: 'सुरक्षित करें',
      bookmarked: 'सुरक्षित',
      share: 'साझा करें',
      copyCitation: 'उद्धरण कॉपी करें',
      statutoryTextLabel: 'आधिकारिक सांविधिक पाठ (भारत के राजपत्र में यथा अधिनियमित)'
    },
    cases: {
      title: 'निर्णय एवं नज़ीरें',
      subtitle: 'सर्वोच्च न्यायालय एवं उच्च न्यायालयों के विधि-निर्णयों, उद्धरणों और आधिकारिक न्यायिक टिप्पणियों की खोज करें।',
      searchPlaceholder: 'वाद का नाम, उद्धरण या कानूनी मुद्दा खोजें...',
      searchBtn: 'खोजें',
      courtLabel: 'न्यायालय:',
      allCourts: 'सभी न्यायालय',
      topicLabel: 'विधिक विषय:',
      allTopics: 'सभी विषय',
      resultsFound: 'न्यायिक निर्णय उपलब्ध'
    },
    search: {
      title: 'विधिक खोज',
      subtitle: 'केंद्रीय व राज्य अधिनियम, संसद के कानून, अदालती निर्णय और राजपत्र अधिसूचनाएं खोजें।',
      searchPlaceholder: 'अधिनियम, धारा, केस या विधिक कीवर्ड खोजें...',
      searchBtn: 'खोजें',
      tabAll: 'सभी',
      tabActs: 'अधिनियम एवं नियम',
      tabJudgments: 'न्यायिक निर्णय',
      tabNotifications: 'अधिसूचनाएं'
    },
    admin: {
      superAdminTitle: 'सुपर एडमिन कंसोल',
      superAdminSubtitle: 'एडमिन क्रेडेंशियल जारी करने, विधिक डेटासेट प्रबंधित करने और आरएजी सत्यापन का शीर्ष अधिकार।',
      userMgmtTitle: 'उपयोगकर्ता पंजीयन एवं भूमिका प्रबंधन',
      feedbackTitle: 'विधिक साक्ष्य ऑडिट एवं प्रतिक्रिया',
      sourcesTitle: 'स्रोत तुल्यकालन एवं पंजीयन',
      healthTitle: 'सिस्टम स्वास्थ्य एवं संचालन स्थिति',
      opsConsoleTitle: 'प्रशासनिक परिचालन कंसोल'
    }
  },

  te: {
    nav: {
      govIndia: 'భారత ప్రభుత్వం',
      ministry: 'న్యాయ మంత్రిత్వ శాఖ',
      portalSubtitle: 'జాతీయ చట్టపరమైన ఇంటెలిజెన్స్ పోర్టల్',
      searchPlaceholder: 'కేంద్ర/రాష్ట్ర చట్టాలు, సెక్షన్ నంబర్లు లేదా తీర్పులను శోధించండి...',
      searchBtn: 'శోధించండి',
      verifiedStamp: 'NIC / ఇ-కోర్టులు ధృవీకరించాయి',
      motto: 'సత్యమేవ జయతే',
      roleCitizen: 'పౌరుడు / న్యాయవాది',
      roleAdmin: 'ఆపరేషన్స్ అడ్మిన్',
      roleSuperAdmin: 'సూపర్ అడ్మిన్',
      selectRole: 'పోర్టల్ పాత్రను ఎంచుకోండి',
      citizenDesc: 'Google SSO ద్వారా ధృవీకరించబడిన పౌర ప్రవేశం',
      adminDesc: 'అధికారిక ఆధారాలు, లాగ్‌లు మరియు సమకాలీకరణ',
      superAdminDesc: 'అడ్మిన్ ప్రొవిజనింగ్ & చట్టబద్ధమైన రిజిస్ట్రీ',
      signIn: 'లాగిన్',
      accessPortal: 'పోర్టల్ తెరవండి',
      signOut: 'లాగౌట్',
      profilePreferences: 'ప్రొఫైల్ & ప్రాధాన్యతలు',
      savedResearch: 'నా పరిశోధన పత్రాలు',
      fontLabel: 'ఫాంట్:'
    },
    sidebar: {
      newQuery: '+ కొత్త న్యాయ విచారణ',
      sectionCitizen: 'పౌర సేవలు',
      dashboard: 'డాష్‌బోర్డ్',
      askLawBot: 'విచారణ సహాయకుడు',
      legalSearch: 'చట్టపరమైన శోధన',
      sectionStatutes: 'చట్టబద్ధమైన భాండాగారం',
      actsSections: 'చట్టాలు & సెక్షన్లు',
      caseLawExplorer: 'కేస్ లా ఎక్స్‌ప్లోరర్',
      docAnalysis: 'పత్ర విశ్లేషణ',
      legalTopics: 'చట్టపరమైన అంశాలు',
      lawComparison: 'చట్టాల పోలిక',
      myResearch: 'నా పరిశోధన',
      chatHistory: 'చాట్ చరిత్ర',
      helpSupport: 'సహాయం & మద్దతు',
      sectionAdmin: 'పరిపాలనా నియంత్రణ',
      adminDesk: 'అడ్మిన్ డాష్‌బోర్డ్',
      usersRegistry: 'వినియోగదారుల రిజిస్ట్రీ',
      sourceSyncRegistry: 'మూల సమకాలీకరణ',
      legalDatasets: 'డేటాసెట్లు',
      systemHealth: 'సిస్టమ్ ఆరోగ్యం',
      sectionSuperAdmin: 'సూపర్ అడ్మిన్',
      superAdminConsole: 'సూపర్ అడ్మిన్ కన్సోల్',
      jurisdictionFooter: 'ఇండియా కోడ్ / ఇ-కోర్టులు',
      footerVerified: 'న్యాయ మంత్రిత్వ శాఖ అధికారిక రికార్డుల ప్రకారం ధృవీకరించబడింది.'
    },
    dashboard: {
      workspaceTag: 'జాతీయ న్యాయ ఇంటెలిజెన్స్ వర్క్‌స్పేస్',
      welcomeBack: 'స్వాగతం',
      welcomeSubtitle: 'పౌరులు & న్యాయవాదుల పరిశోధన డెస్క్. 25,000+ భారతీయ చట్టాలు, సుప్రీం కోర్టు తీర్పులు మరియు పత్రాల విశ్లేషణ.',
      askLawBotBtn: 'లా బాట్‌ను అడగండి',
      uploadDocBtn: 'పత్రాన్ని అప్‌లోడ్ చేయండి',
      quickToolsTitle: 'త్వరిత చట్టపరమైన పరిశోధన సాధనాలు',
      savedDossier: 'సేవ్ చేసిన పరిశోధన పత్రాలు',
      savedSections: 'సేవ్ చేసిన సెక్షన్లు',
      savedJudgments: 'తీర్పులు',
      savedDocuments: 'పత్రాలు',
      recentQueriesTitle: 'ఇటీవలి పరిశోధన ప్రశ్నలు',
      viewAll: 'అన్నీ చూడండి',
      historyBtn: 'చరిత్ర'
    },
    landing: {
      emblemMinistry: 'న్యాయ మంత్రిత్వ శాఖ, భారత ప్రభుత్వం',
      heroTitle: 'జాతీయ చట్టపరమైన ఇంటెలిజెన్స్ పోర్టల్',
      heroSubtitle: 'భారతీయ చట్టాలు, సుప్రీం కోర్టు మరియు హైకోర్టు తీర్పులను AI ఆధారితంగా శోధించండి.',
      searchPlaceholderLanding: 'ఒక చట్టపరమైన ప్రశ్న అడగండి... (ఉదా: సెక్షన్ 420 గురించి వివరించండి)',
      searchBtn: 'శోధించండి',
      popularLabel: 'ప్రసిద్ధ అంశాలు:',
      statActs: 'చట్టాలు & నిబంధనలు',
      statJudgments: 'నివేదించబడిన తీర్పులు',
      statLanguages: 'క్రియాశీల భాషలు',
      statGrounding: 'అధికారిక ఆధారం',
      pillarsTitle: 'భారతదేశ సమగ్ర చట్టపరమైన నిర్మాణం',
      pillarsSubtitle: 'చట్టాలు, కోర్టు తీర్పులు మరియు ఒప్పందాల విశ్లేషణకు ప్రాప్యత.',
      pillarActs: 'చట్టాలు & సెక్షన్ల ఎక్స్‌ప్లోరర్',
      pillarActsDesc: 'ఇండియా కోడ్ చట్టాలు, సెక్షన్ల మూల పాఠాలు మరియు సరళమైన వివరణలను అన్వేషించండి.',
      pillarCase: 'తీర్పులు & పూర్వాపరాలు',
      pillarCaseDesc: 'సుప్రీం కోర్టు మరియు హైకోర్టుల ముఖ్యమైన తీర్పులను శోధించండి.',
      pillarAI: 'AI లీగల్ అసిస్టెంట్',
      pillarAIDesc: 'చట్టపరమైన ప్రశ్నలను అడగండి మరియు చట్టాల ఆధారాలతో సమాధానాలు పొందండి.',
      pillarDoc: 'పత్ర విశ్లేషణ',
      pillarDocDesc: 'ఒప్పందాలు మరియు దరఖాస్తులను చట్టపరమైన విశ్లేషణ కోసం అప్‌లోడ్ చేయండి.',
      viewActs: 'చట్టాలను చూడండి',
      viewJudgments: 'తీర్పులను శోధించండి',
      viewConsultation: 'సంప్రదింపులను ప్రారంభించండి',
      viewDoc: 'పత్రాన్ని విశ్లేషించండి',
      sourceReposTitle: 'అధికారిక చట్టబద్ధమైన మూలాలు'
    },
    auth: {
      portalAuthTitle: 'జాతీయ న్యాయ పోర్టల్ ప్రామాణీకరణ',
      portalAuthDesc: 'పౌరులు, పరిశోధకులు మరియు విభాగ పరిపాలనా కన్సోల్ కోసం ఒకే ప్రవేశ ద్వారం.',
      citizenRule: 'పౌరులు & న్యాయవాదులు: Google Single Sign-On (SSO) ద్వారా మాత్రమే లాగిన్.',
      adminRule: 'అడ్మిన్ & సూపర్ అడ్మిన్: అధికారిక విభాగ ఆధారాలు మాత్రమే (Google లాగిన్ లేదు).',
      leastPrivRule: 'కనిష్ట హక్కులు: సూపర్ అడ్మిన్ మాత్రమే అడ్మిన్ ఆధారాలను జారీ చేయగలరు.',
      citizenTab: 'పౌరుడు / న్యాయవాది (Google)',
      adminTab: 'విభాగ అధికారి (అడ్మిన్ లాగిన్)',
      citizenBoxTitle: 'పౌర సింగిల్ సైన్-ఆన్ (Google Authentication)',
      citizenBoxDesc: 'సాధారణ పౌరులు మరియు న్యాయవాదులు నేరుగా Google ఖాతాతో ప్రామాణీకరించబడతారు.',
      googleNameLabel: 'Google ఖాతా పేరు',
      googleEmailLabel: 'Google ఇమెయిల్ చిరునామా',
      googleSignInBtn: 'Google తో సైన్ ఇన్ చేయండి',
      presetLabel: 'పౌర ఖాతా నమూనా:',
      adminBoxTitle: 'అధికారిక విభాగ ఆధారాలు',
      adminBoxDesc: 'అడ్మిన్లు నేరుగా యూజర్‌నేమ్ మరియు పాస్‌వర్డ్‌తో లాగిన్ అవుతారు. పరిపాలనా ఖాతాలకు Google లాగిన్ అనుమతించబడదు.',
      officialEmailLabel: 'అధికారిక ఇమెయిల్ ID',
      officialPasswordLabel: 'అధికారిక పాస్‌వర్డ్',
      officialSignInBtn: 'అధికారిక లాగిన్',
      presetsTitle: 'అధికారిక ఆధారాలు (నమూనాలు):',
      backHome: '← ప్రధాన పోర్టల్‌కు తిరిగి వెళ్ళండి'
    },
    askLawBot: {
      deskTitle: 'జాతీయ చట్టబద్ధమైన సంప్రదింపుల డెస్క్',
      deskSubtitle: 'ఇండియా కోడ్ & సుప్రీం కోర్టు అధికారిక రికార్డుల నుండి సమాచారం',
      officialAI: 'అధికారిక AI',
      howAssist: 'లా బాట్ నేడు మీ చట్టపరమైన పరిశోధనకు ఎలా సహాయపడుతుంది?',
      howAssistDesc: 'భారతీయ చట్టాలు, చారిత్రక తీర్పులు మరియు సెక్షన్ల గురించి స్పష్టమైన సమాధానాలు అడగండి.',
      userQueryLabel: 'పౌరుడి ప్రశ్న:',
      statutoryClarification: 'చట్టబద్ధమైన వివరణ',
      ministryVerified: 'మంత్రిత్వ శాఖ ధృవీకరించింది',
      viewInActs: 'చట్టాల ఎక్స్‌ప్లోరర్‌లో పూర్తి పాఠాన్ని చదవండి',
      copy: 'కాపీ చేయండి',
      groundedSources: 'ధృవీకరించబడిన మూలాలు',
      viewBtn: 'చూడండి',
      sendBtn: 'పంపండి',
      quickQueries: 'త్వరిత ప్రశ్నలు:',
      inputPlaceholder: 'ఒక చట్టపరమైన ప్రశ్న అడగండి... (ఉదా: సెక్షన్ 420 కింద బెయిల్ లభిస్తుందా?)',
      disclaimer: 'లా బాట్ AI సమాధానాలు అధికారిక భారతీయ చట్టాలపై ఆధారపడి ఉంటాయి. ముఖ్యమైన విషయాల్లో న్యాయవాదిని సంప్రదించండి.',
      closeBtn: 'మూసివేయండి',
      citationRecordTitle: 'అధికారిక చట్టబద్ధమైన రికార్డు',
      titleLabel: 'శీర్షిక:',
      authorityLabel: 'కోర్టు / అధికారం:',
      sectionRefLabel: 'సెక్షన్ / తీర్పు ప్రస్తావన:',
      sourceRepoLabel: 'అధికారిక రిపోజిటరీ:',
      copiedToast: 'చట్టపరమైన పాఠం క్లిప్‌బోర్డ్‌కి కాపీ చేయబడింది.',
      searchingState: 'ఇండియా కోడ్ మరియు సుప్రీం కోర్టు తీర్పుల శోధన జరుగుతోంది...'
    },
    acts: {
      explorerTitle: 'చట్టాలు & సెక్షన్లు',
      repoLink: 'ఇండియా కోడ్ అధికారిక రిపోజిటరీ',
      searchPlaceholder: 'చట్టంలో సెక్షన్ శోధించండి...',
      sectionPrefix: 'సెక్షన్',
      prescribedPenalty: 'శిక్ష నిబంధన:',
      simpleExplanation: 'సరళమైన వివరణ',
      keyIngredients: 'ముఖ్యమైన చట్టపరమైన అంశాలు:',
      bookmark: 'సేవ్ చేయండి',
      bookmarked: 'సేవ్ చేయబడింది',
      share: 'షేర్ చేయండి',
      copyCitation: 'సైటేషన్ కాపీ చేయండి',
      statutoryTextLabel: 'అధికారిక చట్టబద్ధమైన పాఠం (గెజిట్ ఆఫ్ ఇండియా ప్రకారం)'
    },
    cases: {
      title: 'కేస్ లా ఎక్స్‌ప్లోరర్',
      subtitle: 'సుప్రీం కోర్టు మరియు హైకోర్టుల ముఖ్యమైన తీర్పులు మరియు హెడ్‌నోట్స్‌ను శోధించండి.',
      searchPlaceholder: 'కేసు పేరు, సైటేషన్ లేదా చట్టపరమైన అంశాన్ని శోధించండి...',
      searchBtn: 'శోధించండి',
      courtLabel: 'కోర్టు:',
      allCourts: 'అన్ని కోర్టులు',
      topicLabel: 'చట్టపరమైన అంశం:',
      allTopics: 'అన్ని అంశాలు',
      resultsFound: 'తీర్పులు కనుగొనబడ్డాయి'
    },
    search: {
      title: 'చట్టపరమైన శోధన',
      subtitle: 'కేంద్ర & రాష్ట్ర చట్టాలు, తీర్పులు మరియు గెజిట్ నోటిఫికేషన్‌లను శోధించండి.',
      searchPlaceholder: 'చట్టం, సెక్షన్, కేసు పేరు లేదా కీవర్డ్ శోధించండి...',
      searchBtn: 'శోధించండి',
      tabAll: 'అన్నీ',
      tabActs: 'చట్టాలు & నిబంధనలు',
      tabJudgments: 'తీర్పులు',
      tabNotifications: 'నోటిఫికేషన్లు'
    },
    admin: {
      superAdminTitle: 'సూపర్ అడ్మిన్ కన్సోల్',
      superAdminSubtitle: 'అడ్మిన్ ఆధారాలను సృష్టించడం, డేటాసెట్‌ల నిర్వహణ మరియు RAG ధృవీకరణ కోసం అత్యున్నత అధికారం.',
      userMgmtTitle: 'యూజర్ యాక్సెస్ & రోల్ నిర్వహణ',
      feedbackTitle: 'ప్రశ్నలు & ఫీడ్‌బ్యాక్ సమీక్ష',
      sourcesTitle: 'చట్టపరమైన మూలాల సమకాలీకరణ',
      healthTitle: 'సిస్టమ్ ఆరోగ్యం & కార్యాచరణ లాగ్‌లు',
      opsConsoleTitle: 'ఆపరేషన్స్ అడ్మిన్ కన్సోల్'
    }
  }
};

export const getTranslation = (lang: SupportedLanguage): TranslationDictionary => {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
};
