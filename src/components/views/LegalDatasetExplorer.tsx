import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Database,
  ExternalLink,
  Download,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Layers,
  FileText,
  Scale,
  BookOpen,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Copy,
  Check,
  Globe,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FolderTree,
  Tag,
  MessageSquare,
  Clock,
  HardDrive
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  HFDatasetSummary,
  HFDatasetRecord,
  HFDatasetCategory,
  HFRecordsResponse
} from '../../types/legal';

export const LegalDatasetExplorer: React.FC = () => {
  const {
    setCurrentView,
    createNewChat,
    showToast,
    currentUser,
    selectedHfDatasetId,
    setSelectedHfDatasetId,
    selectedHfRecord,
    setSelectedHfRecord,
    setSelectedSectionId,
    setSelectedCaseId,
    refreshCorpus
  } = useApp();

  // Mode: Live Explorer (querying HF directly) vs Local Legal Library (imported offline records)
  const [activeMode, setActiveMode] = useState<'live' | 'library'>('live');

  // Batch ingestion state
  const [batchSize, setBatchSize] = useState<number>(10);
  const [isBatchIngesting, setIsBatchIngesting] = useState<boolean>(false);
  const [batchReport, setBatchReport] = useState<{
    totalProcessed: number;
    importedCount: number;
    skippedDuplicates: number;
    unclassifiedCount: number;
    categoryBreakdown: Record<string, number>;
  } | null>(null);

  // Datasets listing state
  const [datasets, setDatasets] = useState<HFDatasetSummary[]>([]);
  const [loadingDatasets, setLoadingDatasets] = useState(false);
  const [datasetSearch, setDatasetSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HFDatasetCategory>('All');

  // Active dataset & records state
  const [activeDataset, setActiveDataset] = useState<HFDatasetSummary | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<string>('default');
  const [selectedSplit, setSelectedSplit] = useState<string>('train');
  const [recordsResponse, setRecordsResponse] = useState<HFRecordsResponse | null>(null);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [recordsSearch, setRecordsSearch] = useState('');
  const [pageOffset, setPageOffset] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [viewFormat, setViewFormat] = useState<'table' | 'cards'>('cards');

  // Record modal & import state
  const [inspectingRecord, setInspectingRecord] = useState<HFDatasetRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | number | null>(null);
  const [importingRecordId, setImportingRecordId] = useState<string | number | null>(null);
  const [isBulkImporting, setIsBulkImporting] = useState(false);

  // Local library records state
  const [importedRecords, setImportedRecords] = useState<any[]>([]);
  const [loadingImported, setLoadingImported] = useState(false);

  const categories: HFDatasetCategory[] = [
    'All',
    'Acts & Legislation',
    'Court Judgments',
    'Constitutional Law',
    'Criminal Law & Codes',
    'Regulations & Rules',
    'Legal QA & Analysis'
  ];

  // Fetch datasets list from backend
  const fetchDatasets = useCallback(async (query: string = '', cat: string = 'All') => {
    setLoadingDatasets(true);
    try {
      const url = `/api/hf/datasets?q=${encodeURIComponent(query)}&category=${encodeURIComponent(cat)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setDatasets(data.datasets || []);
      }
    } catch (err: any) {
      showToast(`Failed to discover datasets: ${err.message}`);
    } finally {
      setLoadingDatasets(false);
    }
  }, [showToast]);

  // Fetch local imported library records
  const fetchImportedRecords = useCallback(async () => {
    setLoadingImported(true);
    try {
      const res = await fetch('/api/hf/imported');
      if (res.ok) {
        const data = await res.json();
        setImportedRecords(data.records || []);
      }
    } catch {
      // ignore
    } finally {
      setLoadingImported(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchDatasets(datasetSearch, selectedCategory);
    fetchImportedRecords();
  }, [fetchDatasets, fetchImportedRecords, datasetSearch, selectedCategory]);

  // When selectedHfDatasetId changes (e.g. from chat navigation), load that dataset
  useEffect(() => {
    if (selectedHfDatasetId) {
      loadDatasetDetails(selectedHfDatasetId);
    }
  }, [selectedHfDatasetId]);

  // When selectedHfRecord is set externally
  useEffect(() => {
    if (selectedHfRecord) {
      setInspectingRecord(selectedHfRecord);
    }
  }, [selectedHfRecord]);

  // Load single dataset details and its first page of records
  const loadDatasetDetails = async (datasetId: string) => {
    const parts = datasetId.split('/');
    if (parts.length < 2) return;
    const [owner, repo] = parts;

    setLoadingRecords(true);
    try {
      const infoRes = await fetch(`/api/hf/datasets/${owner}/${repo}/info`);
      if (infoRes.ok) {
        const info: HFDatasetSummary = await infoRes.json();
        setActiveDataset(info);
        setSelectedHfDatasetId(datasetId);

        // Pick initial config and split
        const initialConfig = info.configs?.[0] || 'default';
        const initialSplit =
          info.splits?.find((s) => s.config === initialConfig)?.split || 'train';
        setSelectedConfig(initialConfig);
        setSelectedSplit(initialSplit);
        setPageOffset(0);

        if (info.accessStatus === 'accessible') {
          await loadRecords(owner, repo, initialConfig, initialSplit, 0, pageSize, recordsSearch);
        } else {
          setRecordsResponse(null);
        }
      }
    } catch (err: any) {
      showToast(`Error loading dataset info: ${err.message}`);
    } finally {
      setLoadingRecords(false);
    }
  };

  // Load records page
  const loadRecords = async (
    owner: string,
    repo: string,
    config: string,
    split: string,
    offset: number,
    length: number,
    search: string = ''
  ) => {
    setLoadingRecords(true);
    try {
      const queryParams = new URLSearchParams({
        config,
        split,
        offset: String(offset),
        length: String(length),
        search
      });

      const res = await fetch(`/api/hf/datasets/${owner}/${repo}/rows?${queryParams.toString()}`);
      if (res.ok) {
        const data: HFRecordsResponse = await res.json();
        setRecordsResponse(data);
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to fetch records from Hugging Face');
      }
    } catch (err: any) {
      showToast(`Failed to fetch records: ${err.message}`);
    } finally {
      setLoadingRecords(false);
    }
  };

  // Switch config or split
  const handleConfigChange = (newConfig: string) => {
    setSelectedConfig(newConfig);
    if (!activeDataset) return;
    const validSplits = activeDataset.splits.filter((s) => s.config === newConfig);
    const newSplit = validSplits[0]?.split || 'train';
    setSelectedSplit(newSplit);
    setPageOffset(0);

    const [owner, repo] = activeDataset.id.split('/');
    loadRecords(owner, repo, newConfig, newSplit, 0, pageSize, recordsSearch);
  };

  const handleSplitChange = (newSplit: string) => {
    setSelectedSplit(newSplit);
    if (!activeDataset) return;
    setPageOffset(0);
    const [owner, repo] = activeDataset.id.split('/');
    loadRecords(owner, repo, selectedConfig, newSplit, 0, pageSize, recordsSearch);
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (!activeDataset || !recordsResponse) return;
    const [owner, repo] = activeDataset.id.split('/');
    const nextOffset = pageOffset + pageSize;
    setPageOffset(nextOffset);
    loadRecords(owner, repo, selectedConfig, selectedSplit, nextOffset, pageSize, recordsSearch);
  };

  const handlePrevPage = () => {
    if (!activeDataset || !recordsResponse) return;
    const [owner, repo] = activeDataset.id.split('/');
    const prevOffset = Math.max(0, pageOffset - pageSize);
    setPageOffset(prevOffset);
    loadRecords(owner, repo, selectedConfig, selectedSplit, prevOffset, pageSize, recordsSearch);
  };

  const handleRecordsSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDataset) return;
    const [owner, repo] = activeDataset.id.split('/');
    setPageOffset(0);
    loadRecords(owner, repo, selectedConfig, selectedSplit, 0, pageSize, recordsSearch);
  };

  // Copy text helper
  const handleCopy = (text: string, id: string | number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Record text copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Import single record to Local Legal Library
  const handleImportSingleRecord = async (rec: HFDatasetRecord) => {
    if (!activeDataset) return;
    setImportingRecordId(rec.rowId);
    try {
      const res = await fetch('/api/hf/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetId: activeDataset.id,
          config: selectedConfig,
          split: selectedSplit,
          records: [rec],
          collectionLabel: `Hugging Face Legal Library (${activeDataset.name})`
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Record #${rec.rowId} successfully indexed into local knowledge store!`);
        rec.isImportedLocally = true;
        await refreshCorpus();
        fetchImportedRecords();
        fetchDatasets(datasetSearch, selectedCategory);
      } else {
        showToast(data.errors?.[0] || 'Import failed');
      }
    } catch (err: any) {
      showToast(`Import error: ${err.message}`);
    } finally {
      setImportingRecordId(null);
    }
  };

  // Bulk import current page of records
  const handleBulkImportCurrentPage = async () => {
    if (!activeDataset || !recordsResponse || recordsResponse.records.length === 0) return;
    setIsBulkImporting(true);
    try {
      const res = await fetch('/api/hf/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetId: activeDataset.id,
          config: selectedConfig,
          split: selectedSplit,
          records: recordsResponse.records,
          collectionLabel: `Hugging Face Legal Library (${activeDataset.name})`
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(
          `Bulk Import Complete: ${data.importedCount} new records indexed (${data.skippedDuplicates} duplicates preserved)!`
        );
        if (data.categoryBreakdown) {
          setBatchReport({
            totalProcessed: recordsResponse.records.length,
            importedCount: data.importedCount,
            skippedDuplicates: data.skippedDuplicates,
            unclassifiedCount: data.unclassifiedCount || 0,
            categoryBreakdown: data.categoryBreakdown
          });
        }
        // Mark all in current response as imported
        recordsResponse.records.forEach((r) => (r.isImportedLocally = true));
        await refreshCorpus();
        fetchImportedRecords();
        fetchDatasets(datasetSearch, selectedCategory);
      } else {
        showToast(data.errors?.[0] || 'Bulk import failed');
      }
    } catch (err: any) {
      showToast(`Bulk import error: ${err.message}`);
    } finally {
      setIsBulkImporting(false);
    }
  };

  // Automated Batch Ingestion from Hugging Face API
  const handleBatchIngest = async (size: number) => {
    if (!activeDataset) return;
    setIsBatchIngesting(true);
    try {
      showToast(`Initiating automated ingestion of ${size} records from ${activeDataset.name}...`);
      const res = await fetch('/api/hf/batch-ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          datasetId: activeDataset.id,
          config: selectedConfig,
          split: selectedSplit,
          offset: pageOffset,
          batchSize: size,
          collectionLabel: `Hugging Face Batch Pipeline (${activeDataset.name})`
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setBatchReport({
          totalProcessed: data.importedCount + data.skippedDuplicates,
          importedCount: data.importedCount,
          skippedDuplicates: data.skippedDuplicates,
          unclassifiedCount: data.unclassifiedCount || 0,
          categoryBreakdown: data.categoryBreakdown || {}
        });

        showToast(
          `Batch Ingest Complete: ${data.importedCount} new records saved, ${data.skippedDuplicates} duplicate skips preserved!`
        );

        await refreshCorpus();
        fetchImportedRecords();
        fetchDatasets(datasetSearch, selectedCategory);
      } else {
        showToast(data.errors?.[0] || data.details || 'Batch ingestion failed');
      }
    } catch (err: any) {
      showToast(`Batch ingestion error: ${err.message}`);
    } finally {
      setIsBatchIngesting(false);
    }
  };

  // Open imported record in existing application sections
  const handleOpenInNativeExplorer = (rec: any) => {
    const isJudgment = rec.documentType === 'Judgment' || Boolean(rec.court);
    if (isJudgment) {
      setSelectedCaseId(rec.documentId || rec.id);
      setCurrentView('judgment_detail');
      showToast(`Viewing ${rec.title || 'judgment'} in Case Law Explorer`);
    } else {
      setSelectedSectionId(rec.documentId || rec.id);
      setCurrentView('acts_sections');
      showToast(`Viewing ${rec.title || 'statute'} in Acts & Sections Explorer`);
    }
  };

  // Ask Law Bot about this specific Hugging Face record
  const handleAskLawBotAboutRecord = (rec: HFDatasetRecord) => {
    const query = `Analyze this legal record from Hugging Face dataset ${rec.datasetId} (Citation: ${rec.normalizedCitation || rec.normalizedTitle}):\n\nTitle: ${rec.normalizedTitle}\n${rec.normalizedCourt ? `Court: ${rec.normalizedCourt}\n` : ''}${rec.verbatimText.slice(0, 1000)}`;
    createNewChat();
    // Navigate to chat
    setCurrentView('ask_law_bot');
    showToast(`Loaded record into Law Bot AI research session`);
  };

  return (
    <div className="min-h-full bg-slate-50 text-slate-900 pb-16">
      {/* Top Tricolor Ribbon */}
      <div className="gov-tricolor-stripe" />

      {/* Top Breadcrumb & Hero Header */}
      <div className="bg-[#0b2239] text-white border-b border-[#1a426e] py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span>Hugging Face Hub & Statutory Repository Live Integration</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-emerald-300 font-mono">Live API Connected</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight flex items-center gap-2.5">
                <BookOpen className="w-7 h-7 text-amber-400" />
                <span>Acts & Sections</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Connect directly to Hugging Face legal repositories and statutory codes. Dynamically explore, paginate, and search authentic Indian statutory enactments, BNS/IPC sections, constitutional texts, and case law datasets within Law Bot AI.
              </p>
            </div>

            {/* Mode Switcher Toggle */}
            <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-auto">
              <div className="flex items-center bg-[#071727] p-1 rounded-lg border border-[#1a426e]">
                <button
                  onClick={() => setActiveMode('live')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all ${
                    activeMode === 'live'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Live Explorer Mode</span>
                </button>
                <button
                  onClick={() => {
                    setActiveMode('library');
                    fetchImportedRecords();
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-all ${
                  activeMode === 'library'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>Local Legal Library ({importedRecords.length})</span>
              </button>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts for evaluated repositories */}
          <div className="mt-4 pt-3 border-t border-[#1a426e]/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Verified Core Datasets:
            </span>
            <button
              onClick={() => loadDatasetDetails('KanoonGPT/indian-case-laws')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors border ${
                activeDataset?.id === 'KanoonGPT/indian-case-laws'
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              ⚖️ KanoonGPT/indian-case-laws (10M+ Case Laws)
            </button>
            <button
              onClick={() => loadDatasetDetails('ddycorp/CPT-Dataset-Indian-Constitution')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors border ${
                activeDataset?.id === 'ddycorp/CPT-Dataset-Indian-Constitution'
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              🏛️ ddycorp/CPT-Dataset-Indian-Constitution
            </button>
            <button
              onClick={() => loadDatasetDetails('AravArun/dhara-indian-criminal-law')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors border ${
                activeDataset?.id === 'AravArun/dhara-indian-criminal-law'
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              📜 AravArun/dhara-indian-criminal-law (BNS & IPC)
            </button>
            <button
              onClick={() => loadDatasetDetails('vaquill/open-india-law')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors border ${
                activeDataset?.id === 'vaquill/open-india-law'
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              📦 vaquill/open-india-law (State Parquet Shards)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* ========================================================================= */}
        {/* LOCAL LEGAL LIBRARY MODE VIEW */}
        {/* ========================================================================= */}
        {activeMode === 'library' ? (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-amber-600" />
                    <span>Locally Indexed Hugging Face Legal Library</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Records permanently ingested into the high-performance local knowledge store. Fully available for offline browsing, hybrid search, and Law Bot AI RAG answers.
                  </p>
                </div>
                <button
                  onClick={fetchImportedRecords}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Library</span>
                </button>
              </div>

              {loadingImported ? (
                <div className="py-12 text-center text-slate-500">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-600 mb-2" />
                  <p className="text-xs">Loading local legal records...</p>
                </div>
              ) : importedRecords.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-200">
                    <Database className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No Hugging Face records imported yet</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                    Switch to Live Explorer Mode, explore authentic Indian case laws or statutory codes, and click "Import to Local Knowledge Store".
                  </p>
                  <button
                    onClick={() => setActiveMode('live')}
                    className="px-4 py-2 bg-[#0b2239] text-white text-xs font-bold rounded-lg hover:bg-[#123253] transition-colors"
                  >
                    Open Live Explorer Mode
                  </button>
                </div>
              ) : (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Document Title</th>
                        <th className="py-3 px-3">Type</th>
                        <th className="py-3 px-3">Court / Jurisdiction</th>
                        <th className="py-3 px-3">Citation / Ref</th>
                        <th className="py-3 px-3">Ingested At</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {importedRecords.map((item, idx) => (
                        <tr key={idx} className="hover:bg-amber-50/40 transition-colors">
                          <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">
                            {item.title}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                              {item.documentType}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-600">{item.court || item.jurisdiction}</td>
                          <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                            {item.citation || '—'}
                          </td>
                          <td className="py-3 px-3 text-slate-500">{item.ingestedAt?.split('T')[0] || 'Today'}</td>
                          <td className="py-3 px-3 text-right flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenInNativeExplorer(item)}
                              className="px-2.5 py-1 rounded bg-amber-50 text-amber-900 border border-amber-300 text-[11px] font-semibold hover:bg-amber-100 transition-colors inline-flex items-center gap-1"
                              title={item.documentType === 'Judgment' ? 'Open in Case Law Explorer' : 'Open in Acts & Sections Explorer'}
                            >
                              <BookOpen className="w-3 h-3 text-amber-700" />
                              <span>{item.documentType === 'Judgment' ? 'View Precedent' : 'View Section'}</span>
                            </button>
                            <button
                              onClick={() => {
                                const query = `Explain ${item.title} (${item.citation || 'Hugging Face local record'})`;
                                createNewChat();
                                setCurrentView('ask_law_bot');
                              }}
                              className="px-2.5 py-1 rounded bg-[#0b2239] text-white text-[11px] font-semibold hover:bg-[#123253] transition-colors inline-flex items-center gap-1"
                            >
                              <MessageSquare className="w-3 h-3 text-amber-400" />
                              <span>Ask AI</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* LIVE EXPLORER MODE VIEW */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Search & Category Filter Section */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                {/* Search input */}
                <div className="relative w-full sm:max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={datasetSearch}
                    onChange={(e) => setDatasetSearch(e.target.value)}
                    placeholder="Search Indian legal datasets (e.g. KanoonGPT, BNS, constitution)..."
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                  />
                  {datasetSearch && (
                    <button
                      onClick={() => setDatasetSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Refresh list button */}
                <button
                  onClick={() => fetchDatasets(datasetSearch, selectedCategory)}
                  disabled={loadingDatasets}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingDatasets ? 'animate-spin' : ''}`} />
                  <span>Discover More on Hub</span>
                </button>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-3 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-slate-400" />
                  Category:
                </span>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#0b2239] text-white shadow-2xs font-semibold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Datasets Cards Carousel / Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span>Available Hugging Face Datasets ({datasets.length})</span>
                </h2>
                <span className="text-xs text-slate-500">
                  Select a dataset to load live records & splits below
                </span>
              </div>

              {loadingDatasets ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-44 bg-white rounded-xl border border-slate-200 p-5 animate-pulse" />
                  ))}
                </div>
              ) : datasets.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold">No Indian legal datasets found matching "{datasetSearch}"</p>
                  <button
                    onClick={() => {
                      setDatasetSearch('');
                      setSelectedCategory('All');
                    }}
                    className="mt-2 text-xs text-amber-600 underline font-bold"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {datasets.map((d) => {
                    const isSelected = activeDataset?.id === d.id;
                    return (
                      <div
                        key={d.id}
                        className={`bg-white rounded-xl border transition-all p-5 flex flex-col justify-between shadow-2xs ${
                          isSelected
                            ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/10'
                            : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                        }`}
                      >
                        <div>
                          {/* Top Badges */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0b2239] text-white">
                              {d.category}
                            </span>
                            {d.accessStatus === 'accessible' ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                Live Viewer
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                                <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                                Shards Only
                              </span>
                            )}
                          </div>

                          {/* Title & Author */}
                          <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                            {d.name}
                          </h3>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                            <span>repo:</span>
                            <span className="text-amber-700 font-semibold">{d.id}</span>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                            {d.description}
                          </p>

                          {/* Verification Notes */}
                          {d.verificationNotes && (
                            <div className="mt-2.5 p-2 bg-slate-50 rounded border border-slate-200/80 text-[11px] text-slate-600 leading-snug">
                              <span className="font-semibold text-slate-700">Audit Note:</span> {d.verificationNotes}
                            </div>
                          )}
                        </div>

                        {/* Bottom Stats & Explore Button */}
                        <div className="mt-4 pt-3 border-t border-slate-100">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Download className="w-3 h-3 text-slate-400" />
                              {d.downloads.toLocaleString()} DLs
                            </span>
                            <span className="flex items-center gap-1">
                              <Tag className="w-3 h-3 text-slate-400" />
                              {d.license || 'Open'}
                            </span>
                            {d.importedCount ? (
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <HardDrive className="w-3 h-3" />
                                {d.importedCount} Indexed
                              </span>
                            ) : null}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => loadDatasetDetails(d.id)}
                              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                                isSelected
                                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                                  : 'bg-[#0b2239] text-white hover:bg-[#123253]'
                              }`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{isSelected ? 'Viewing Records' : 'Explore Records'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => loadDatasetDetails(d.id)}
                              className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                              title={`Inspect ${d.id} inside application`}
                            >
                              <Database className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ===================================================================== */}
            {/* ACTIVE DATASET RECORDS BROWSER */}
            {/* ===================================================================== */}
            {activeDataset && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-200">
                {/* Active Dataset Header & Split Selector */}
                <div className="bg-[#071727] text-white p-5 border-b border-[#1a426e]">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
                        <span>DATASET:</span>
                        <span className="font-bold underline">{activeDataset.id}</span>
                        <span>·</span>
                        <span className="text-slate-300">{activeDataset.category}</span>
                      </div>
                      <h2 className="text-xl font-bold font-sans text-white tracking-tight flex items-center gap-2">
                        <span>{activeDataset.name}</span>
                        <span className="text-slate-400 text-xs inline-flex items-center gap-1 font-normal font-mono bg-[#0b2239] px-2 py-0.5 rounded border border-[#1a426e]">
                          <Database className="w-3 h-3 text-amber-400" />
                          <span>In-App Dataset Stream</span>
                        </span>
                      </h2>
                      <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                        {activeDataset.description}
                      </p>
                    </div>

                    {/* Actions: Batch Ingestion Pipeline & Current Page Import */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {activeDataset.accessStatus === 'accessible' && (
                        <>
                          <div className="flex items-center gap-1 bg-[#0b2239] p-1 rounded-lg border border-[#1a426e]">
                            <select
                              value={batchSize}
                              onChange={(e) => setBatchSize(Number(e.target.value))}
                              className="bg-transparent text-amber-300 text-xs font-bold px-1.5 py-1 outline-none"
                              title="Batch size to retrieve & ingest"
                            >
                              <option value={5} className="bg-[#0b2239] text-white">5 items</option>
                              <option value={10} className="bg-[#0b2239] text-white">10 items</option>
                              <option value={25} className="bg-[#0b2239] text-white">25 items</option>
                              <option value={50} className="bg-[#0b2239] text-white">50 items</option>
                            </select>
                            <button
                              onClick={() => handleBatchIngest(batchSize)}
                              disabled={isBatchIngesting}
                              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded text-xs flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${isBatchIngesting ? 'animate-spin' : ''}`} />
                              <span>{isBatchIngesting ? 'Ingesting Batch...' : `Batch Ingest (${batchSize})`}</span>
                            </button>
                          </div>

                          <button
                            onClick={handleBulkImportCurrentPage}
                            disabled={isBulkImporting || loadingRecords}
                            className="flex items-center gap-1.5 px-3 py-2 bg-[#0b2239] hover:bg-[#123253] text-amber-300 text-xs font-bold rounded-lg border border-amber-500/40 transition-colors"
                          >
                            <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                            <span>{isBulkImporting ? 'Ingesting...' : 'Import Page'}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Batch Ingestion & Classification Results Banner */}
                  {batchReport && (
                    <div className="mt-4 p-3.5 bg-gradient-to-r from-slate-900 to-[#0e2744] border border-amber-500/40 rounded-lg text-xs space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-amber-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Ingestion & Classification Pipeline Report</span>
                        </div>
                        <button
                          onClick={() => setBatchReport(null)}
                          className="text-[11px] text-slate-400 hover:text-white underline"
                        >
                          Dismiss
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                        <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                          {batchReport.importedCount} Ingested
                        </span>
                        <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded font-mono">
                          {batchReport.skippedDuplicates} Duplicates Skipped (SHA-256)
                        </span>
                        {batchReport.unclassifiedCount > 0 && (
                          <span className="bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded font-mono">
                            {batchReport.unclassifiedCount} Review Required
                          </span>
                        )}

                        <span className="text-slate-400 ml-1">Categories:</span>
                        {Object.entries(batchReport.categoryBreakdown).map(([cat, count]) => (
                          <span
                            key={cat}
                            className="bg-blue-950 text-blue-200 border border-blue-800 px-2 py-0.5 rounded font-mono"
                          >
                            {cat}: {count}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Config & Split Selectors */}
                  {activeDataset.configs && activeDataset.configs.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#1a426e] flex flex-wrap items-center gap-4 text-xs">
                      {/* Config selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-bold uppercase text-[10px]">Config:</span>
                        <select
                          value={selectedConfig}
                          onChange={(e) => handleConfigChange(e.target.value)}
                          className="bg-[#0b2239] text-white text-xs rounded border border-[#1a426e] px-2.5 py-1 outline-none focus:border-amber-400"
                        >
                          {activeDataset.configs.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Split selector */}
                      {activeDataset.splits && activeDataset.splits.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-bold uppercase text-[10px]">Split:</span>
                          <select
                            value={selectedSplit}
                            onChange={(e) => handleSplitChange(e.target.value)}
                            className="bg-[#0b2239] text-white text-xs rounded border border-[#1a426e] px-2.5 py-1 outline-none focus:border-amber-400"
                          >
                            {activeDataset.splits
                              .filter((s) => s.config === selectedConfig)
                              .map((s) => (
                                <option key={s.split} value={s.split}>
                                  {s.split} {s.numRows ? `(${s.numRows.toLocaleString()} rows)` : ''}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}

                      {/* Search within records */}
                      <form onSubmit={handleRecordsSearchSubmit} className="flex-1 max-w-sm flex items-center gap-1.5 ml-auto">
                        <div className="relative w-full">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={recordsSearch}
                            onChange={(e) => setRecordsSearch(e.target.value)}
                            placeholder="Filter records by keyword / section..."
                            className="w-full bg-[#0b2239] text-white text-xs rounded border border-[#1a426e] pl-8 pr-3 py-1 outline-none focus:border-amber-400 placeholder:text-slate-500"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded text-xs hover:bg-amber-400"
                        >
                          Filter
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                {/* Content Area: Viewer-Unsupported fallback (e.g. vaquill/open-india-law) vs Live Rows */}
                {activeDataset.accessStatus === 'viewer-unsupported' ? (
                  <div className="p-8 text-center bg-slate-50">
                    <div className="max-w-2xl mx-auto bg-white rounded-xl border border-amber-200 p-6 shadow-xs text-left">
                      <div className="flex items-center gap-2 text-amber-700 font-bold text-sm mb-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <span>Hugging Face Datasets Server Viewer Status: Custom Parquet Shards</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        The repository <span className="font-mono font-semibold">{activeDataset.id}</span> is fully active on the Hugging Face Hub, but uses multi-file custom Parquet splits (partitioned by Indian state and High Court) without an automated single-table viewer on Hugging Face Datasets Server.
                      </p>

                      {/* Repository Files Tree */}
                      {activeDataset.repositoryFiles && activeDataset.repositoryFiles.length > 0 && (
                        <div className="mt-4">
                          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <FolderTree className="w-4 h-4 text-slate-500" />
                            <span>Available Repository Parquet Shards ({activeDataset.repositoryFiles.length})</span>
                          </div>
                          <div className="bg-slate-900 text-slate-200 rounded-lg p-3 font-mono text-[11px] max-h-48 overflow-y-auto space-y-1">
                            {activeDataset.repositoryFiles.map((f, i) => (
                              <div key={i} className="flex items-center justify-between hover:text-amber-400">
                                <span>📄 {f}</span>
                                <span className="text-[10px] text-amber-400 font-mono">
                                  Indexed Shard
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Integrated in Law Bot AI:</span> The essential statutory provisions and Supreme Court precedents from Open India Law are pre-indexed into our local persistent store. You can search them in{' '}
                          <button
                            onClick={() => setCurrentView('acts_sections')}
                            className="font-bold underline text-amber-900"
                          >
                            Acts & Sections
                          </button>{' '}
                          or query them in{' '}
                          <button
                            onClick={() => setCurrentView('ask_law_bot')}
                            className="font-bold underline text-amber-900"
                          >
                            Ask Law Bot
                          </button>.
                        </div>
                      </div>
                    </div>
                  </div>
                ) : loadingRecords ? (
                  <div className="py-24 text-center text-slate-500">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-600 mb-2" />
                    <p className="text-xs font-semibold">Connecting to Hugging Face Datasets Server...</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Streaming live records from {activeDataset.id} (offset {pageOffset}, length {pageSize})
                    </p>
                  </div>
                ) : !recordsResponse || recordsResponse.records.length === 0 ? (
                  <div className="py-16 text-center text-slate-500">
                    <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-xs font-semibold">No records returned for this split or filter.</p>
                    <button
                      onClick={() => {
                        setRecordsSearch('');
                        if (activeDataset) {
                          const [owner, repo] = activeDataset.id.split('/');
                          loadRecords(owner, repo, selectedConfig, selectedSplit, 0, pageSize, '');
                        }
                      }}
                      className="mt-2 text-xs text-amber-600 underline font-bold"
                    >
                      Clear search filter
                    </button>
                  </div>
                ) : (
                  <div>
                    {/* View Controls & Pagination Bar */}
                    <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="text-slate-600 font-medium">
                        Showing rows <span className="font-bold text-slate-900">{pageOffset + 1}</span>–
                        <span className="font-bold text-slate-900">
                          {pageOffset + recordsResponse.records.length}
                        </span>{' '}
                        of{' '}
                        <span className="font-bold text-slate-900">
                          {recordsResponse.totalRows.toLocaleString()}
                        </span>{' '}
                        total records
                        {recordsResponse.isLive && (
                          <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                            Live Streamed
                          </span>
                        )}
                      </div>

                      {/* Pagination Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handlePrevPage}
                          disabled={pageOffset === 0 || loadingRecords}
                          className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>Previous</span>
                        </button>
                        <span className="text-xs font-mono text-slate-600">
                          Page {Math.floor(pageOffset / pageSize) + 1}
                        </span>
                        <button
                          onClick={handleNextPage}
                          disabled={
                            pageOffset + pageSize >= recordsResponse.totalRows || loadingRecords
                          }
                          className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Records List / Grid */}
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {recordsResponse.records.map((rec) => {
                        const isImported = rec.isImportedLocally;
                        const isImportingThis = importingRecordId === rec.rowId;

                        return (
                          <div
                            key={rec.rowId}
                            className="bg-white rounded-lg border border-slate-200 p-4 hover:border-amber-400 hover:shadow-xs transition-all flex flex-col justify-between text-left group"
                          >
                            <div>
                              {/* Top Meta Line */}
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                  {rec.normalizedDocType}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  {isImported ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                                      In Library
                                    </span>
                                  ) : null}
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    #{rec.rowId}
                                  </span>
                                </div>
                              </div>

                              {/* Title */}
                              <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2">
                                {rec.normalizedTitle}
                              </h4>

                              {/* Secondary Metadata */}
                              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500">
                                {rec.normalizedCourt && (
                                  <span className="flex items-center gap-1">
                                    <Scale className="w-3 h-3 text-slate-400" />
                                    {rec.normalizedCourt}
                                  </span>
                                )}
                                {rec.normalizedCitation && (
                                  <span className="font-mono text-amber-800 font-semibold">
                                    {rec.normalizedCitation}
                                  </span>
                                )}
                                {rec.normalizedDate && (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-400" />
                                    {rec.normalizedDate}
                                  </span>
                                )}
                              </div>

                              {/* Snippet */}
                              <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed font-sans bg-slate-50 p-2 rounded border border-slate-100">
                                {rec.summaryOrSnippet}
                              </p>
                            </div>

                            {/* Actions Bottom Bar */}
                            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                              <button
                                onClick={() => setInspectingRecord(rec)}
                                className="text-xs font-bold text-[#0b2239] hover:text-amber-600 transition-colors flex items-center gap-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View Full Text</span>
                              </button>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleAskLawBotAboutRecord(rec)}
                                  className="p-1.5 rounded hover:bg-slate-100 text-slate-600 hover:text-amber-600 transition-colors"
                                  title="Ask Law Bot AI about this record"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleImportSingleRecord(rec)}
                                  disabled={isImported || isImportingThis}
                                  className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                                    isImported
                                      ? 'bg-slate-100 text-slate-500 cursor-default'
                                      : 'bg-[#0b2239] text-white hover:bg-[#123253]'
                                  }`}
                                  title="Index permanently into local knowledge store for RAG"
                                >
                                  {isImported ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      <span>Saved</span>
                                    </>
                                  ) : isImportingThis ? (
                                    <>
                                      <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                                      <span>Saving...</span>
                                    </>
                                  ) : (
                                    <>
                                      <HardDrive className="w-3 h-3 text-amber-400" />
                                      <span>Save to Library</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* FULL RECORD MODAL / DRAWER */}
      {/* ========================================================================= */}
      {inspectingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#0b2239] text-white p-5 border-b border-[#1a426e] flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-1">
                  <span>HUGGING FACE RECORD #{inspectingRecord.rowId}</span>
                  <span>·</span>
                  <span className="text-slate-300">{inspectingRecord.datasetId}</span>
                </div>
                <h3 className="text-lg font-bold font-sans text-white leading-snug">
                  {inspectingRecord.normalizedTitle}
                </h3>
              </div>
              <button
                onClick={() => setInspectingRecord(null)}
                className="text-slate-400 hover:text-white p-1 rounded transition-colors text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Metadata Pill Strip */}
            <div className="px-5 py-2.5 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center gap-2.5 text-xs">
              {inspectingRecord.classificationCategory && (
                <span className="px-2.5 py-0.5 rounded font-bold text-[11px] bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
                  <span>Category: {inspectingRecord.classificationCategory}</span>
                  {inspectingRecord.classificationConfidence && (
                    <span className="text-[10px] text-blue-700 font-mono">({Math.round(inspectingRecord.classificationConfidence * 100)}%)</span>
                  )}
                </span>
              )}
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800 border border-slate-300">
                {inspectingRecord.normalizedDocType}
              </span>
              {inspectingRecord.normalizedCourt && (
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Scale className="w-3.5 h-3.5 text-slate-500" />
                  {inspectingRecord.normalizedCourt}
                </span>
              )}
              {inspectingRecord.normalizedCitation && (
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-amber-900 font-bold">
                  {inspectingRecord.normalizedCitation}
                </span>
              )}
              {inspectingRecord.normalizedDate && (
                <span className="flex items-center gap-1 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {inspectingRecord.normalizedDate}
                </span>
              )}
              <span className="ml-auto text-[11px] text-slate-500 font-mono">
                config: {inspectingRecord.config} | split: {inspectingRecord.split}
              </span>
            </div>

            {/* Verbatim Text Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans text-xs sm:text-sm leading-relaxed text-slate-800">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold uppercase tracking-wider text-slate-700 text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>Verbatim Legal Text & Statutory Excerpt</span>
                </span>
                <button
                  onClick={() => handleCopy(inspectingRecord.verbatimText, inspectingRecord.rowId)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                >
                  {copiedId === inspectingRecord.rowId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 font-sans leading-relaxed whitespace-pre-wrap max-h-[45vh] overflow-y-auto text-slate-900 select-text">
                {inspectingRecord.verbatimText}
              </div>

              {/* Attribution and Raw Schema */}
              <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200/80 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <span className="font-bold">Original Source Attribution:</span> Hugging Face Repository{' '}
                  <span className="font-mono font-semibold">{inspectingRecord.datasetId}</span>
                </div>
                <span className="font-bold text-amber-900 font-mono text-[11px] bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  Verified In-App Corpus Record ({inspectingRecord.datasetId})
                </span>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setInspectingRecord(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                Close Record
              </button>

              <div className="flex flex-wrap items-center gap-2">
                {inspectingRecord.isImportedLocally && (
                  <button
                    onClick={() => {
                      const canonicalId = `doc-hf-${inspectingRecord.datasetId.replace(/[^a-zA-Z0-9]/g, '-')}-${String(inspectingRecord.rowId).replace(/[^a-zA-Z0-9_-]/g, '_')}`;
                      handleOpenInNativeExplorer({
                        documentId: canonicalId,
                        documentType: inspectingRecord.normalizedDocType,
                        title: inspectingRecord.normalizedTitle,
                        court: inspectingRecord.normalizedCourt
                      });
                      setInspectingRecord(null);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-xs"
                  >
                    <BookOpen className="w-4 h-4 text-slate-950" />
                    <span>
                      {inspectingRecord.normalizedDocType === 'Judgment'
                        ? 'Open in Case Law Explorer'
                        : 'Open in Acts & Sections Explorer'}
                    </span>
                  </button>
                )}

                <button
                  onClick={() => {
                    handleAskLawBotAboutRecord(inspectingRecord);
                    setInspectingRecord(null);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-200 text-slate-900 text-xs font-bold hover:bg-slate-300 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  <span>Ask Law Bot</span>
                </button>

                <button
                  onClick={() => handleImportSingleRecord(inspectingRecord)}
                  disabled={inspectingRecord.isImportedLocally || importingRecordId === inspectingRecord.rowId}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    inspectingRecord.isImportedLocally
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-[#0b2239] text-white hover:bg-[#123253]'
                  }`}
                >
                  <HardDrive className="w-4 h-4 text-amber-400" />
                  <span>
                    {inspectingRecord.isImportedLocally
                      ? 'Saved to Local Library'
                      : importingRecordId === inspectingRecord.rowId
                      ? 'Saving...'
                      : 'Save to Local Legal Library'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
