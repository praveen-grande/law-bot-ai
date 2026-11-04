import {
  HFDatasetSummary,
  HFDatasetRecord,
  HFRecordsResponse,
  HFDatasetCategory,
  HFSplitInfo,
  HFImportRequest,
  HFImportResponse,
  DocumentType,
  StatutorySection,
  CourtJudgment
} from '../types/legal.js';
import { legalKnowledgeStore, sanitizeUntrustedLegalText } from './ingestionPipeline.js';
import {
  classifyLegalDocument,
  formatAsStatutorySection,
  formatAsCourtJudgment
} from './legalClassifier.js';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// In-memory cache for API resilience and speed
const metadataCache = new Map<string, CacheItem<HFDatasetSummary>>();
const rowsCache = new Map<string, CacheItem<HFRecordsResponse>>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Curated list of verified Indian Legal datasets on Hugging Face
 * Includes evaluation of user-specified repositories:
 * 1. vaquill/open-india-law
 * 2. KanoonGPT/indian-case-laws
 * 3. ddycorp/CPT-Dataset-Indian-Constitution
 */
export const FEATURED_HF_LEGAL_DATASETS: HFDatasetSummary[] = [
  {
    id: 'KanoonGPT/indian-case-laws',
    name: 'KanoonGPT Indian Case Laws (10M+ Judgments)',
    author: 'KanoonGPT',
    description:
      'Massive database of Indian High Court and Supreme Court judgments and orders. Features petitioner/respondent captions, neutral citations, docket numbers, judges, full indexable text, headnotes, and court codes.',
    category: 'Court Judgments',
    downloads: 900,
    likes: 12,
    lastModified: '2024-05-18',
    tags: ['legal', 'indian-law', 'case-law', 'supreme-court', 'high-court', 'parquet'],
    license: 'apache-2.0',
    accessStatus: 'accessible',
    statusMessage: 'Live Datasets-Server Active — Dynamic Rows & Pagination Ready',
    supported: true,
    configs: ['default'],
    splits: [{ config: 'default', split: 'train', numRows: 120500 }],
    sourceUrl: 'https://huggingface.co/datasets/KanoonGPT/indian-case-laws',
    isFeatured: true,
    documentType: 'Judgment',
    verificationNotes:
      'Contains authentic judicial precedent transcripts across state High Courts (Patna, Bombay, Allahabad, Madras, etc.) and Supreme Court.'
  },
  {
    id: 'ddycorp/CPT-Dataset-Indian-Constitution',
    name: 'CPT Dataset - Constitution of India',
    author: 'ddycorp',
    description:
      'The Constitution of India structured into articles, preambles, amendments, and fundamental rights clauses. Sourced from authoritative legislative archives.',
    category: 'Constitutional Law',
    downloads: 110,
    likes: 8,
    lastModified: '2024-06-20',
    tags: ['constitution', 'indian-law', 'legal', 'governance', 'parquet'],
    license: 'cc-by-4.0',
    accessStatus: 'accessible',
    statusMessage: 'Live Datasets-Server Active — Dynamic Rows & Pagination Ready',
    supported: true,
    configs: ['default'],
    splits: [{ config: 'default', split: 'train', numRows: 15400 }],
    sourceUrl: 'https://huggingface.co/datasets/ddycorp/CPT-Dataset-Indian-Constitution',
    isFeatured: true,
    documentType: 'Constitution',
    verificationNotes:
      'Constitutional articles, preamble, schedules, and fundamental rights provisions.'
  },
  {
    id: 'AravArun/dhara-indian-criminal-law',
    name: 'Dhara Indian Criminal Law (BNS, IPC, CrPC, BNSS & Evidence)',
    author: 'AravArun',
    description:
      'Complete statutory provisions of Bharatiya Nyaya Sanhita (BNS 2023), Indian Penal Code (IPC), CrPC, BNSS, and Indian Evidence Act, plus court bridges and judicial interpretations.',
    category: 'Criminal Law & Codes',
    downloads: 120,
    likes: 7,
    lastModified: '2024-08-10',
    tags: ['bns', 'ipc', 'crpc', 'bnss', 'criminal-law', 'india'],
    license: 'mit',
    accessStatus: 'accessible',
    statusMessage: 'Live Datasets-Server Active — Multi-Config Provisions & Judgments Ready',
    supported: true,
    configs: ['provisions', 'judgments', 'citations', 'court_bridges', 'mapping'],
    splits: [
      { config: 'provisions', split: 'train', numRows: 1250 },
      { config: 'judgments', split: 'train', numRows: 850 },
      { config: 'citations', split: 'train', numRows: 3400 }
    ],
    sourceUrl: 'https://huggingface.co/datasets/AravArun/dhara-indian-criminal-law',
    isFeatured: true,
    documentType: 'Act',
    verificationNotes:
      'Crucial for comparing pre-2024 IPC/CrPC provisions with 2024 Bharatiya Nyaya Sanhita (BNS) provisions.'
  },
  {
    id: 'mratanusarkar/Indian-Laws',
    name: 'Indian Laws Compendium (Acts & Statutory Provisions)',
    author: 'mratanusarkar',
    description:
      'Compendium of Indian statutory enactments, section headers, legal rules, and chapter hierarchies.',
    category: 'Acts & Legislation',
    downloads: 1350,
    likes: 15,
    lastModified: '2024-03-12',
    tags: ['indian-laws', 'acts', 'sections', 'legal-corpus'],
    license: 'apache-2.0',
    accessStatus: 'accessible',
    statusMessage: 'Live Datasets-Server Active — Dynamic Rows & Pagination Ready',
    supported: true,
    configs: ['default'],
    splits: [{ config: 'default', split: 'train', numRows: 8400 }],
    sourceUrl: 'https://huggingface.co/datasets/mratanusarkar/Indian-Laws',
    isFeatured: true,
    documentType: 'Act',
    verificationNotes: 'Central Acts and rules transcribed from India Code.'
  },
  {
    id: 'vaquill/open-india-law',
    name: 'Open India Law (State & Central Statutory Parquet Shards)',
    author: 'vaquill',
    description:
      'Large open-source initiative containing legislation and judgments across Indian States (Andhra Pradesh, Bihar, Allahabad, Andaman & Nicobar, Arunachal Pradesh, Assam, etc.). Stored in partitioned Parquet files.',
    category: 'Acts & Legislation',
    downloads: 2600,
    likes: 38,
    lastModified: '2024-02-14',
    tags: ['legislation', 'judgments', 'open-india-law', 'state-acts', 'parquet'],
    license: 'cc-by-4.0',
    accessStatus: 'viewer-unsupported',
    statusMessage: 'Repository Active on Hub — Custom State Parquet Shards (Viewer Unsupported)',
    supported: false,
    configs: ['default'],
    splits: [],
    sourceUrl: 'https://huggingface.co/datasets/vaquill/open-india-law',
    isFeatured: true,
    documentType: 'Mixed Legal Records',
    verificationNotes:
      'Hugging Face Datasets Server returns 401 for automated viewer on this repository because it uses multi-file custom Parquet shards without an automated viewer conversion. Repository files and metadata are inspected directly from Hugging Face Hub, and verified state legislation is pre-integrated in Law Bot AI.',
    repositoryFiles: [
      'in_allahabad_judgments.parquet',
      'in_andaman-nicobar_legislation.parquet',
      'in_andhra-pradesh_judgments.parquet',
      'in_andhra-pradesh_legislation.parquet',
      'in_arunachal-pradesh_legislation.parquet',
      'in_assam_legislation.parquet',
      'in_bihar_legislation.parquet',
      'README.md',
      'SHA256SUMS.json'
    ]
  },
  {
    id: 'Pravincoder/Indian_traffic_law_QA',
    name: 'Indian Traffic & Motor Vehicles Law Q&A',
    author: 'Pravincoder',
    description:
      'Question-answering dataset covering the Motor Vehicles Act, traffic rules, penalties, driving licenses, and citizen liabilities in India.',
    category: 'Legal QA & Analysis',
    downloads: 65,
    likes: 3,
    lastModified: '2024-07-02',
    tags: ['traffic-law', 'motor-vehicles-act', 'qa', 'penalties'],
    license: 'mit',
    accessStatus: 'accessible',
    statusMessage: 'Live Datasets-Server Active — Dynamic Rows & Pagination Ready',
    supported: true,
    configs: ['default'],
    splits: [{ config: 'default', split: 'train', numRows: 1200 }],
    sourceUrl: 'https://huggingface.co/datasets/Pravincoder/Indian_traffic_law_QA',
    isFeatured: true,
    documentType: 'Regulation',
    verificationNotes: 'Practical citizen Q&A under the Motor Vehicles (Amendment) Act 2019.'
  }
];

/**
 * Categorize a Hugging Face dataset based on its tags, ID, and description
 */
function inferCategory(id: string, description: string, tags: string[] = []): HFDatasetCategory {
  const text = `${id} ${description} ${tags.join(' ')}`.toLowerCase();
  if (text.includes('constitution') || text.includes('cpt') || text.includes('constitutional')) {
    return 'Constitutional Law';
  }
  if (
    text.includes('case-law') ||
    text.includes('judgment') ||
    text.includes('court') ||
    text.includes('judge') ||
    text.includes('precedent') ||
    text.includes('kanoon')
  ) {
    return 'Court Judgments';
  }
  if (
    text.includes('criminal') ||
    text.includes('bns') ||
    text.includes('ipc') ||
    text.includes('crpc') ||
    text.includes('bnss') ||
    text.includes('penal')
  ) {
    return 'Criminal Law & Codes';
  }
  if (text.includes('traffic') || text.includes('rule') || text.includes('regulation') || text.includes('notification')) {
    return 'Regulations & Rules';
  }
  if (text.includes('qa') || text.includes('question') || text.includes('answer') || text.includes('llama') || text.includes('ner')) {
    return 'Legal QA & Analysis';
  }
  return 'Acts & Legislation';
}

/**
 * Discover Indian legal datasets on Hugging Face Hub
 */
export async function discoverHuggingFaceDatasets(query: string = '', category: string = 'All'): Promise<HFDatasetSummary[]> {
  const trimmed = query.trim().toLowerCase();

  // If no query or matching featured datasets, start with our curated directory
  let results = [...FEATURED_HF_LEGAL_DATASETS];

  // Try live Hub search if query provided or general search
  try {
    const searchTerms = trimmed ? `${trimmed} indian law` : 'indian law';
    const hubUrl = `https://huggingface.co/api/datasets?search=${encodeURIComponent(searchTerms)}&limit=15`;
    const res = await fetch(hubUrl, { signal: AbortSignal.timeout(4500) });

    if (res.ok) {
      const liveList = await res.json();
      if (Array.isArray(liveList)) {
        for (const item of liveList) {
          if (!results.some((r) => r.id === item.id)) {
            const cat = inferCategory(item.id, item.description || '', item.tags || []);
            results.push({
              id: item.id,
              name: item.id.split('/')[1] || item.id,
              author: item.author || item.id.split('/')[0] || 'Community',
              description: item.description || `Indian legal dataset repository on Hugging Face Hub (${item.id}).`,
              category: cat,
              downloads: item.downloads || 0,
              likes: item.likes || 0,
              lastModified: item.lastModified ? item.lastModified.split('T')[0] : 'Recent',
              tags: item.tags || ['legal', 'india'],
              license: 'other',
              accessStatus: 'accessible',
              statusMessage: 'Discovered via Hugging Face Hub API',
              supported: true,
              configs: ['default'],
              splits: [{ config: 'default', split: 'train' }],
              sourceUrl: `https://huggingface.co/datasets/${item.id}`,
              documentType: cat === 'Court Judgments' ? 'Judgment' : 'Act'
            });
          }
        }
      }
    }
  } catch (err: any) {
    console.warn('Hugging Face Hub discovery query error (using cached featured datasets):', err?.message);
  }

  // Filter by query and category
  return results.filter((d) => {
    if (category !== 'All' && d.category !== category) return false;
    if (!trimmed) return true;
    return (
      d.id.toLowerCase().includes(trimmed) ||
      d.name.toLowerCase().includes(trimmed) ||
      d.description.toLowerCase().includes(trimmed) ||
      d.category.toLowerCase().includes(trimmed) ||
      d.tags.some((t) => t.toLowerCase().includes(trimmed))
    );
  });
}

/**
 * Fetch detailed metadata, configs, and splits for a single dataset
 */
export async function getHuggingFaceDatasetDetails(owner: string, repo: string): Promise<HFDatasetSummary> {
  const datasetId = `${owner}/${repo}`;
  const cached = metadataCache.get(datasetId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // Check if known in featured
  const featured = FEATURED_HF_LEGAL_DATASETS.find((f) => f.id.toLowerCase() === datasetId.toLowerCase());

  let summary: HFDatasetSummary = featured
    ? { ...featured }
    : {
        id: datasetId,
        name: repo,
        author: owner,
        description: 'Indian legal dataset on Hugging Face.',
        category: inferCategory(datasetId, ''),
        downloads: 0,
        likes: 0,
        lastModified: 'Recent',
        tags: ['legal', 'india'],
        accessStatus: 'accessible',
        statusMessage: 'Checking Hugging Face API status...',
        supported: true,
        configs: ['default'],
        splits: [{ config: 'default', split: 'train' }],
        sourceUrl: `https://huggingface.co/datasets/${datasetId}`,
        documentType: 'Act'
      };

  try {
    // 1. Check Hub info
    const hubRes = await fetch(`https://huggingface.co/api/datasets/${datasetId}`, {
      signal: AbortSignal.timeout(4500)
    });
    if (hubRes.ok) {
      const hubData = await hubRes.json();
      summary.downloads = hubData.downloads || summary.downloads;
      summary.likes = hubData.likes || summary.likes;
      summary.tags = hubData.tags || summary.tags;
      if (hubData.description) summary.description = hubData.description;
      if (hubData.lastModified) summary.lastModified = hubData.lastModified.split('T')[0];
    }

    // 2. Check Datasets-Server splits
    const splitsRes = await fetch(`https://datasets-server.huggingface.co/splits?dataset=${datasetId}`, {
      signal: AbortSignal.timeout(5000)
    });

    if (splitsRes.ok) {
      const splitsData = await splitsRes.json();
      if (Array.isArray(splitsData.splits)) {
        summary.splits = splitsData.splits.map((s: any) => ({
          config: s.config || 'default',
          split: s.split || 'train',
          numRows: s.num_rows
        }));
        summary.configs = Array.from(new Set(summary.splits.map((s) => s.config)));
        summary.supported = true;
        summary.accessStatus = 'accessible';
        summary.statusMessage = `Datasets Server Active (${summary.splits.length} split(s) available for dynamic querying)`;
      }
    } else {
      const status = splitsRes.status;
      if (status === 401) {
        summary.supported = false;
        summary.accessStatus = 'viewer-unsupported';
        summary.statusMessage =
          'Hugging Face Datasets Server returns 401 (automated viewer disabled for multi-shard or gated files; files can still be inspected via Git/HTTP).';
      } else if (status === 404) {
        summary.supported = false;
        summary.accessStatus = 'viewer-unsupported';
        summary.statusMessage = 'Dataset repository active on Hub, but Datasets Server viewer is not configured for this format.';
      }

      // Fetch file tree from Hub to display accessible repository files
      try {
        const treeRes = await fetch(`https://huggingface.co/api/datasets/${datasetId}/tree/main`, {
          signal: AbortSignal.timeout(4000)
        });
        if (treeRes.ok) {
          const treeData = await treeRes.json();
          if (Array.isArray(treeData)) {
            summary.repositoryFiles = treeData.map((f: any) => f.path || f.name).slice(0, 25);
          }
        }
      } catch {
        // Fallback
      }
    }
  } catch (err: any) {
    console.warn(`Error querying Hugging Face API for ${datasetId}:`, err?.message);
    if (!summary.splits || summary.splits.length === 0) {
      summary.splits = [{ config: 'default', split: 'train' }];
    }
  }

  metadataCache.set(datasetId, { data: summary, timestamp: Date.now() });
  return summary;
}

/**
 * Normalize raw Hugging Face records across heterogeneous schemas
 */
export function normalizeRecord(
  raw: Record<string, any>,
  rowId: string | number,
  datasetId: string,
  config: string,
  split: string
): HFDatasetRecord {
  const dId = datasetId.toLowerCase();

  // Normalize Title
  let title =
    raw.case_title ||
    raw.title ||
    raw.actName ||
    raw.case_name ||
    raw.name ||
    raw.party_caption ||
    raw.provision_title ||
    raw.question ||
    raw.Title ||
    raw.Article ||
    raw.section_title ||
    '';

  // Normalize Verbatim Text
  let text =
    raw.indexable_text ||
    raw.text ||
    raw.headnote_text ||
    raw.statutoryText ||
    raw.content ||
    raw.judgmentSnippet ||
    raw.body ||
    raw.answer ||
    raw.provision_text ||
    raw.article_text ||
    raw.description ||
    '';

  // If text is still empty, gather all string fields
  if (!text) {
    const parts = Object.entries(raw)
      .filter(([k, v]) => typeof v === 'string' && v.length > 20 && k !== 'id')
      .map(([k, v]) => `[${k}]: ${v}`);
    text = parts.join('\n\n') || JSON.stringify(raw, null, 2);
  }

  // Sanitize any untrusted prompt injections
  const sanitizedText = sanitizeUntrustedLegalText(text).sanitized;

  // Normalize Citation & Docket
  const citation =
    raw.neutral_citation ||
    raw.law_report_citation ||
    raw.citation ||
    raw.cnr_number ||
    raw.docket_number ||
    raw.case_metadata_id ||
    undefined;

  // Normalize Court & Bench
  let court: string | undefined =
    raw.court_name ||
    raw.court ||
    raw.bench_name ||
    raw.court_code ||
    (dId.includes('constitution') ? 'Constitutional Assembly / Supreme Court' : undefined);

  // Normalize Date
  const date =
    raw.decision_date ||
    raw.judgment_date ||
    raw.registration_date ||
    raw.year?.toString() ||
    raw.decision_year?.toString() ||
    raw.citation_year?.toString() ||
    raw.date ||
    undefined;

  // Normalize Act / Code & Section
  let actOrCode: string | undefined = raw.act || raw.actName || raw.code || raw.statute;
  let section: string | undefined = raw.section || raw.sectionNumber || raw.article || raw.article_number;

  if (dId.includes('constitution')) {
    actOrCode = 'Constitution of India';
    if (!title) title = 'Constitution of India (Article / Clause)';
  } else if (dId.includes('dhara')) {
    actOrCode = config === 'provisions' ? 'Bharatiya Nyaya Sanhita (BNS) / IPC' : 'Indian Criminal Code';
    if (raw.flag) {
      actOrCode += ` [${raw.status || 'in_force'} - ${raw.flag}]`;
    }
  }

  if (!title) {
    title = citation || (court && date ? `${court} Order (${date})` : `Legal Record #${rowId}`);
  }

  // Snippet preview
  const snippet = sanitizedText.slice(0, 300).replace(/\s+/g, ' ') + (sanitizedText.length > 300 ? '...' : '');

  // Determine Doc Type & Category via Legal Classifier
  const classification = classifyLegalDocument(sanitizedText, raw, datasetId);
  const docType: DocumentType | 'Judgment' | 'Act' | 'Constitution' | 'Legal QA' =
    classification.documentType === 'Constitution'
      ? 'Constitution'
      : classification.isCourtJudgment
      ? 'Judgment'
      : dId.includes('qa') || raw.question
      ? 'Legal QA'
      : 'Act';

  if (!court && classification.judgmentInfo?.court) {
    court = classification.judgmentInfo.court;
  }
  if (!actOrCode && classification.statutoryInfo?.parentAct) {
    actOrCode = classification.statutoryInfo.parentAct;
  }
  if (!section && classification.statutoryInfo?.provisionNumber) {
    section = classification.statutoryInfo.provisionNumber;
  }

  return {
    rowId,
    datasetId,
    config,
    split,
    normalizedTitle: title.slice(0, 250),
    normalizedDocType: docType,
    normalizedCourt: court,
    normalizedCitation: citation,
    normalizedDate: date,
    normalizedJurisdiction: raw.jurisdiction || 'Central',
    normalizedActOrCode: actOrCode,
    normalizedSection: section,
    verbatimText: sanitizedText,
    summaryOrSnippet: snippet,
    rawFields: raw,
    sourceUrl: `https://huggingface.co/datasets/${datasetId}`,
    classificationCategory: classification.category,
    classificationConfidence: classification.confidence
  };
}

/**
 * Fetch paginated live records from Hugging Face Datasets Server API
 */
export async function fetchHuggingFaceRows(
  owner: string,
  repo: string,
  options: {
    config?: string;
    split?: string;
    offset?: number;
    length?: number;
    search?: string;
  } = {}
): Promise<HFRecordsResponse> {
  const datasetId = `${owner}/${repo}`;
  const config = options.config || 'default';
  const split = options.split || 'train';
  const offset = Math.max(0, options.offset || 0);
  const length = Math.min(50, Math.max(1, options.length || 20));
  const search = (options.search || '').trim().toLowerCase();

  const cacheKey = `${datasetId}:${config}:${split}:${offset}:${length}:${search}`;
  const cached = rowsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const url = `https://datasets-server.huggingface.co/rows?dataset=${datasetId}&config=${config}&split=${split}&offset=${offset}&length=${length}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });

    if (!res.ok) {
      const errText = await res.text();
      return {
        datasetId,
        config,
        split,
        offset,
        length,
        totalRows: 0,
        records: [],
        isLive: false,
        error: `Hugging Face Datasets Server responded with status ${res.status}: ${errText.slice(0, 200)}`
      };
    }

    const data = await res.json();
    const rows = Array.isArray(data.rows) ? data.rows : [];
    const totalRows = data.num_rows_per_page || data.total_rows || rows.length + offset;

    let normalizedList = rows.map((r: any, idx: number) =>
      normalizeRecord(r.row || r, r.row_idx !== undefined ? r.row_idx : offset + idx, datasetId, config, split)
    );

    // Apply keyword search filtering if query provided
    if (search) {
      normalizedList = normalizedList.filter(
        (rec: HFDatasetRecord) =>
          rec.normalizedTitle.toLowerCase().includes(search) ||
          rec.verbatimText.toLowerCase().includes(search) ||
          (rec.normalizedCitation && rec.normalizedCitation.toLowerCase().includes(search)) ||
          (rec.normalizedCourt && rec.normalizedCourt.toLowerCase().includes(search))
      );
    }

    // Check which records are already imported locally
    const localDocs = legalKnowledgeStore.getDocuments();
    normalizedList.forEach((rec: HFDatasetRecord) => {
      const isAlreadyImported = localDocs.some(
        (d) =>
          d.sourceUrl?.includes(datasetId) &&
          (d.documentId.includes(String(rec.rowId)) || d.officialTitle === rec.normalizedTitle)
      );
      rec.isImportedLocally = isAlreadyImported;
    });

    const response: HFRecordsResponse = {
      datasetId,
      config,
      split,
      offset,
      length,
      totalRows,
      records: normalizedList,
      isLive: true,
      cachedAt: new Date().toISOString(),
      features: data.features ? data.features.map((f: any) => f.feature?.text || f.name || f) : []
    };

    rowsCache.set(cacheKey, { data: response, timestamp: Date.now() });
    return response;
  } catch (err: any) {
    console.error(`Error fetching rows for ${datasetId}:`, err);
    return {
      datasetId,
      config,
      split,
      offset,
      length,
      totalRows: 0,
      records: [],
      isLive: false,
      error: `Failed to connect to Hugging Face Datasets Server: ${err.message}`
    };
  }
}

/**
 * Import selected Hugging Face records into persistent Local Legal Library (legalKnowledgeStore)
 * Deduplicates, classifies, separates Acts/judgments, indexes chunks & embeddings, and records audit logs
 */
export async function importHFTargetRecords(req: HFImportRequest): Promise<HFImportResponse> {
  const { datasetId, config, split, records, collectionLabel, actorEmail = 'user@lawbot.ai', actorRole = 'user' } = req;

  if (!records || records.length === 0) {
    return {
      success: false,
      importedCount: 0,
      skippedDuplicates: 0,
      datasetId,
      jobId: `hf-job-empty-${Date.now()}`,
      details: 'No records provided for import.',
      errors: ['Record list was empty.']
    };
  }

  let importedCount = 0;
  let skippedDuplicates = 0;
  let unclassifiedCount = 0;
  const errors: string[] = [];
  const categoryBreakdown: Record<string, number> = {};
  const importedSections: StatutorySection[] = [];
  const importedJudgments: CourtJudgment[] = [];

  const effectiveCollection =
    collectionLabel || `Hugging Face Legal Library (${datasetId} / ${config})`;

  for (const rec of records) {
    try {
      const cleanRowId = String(rec.rowId).replace(/[^a-zA-Z0-9_-]/g, '_');
      const canonicalDocId = `doc-hf-${datasetId.replace(/[^a-zA-Z0-9]/g, '-')}-${cleanRowId}`;

      // Run automatic classification engine
      const classification = classifyLegalDocument(rec.verbatimText, rec.rawFields, datasetId);
      rec.classificationCategory = classification.category;
      rec.classificationConfidence = classification.confidence;

      categoryBreakdown[classification.category] =
        (categoryBreakdown[classification.category] || 0) + 1;

      if (classification.category === 'Unclassified / Needs Review') {
        unclassifiedCount++;
      }

      const isJudgment =
        classification.isCourtJudgment ||
        rec.normalizedDocType === 'Judgment' ||
        Boolean(rec.normalizedCourt || rec.normalizedCitation);

      const targetDocType =
        classification.documentType === 'Constitution'
          ? 'Constitution'
          : isJudgment
          ? 'Judgment'
          : 'Act';

      const outcome = legalKnowledgeStore.ingestDocument({
        documentId: canonicalDocId,
        officialTitle: rec.normalizedTitle,
        documentType: targetDocType,
        jurisdiction: (rec.normalizedJurisdiction as 'Central' | 'State' | 'Union Territory') || 'Central',
        court: rec.normalizedCourt || classification.judgmentInfo?.court,
        caseId: rec.normalizedCitation || classification.judgmentInfo?.caseNumber,
        citation: rec.normalizedCitation || classification.judgmentInfo?.citation,
        judgmentDate: rec.normalizedDate || classification.judgmentInfo?.judgmentDate,
        enactmentDate: rec.normalizedDate || (classification.statutoryInfo?.actYear ? `${classification.statutoryInfo.actYear}-01-01` : undefined),
        sectionRefs: rec.normalizedSection ? [rec.normalizedSection] : classification.statutoryInfo?.provisionNumber ? [classification.statutoryInfo.provisionNumber] : [],
        rawContent: `${rec.normalizedTitle}\n${rec.normalizedCourt ? `Court: ${rec.normalizedCourt}\n` : ''}${rec.normalizedCitation ? `Citation: ${rec.normalizedCitation}\n` : ''}\n${rec.verbatimText}`,
        sourceUrl: `https://huggingface.co/datasets/${datasetId}`,
        collectionLabel: effectiveCollection
      });

      if (outcome.outcome === 'unchanged_skipped') {
        skippedDuplicates++;
      } else if (outcome.outcome === 'failed') {
        errors.push(`Failed to import record #${rec.rowId}: ${outcome.reason}`);
      } else {
        importedCount++;
        rec.isImportedLocally = true;

        // Distribute into structured StatutorySection or CourtJudgment
        if (targetDocType === 'Judgment') {
          const formattedJudge = formatAsCourtJudgment(rec, classification);
          importedJudgments.push(formattedJudge);
        } else {
          const formattedSec = formatAsStatutorySection(rec, classification);
          importedSections.push(formattedSec);
        }
      }
    } catch (e: any) {
      errors.push(`Error on record #${rec.rowId}: ${e.message}`);
    }
  }

  const jobId = `job-hf-import-${Date.now()}`;
  legalKnowledgeStore.recordAudit(
    actorEmail,
    actorRole,
    'HF_DATASET_IMPORT',
    datasetId,
    errors.length > 0 && importedCount === 0 ? 'error' : 'success',
    `Imported ${importedCount} records (skipped ${skippedDuplicates} duplicates, ${unclassifiedCount} unclassified) from Hugging Face ${datasetId} (${config}/${split}).`
  );

  return {
    success: importedCount > 0 || (skippedDuplicates > 0 && errors.length === 0),
    importedCount,
    skippedDuplicates,
    unclassifiedCount,
    categoryBreakdown,
    datasetId,
    jobId,
    details: `Successfully processed ${records.length} records: ${importedCount} newly indexed, ${skippedDuplicates} duplicate skips preserved, ${importedSections.length} statutory provisions, ${importedJudgments.length} court judgments distributed.`,
    errors: errors.length > 0 ? errors : undefined,
    stats: legalKnowledgeStore.getHealthAndStats(),
    importedSections,
    importedJudgments
  };
}

/**
 * High-level Batch Ingestion: fetches live rows from Hugging Face API, classifies and saves them
 */
export async function batchIngestFromHFDataset(options: {
  datasetId: string;
  config?: string;
  split?: string;
  offset?: number;
  batchSize?: number;
  actorEmail?: string;
  actorRole?: any;
  collectionLabel?: string;
}): Promise<HFImportResponse> {
  const { datasetId, config = 'default', split = 'train', offset = 0, batchSize = 10, actorEmail, actorRole, collectionLabel } = options;
  const [owner, repo] = datasetId.split('/');

  if (!owner || !repo) {
    throw new Error(`Invalid datasetId "${datasetId}". Format must be owner/repo.`);
  }

  // 1. Fetch live records from Hugging Face Datasets Server
  const rowsRes = await fetchHuggingFaceRows(owner, repo, {
    config,
    split,
    offset,
    length: Math.min(50, Math.max(1, batchSize))
  });

  if (!rowsRes.records || rowsRes.records.length === 0) {
    return {
      success: false,
      importedCount: 0,
      skippedDuplicates: 0,
      datasetId,
      jobId: `job-batch-empty-${Date.now()}`,
      details: rowsRes.error || `No records could be retrieved from ${datasetId} at offset ${offset}.`,
      errors: rowsRes.error ? [rowsRes.error] : ['Zero rows returned from dataset server API.']
    };
  }

  // 2. Run ingestion, classification, and distribution pipeline
  return await importHFTargetRecords({
    datasetId,
    config,
    split,
    records: rowsRes.records,
    actorEmail,
    actorRole,
    collectionLabel: collectionLabel || `Hugging Face Batch Pipeline (${datasetId})`
  });
}

/**
 * Retrieve all records in legalKnowledgeStore that originated from Hugging Face
 */
export function getImportedHFRecords(): any[] {
  const docs = legalKnowledgeStore.getDocuments();
  return docs
    .filter((d) => d.sourceUrl?.includes('huggingface.co') || d.documentId?.startsWith('doc-hf-'))
    .map((d) => ({
      documentId: d.documentId,
      title: d.officialTitle,
      documentType: d.documentType,
      jurisdiction: d.jurisdiction,
      court: d.court,
      citation: d.citation,
      sourceUrl: d.sourceUrl,
      ingestedAt: d.ingestedAt,
      versionId: d.versionId,
      statusVerification: d.statusVerification
    }));
}
