import {
  SupportedLanguage,
  StatutorySection,
  CourtJudgment,
  GroundedCitation
} from '../types/legal';

export interface ExtractedEntities {
  actNames: string[];
  sectionNumbers: string[];
  caseNames: string[];
  citations: string[];
  legalConcepts: string[];
}

export type QueryIntent =
  | 'statutory_explanation'
  | 'judgment_search'
  | 'procedure_inquiry'
  | 'statutory_comparison'
  | 'amendment_status'
  | 'general_legal_inquiry';

/**
 * Detect language based on script ranges (Telugu, Devanagari/Hindi, English).
 */
export function detectLanguage(text: string): SupportedLanguage {
  if (!text) return 'en';
  // Telugu Unicode block: U+0C00–U+0C7F
  const teluguRegex = /[\u0C00-\u0C7F]/;
  // Devanagari Unicode block (Hindi): U+0900–U+097F
  const devanagariRegex = /[\u0900-\u097F]/;

  if (teluguRegex.test(text)) {
    return 'te';
  }
  if (devanagariRegex.test(text)) {
    return 'hi';
  }
  return 'en';
}

/**
 * Classifies query intent to guide the RAG retrieval strategy.
 */
export function classifyQueryIntent(query: string): QueryIntent {
  const lower = query.toLowerCase();

  if (
    lower.includes('compare') ||
    lower.includes('difference between') ||
    lower.includes('vs') ||
    lower.includes('versus') ||
    lower.includes('తేడా') ||
    lower.includes('अंतर')
  ) {
    return 'statutory_comparison';
  }

  if (
    lower.includes('judgment') ||
    lower.includes('case law') ||
    lower.includes('court held') ||
    lower.includes('precedent') ||
    lower.includes('supreme court') ||
    lower.includes('high court') ||
    lower.includes(' scc ') ||
    lower.includes(' v. ') ||
    lower.includes('తీర్పు') ||
    lower.includes('फैसला')
  ) {
    return 'judgment_search';
  }

  if (
    lower.includes('procedure') ||
    lower.includes('how to file') ||
    lower.includes('complaint') ||
    lower.includes('fir') ||
    lower.includes('steps to') ||
    lower.includes('విధానం') ||
    lower.includes('प्रक्रिया')
  ) {
    return 'procedure_inquiry';
  }

  if (
    lower.includes('amended') ||
    lower.includes('repealed') ||
    lower.includes('in force') ||
    lower.includes('struck down') ||
    lower.includes('bns') ||
    lower.includes('bnss') ||
    lower.includes('చెల్లుబాటు') ||
    lower.includes('संशोधन')
  ) {
    return 'amendment_status';
  }

  if (
    lower.includes('explain') ||
    lower.includes('what does section') ||
    lower.includes('meaning of') ||
    lower.includes('punishment') ||
    lower.includes('ingredients') ||
    lower.includes('section ') ||
    lower.includes('article ') ||
    lower.includes('సెక్షన్') ||
    lower.includes('धारा')
  ) {
    return 'statutory_explanation';
  }

  return 'general_legal_inquiry';
}

/**
 * Normalizes legal references across common abbreviations and vernacular forms.
 */
export function normalizeLegalQuery(query: string): string {
  let normalized = query;

  // Normalize common Indian Act abbreviations
  normalized = normalized.replace(/\bipc\b/gi, 'Indian Penal Code');
  normalized = normalized.replace(/\bcrpc\b/gi, 'Code of Criminal Procedure');
  normalized = normalized.replace(/\bcpc\b/gi, 'Code of Civil Procedure');
  normalized = normalized.replace(/\bit act\b/gi, 'Information Technology Act');
  normalized = normalized.replace(/\bbns\b/gi, 'Bharatiya Nyaya Sanhita');
  normalized = normalized.replace(/\bbnss\b/gi, 'Bharatiya Nagarik Suraksha Sanhita');
  normalized = normalized.replace(/\bart\.?\s*(\d+)/gi, 'Article $1');
  normalized = normalized.replace(/\bsec\.?\s*(\d+[a-z]?)/gi, 'Section $1');

  // Vernacular mappings to standardized terms
  normalized = normalized.replace(/సెక్షన్\s*(\d+)/gi, 'Section $1');
  normalized = normalized.replace(/మోసం/gi, 'cheating');
  normalized = normalized.replace(/భారతీయ శిక్షాస్మృతి/gi, 'Indian Penal Code');
  normalized = normalized.replace(/धारा\s*(\d+)/gi, 'Section $1');
  normalized = normalized.replace(/धोखाधड़ी/gi, 'cheating');
  normalized = normalized.replace(/भारतीय दंड संहिता/gi, 'Indian Penal Code');

  return normalized.trim();
}

/**
 * Extracts legal entities: Acts, sections, case names, and legal concepts.
 */
export function extractLegalEntities(query: string): ExtractedEntities {
  const norm = normalizeLegalQuery(query);
  const actNames: string[] = [];
  const sectionNumbers: string[] = [];
  const caseNames: string[] = [];
  const citations: string[] = [];
  const legalConcepts: string[] = [];

  // Match Acts
  const actsPatterns = [
    /Indian Penal Code(,?\s*\d{4})?/i,
    /Code of Criminal Procedure(,?\s*\d{4})?/i,
    /Constitution of India/i,
    /Registration Act(,?\s*\d{4})?/i,
    /Information Technology Act(,?\s*\d{4})?/i,
    /Bharatiya Nyaya Sanhita/i,
    /Transfer of Property Act/i,
    /Consumer Protection Act/i
  ];

  for (const pat of actsPatterns) {
    const match = norm.match(pat);
    if (match) {
      actNames.push(match[0]);
    }
  }

  // Match Sections or Articles
  const sectionMatches = norm.match(/(Section|Article)\s*(\d+[a-zA-Z]?)/gi);
  if (sectionMatches) {
    sectionMatches.forEach((s) => {
      const parts = s.split(/\s+/);
      if (parts[1]) sectionNumbers.push(parts[1]);
    });
  }

  // Match SCC or standard law citations
  const sccMatches = query.match(/\(\d{4}\)\s*\d+\s*SCC\s*\d+/gi);
  if (sccMatches) {
    citations.push(...sccMatches);
  }

  // Match "X v. Y" or "X vs Y"
  const caseMatch = query.match(/([A-Z][a-zA-Z\.\s]+)\s+v(?:s|\.)\s+([A-Z][a-zA-Z\.\s]+)/i);
  if (caseMatch) {
    caseNames.push(caseMatch[0].trim());
  }

  // Detect key legal concepts
  const conceptKeywords = [
    'cheating',
    'anticipatory bail',
    'registration',
    'personal liberty',
    'privacy',
    'arrest',
    'breach of contract',
    'dishonest intention',
    'unregistered deed',
    'habeas corpus',
    'freedom of speech'
  ];

  for (const concept of conceptKeywords) {
    if (query.toLowerCase().includes(concept)) {
      legalConcepts.push(concept);
    }
  }

  return {
    actNames: Array.from(new Set(actNames)),
    sectionNumbers: Array.from(new Set(sectionNumbers)),
    caseNames: Array.from(new Set(caseNames)),
    citations: Array.from(new Set(citations)),
    legalConcepts: Array.from(new Set(legalConcepts))
  };
}

export interface RetrievalResult {
  matchedSections: StatutorySection[];
  matchedJudgments: CourtJudgment[];
  citations: GroundedCitation[];
  groundingConfidence: 'High' | 'Moderate' | 'Low';
  evidenceExplanation: string;
}

/**
 * Hybrid retrieval engine scoring statutory sections and judgments against normalized queries & extracted entities.
 */
export function hybridRetrieveEvidence(
  query: string,
  sections: StatutorySection[],
  judgments: CourtJudgment[]
): RetrievalResult {
  const normalized = normalizeLegalQuery(query).toLowerCase();
  const entities = extractLegalEntities(query);

  const scoredSections: { section: StatutorySection; score: number }[] = [];
  const scoredJudgments: { judgment: CourtJudgment; score: number }[] = [];

  // Score statutory sections
  for (const sec of sections) {
    let score = 0;
    const secNum = sec.sectionNumber.toLowerCase().replace('article ', '');

    // Exact section number match (highest weight)
    if (entities.sectionNumbers.some((n) => n.toLowerCase() === secNum || sec.sectionNumber.toLowerCase().includes(n.toLowerCase()))) {
      score += 50;
    }

    // Act name match
    if (entities.actNames.some((a) => sec.actName.toLowerCase().includes(a.toLowerCase()))) {
      score += 25;
    }

    // Title match
    if (normalized.includes(sec.title.toLowerCase()) || sec.title.toLowerCase().includes(normalized)) {
      score += 20;
    }

    // Keyword match in simple explanation or text
    for (const concept of entities.legalConcepts) {
      if (
        sec.statutoryText.toLowerCase().includes(concept) ||
        sec.simpleExplanation.toLowerCase().includes(concept) ||
        sec.keyIngredients.some((k) => k.toLowerCase().includes(concept))
      ) {
        score += 15;
      }
    }

    // General token overlap
    const tokens = normalized.split(/\s+/).filter((t) => t.length > 3);
    for (const t of tokens) {
      if (sec.statutoryText.toLowerCase().includes(t) || sec.title.toLowerCase().includes(t)) {
        score += 3;
      }
    }

    if (score > 5) {
      scoredSections.push({ section: sec, score });
    }
  }

  // Score judgments
  for (const j of judgments) {
    let score = 0;

    // Citation exact match
    if (entities.citations.some((c) => j.citation.toLowerCase().includes(c.toLowerCase()))) {
      score += 60;
    }

    // Case title match
    if (entities.caseNames.some((c) => j.caseTitle.toLowerCase().includes(c.toLowerCase()))) {
      score += 50;
    }

    // Sections discussed match
    for (const sn of entities.sectionNumbers) {
      if (j.sectionsDiscussed.some((sd) => sd.toLowerCase().includes(sn.toLowerCase()))) {
        score += 30;
      }
    }

    // Topic overlap
    for (const concept of entities.legalConcepts) {
      if (
        j.topics.some((t) => t.toLowerCase().includes(concept)) ||
        j.aiSummary.toLowerCase().includes(concept) ||
        j.judgmentSnippet.toLowerCase().includes(concept)
      ) {
        score += 15;
      }
    }

    const tokens = normalized.split(/\s+/).filter((t) => t.length > 3);
    for (const t of tokens) {
      if (j.caseTitle.toLowerCase().includes(t) || j.aiSummary.toLowerCase().includes(t)) {
        score += 3;
      }
    }

    if (score > 5) {
      scoredJudgments.push({ judgment: j, score });
    }
  }

  // Sort descending
  scoredSections.sort((a, b) => b.score - a.score);
  scoredJudgments.sort((a, b) => b.score - a.score);

  const matchedSections = scoredSections.slice(0, 3).map((s) => s.section);
  const matchedJudgments = scoredJudgments.slice(0, 3).map((j) => j.judgment);

  // Generate grounded citations
  const citations: GroundedCitation[] = [];

  matchedSections.forEach((sec) => {
    citations.push({
      id: `cite-${sec.id}`,
      title: `${sec.actName} - Section ${sec.sectionNumber}`,
      referenceType: 'Act',
      authority: 'Ministry of Law and Justice (India Code)',
      sectionOrPara: `Section ${sec.sectionNumber}`,
      url: sec.officialSourceUrl,
      verified: true,
      date: sec.lastVerifiedDate,
      relevanceSnippet: sec.statutoryText.slice(0, 140) + '...'
    });
  });

  matchedJudgments.forEach((j) => {
    citations.push({
      id: `cite-${j.id}`,
      title: `${j.caseTitle} ${j.citation}`,
      referenceType: 'Judgment',
      authority: j.court,
      sectionOrPara: j.citation,
      url: j.fullJudgmentUrl,
      verified: true,
      date: j.decisionDate,
      relevanceSnippet: j.aiSummary.slice(0, 140) + '...'
    });
  });

  let groundingConfidence: 'High' | 'Moderate' | 'Low' = 'Low';
  let evidenceExplanation = 'No direct statutory or judicial matches found in the indexed repository.';

  if (matchedSections.length > 0 || matchedJudgments.length > 0) {
    groundingConfidence = matchedSections.length > 0 && matchedJudgments.length > 0 ? 'High' : 'Moderate';
    evidenceExplanation = `Grounding established on ${matchedSections.length} statutory provision(s) and ${matchedJudgments.length} authoritative court decision(s).`;
  }

  return {
    matchedSections,
    matchedJudgments,
    citations,
    groundingConfidence,
    evidenceExplanation
  };
}

/**
 * Validates generated response against known database citations to prevent hallucinations.
 */
export function validateCitations(
  responseContent: string,
  availableCitations: GroundedCitation[]
): { verifiedCount: number; unverifiedReferences: string[] } {
  const verifiedCount = availableCitations.filter((c) => c.verified).length;
  const unverifiedReferences: string[] = [];

  // Check if response mentions sections not found in available citations
  const mentionedSections = responseContent.match(/Section\s+\d+[a-zA-Z]?/gi) || [];
  for (const m of mentionedSections) {
    const secNum = m.replace(/Section\s+/i, '').trim();
    const isSupported = availableCitations.some(
      (c) => c.sectionOrPara?.includes(secNum) || c.title.includes(secNum)
    );
    if (!isSupported && !unverifiedReferences.includes(m)) {
      unverifiedReferences.push(m);
    }
  }

  return {
    verifiedCount,
    unverifiedReferences
  };
}
