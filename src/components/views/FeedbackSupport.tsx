import React, { useState } from 'react';
import {
  HelpCircle,
  AlertTriangle,
  Send,
  CheckCircle2,
  Scale,
  Shield,
  FileQuestion,
  FileWarning
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FeedbackReport } from '../../types/legal';

export const FeedbackSupport: React.FC = () => {
  const { submitFeedback, showToast } = useApp();

  const [feedbackType, setFeedbackType] = useState<FeedbackReport['type']>('Incorrect Citation');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    submitFeedback(feedbackType, description);
    setSubmitted(true);
    showToast('Report submitted to legal audit queue.');
    setTimeout(() => {
      setDescription('');
      setSubmitted(false);
    }, 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200 text-slate-800">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
          Feedback & Citation Audit
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Law Bot AI relies on high-integrity legal sources. Report broken citations, outdated statutory provisions, or OCR extraction issues.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6 text-xs">
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Report Successfully Submitted</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Thank you. Our legal operations team and verification automated pipelines review reported citation discrepancies against official gazette entries.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Feedback / Issue Category
              </label>
              <select
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
              >
                <option value="Incorrect Citation">Incorrect or Broken Case Citation</option>
                <option value="Outdated Section">Outdated Section / Recent Amendment</option>
                <option value="Extraction Issue">Document OCR or Extraction Issue</option>
                <option value="General Feedback">General Legal Research Feedback</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Detailed Description & Context
              </label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the discrepancy, specify the Act name, Section number, or Case citation..."
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl text-blue-900 text-[11px] leading-relaxed flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                All reported discrepancies are entered into our audit history and reflected in the Admin and Super Admin monitoring consoles.
              </span>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Report</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
