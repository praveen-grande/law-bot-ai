import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { PersistentChatStore } from './chatStore';
import {
  analyzeLegalQuery,
  hybridRetrieveEvidence
} from './nlpRAG';
import {
  generateLegalChatbotResponse,
  shouldFailoverToBackup
} from './aiProvider';
import { STATUTORY_SECTIONS, COURT_JUDGMENTS } from '../data/legalCorpus';
import { ensureEnvFiles } from './auth';

test('Test Case 1 & 2: New User Empty Chat & Multi-User Isolation', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lawbot-chat-test-'));
  const storePath = path.join(tmpDir, 'chat_store.json');
  const store = new PersistentChatStore(storePath);

  // Test Case 1: New account has zero conversations
  const newUserConvs = store.getUserConversations('usr-new-account-1');
  assert.deepEqual(newUserConvs, []);

  // Test Case 2: User A creates a conversation and sends a question
  const userAId = 'usr-alice-101';
  const userBId = 'usr-bob-202';

  store.appendMessages(
    userAId,
    'conv-alice-1',
    [
      {
        id: 'msg-u1',
        role: 'user',
        content: 'Can a landlord evict a tenant without notice?',
        timestamp: '10:00 AM'
      },
      {
        id: 'msg-a1',
        role: 'assistant',
        content: 'Under Section 106 of the Transfer of Property Act, 1882, written notice is required.',
        timestamp: '10:00 AM'
      }
    ],
    { titleHint: 'Can a landlord evict a tenant without notice?', topicHint: 'Property & Tenancy Law' }
  );

  // User A sees their conversation
  const aliceConvs = store.getUserConversations(userAId);
  assert.equal(aliceConvs.length, 1);
  assert.equal(aliceConvs[0].messages.length, 2);

  // User B logs in and sees ZERO conversations from User A
  const bobConvs = store.getUserConversations(userBId);
  assert.deepEqual(bobConvs, []);

  // User B cannot access, rename, or delete User A's conversation
  assert.equal(store.getConversationForUser(userBId, 'conv-alice-1'), null);
  assert.equal(store.renameConversation(userBId, 'conv-alice-1', 'Hacked Title'), null);
  assert.equal(store.deleteConversation(userBId, 'conv-alice-1'), false);

  // User B cannot append messages to User A's conversation
  assert.throws(() => {
    store.appendMessages(userBId, 'conv-alice-1', [
      { id: 'msg-hack', role: 'user', content: 'Injected', timestamp: 'Now' }
    ]);
  }, /Forbidden/);

  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('Test Case 3, 4 & 5: First Conversation Creation, Persistence Across Reload, and Deletion', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lawbot-persist-test-'));
  const storePath = path.join(tmpDir, 'chat_store.json');

  const userId = 'usr-persist-1';
  const store1 = new PersistentChatStore(storePath);

  // Create conversation and append messages
  const created = store1.createConversation(userId, {
    id: 'conv-persist-100',
    title: 'Article 21 Consultation',
    topic: 'Constitutional Law'
  });
  assert.equal(created.id, 'conv-persist-100');

  store1.appendMessages(userId, 'conv-persist-100', [
    { id: 'm1', role: 'user', content: 'Explain Article 21 in simple language.', timestamp: '11:00 AM' },
    { id: 'm2', role: 'assistant', content: 'Article 21 protects life and personal liberty.', timestamp: '11:00 AM' }
  ]);

  // Test Case 4: Reload from disk (simulating page refresh / logout & login)
  const store2 = new PersistentChatStore(storePath);
  const loaded = store2.getUserConversations(userId);
  assert.equal(loaded.length, 1);
  assert.equal(loaded[0].id, 'conv-persist-100');
  assert.equal(loaded[0].messages.length, 2);

  // Rename conversation and verify persistence
  const renamed = store2.renameConversation(userId, 'conv-persist-100', 'Right to Life & Privacy Notes');
  assert.equal(renamed?.title, 'Right to Life & Privacy Notes');

  // Test Case 5: Delete conversation and verify it does not reappear after reload
  const deleted = store2.deleteConversation(userId, 'conv-persist-100');
  assert.equal(deleted, true);

  const store3 = new PersistentChatStore(storePath);
  assert.deepEqual(store3.getUserConversations(userId), []);

  fs.rmSync(tmpDir, { recursive: true, force: true });
});

test('Test Case 6: Real Question Understanding (Landlord Eviction, Article 21, Judgment Comparison)', async () => {
  // 6A: "Can a landlord evict a tenant without notice?"
  const q1 = 'Can a landlord evict a tenant without notice?';
  const analysis1 = analyzeLegalQuery(q1);
  assert.equal(analysis1.legalDomain, 'Property & Tenancy Law');
  assert.equal(analysis1.isAmbiguous, false);

  const ret1 = hybridRetrieveEvidence(q1, STATUTORY_SECTIONS, COURT_JUDGMENTS);
  assert.ok(ret1.matchedSections.some((s) => s.sectionNumber === '106'));
  assert.ok(ret1.matchedJudgments.some((j) => j.caseTitle.includes('Maria Margarida')));

  const gen1 = await generateLegalChatbotResponse({
    query: q1,
    language: 'en',
    queryAnalysis: analysis1,
    retrieval: ret1
  });
  assert.ok(gen1.content.includes('106'));
  assert.ok(gen1.content.includes('Transfer of Property Act'));
  assert.ok(!gen1.content.includes('Section 420'));

  // 6B: "Explain Article 21 in simple language."
  const q2 = 'Explain Article 21 in simple language.';
  const analysis2 = analyzeLegalQuery(q2);
  assert.equal(analysis2.legalDomain, 'Constitutional Law');
  const ret2 = hybridRetrieveEvidence(q2, STATUTORY_SECTIONS, COURT_JUDGMENTS);
  assert.ok(ret2.matchedSections.some((s) => s.sectionNumber === 'Article 21'));

  const gen2 = await generateLegalChatbotResponse({
    query: q2,
    language: 'en',
    queryAnalysis: analysis2,
    retrieval: ret2
  });
  assert.ok(gen2.content.includes('Article 21'));
  assert.ok(gen2.content.includes('Protection of life and personal liberty'));

  // 6C: Compare two judgments
  const q3 = 'Compare Maneka Gandhi v. Union of India and Justice K.S. Puttaswamy v. Union of India';
  const analysis3 = analyzeLegalQuery(q3);
  const ret3 = hybridRetrieveEvidence(q3, STATUTORY_SECTIONS, COURT_JUDGMENTS);
  assert.ok(ret3.matchedJudgments.length >= 2);
  const gen3 = await generateLegalChatbotResponse({
    query: q3,
    language: 'en',
    queryAnalysis: analysis3,
    retrieval: ret3
  });
  assert.ok(gen3.content.includes('Maneka Gandhi'));
  assert.ok(gen3.content.includes('Puttaswamy'));
});

test('Test Case 7: Ambiguous Query & Unclear Jurisdiction Clarification', async () => {
  const qAmbiguous = 'What happened in this judgment?';
  const analysisAmb = analyzeLegalQuery(qAmbiguous, []);
  assert.equal(analysisAmb.isAmbiguous, true);
  assert.equal(analysisAmb.intent, 'ambiguous_query');

  const retAmb = hybridRetrieveEvidence(qAmbiguous, STATUTORY_SECTIONS, COURT_JUDGMENTS, []);
  const genAmb = await generateLegalChatbotResponse({
    query: qAmbiguous,
    language: 'en',
    queryAnalysis: analysisAmb,
    retrieval: retAmb
  });
  assert.ok(genAmb.content.includes('Clarification Required'));
  assert.ok(genAmb.content.includes('specify which judgment'));

  // Foreign jurisdiction check
  const qForeign = 'What are my Fifth Amendment Miranda rights in US Supreme Court law?';
  const analysisFor = analyzeLegalQuery(qForeign, []);
  assert.equal(analysisFor.jurisdictionUnclear, true);
  assert.equal(analysisFor.detectedForeignJurisdiction, 'United States');
});

test('Test Case 8: Unsupported / Missing Source Query Does Not Fabricate Citations', async () => {
  const qMissing = 'What is the penalty under the 1999 Interplanetary Asteroid Mining Act?';
  const analysisMis = analyzeLegalQuery(qMissing, []);
  const retMis = hybridRetrieveEvidence(qMissing, STATUTORY_SECTIONS, COURT_JUDGMENTS, []);
  assert.equal(retMis.matchedSections.length, 0);
  assert.equal(retMis.matchedJudgments.length, 0);

  const genMis = await generateLegalChatbotResponse({
    query: qMissing,
    language: 'en',
    queryAnalysis: analysisMis,
    retrieval: retMis
  });
  assert.ok(genMis.content.includes('Supporting Sources Not Found in Indexed Database'));
  assert.ok(genMis.content.includes('do not invent case names'));
});

test('Test Case 9 & 10: Groq Backup Failover & Total Provider Failure Handling', async () => {
  const q = 'Can a landlord evict a tenant without notice?';
  const analysis = analyzeLegalQuery(q);
  const retrieval = hybridRetrieveEvidence(q, STATUTORY_SECTIONS, COURT_JUDGMENTS);

  // Verify failover classification rules
  assert.equal(shouldFailoverToBackup({ status: 429, message: 'Rate limit exceeded' }).shouldFailover, true);
  assert.equal(shouldFailoverToBackup({ status: 503, message: 'Service unavailable' }).shouldFailover, true);
  assert.equal(shouldFailoverToBackup({ name: 'TimeoutError', message: 'Request timed out' }).shouldFailover, true);
  assert.equal(shouldFailoverToBackup({ status: 400, message: 'Invalid user input' }).shouldFailover, false);

  // Test Case 9: Primary fails with 429 -> Automatically switches to Groq backup provider with identical RAG context
  let capturedPromptInGroq = '';
  const failoverRes = await generateLegalChatbotResponse({
    query: q,
    language: 'en',
    queryAnalysis: analysis,
    retrieval,
    customPrimaryCaller: async () => {
      const err: any = new Error('Primary rate limit 429');
      err.status = 429;
      throw err;
    },
    customGroqCaller: async (prompt) => {
      capturedPromptInGroq = prompt;
      return '### Legal Analysis via Groq Backup\nUnder Section 106 of the Transfer of Property Act, 1882, a landlord cannot evict a tenant without serving a 15-day written notice and following due process (*Maria Margarida (2012) 5 SCC 370*).';
    }
  });

  assert.equal(failoverRes.backupActivated, true);
  assert.equal(failoverRes.providerUsed, 'groq');
  assert.equal(failoverRes.telemetry.errorCategory, 'rate_limit_429');
  assert.ok(capturedPromptInGroq.includes('Transfer of Property Act, 1882'));
  assert.ok(failoverRes.content.includes('Section 106'));

  // Test Case 10: Total Provider Failure throws clean error without fake AI response
  await assert.rejects(
    async () => {
      await generateLegalChatbotResponse({
        query: q,
        language: 'en',
        queryAnalysis: analysis,
        retrieval,
        simulateTotalProviderFailure: true
      });
    },
    (err: any) => err.code === 'TOTAL_PROVIDER_FAILURE'
  );
});

test('Test Case 11: Multi-Turn Conversation Context Continuity', () => {
  const history = [
    { role: 'user' as const, content: 'Explain IPC Section 420 in simple language.' },
    {
      role: 'assistant' as const,
      content: 'Section 420 of the Indian Penal Code deals with cheating and dishonestly inducing delivery of property.'
    }
  ];

  // Follow-up question uses pronoun "it" without repeating "IPC Section 420"
  const followUp = 'What is the punishment and key precedent for it?';
  const analysis = analyzeLegalQuery(followUp, history);
  assert.equal(analysis.usedConversationContext, true);
  assert.ok(analysis.entities.sectionNumbers.includes('420'));

  const retrieval = hybridRetrieveEvidence(followUp, STATUTORY_SECTIONS, COURT_JUDGMENTS, history);
  assert.ok(retrieval.matchedSections.some((s) => s.sectionNumber === '420'));
});

test('Test Case 12: Environment Security & Auto-Configuration', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'lawbot-env-test-'));
  const res = ensureEnvFiles({ rootDir: tmpDir, applyToProcessEnv: false });
  assert.equal(res.createdEnv, true);

  const envContent = fs.readFileSync(res.envPath, 'utf8');
  assert.ok(envContent.includes('GROQ_API_KEY='));
  assert.ok(envContent.includes('GROQ_MODEL="llama-3.3-70b-versatile"'));
  assert.ok(envContent.includes('AI_PRIMARY_PROVIDER="gemini"'));
  assert.ok(envContent.includes('AI_BACKUP_PROVIDER="groq"'));
  assert.ok(envContent.includes('AI_REQUEST_TIMEOUT="15000"'));

  const envLocalPath = path.join(tmpDir, '.env.local');
  assert.ok(fs.existsSync(envLocalPath));

  fs.rmSync(tmpDir, { recursive: true, force: true });
});
