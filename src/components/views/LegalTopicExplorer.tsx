import React from 'react';
import {
  Landmark,
  ShieldAlert,
  Scale,
  Building,
  HeartHandshake,
  Briefcase,
  ShoppingBag,
  Building2,
  Terminal,
  Sparkles,
  Receipt,
  Car,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LEGAL_TOPICS } from '../../data/legalCorpus';

export const LegalTopicExplorer: React.FC = () => {
  const { setCurrentView, setSearchQuery } = useApp();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Landmark':
        return <Landmark className="w-5 h-5 text-blue-600" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-red-600" />;
      case 'Scale':
        return <Scale className="w-5 h-5 text-amber-600" />;
      case 'Building':
        return <Building className="w-5 h-5 text-emerald-600" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-rose-600" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-indigo-600" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-orange-600" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-cyan-600" />;
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-purple-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-yellow-600" />;
      case 'Receipt':
        return <Receipt className="w-5 h-5 text-teal-600" />;
      case 'Car':
        return <Car className="w-5 h-5 text-slate-700" />;
      default:
        return <BookOpen className="w-5 h-5 text-blue-600" />;
    }
  };

  const handleSelectTopic = (title: string) => {
    setSearchQuery(title);
    setCurrentView('legal_search');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200 text-slate-800">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
          Legal Topics Explorer
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Explore structured collections of Indian laws, statutory provisions, and landmark court decisions across 12 major practice areas.
        </p>
      </div>

      {/* 12 Topic Cards Grid matching Mockup Screen 12 */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LEGAL_TOPICS.map((topic) => (
          <div
            key={topic.id}
            onClick={() => handleSelectTopic(topic.title)}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {getIcon(topic.iconName)}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {topic.totalJudgments} judgments
                </div>
              </div>

              <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                {topic.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {topic.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-blue-600 font-semibold">
              <span className="text-[11px] text-slate-400 font-normal">
                {topic.featuredActs[0]}
              </span>
              <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
