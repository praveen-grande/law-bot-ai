import React, { useState } from 'react';
import {
  Bookmark,
  Scale,
  FileText,
  Search,
  BookOpen,
  Trash2,
  ExternalLink,
  ArrowRight,
  MoreVertical,
  Download,
  FolderPlus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MyResearch: React.FC = () => {
  const {
    sections,
    judgments,
    savedSections,
    savedCases,
    uploadedDocs,
    toggleBookmarkSection,
    toggleBookmarkCase,
    setSelectedSectionId,
    setSelectedCaseId,
    setCurrentView,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bookmarks' | 'cases' | 'documents' | 'notes' | 'searches'>('bookmarks');

  const bookmarkedSectionList = sections.filter((s) => savedSections.includes(s.id));
  const bookmarkedCaseList = judgments.filter((j) => savedCases.includes(j.id));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 text-slate-800">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
          My Research Workspace
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Access your bookmarked statutes, saved judicial precedents, uploaded legal documents, and research notes.
        </p>
      </div>

      {/* Tabs Header matching Mockup Screen 14 */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'bookmarks'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Bookmarks ({bookmarkedSectionList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cases')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'cases'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Saved Cases ({bookmarkedCaseList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'documents'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Documents ({uploadedDocs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'notes'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Notes (3)</span>
          </button>

          <button
            onClick={() => setActiveTab('searches')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeTab === 'searches'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Recent Searches</span>
          </button>
        </div>
      </div>

      {/* Main Workspace List matching Mockup Screen 14 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 text-xs">
        {/* Item 1: IPC Section 420 */}
        <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
          <div
            onClick={() => {
              setSelectedSectionId('sec-ipc-420');
              setCurrentView('acts_sections');
            }}
            className="flex items-center gap-3.5 cursor-pointer flex-1"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Bookmark className="w-4 h-4 fill-blue-600 text-blue-600" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">
                IPC Section 420 — Cheating and dishonestly inducing delivery of property
              </div>
              <div className="text-slate-500 mt-0.5">
                Indian Penal Code, 1860 • Chapter XVII
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-[11px]">2 Feb 2024</span>
            <button
              onClick={() => toggleBookmarkSection('sec-ipc-420')}
              className="p-1 hover:text-red-600 transition-colors"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Item 2: Registration Act */}
        <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
          <div
            onClick={() => {
              setSelectedSectionId('sec-reg-17');
              setCurrentView('acts_sections');
            }}
            className="flex items-center gap-3.5 cursor-pointer flex-1"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">
                The Registration Act, 1908 — Section 17 (Compulsory Registration)
              </div>
              <div className="text-slate-500 mt-0.5">
                Central Act • Ministry of Law & Justice
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-[11px]">28 Jan 2024</span>
            <button
              onClick={() => toggleBookmarkSection('sec-reg-17')}
              className="p-1 hover:text-red-600 transition-colors"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Item 3: State of Maharashtra v. Rajesh Shah */}
        <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
          <div
            onClick={() => {
              setSelectedCaseId('case-rajesh-shah-2020');
              setCurrentView('judgment_detail');
            }}
            className="flex items-center gap-3.5 cursor-pointer flex-1"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4 text-purple-700" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">
                State of Maharashtra v. Rajesh Shah
              </div>
              <div className="text-slate-500 mt-0.5 font-mono text-[11px]">
                (2020) 5 SCC 123 • Supreme Court of India
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-[11px]">25 Jan 2024</span>
            <button
              onClick={() => toggleBookmarkCase('case-rajesh-shah-2020')}
              className="p-1 hover:text-red-600 transition-colors"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Item 4: Saved Search Query */}
        <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
          <div
            onClick={() => {
              setCurrentView('legal_search');
            }}
            className="flex items-center gap-3.5 cursor-pointer flex-1"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
              <Search className="w-4 h-4 text-sky-700" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">
                Land registration process
              </div>
              <div className="text-slate-500 mt-0.5">
                Saved Search Query • Filter: Central + State
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-[11px]">20 Jan 2024</span>
            <button
              onClick={() => showToast('Removed saved search query')}
              className="p-1 hover:text-red-600 transition-colors"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Item 5: Uploaded Document */}
        <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
          <div
            onClick={() => {
              setCurrentView('document_analysis');
            }}
            className="flex items-center gap-3.5 cursor-pointer flex-1"
          >
            <div className="w-9 h-9 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-yellow-700" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">
                Agreement to Sell.pdf
              </div>
              <div className="text-slate-500 mt-0.5">
                Uploaded Document • 12 Pages • 2.4 MB
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-[11px]">15 Jan 2024</span>
            <button
              onClick={() => showToast('Document removed from workspace')}
              className="p-1 hover:text-red-600 transition-colors"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
