import React, { useState } from 'react';
import {
  GitCompare,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LegalComparisonTool: React.FC = () => {
  const { sections, setCurrentView, setSelectedSectionId } = useApp();

  const [leftSectionId, setLeftSectionId] = useState('sec-ipc-420');
  const [rightSectionId, setRightSectionId] = useState('sec-ipc-415');
  const [activeTab, setActiveTab] = useState<'side_by_side' | 'differences' | 'summary'>('side_by_side');

  const leftSection = sections.find((s) => s.id === leftSectionId) || sections[0];
  const rightSection = sections.find((s) => s.id === rightSectionId) || sections[1];

  const handleSwap = () => {
    const temp = leftSectionId;
    setLeftSectionId(rightSectionId);
    setRightSectionId(temp);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 text-slate-800">
      {/* Header matching Mockup Screen 13 */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
          Compare Legal Provisions
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Select two sections or provisions to examine textual distinctions, mens rea elements, scope, and prescribed punishments.
        </p>
      </div>

      {/* Selectors Bar matching Screen 13 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="grid md:grid-cols-12 gap-3 items-center">
          {/* Left Selector */}
          <div className="md:col-span-5">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              First Provision
            </label>
            <select
              value={leftSectionId}
              onChange={(e) => setLeftSectionId(e.target.value)}
              className="w-full p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.actName} — Section {s.sectionNumber}: {s.title}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-2 flex justify-center">
            <button
              onClick={handleSwap}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Swap Provisions"
            >
              <ArrowRightLeft className="w-4 h-4 text-blue-600" />
            </button>
          </div>

          {/* Right Selector */}
          <div className="md:col-span-5">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Second Provision
            </label>
            <select
              value={rightSectionId}
              onChange={(e) => setRightSectionId(e.target.value)}
              className="w-full p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-100"
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.actName} — Section {s.sectionNumber}: {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sub-tabs matching Screen 13 */}
        <div className="flex items-center gap-4 border-t border-slate-100 pt-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('side_by_side')}
            className={`pb-1 transition-colors ${
              activeTab === 'side_by_side'
                ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Side by Side
          </button>
          <button
            onClick={() => setActiveTab('differences')}
            className={`pb-1 transition-colors ${
              activeTab === 'differences'
                ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Key Differences
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`pb-1 transition-colors ${
              activeTab === 'summary'
                ? 'text-blue-600 border-b-2 border-blue-600 font-bold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Summary
          </button>
        </div>
      </div>

      {/* Comparison Table matching Mockup Screen 13 */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-900 text-white border-b border-slate-800">
                <th className="py-3 px-4 font-bold text-slate-300 w-1/4">Comparison Attribute</th>
                <th className="py-3 px-4 font-bold text-amber-300 w-3/8">
                  Section {leftSection.sectionNumber} ({leftSection.actName})
                </th>
                <th className="py-3 px-4 font-bold text-blue-300 w-3/8">
                  Section {rightSection.sectionNumber} ({rightSection.actName})
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* Row 1: Title matching Screen 13 */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-600 bg-slate-50/60">Title</td>
                <td className="py-3 px-4 text-slate-900 font-semibold">{leftSection.title}</td>
                <td className="py-3 px-4 text-slate-900 font-semibold">{rightSection.title}</td>
              </tr>

              {/* Row 2: Punishment matching Screen 13 */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-600 bg-slate-50/60">Punishment</td>
                <td className="py-3 px-4 text-red-700 font-medium">
                  {leftSection.punishment || 'Prescribed under specific procedural schedules'}
                </td>
                <td className="py-3 px-4 text-red-700 font-medium">
                  {rightSection.punishment || 'Prescribed under specific procedural schedules'}
                </td>
              </tr>

              {/* Row 3: Key Elements matching Screen 13 */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-600 bg-slate-50/60">Key Elements</td>
                <td className="py-3 px-4 text-slate-700">
                  <ul className="space-y-1">
                    {leftSection.keyIngredients.map((ing, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="py-3 px-4 text-slate-700">
                  <ul className="space-y-1">
                    {rightSection.keyIngredients.map((ing, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>

              {/* Row 4: Nature matching Screen 13 */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-600 bg-slate-50/60">Nature of Offence</td>
                <td className="py-3 px-4 text-slate-700">
                  Graver, compoundable/non-bailable form of cheating specifically requiring delivery of property or alteration of valuable security.
                </td>
                <td className="py-3 px-4 text-slate-700">
                  Foundational definition of cheating covering mental harm, physical damage, reputation, or property loss.
                </td>
              </tr>

              {/* Row 5: Scope & Applicability matching Screen 13 */}
              <tr className="hover:bg-slate-50/50">
                <td className="py-3 px-4 font-bold text-slate-600 bg-slate-50/60">Scope & Applicability</td>
                <td className="py-3 px-4 text-slate-700">
                  Applies strictly to immovable/movable property or valuable securities. Sine qua non: dishonest intention at inception.
                </td>
                <td className="py-3 px-4 text-slate-700">
                  Broader scope covering acts or omissions induced by fraudulent representation.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
