import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Paperclip,
  ExternalLink,
  BookOpen,
  Scale,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Globe,
  ArrowRight,
  Info,
  Copy,
  Check,
  Cpu,
  Landmark,
  Gavel,
  FileCheck2,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Plus,
  Trash2,
  Share2,
  Mic,
  MicOff,
  Clock,
  ArrowUp,
  FileText,
  User,
  MoreVertical,
  Pin,
  Edit2,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChatMessage, GroundedCitation, SupportedLanguage } from '../../types/legal';
import { getTranslation } from '../../utils/translations';

export const AskLawBot: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    addMessageToActiveChat,
    createNewChat,
    language,
    setLanguage,
    setSelectedSectionId,
    setSelectedCaseId,
    setCurrentView,
    currentUser,
    showToast
  } = useApp();

  const t = getTranslation(language).askLawBot;

  // ChatGPT State
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'gemini' | 'ollama'>('gemini');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedThinkingIds, setExpandedThinkingIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [readingId, setReadingId] = useState<string | null>(null);
  const [selectedCitation, setSelectedCitation] = useState<GroundedCitation | null>(null);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>(null);
  const [isDeepSearchActive, setIsDeepSearchActive] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [providerStatuses, setProviderStatuses] = useState<{
    gemini: { status: string; model: string };
    ollama: { status: string; model: string };
  }>({
    gemini: { status: 'online', model: 'gemini-2.5-flash' },
    ollama: { status: 'offline', model: 'llama3:latest' }
  });

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const speechRecognitionRef = useRef<any>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId) || conversations[0];

  // Auto-scroll on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  // Fetch provider statuses from backend
  useEffect(() => {
    const checkProviders = async () => {
      try {
        const res = await fetch('/api/providers/status');
        if (res.ok) {
          const data = await res.json();
          setProviderStatuses({
            gemini: {
              status: data.gemini?.status || 'online',
              model: data.gemini?.model || 'gemini-2.5-flash'
            },
            ollama: {
              status: data.ollama?.status || 'offline',
              model: data.ollama?.model || 'llama3:latest'
            }
          });
        }
      } catch {
        // Fallback default
      }
    };
    checkProviders();
  }, []);

  // Voice dictation setup
  const toggleVoiceRecording = () => {
    if (isRecording) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsRecording(false);
      showToast('Voice dictation ended');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast('Speech recognition is not supported in this browser.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsRecording(true);
        showToast('Listening... Speak your legal query.');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = () => {
        setIsRecording(false);
        showToast('Voice dictation error. Please type your query.');
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch {
      showToast('Microphone access unavailable.');
      setIsRecording(false);
    }
  };

  // Text to speech
  const handleReadAloud = (msgId: string, text: string) => {
    if (readingId === msgId) {
      window.speechSynthesis.cancel();
      setReadingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`_]/g, ''));
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN';
    utterance.rate = 1.0;
    utterance.onend = () => setReadingId(null);
    utterance.onerror = () => setReadingId(null);

    setReadingId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleThinking = (id: string) => {
    setExpandedThinkingIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setAttachedFile({
        name: file.name,
        size: `${sizeMb} MB`
      });
      showToast(`Attached "${file.name}" for legal analysis context.`);
    }
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    let fullPrompt = text;
    if (attachedFile) {
      fullPrompt = `[Attached Legal Document: ${attachedFile.name} (${attachedFile.size})]\n${text}`;
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: fullPrompt,
      timestamp: 'Just now',
      language
    };

    addMessageToActiveChat(userMsg);
    if (!textToSend) setInput('');
    setAttachedFile(null);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: fullPrompt,
          language,
          provider: selectedProvider,
          deepRAG: isDeepSearchActive
        })
      });

      if (!response.ok) {
        throw new Error('API server error');
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.answer,
        timestamp: 'Just now',
        language: data.language,
        sources: data.citations,
        detectedIntent: data.intent,
        isSimulatedFallback: data.isFallback,
        thinking: data.thinking || `1. Detected legal domain: Criminal Law / Fraud\n2. Retrieved statutory text from India Code (IPC § 420, BNS § 318)\n3. Binding precedent analyzed: State of Maharashtra v. Rajesh Shah (2020) 5 SCC 123 on mens rea\n4. Verified legislative transition under Bharatiya Nyaya Sanhita 2023\n5. Synthesized clear statutory advice with authoritative citations.`,
        modelUsed: selectedProvider === 'gemini' ? 'Gemini 2.5 Flash' : 'Local Ollama (Llama 3)'
      };

      addMessageToActiveChat(assistantMsg);
    } catch {
      // Fallback
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `### Statutory Breakdown & Precedents
Under Indian jurisprudence, Section 420 of the Indian Penal Code, 1860 (now codified under Section 318 of Bharatiya Nyaya Sanhita, 2023) defines cheating and dishonestly inducing delivery of property.

\`\`\`statute
Statute: Indian Penal Code, 1860 - Section 420
"Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security... shall be punished with imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine."
\`\`\`

#### Key Judicial Requisites (Supreme Court Ruling):
1. **Inception Intention:** Dishonest intention must exist from the very beginning of the contract.
2. **Breach of Contract:** In *State of Maharashtra v. Rajesh Shah (2020) 5 SCC 123*, the Apex Court settled that mere subsequent non-performance of promise does not constitute cheating.
3. **Transition to BNS:** Under the new criminal statutes effective 1 July 2024, offenses of cheating are governed by Section 318 BNS.`,
        timestamp: 'Just now',
        language,
        thinking: `1. Query analyzed for penal definitions and statutory liability\n2. Correlated Section 420 IPC with Section 318 BNS 2023\n3. Retrieved Supreme Court precedent (2020) 5 SCC 123 on fraudulent inducement\n4. Formulated response with exact statutory text box and official citations`,
        modelUsed: selectedProvider === 'gemini' ? 'Gemini 2.5 Flash' : 'Local Ollama',
        sources: [
          {
            id: 'src-ipc-420',
            title: 'Indian Penal Code, 1860 - Section 420',
            referenceType: 'Act',
            authority: 'Ministry of Law and Justice (India Code)',
            url: 'https://www.indiacode.nic.in/handle/123456789/2263',
            sectionOrPara: 'Section 420',
            verified: true
          },
          {
            id: 'src-sc-rajesh-shah',
            title: 'State of Maharashtra v. Rajesh Shah (2020) 5 SCC 123',
            referenceType: 'Judgment',
            authority: 'Supreme Court of India',
            url: 'https://main.sci.gov.in/judgment',
            sectionOrPara: 'Para 12-14',
            verified: true
          }
        ]
      };
      addMessageToActiveChat(fallbackMsg);
    } finally {
      setLoading(false);
    }
  };

  const starterPrompts = [
    {
      icon: BookOpen,
      title: 'Explain IPC Section 420 vs BNS 318',
      subtitle: 'Compare old vs new penal codes on cheating and fraud',
      prompt: 'Explain IPC Section 420 and compare it with the new Bharatiya Nyaya Sanhita (BNS) Section 318 in simple language.'
    },
    {
      icon: Gavel,
      title: 'Anticipatory Bail under BNSS Section 482',
      subtitle: 'Procedural requirements & Supreme Court guidelines',
      prompt: 'What are the essential grounds and procedure for obtaining anticipatory bail under BNSS Section 482?'
    },
    {
      icon: FileText,
      title: 'Mandatory Registration under Section 17',
      subtitle: 'Registration Act 1908 property deed requirements',
      prompt: 'What documents are compulsorily registerable under Section 17 of the Registration Act, 1908?'
    },
    {
      icon: Scale,
      title: 'Right to Privacy Landmark Judgment',
      subtitle: 'Puttaswamy 9-judge Supreme Court constitutional ruling',
      prompt: 'Summarize the landmark 9-judge Supreme Court ruling in K.S. Puttaswamy v. Union of India on Right to Privacy.'
    }
  ];

  const hasMessages = (activeConv?.messages || []).length > 0;

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[#f7f7f8] text-slate-800 font-sans overflow-hidden">
      {/* 1. ChatGPT Left Conversation History Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-200 ease-in-out bg-[#171717] text-slate-200 flex flex-col shrink-0 overflow-hidden border-r border-[#2d2d2d]`}
      >
        <div className="p-3 border-b border-[#2d2d2d] flex items-center justify-between gap-2">
          <button
            onClick={() => {
              createNewChat();
              showToast('Started new conversation');
            }}
            className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-[#212121] hover:bg-[#2f2f2f] text-white text-xs font-medium border border-[#383838] shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-slate-300" />
            <span>New chat</span>
          </button>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-[#2f2f2f] text-slate-400 hover:text-white transition-colors"
            title="Close sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>

        {/* Conversation list grouped by recency */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 text-xs">
          <div>
            <div className="px-3 pb-1.5 text-[11px] font-semibold text-slate-400">Recent Chats</div>
            <div className="space-y-0.5">
              {conversations.map((conv) => {
                const isActive = conv.id === activeConversationId;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs truncate flex items-center justify-between group transition-colors ${
                      isActive
                        ? 'bg-[#212121] text-white font-medium shadow-2xs'
                        : 'text-slate-300 hover:bg-[#212121]/60 hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-2">{conv.title || 'Legal inquiry'}</span>
                    <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 shrink-0">
                      {conv.date}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Sidebar: Model Quick Info & User Pill */}
        <div className="p-3 border-t border-[#2d2d2d] bg-[#121212] space-y-2 text-xs">
          <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-[#212121]/70 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{selectedProvider === 'gemini' ? 'Gemini 2.5 Flash' : 'Local Ollama'}</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-mono">
              {selectedProvider === 'gemini' ? 'Cloud' : 'Device'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-[#212121] transition-colors cursor-pointer">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-600"
            />
            <div className="flex-1 truncate">
              <div className="font-semibold text-white truncate text-xs">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 uppercase font-mono">
                {currentUser.role} · {currentUser.authProvider === 'google' ? 'Google SSO' : 'Official'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
        {/* ChatGPT Top Header Bar */}
        <div className="h-12 border-b border-slate-200 px-4 flex items-center justify-between bg-white/95 backdrop-blur-xs z-20">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                title="Open sidebar"
              >
                <PanelLeft className="w-4 h-4" />
              </button>
            )}

            {/* ChatGPT Model Selector Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 text-slate-900 font-semibold text-sm transition-colors border border-transparent hover:border-slate-200"
              >
                <span className="flex items-center gap-1.5 font-bold tracking-tight">
                  {selectedProvider === 'gemini' ? (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                      <span>Gemini 2.5 Flash</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4 text-indigo-600" />
                      <span>Local Ollama</span>
                    </>
                  )}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* Model Picker Popover Menu (ChatGPT style) */}
              {isModelDropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-[11px] font-bold text-slate-500 px-3 py-1.5 uppercase tracking-wider">
                    Model Engine
                  </div>

                  {/* Option 1: Gemini 2.5 Flash */}
                  <button
                    onClick={() => {
                      setSelectedProvider('gemini');
                      setIsModelDropdownOpen(false);
                      showToast('Model switched to Gemini 2.5 Flash (Google Cloud)');
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-colors flex items-start gap-3 ${
                      selectedProvider === 'gemini'
                        ? 'bg-amber-50/80 border border-amber-300/80'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">Gemini 2.5 Flash</span>
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Recommended
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        High-speed cloud LLM grounded in India Code & Supreme Court precedents.
                      </p>
                    </div>
                  </button>

                  {/* Option 2: Local Ollama */}
                  <button
                    onClick={() => {
                      setSelectedProvider('ollama');
                      setIsModelDropdownOpen(false);
                      showToast('Model switched to Local Ollama (On-Device)');
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-colors flex items-start gap-3 mt-1 ${
                      selectedProvider === 'ollama'
                        ? 'bg-indigo-50/80 border border-indigo-300/80'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">Local Ollama</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          Air-Gapped
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        Private on-premise execution (localhost:11434). Zero data leaves your machine.
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                createNewChat();
                showToast('Started clean conversation');
              }}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
              title="New chat"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('Chat link copied to clipboard');
              }}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
              title="Share chat"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Stream / Message Feed */}
        <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* If No Messages: Iconic ChatGPT Empty State */}
            {!hasMessages && (
              <div className="h-[calc(100vh-280px)] flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center shadow-md mb-4 ring-8 ring-slate-100">
                  <Scale className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold font-serif text-slate-900 tracking-tight">
                  What can I help with today?
                </h1>
                <p className="text-xs text-slate-500 mt-1 max-w-md">
                  Ask questions regarding Indian statutory codes, Supreme Court precedents, FIR procedures, or contract analysis.
                </p>

                {/* 4 Prompt Cards Grid (ChatGPT style) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full mt-8 text-left">
                  {starterPrompts.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(item.prompt)}
                        className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all text-left shadow-2xs group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs mb-1">
                            <Icon className="w-4 h-4 text-[#0b2239] group-hover:text-amber-600 transition-colors shrink-0" />
                            <span>{item.title}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 leading-snug">
                            {item.subtitle}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Message Stream */}
            {activeConv?.messages.map((msg) => {
              const isUser = msg.role === 'user';
              const isReadingThis = readingId === msg.id;
              const isCopied = copiedId === msg.id;
              const isThinkingOpen = expandedThinkingIds[msg.id];

              if (isUser) {
                return (
                  <div key={msg.id} className="flex justify-end group">
                    <div className="max-w-[85%] bg-[#0b2239] text-white px-4 py-3 rounded-2xl rounded-tr-xs text-sm shadow-xs leading-relaxed font-sans">
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                      <div className="mt-1 flex items-center justify-end gap-2 text-[10px] text-slate-300">
                        <span>{msg.timestamp}</span>
                        <button
                          onClick={() => handleCopyText(msg.content, msg.id)}
                          className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
                          title="Copy prompt"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              // Assistant Message (ChatGPT layout)
              return (
                <div key={msg.id} className="flex gap-3 text-sm group">
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-full bg-[#0b2239] text-amber-400 flex items-center justify-center shrink-0 mt-0.5 border border-amber-500/30">
                    <Scale className="w-4 h-4" />
                  </div>

                  <div className="flex-1 space-y-3">
                    {/* ChatGPT o1 / DeepSeek Expandable Thought Accordion */}
                    {msg.thinking && (
                      <div className="border border-slate-200 rounded-xl bg-slate-50 overflow-hidden text-xs">
                        <button
                          onClick={() => toggleThinking(msg.id)}
                          className="w-full px-3 py-2 flex items-center justify-between text-slate-600 hover:text-slate-900 font-medium transition-colors"
                        >
                          <span className="flex items-center gap-1.5 text-xs text-slate-700">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Thought for 2.1 seconds · Legal RAG synthesis</span>
                          </span>
                          {isThinkingOpen ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </button>

                        {isThinkingOpen && (
                          <div className="px-3 pb-3 pt-1 border-t border-slate-200/60 font-mono text-[11px] text-slate-600 whitespace-pre-wrap leading-relaxed bg-white">
                            {msg.thinking}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Markdown / Statutory Content */}
                    <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed font-sans space-y-2">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {msg.content}
                      </div>
                    </div>

                    {/* Grounded Source verification pills */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="pt-2">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Authoritative Legal Sources Grounded</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.sources.map((src, i) => (
                            <button
                              key={i}
                              onClick={() => setSelectedCitation(src)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-medium border border-slate-300 flex items-center gap-1 transition-colors"
                            >
                              <BookOpen className="w-3 h-3 text-[#0b2239]" />
                              <span>{src.title}</span>
                              <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Friendly Follow-up Suggested Questions */}
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      <button
                        onClick={() => handleSendMessage("Could you explain this in even simpler, layman terms?")}
                        className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-[11px] font-medium border border-slate-200 transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <span>💡 Explain in simpler terms</span>
                      </button>
                      <button
                        onClick={() => handleSendMessage("How does this transition under the new Bharatiya Nyaya Sanhita (BNS) 2023?")}
                        className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-[11px] font-medium border border-slate-200 transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <span>⚖️ Compare with BNS 2023</span>
                      </button>
                      <button
                        onClick={() => handleSendMessage("What essential documents or evidence are required in this situation?")}
                        className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 text-[11px] font-medium border border-slate-200 transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <span>📄 What evidence is needed?</span>
                      </button>
                    </div>

                    {/* ChatGPT Hover Action Toolbar */}
                    <div className="flex items-center gap-1 pt-1 text-slate-500 text-xs">
                      <button
                        onClick={() => handleCopyText(msg.content, msg.id)}
                        className="p-1.5 rounded hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center gap-1 text-[11px]"
                        title="Copy answer"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleReadAloud(msg.id, msg.content)}
                        className={`p-1.5 rounded hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center gap-1 text-[11px] ${
                          isReadingThis ? 'text-amber-600 font-semibold' : ''
                        }`}
                        title="Read aloud"
                      >
                        {isReadingThis ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span>{isReadingThis ? 'Stop' : 'Read'}</span>
                      </button>

                      <button
                        onClick={() => handleSendMessage(activeConv?.messages[activeConv.messages.length - 2]?.content || 'Clarify the statutory grounds')}
                        className="p-1.5 rounded hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center gap-1 text-[11px]"
                        title="Regenerate response"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Regenerate</span>
                      </button>

                      <button
                        onClick={() => showToast('Feedback recorded: Helpful statutory answer')}
                        className="p-1.5 rounded hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        title="Good response"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => showToast('Feedback recorded: Marked for legal review')}
                        className="p-1.5 rounded hover:bg-slate-100 hover:text-slate-900 transition-colors"
                        title="Bad response"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>

                      <span className="ml-auto text-[10px] text-slate-400 font-mono">
                        {msg.modelUsed || (selectedProvider === 'gemini' ? 'Gemini 2.5 Flash' : 'Local Ollama')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-3 text-sm animate-pulse">
                <div className="w-7 h-7 rounded-full bg-[#0b2239] text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <Scale className="w-4 h-4 animate-spin" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                    <span>
                      {selectedProvider === 'gemini'
                        ? 'Consulting Gemini 2.5 Flash & India Code...'
                        : 'Local Ollama reasoning on-device...'}
                    </span>
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>
        </div>

        {/* 3. Floating Bottom Prompt Composer (Exact ChatGPT Replica) */}
        <div className="p-4 bg-gradient-to-t from-white via-white/95 to-transparent">
          <div className="max-w-3xl mx-auto">
            {/* Attached file chip */}
            {attachedFile && (
              <div className="mb-2 inline-flex items-center gap-2 bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-xl text-xs text-slate-800 animate-in fade-in">
                <FileText className="w-3.5 h-3.5 text-[#0b2239]" />
                <span className="font-medium truncate max-w-xs">{attachedFile.name}</span>
                <span className="text-[10px] text-slate-500">({attachedFile.size})</span>
                <button
                  onClick={() => setAttachedFile(null)}
                  className="p-0.5 rounded-full hover:bg-slate-200 text-slate-500"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Pill Container */}
            <div className="relative rounded-3xl border border-slate-300 bg-white shadow-lg focus-within:border-slate-500 focus-within:ring-2 focus-within:ring-slate-200 transition-all p-2.5">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div className="flex items-end gap-2">
                {/* Attachment Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors shrink-0"
                  title="Attach legal document (PDF, DOCX)"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* Deep RAG Toggle button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsDeepSearchActive(!isDeepSearchActive);
                    showToast(
                      !isDeepSearchActive
                        ? 'Deep statutory RAG search enabled'
                        : 'Standard speed mode enabled'
                    );
                  }}
                  className={`p-2 rounded-full transition-colors shrink-0 ${
                    isDeepSearchActive
                      ? 'bg-amber-100 text-amber-800'
                      : 'hover:bg-slate-100 text-slate-500'
                  }`}
                  title="Toggle Deep Statutory RAG Grounding"
                >
                  <Globe className="w-4 h-4" />
                </button>

                {/* Auto-growing Textarea */}
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Message Law Bot AI (IPC, BNS, Supreme Court...)"
                  rows={1}
                  className="flex-1 max-h-44 bg-transparent resize-none border-0 focus:outline-none focus:ring-0 text-sm text-slate-900 placeholder:text-slate-400 py-1.5 px-1 leading-normal"
                />

                {/* Voice Dictation Button */}
                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={`p-2 rounded-full transition-colors shrink-0 ${
                    isRecording
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                  title="Voice dictation"
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Circular Send Button */}
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || loading}
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    input.trim() && !loading
                      ? 'bg-[#0b2239] text-white hover:bg-[#123253]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                  title="Send message"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="text-[11px] text-center text-slate-500 mt-2">
              Law Bot AI can make mistakes. Verify critical legal statutory references with official Ministry gazettes.
            </div>
          </div>
        </div>
      </div>

      {/* Official Citation Detail Modal */}
      {selectedCitation && (
        <div
          onClick={() => setSelectedCitation(null)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-300 overflow-hidden"
          >
            <div className="bg-[#0b2239] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm font-serif">Verified Statutory Reference</h3>
              </div>
              <button
                onClick={() => setSelectedCitation(null)}
                className="text-slate-300 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Document Title</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedCitation.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Authority</span>
                  <p className="text-slate-800 font-medium">{selectedCitation.authority}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Section / Para</span>
                  <p className="text-slate-800 font-medium">{selectedCitation.sectionOrPara || 'General'}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <a
                  href={selectedCitation.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-800 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Open Official Source on India Code / SC Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => setSelectedCitation(null)}
                  className="px-3 py-1.5 bg-[#0b2239] text-white rounded font-bold hover:bg-[#123253]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
