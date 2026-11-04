import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  ArrowRight,
  Sparkles,
  Download,
  Copy,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UploadedLegalDocument } from '../../types/legal';
import { SAMPLE_UPLOADED_DOC } from '../../data/legalCorpus';

export const DocumentAnalysis: React.FC = () => {
  const { uploadedDocs, addUploadedDoc, showToast, setCurrentView, setSelectedSectionId } = useApp();

  const [currentDoc, setCurrentDoc] = useState<UploadedLegalDocument>(
    uploadedDocs[0] || SAMPLE_UPLOADED_DOC
  );
  const [activeTab, setActiveTab] = useState<'summary' | 'key_info' | 'legal_refs'>('summary');
  const [leftTab, setLeftTab] = useState<'analysis' | 'extracted_text'>('analysis');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    showToast(`Uploading and extracting clauses from "${file.name}"...`);

    setTimeout(() => {
      const newDoc: UploadedLegalDocument = {
        id: `doc-${Date.now()}`,
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: file.name.split('.').pop()?.toUpperCase() || 'PDF',
        pageCount: Math.floor(Math.random() * 8) + 3,
        uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        parties: {
          sellerOrFirstParty: 'Vendor: S. K. Enterprises',
          buyerOrSecondParty: 'Purchaser: Apex Tech Ltd',
          witnesses: ['A. Raman', 'P. Sen']
        },
        propertyOrSubject: 'Commercial office premise, Bangalore Cyber Park',
        agreementDate: '24 Oct 2024',
        summary: `Automated clause extraction completed for ${file.name}. Identifies obligations, governing law clause under Indian arbitration act, and registration requirements.`,
        extractedClauses: [
          {
            title: 'Clause 2 — Term and Renewal',
            text: 'The lease shall be for an initial period of 3 years with 5% escalation upon renewal.',
            riskNote: 'Requires compulsory registration under Section 17 of The Registration Act, 1908.'
          },
          {
            title: 'Clause 8 — Governing Law & Jurisdiction',
            text: 'This agreement shall be governed by the laws of India and subject to courts in Bangalore.',
            riskNote: 'Standard jurisdiction clause.'
          }
        ],
        legalReferencesFound: [
          'The Registration Act, 1908 - Section 17',
          'Transfer of Property Act, 1882 - Section 107',
          'Indian Contract Act, 1872 - Section 10'
        ],
        extractedRawText: `EXTRACTED OCR TEXT FROM ${file.name.toUpperCase()}:\nThis Agreement is entered into on 24th October 2024 by and between the parties for commercial premises...`
      };

      addUploadedDoc(newDoc);
      setCurrentDoc(newDoc);
      setIsUploading(false);
      showToast('Document analyzed successfully!');
    }, 1200);
  };

  const handleLoadSample = (sampleType: 'sale' | 'lease') => {
    if (sampleType === 'sale') {
      setCurrentDoc(SAMPLE_UPLOADED_DOC);
      showToast('Loaded sample Agreement to Sell.pdf');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 text-slate-800">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
          Document Upload & Analysis
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Upload agreements, sale deeds, petitions, or notices for automated legal clause extraction and statute cross-referencing.
        </p>
      </div>

      {/* Grid: Left Upload & Right Analysis Panel matching Mockup Screen 11 */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Drag & Drop Zone (5 cols) matching Screen 11 */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Upload Document
            </h3>
            <button
              onClick={() => handleLoadSample('sale')}
              className="text-[11px] text-blue-600 font-semibold hover:underline"
            >
              Load Sample Deed
            </button>
          </div>

          {/* Drag & Drop Card matching Screen 11 */}
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center bg-slate-50/70 hover:bg-blue-50/20 transition-all relative">
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              Drag and drop your file here or click to browse
            </h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports PDF, DOCX, TXT (Max 20 MB)
            </p>
          </div>

          {/* Sub-tabs: Analysis vs Extracted Text matching Screen 11 */}
          <div className="flex items-center gap-2 border-b border-slate-200 pt-2">
            <button
              onClick={() => setLeftTab('analysis')}
              className={`pb-2 px-3 font-semibold text-xs transition-colors ${
                leftTab === 'analysis'
                  ? 'text-blue-600 border-b-2 border-blue-600 -mb-[1px]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Analysis
            </button>
            <button
              onClick={() => setLeftTab('extracted_text')}
              className={`pb-2 px-3 font-semibold text-xs transition-colors ${
                leftTab === 'extracted_text'
                  ? 'text-blue-600 border-b-2 border-blue-600 -mb-[1px]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Extracted Text
            </button>
          </div>

          {leftTab === 'analysis' ? (
            <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-slate-600 text-[11px]">
              <div className="flex items-center gap-2 font-semibold text-slate-900 text-xs">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Text OCR & NLP Integrity</span>
              </div>
              <p>
                Document text extracted with 99.4% optical character accuracy. Parties, date execution, and statutory obligations parsed into structured entities.
              </p>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl max-h-60 overflow-y-auto font-mono text-[10px] text-slate-700 whitespace-pre-wrap leading-relaxed border border-slate-200">
              {currentDoc.extractedRawText}
            </div>
          )}
        </div>

        {/* Right Side: Analysis Result Card (7 cols) matching Screen 11 */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Analysis Result
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <FileText className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-base text-slate-900">
                  {currentDoc.fileName}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5">
                <span>Type: {currentDoc.fileType}</span>
                <span>•</span>
                <span>Pages: {currentDoc.pageCount}</span>
                <span>•</span>
                <span>Size: {currentDoc.fileSize}</span>
              </div>
            </div>

            <button
              onClick={() => {
                showToast('Asking Law Bot about this agreement...');
                setCurrentView('ask_law_bot');
              }}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors self-start sm:self-center"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask Law Bot About File</span>
            </button>
          </div>

          {/* Result Sub-tabs matching Screen 11 */}
          <div className="flex items-center gap-3 border-b border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('summary')}
              className={`pb-2 transition-colors ${
                activeTab === 'summary'
                  ? 'text-blue-600 border-b-2 border-blue-600 -mb-[1px]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('key_info')}
              className={`pb-2 transition-colors ${
                activeTab === 'key_info'
                  ? 'text-blue-600 border-b-2 border-blue-600 -mb-[1px]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Key Information
            </button>
            <button
              onClick={() => setActiveTab('legal_refs')}
              className={`pb-2 transition-colors ${
                activeTab === 'legal_refs'
                  ? 'text-blue-600 border-b-2 border-blue-600 -mb-[1px]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Legal References
            </button>
          </div>

          {/* Tab 1: Summary matching Screen 11 */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 leading-relaxed">
                <p>{currentDoc.summary}</p>
              </div>

              {/* Key Information Table matching Screen 11 */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Key Information
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-500 bg-slate-50 w-36">
                          Parties
                        </td>
                        <td className="py-2.5 px-4 text-slate-800">
                          <div><span className="font-semibold">Seller/Vendor:</span> {currentDoc.parties.sellerOrFirstParty || 'Mr. Rajesh Kumar'}</div>
                          <div><span className="font-semibold">Buyer/Purchaser:</span> {currentDoc.parties.buyerOrSecondParty || 'Ms. Priya Sharma'}</div>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-500 bg-slate-50">
                          Property / Subject
                        </td>
                        <td className="py-2.5 px-4 text-slate-800 font-medium">
                          {currentDoc.propertyOrSubject || 'Residential plot, Jubilee Hills, Hyderabad'}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-slate-500 bg-slate-50">
                          Agreement Date
                        </td>
                        <td className="py-2.5 px-4 text-slate-800">
                          {currentDoc.agreementDate || '15 Mar 2023'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Extracted Key Clauses */}
              <div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Extracted Contract Clauses
                </h4>
                <div className="space-y-2">
                  {currentDoc.extractedClauses.map((clause, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="font-bold text-slate-900">{clause.title}</div>
                      <p className="text-slate-600">{clause.text}</p>
                      {clause.riskNote && (
                        <div className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded inline-block font-medium">
                          Note: {clause.riskNote}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Key Info */}
          {activeTab === 'key_info' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <span className="font-bold text-slate-900">Execution Validity:</span>
                <p className="text-slate-600">
                  Agreement contains signatures of both primary contracting parties and two attesting witnesses.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Legal References matching Screen 11 */}
          {activeTab === 'legal_refs' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900">Referenced Indian Statutes & Sections:</h4>
              <div className="space-y-2">
                {currentDoc.legalReferencesFound.map((ref, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (ref.includes('17')) {
                        setSelectedSectionId('sec-reg-17');
                        setCurrentView('acts_sections');
                      } else {
                        showToast(`Searching ${ref}`);
                      }
                    }}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-slate-900">{ref}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
