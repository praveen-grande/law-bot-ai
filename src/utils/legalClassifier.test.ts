import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyLegalDocument,
  detectDocumentKind,
  extractStatutoryIdentifiers,
  extractJudgmentIdentifiers,
  formatAsStatutorySection,
  formatAsCourtJudgment
} from './legalClassifier.js';
import { HFDatasetRecord } from '../types/legal.js';

test('Legal Classifier - Correctly classifies Indian Criminal Law statutory provisions', () => {
  const text = `Section 420. Cheating and dishonestly inducing delivery of property.
Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.`;

  const result = classifyLegalDocument(text, { actName: 'Indian Penal Code, 1860', sectionNumber: '420' });

  assert.equal(result.category, 'Criminal Law');
  assert.equal(result.isCourtJudgment, false);
  assert.equal(result.documentType, 'Act');
  assert.ok(result.confidence >= 0.85);
  assert.equal(result.statutoryInfo?.provisionNumber, '420');
  assert.equal(result.statutoryInfo?.parentAct, 'Indian Penal Code, 1860');
});

test('Legal Classifier - Correctly classifies Constitution of India articles', () => {
  const text = `Article 21. Protection of life and personal liberty.
No person shall be deprived of his life or personal liberty except according to procedure established by law.`;

  const result = classifyLegalDocument(text, { Article: 'Article 21' }, 'ddycorp/CPT-Dataset-Indian-Constitution');

  assert.equal(result.category, 'Constitutional Law');
  assert.equal(result.isCourtJudgment, false);
  assert.equal(result.documentType, 'Constitution');
  assert.ok(result.confidence >= 0.9);
  assert.ok(result.statutoryInfo?.provisionNumber.includes('21'));
  assert.equal(result.statutoryInfo?.parentAct, 'Constitution of India');
});

test('Legal Classifier - Correctly classifies Court Judgments and separates judicial identifiers', () => {
  const text = `IN THE SUPREME COURT OF INDIA
CRIMINAL APPELLATE JURISDICTION
CRIMINAL APPEAL NO. 450 OF 2020

State of Maharashtra ... Appellant
versus
Rajesh Shah ... Respondent

J U D G M E N T
The prosecution has failed to establish mens rea at the inception of the commercial transaction under Section 420 of the Indian Penal Code. The appeal is dismissed.`;

  const result = classifyLegalDocument(text, {
    court_name: 'Supreme Court of India',
    neutral_citation: '(2020) 5 SCC 123',
    decision_date: '2020-01-15'
  }, 'KanoonGPT/indian-case-laws');

  assert.equal(result.category, 'Criminal Law');
  assert.equal(result.isCourtJudgment, true);
  assert.equal(result.documentType, 'Judgment');
  assert.ok(result.confidence >= 0.85);
  assert.equal(result.judgmentInfo?.court, 'Supreme Court of India');
  assert.ok(result.judgmentInfo?.caseTitle.includes('State of Maharashtra') || result.judgmentInfo?.caseTitle.includes('Rajesh Shah'));
  assert.equal(result.judgmentInfo?.citation, '(2020) 5 SCC 123');
});

test('Legal Classifier - Correctly classifies Cyber Law & IT Act provisions', () => {
  const text = `Section 66A. Punishment for sending offensive messages through communication service, etc.
Any person who sends, by means of a computer resource or a communication device any information that is grossly offensive or has menacing character shall be punishable with imprisonment. Information Technology Act, 2000.`;

  const result = classifyLegalDocument(text, { act: 'Information Technology Act, 2000', section: '66A' });

  assert.equal(result.category, 'Cyber Law');
  assert.equal(result.isCourtJudgment, false);
  assert.ok(result.confidence >= 0.8);
});

test('Legal Classifier - Correctly classifies Property Law & Land Registration', () => {
  const text = `Section 17 of The Registration Act, 1908.
Documents of which registration is compulsory.
The following documents shall be registered, if the property to which they relate is situate in a district in which, and if they have been executed on or after the date on which the Act came into force, namely: instruments of gift of immovable property; lease deed of immovable property.`;

  const result = classifyLegalDocument(text, { act: 'The Registration Act, 1908' });

  assert.equal(result.category, 'Property Law');
  assert.equal(result.isCourtJudgment, false);
});

test('Legal Classifier - Assigns Unclassified / Needs Review when text is completely ambiguous', () => {
  const text = `Sample generic text without any statutory citations, court names, sections, or recognized legal vocabulary. Some numbers: 123, 456.`;

  const result = classifyLegalDocument(text, {});

  assert.equal(result.category, 'Unclassified / Needs Review');
  assert.ok(result.confidence <= 0.6);
});

test('Legal Formatter - Correctly formats StatutorySection and CourtJudgment with origin badges', () => {
  const sampleRec: HFDatasetRecord = {
    rowId: 101,
    datasetId: 'ddycorp/CPT-Dataset-Indian-Constitution',
    config: 'default',
    split: 'train',
    normalizedTitle: 'Article 14 - Equality before law',
    normalizedDocType: 'Constitution',
    verbatimText: 'The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.',
    summaryOrSnippet: 'Fundamental Right to Equality guaranteed to all persons.',
    rawFields: { Article: 'Article 14' },
    sourceUrl: 'https://huggingface.co/datasets/ddycorp/CPT-Dataset-Indian-Constitution'
  };

  const classification = classifyLegalDocument(sampleRec.verbatimText, sampleRec.rawFields, sampleRec.datasetId);
  const sec = formatAsStatutorySection(sampleRec, classification);

  assert.equal(sec.originBadge, 'hf_imported');
  assert.equal(sec.sourceDatasetId, 'ddycorp/CPT-Dataset-Indian-Constitution');
  assert.equal(sec.classificationCategory, 'Constitutional Law');
  assert.ok(sec.id.includes('101'));
});
