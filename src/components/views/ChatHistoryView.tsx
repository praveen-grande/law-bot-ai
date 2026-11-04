import React from 'react';
import {
  MessageSquare,
  Clock,
  Trash2,
  ArrowRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ChatHistoryView: React.FC = () => {
  const {
    conversations,
    setActiveConversationId,
    setCurrentView,
    createNewChat,
    showToast
  } = useApp();

  const handleOpenConversation = (id: string) => {
    setActiveConversationId(id);
    setCurrentView('ask_law_bot');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200 text-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
            Chat History & Past Research
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review previous legal inquiries, cited provisions, and statutory answers.
          </p>
        </div>

        <button
          onClick={createNewChat}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>New Research Chat</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 text-xs">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
          >
            <div
              onClick={() => handleOpenConversation(conv.id)}
              className="flex items-center gap-3.5 cursor-pointer flex-1"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors">
                  {conv.title}
                </h3>
                <div className="text-slate-500 mt-0.5 text-[11px] flex items-center gap-2">
                  <span>{conv.topic || 'Indian Law Research'}</span>
                  <span>•</span>
                  <span>{conv.messages.length} messages</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <span className="text-[11px]">{conv.date}</span>
              <button
                onClick={() => handleOpenConversation(conv.id)}
                className="p-1.5 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-blue-600 font-semibold flex items-center gap-1"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
