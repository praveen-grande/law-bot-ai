import test from 'node:test';
import assert from 'node:assert/strict';
import {
  detectLanguage,
  classifyQueryIntent,
  normalizeLegalQuery,
  extractLegalEntities,
  hybridRetrieveEvidence,
  validateCitations
} from './nlpRAG';
import { STATUTORY_SECTIONS, COURT_JUDGMENTS } from '../data/legalCorpus';

test('detectLanguage correctly detects English, Telugu, and Hindi', () => {
  assert.equal(detectLanguage('Explain IPC Section 420 in simple language'), 'en');
  assert.equal(detectLanguage('సెక్షన్ 420 గురించి వివరించండి'), 'te');
  assert.equal(detectLanguage('आईपीसी धारा 420 की व्याख्या सरल भाषा में करें'), 'hi');
  assert.equal(detectLanguage(''), 'en');
});

test('classifyQueryIntent classifies legal intents accurately', () => {
  assert.equal(
    classifyQueryIntent('Explain IPC Section 420 in simple language.'),
    'statutory_explanation'
  );
  assert.equal(
    classifyQueryIntent('Supreme Court judgment on cheating and breach of contract in SCC'),
    'judgment_search'
  );
  assert.equal(
    classifyQueryIntent('What is the procedure for filing an anticipatory bail application?'),
    'procedure_inquiry'
  );
  assert.equal(
    classifyQueryIntent('Compare IPC Section 420 vs Section 415 cheating'),
    'statutory_comparison'
  );
  assert.equal(
    classifyQueryIntent('Has Section 66A of IT Act been struck down or amended?'),
    'amendment_status'
  );
});

test('normalizeLegalQuery normalizes aliases and vernacular legal terms', () => {
  const norm1 = normalizeLegalQuery('What does IPC 420 say?');
  assert.ok(norm1.includes('Indian Penal Code'));
  assert.ok(norm1.includes('420'));

  const norm2 = normalizeLegalQuery('ఆర్టికల్ 21 రాజ్యాంగం');
  assert.ok(norm2.length > 0);

  const norm3 = normalizeLegalQuery('CrPC Sec. 438 anticipatory bail');
  assert.ok(norm3.includes('Code of Criminal Procedure'));
  assert.ok(norm3.includes('Section 438'));
});

test('extractLegalEntities extracts Acts, sections, case citations and concepts', () => {
  const query = 'Explain Indian Penal Code Section 420 and State of Maharashtra v. Rajesh Shah (2020) 5 SCC 123 cheating';
  const entities = extractLegalEntities(query);

  assert.ok(entities.actNames.some((a) => a.includes('Indian Penal Code')));
  assert.ok(entities.sectionNumbers.includes('420'));
  assert.ok(entities.citations.some((c) => c.includes('5 SCC 123')));
  assert.ok(entities.legalConcepts.includes('cheating'));
});

test('hybridRetrieveEvidence retrieves grounded sections and judgments for IPC 420', () => {
  const result = hybridRetrieveEvidence(
    'Explain IPC Section 420 in simple language',
    STATUTORY_SECTIONS,
    COURT_JUDGMENTS
  );

  assert.ok(result.matchedSections.length > 0);
  assert.equal(result.matchedSections[0].sectionNumber, '420');
  assert.equal(result.groundingConfidence, 'High');
  assert.ok(result.citations.length >= 2);
  assert.ok(result.citations.some((c) => c.title.includes('Section 420')));
  assert.ok(result.citations.some((c) => c.title.includes('State of Maharashtra v. Rajesh Shah')));
});

test('validateCitations flags unverified citations correctly', () => {
  const availableCites = [
    {
      id: 'cite-1',
      title: 'Indian Penal Code - Section 420',
      referenceType: 'Act' as const,
      authority: 'India Code',
      sectionOrPara: 'Section 420',
      url: 'https://indiacode.nic.in',
      verified: true
    }
  ];

  const validResponse = 'Under Section 420, cheating requires dishonest intention.';
  const res1 = validateCitations(validResponse, availableCites);
  assert.equal(res1.unverifiedReferences.length, 0);

  const hallucinatedResponse = 'Under Section 999 and Section 420, punishment is given.';
  const res2 = validateCitations(hallucinatedResponse, availableCites);
  assert.ok(res2.unverifiedReferences.includes('Section 999'));
});
