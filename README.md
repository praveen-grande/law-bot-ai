<div align="center">

<h1>⚖️ Law Bot AI</h1>
<h3>India's Intelligent Legal Research Platform</h3>
<p><strong>Multilingual · RAG-Powered · Ollama Integrated · Hallucination-Free Answers</strong></p>

<p>Ask legal questions in English, Hindi, or Telugu — get grounded, citation-backed answers from verified Indian statutes, Supreme Court judgments, and official government sources.</p>

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.5_Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Architecture](#️-architecture)
- [NLP & RAG Pipeline](#-nlp--rag-pipeline)
- [Local LLM — Ollama](#-local-llm--ollama)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Legal Dataset Coverage](#-legal-dataset-coverage)
- [Security & Access Control](#-security--access-control)
- [Roadmap](#️-roadmap)
- [Contributing](#-contributing)
- [Disclaimer](#️-disclaimer)

---

## 🌟 Overview

**Law Bot AI** is a production-ready, full-stack AI-powered legal research assistant purpose-built for the Indian legal ecosystem. It combines the power of **Google Gemini 2.5 Flash**, a custom **NLP + Retrieval-Augmented Generation (RAG)** engine, **Ollama local models** for offline inference, and a live **official source synchronizer** to deliver legislatively grounded, citation-backed answers in three languages — **English**, **Hindi (हिन्दी)**, and **Telugu (తెలుగు)**.

Whether you're a citizen understanding your rights, a law student researching precedents, an advocate verifying statutory text, or an administrator managing a legal knowledge base — Law Bot AI provides an intelligent, trustworthy interface to India's vast legal corpus.

### Why Law Bot AI?

India's legal landscape is fragmented — spanning Central Acts, State Legislation, Constitutional provisions, Supreme Court judgments, High Court decisions, and ongoing criminal law reforms (IPC → BNS, CrPC → BNSS). **Law Bot AI bridges the gap** between raw government data and actionable legal understanding through AI — always grounded in verifiable sources from India Code, the e-Gazette, and the Supreme Court portal, with a **zero hallucination policy** on section numbers, citations, and amendment dates.

---

## ✨ Key Features

### 🤖 AI Legal Research Assistant
- Conversational Q&A powered by **Google Gemini 2.5 Flash** with system-prompt grounding on verified Indian law
- **Zero Hallucination Policy** — every legal claim is validated against the indexed knowledge base before answering; unverified queries receive an honest, transparent limitation notice
- **Grounded citations** with confidence scores (`High / Moderate / Low`) for every response
- **Multi-turn memory** — context-aware query resolution across a conversation session
- **Persistent chat history** with session management per user
- Multilingual answers with native script formatting for Telugu and Hindi responses

### 🧠 NLP + RAG Engine
- **Language detection** via Unicode script analysis (Telugu U+0C00–U+0C7F, Devanagari U+0900–U+097F, Latin/English)
- **Query intent classification** into 6 intents: `statutory_explanation`, `judgment_search`, `procedure_inquiry`, `statutory_comparison`, `amendment_status`, `general_legal_inquiry`
- **Named Entity Recognition (NER)** for Indian legal entities: Act names, section numbers, case names, citations, and legal concepts
- **Multilingual normalization** — Telugu/Hindi legal terms auto-mapped to canonical English tokens (e.g., తీర్పు → Judgment, धारा → Section)
- **Hybrid scoring retrieval** with weighted BM25 keyword + 64-dimensional vector cosine similarity across statutes, judgments, and persistent chunks
- **Citation validation** — post-generation audit flags ungrounded section or case references before the answer is returned

### 📄 Legal Document Analysis
- Upload contracts, agreements, petitions, and legal notices in PDF or text format
- **AI-powered clause extraction** — identifies parties, subject matter, agreement dates, and key terms
- **Risk flagging** — highlights potentially problematic clauses with legal context
- Cross-references extracted content against indexed Indian statutes for section-level grounding
- Structured output with `extractedClauses`, `legalReferencesFound`, and document summary

### 🔄 Automatic Official Source Synchronization
- Scheduled sync against official Indian legal portals (India Code, e-Gazette, Supreme Court Portal)
- Configurable frequency — Super Admins can trigger **on-demand Sync Now** or adjust intervals
- **Two-stage review queue** — uncertain records routed to Super Admin approval before RAG indexing
- **Audit logging** — every sync event recorded with timestamp, source URL, record count, actor, and outcome
- Supports bulk import in `JSON`, `JSONL`, and `CSV` formats with checkpoint-resume for large datasets

### ⚖️ Statutory Comparison Centre
- Side-by-side comparison of any two Acts, Sections, or legal concepts
- Highlights key differences in scope, punishment, jurisdiction, and amendment history
- Tracks **IPC → BNS** and **CrPC → BNSS** criminal law reform transitions with commencement date annotations
- Displays repeal status, struck-down provisions (e.g., IT Act Section 66A), and superseded sections

### 📚 Case Law Explorer
- Browse, filter, and deep-dive into indexed court judgments
- Filter by jurisdiction, court, topic, bench, and decision date
- Full judgment detail view with AI summary, key holdings, cited authorities, and binding precedent status
- Bookmark judgments to personal research collection

### 🌐 Multilingual Support
- Full UI in **English**, **Telugu (తెలుగు)**, **Hindi (हिन्दी)**
- Bilingual query processing — users can mix scripts in the same query
- Vernacular legal term normalization (e.g., న్యాయస్థానం → Court, अनुच्छेद → Article)
- Act names, section numbers, and citations always preserved in standard English script for legal accuracy

### 🔐 Role-Based Access Control
- **Public / Citizen users** — self-register via Google Auth or email; full chat access, document analysis, comparison, and personal research bookmarks
- **Legal Admins** — admin console, user account management, feedback resolution, and knowledge base oversight
- **Super Admins** — full dataset sync control, ingestion pipeline management, audit logs, and system health monitoring
- Firebase Auth + Firestore security rules for strict per-user data isolation

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        Law Bot AI                                │
│              React 19 + TypeScript + Vite 8                      │
├────────────────┬─────────────────────────┬───────────────────────┤
│   UI Layer     │   NLP / RAG Layer       │  Data / Sync Layer    │
│                │                         │                       │
│ • AskLawBot    │ • detectLanguage()      │ • Legal Source Sync   │
│ • DocumentAnal │ • classifyQueryIntent() │   - India Code        │
│ • CaseLaw      │ • extractLegalEntities()│   - e-Gazette         │
│   Explorer     │ • hybridRetrieve()      │   - SC Portal         │
│ • Statutory    │ • validateCitations()   │ • Local JSON Store    │
│   Comparison   │                         │ • Cloud Firestore     │
│ • Acts/Sections│  Google Gemini 2.5 Flash│ • Persistent Vector   │
│   Explorer     │  + Ollama (local LLMs)  │   Chunk Index         │
│ • Admin Portal │                         │                       │
│ • Super Admin  │                         │                       │
│   Dashboard    │                         │                       │
└────────────────┴─────────────────────────┴───────────────────────┘
         │                                          │
         ▼                                          ▼
  Express.js Server                     Firebase + Firestore
  (server.ts, Port 3000)                Auth & Session Store
  Vite Dev/Prod Pipeline
```

---

## 🧠 NLP & RAG Pipeline

Law Bot AI implements a custom multi-stage Retrieval-Augmented Generation pipeline in TypeScript, with both cloud (Gemini) and fully local (Ollama) LLM support.

### Pipeline Flow

```
User Query (any language)
        │
        ▼
1. Language Detection      ← Unicode block analysis (Telugu / Hindi / English)
        │
        ▼
2. Query Normalization     ← Abbreviation expansion + vernacular legal term mapping
        │
        ▼
3. Entity Extraction (NER) ← Act names, section numbers, case citations, legal concepts
        │
        ▼
4. Intent Classification   ← statutory_explanation | judgment_search | procedure_inquiry
                              statutory_comparison | amendment_status | general_legal_inquiry
        │
        ▼
5. Hybrid Retrieval        ← Weighted scoring across:
   (hybridRetrieve)          • Persistent vector chunk index (BM25 + 64-D cosine similarity)
                             • Indexed statutory sections (India Code)
                             • Court judgment corpus (SC 2023 Dataset — 854 judgments)
                             • Official gazette notifications
        │
        ▼
6. Citation Building       ← Grounded citations with source (India Code / SC Portal / e-Gazette)
                              and confidence (High / Moderate / Low)
        │
        ▼
7. LLM Prompt              ← Prompt-injection-safe evidence context + system grounding rules
   (Gemini or Ollama)         Model selected based on provider config and network availability
        │
        ▼
8. Post-Generation Audit   ← validateCitations() flags ungrounded section / case claims
        │
        ▼
   Answer with Confidence Score + Verified Source Citations + Commencement Notes
```

### Retrieval Scoring Weights

| Match Type | Statutory Score | Judgment Score |
|---|---|---|
| Exact section number match | +60 | — |
| Exact Act name match | +50 | — |
| Partial section / Act overlap | +30 | — |
| Legal topic / category match | +20 | — |
| Exact case citation match | — | +60 |
| Case name / party match | — | +35 |
| Section discussed in judgment | +25 | +25 |
| Legal concept keyword | +15 | +15 |
| Token overlap (general) | +3/token | +3/token |

---

## 🦙 Local LLM — Ollama

Law Bot AI supports fully **offline, on-device LLM inference** via [Ollama](https://ollama.com/), enabling privacy-first legal queries with no data leaving the device.

### Model Routing Strategy

```
Query received
        │
        ▼
Is Gemini API key configured?
├── YES → Use Gemini 2.5 Flash (primary — cloud)
└── NO  → Is Ollama running locally?
           ├── YES → Route to configured local model (llama3, qwen, mistral, etc.)
           └── NO  → Deterministic Grounded RAG Engine
                      (source-cited answer from retrieved chunks, no LLM)
```

### Running Ollama Locally

```bash
# Install Ollama
# https://ollama.com/download

# Pull a model (examples)
ollama pull llama3
ollama pull qwen:4b
ollama pull mistral

# Ollama runs automatically on http://localhost:11434
```

Set `OLLAMA_URL=http://localhost:11434` in your `.env` and select **Ollama** as the provider in the chat interface.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19, TypeScript 7 |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Motion (Framer Motion) |
| **Icons** | Lucide React |
| **Backend Server** | Express.js (Node.js / TSX) |
| **AI / LLM (Cloud)** | Google Gemini 2.5 Flash (`@google/genai`) — chat, grounding, structured output |
| **AI / LLM (Local)** | Ollama — any locally-pulled model (llama3, qwen, mistral), fully offline |
| **NLP Pipeline** | Custom TypeScript NER & intent classifier (`nlpRAG.ts`, `legalClassifier.ts`) |
| **RAG Engine** | Custom TypeScript hybrid retrieval — BM25 keyword + 64-D vector cosine (`ingestionPipeline.ts`) |
| **Document Analysis** | PDF text extraction + Gemini Vision (`documentAnalysisEngine.ts`, `pdfOcrExtractor.ts`) |
| **Authentication** | Firebase Auth (Google OAuth + Email/Password) + role-based JWT |
| **Database** | Cloud Firestore + Local JSON flat-file persistent store |
| **i18n** | Custom translations layer — English, Telugu (తెలుగు), Hindi (हिन्दी) (`translations.ts`) |
| **Testing** | Node.js built-in test runner — unit tests across all core utilities |
| **Package Manager** | npm / Bun |
| **Data Sources** | India Code (indiacode.nic.in), e-Gazette, Supreme Court Portal (SCI), SC 2023 Judgment Dataset |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** or **Bun 1.0+**
- A **Google Gemini API Key** — get one free at [ai.google.dev](https://ai.google.dev/)
- *(Optional)* **Ollama** installed for local/offline LLM mode — [ollama.com](https://ollama.com/)
- *(Optional)* **Firebase project** for authentication and Firestore persistence

### Installation

```bash
# Clone the repository
git clone https://github.com/praveen-grande/law-bot-ai.git
cd law-bot-ai

# Install dependencies
npm install
# or with Bun
bun install
```

### Running Locally

```bash
# Copy and configure environment variables
cp .env.example .env
# Edit .env and set your GEMINI_API_KEY

# Start the development server (Express + Vite)
npm run dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run preview
```

### Running Tests

```bash
npm test
# or run individual test files
node --test --import tsx src/utils/nlpRAG.test.ts
node --test --import tsx src/utils/ingestionPipeline.test.ts
node --test --import tsx src/utils/legalClassifier.test.ts
node --test --import tsx src/utils/caseAnalysisEngine.test.ts
node --test --import tsx src/utils/documentAnalysisEngine.test.ts
```

Tests cover: `nlpRAG`, `ingestionPipeline`, `legalClassifier`, `caseAnalysisEngine`, `documentAnalysisEngine`, `auth`, and `chatAndProvider`.

---

## 🔑 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Required — Google Gemini API key
GEMINI_API_KEY=your_gemini_api_key_here

# Server port (default: 3000)
PORT=3000

# App URL (used for OAuth callbacks and self-referential links)
APP_URL=http://localhost:3000

# Optional — Ollama base URL for local LLM inference
OLLAMA_URL=http://localhost:11434

# Optional — Firebase configuration (for Auth & Firestore persistence)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

> **Note:** The app runs in a limited demo mode without Firebase. For full authentication, persistent conversations, and Firestore-backed storage, a Firebase project is required.

---

## 📁 Project Structure

```
law-bot-ai/
├── server.ts                    # Express backend: RAG Q&A, source sync, admin API routes
├── data/                        # Persistent JSON storage (accounts, sessions, legal knowledge)
│   ├── auth_users_store.json    # User account records
│   └── legal_knowledge_store.json  # Persistent RAG chunk & document index
├── public/
│   └── assets/aistudio/         # Static legal dataset assets
├── src/
│   ├── App.tsx                  # Main React application & routing
│   ├── main.tsx                 # React entry point
│   ├── firebase.ts              # Firebase client initialization
│   ├── index.css                # Global styles (Tailwind)
│   ├── types/
│   │   └── legal.ts             # TypeScript type definitions (all domain models)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx       # Top navigation bar
│   │   │   └── Sidebar.tsx      # Collapsible sidebar navigation
│   │   └── views/
│   │       ├── LandingPage.tsx          # Public homepage & sign-in/register forms
│   │       ├── AskLawBot.tsx            # 🤖 Main AI chat interface (RAG Q&A)
│   │       ├── ChatHistoryView.tsx      # Persistent conversation history
│   │       ├── DocumentAnalysis.tsx     # 📄 Legal document upload & clause extraction
│   │       ├── LegalSearch.tsx          # 🔍 Unified hybrid statute & judgment search
│   │       ├── ActsSectionsExplorer.tsx # 📚 Statutory Acts & Sections browser
│   │       ├── CaseLawExplorer.tsx      # ⚖️ Case law browser & judgment detail
│   │       ├── JudgmentDetail.tsx       # Full judgment view with holdings & citations
│   │       ├── LegalComparisonTool.tsx  # ⚡ Side-by-side statutory comparison
│   │       ├── LegalTopicExplorer.tsx   # 🗂️ Browse law by legal topic / area
│   │       ├── LegalDatasetExplorer.tsx # 🗃️ Persistent vector store browser
│   │       ├── MyResearch.tsx           # 📌 Personal bookmarks & saved research
│   │       ├── ProfileSettings.tsx      # User profile & language preferences
│   │       ├── AuthModal.tsx            # Authentication modal
│   │       ├── DatasetManagement.tsx    # 🔧 Admin: dataset import & sync management
│   │       ├── AdminManagementViews.tsx # 🔧 Admin: user management & feedback
│   │       ├── AdminPortalGate.tsx      # Admin login & access control
│   │       ├── SuperAdminDashboard.tsx  # 👑 Super Admin: system health & audit logs
│   │       └── UserDashboard.tsx        # Citizen dashboard overview
│   ├── context/
│   │   └── AppContext.tsx        # Global React state context & provider
│   ├── data/
│   │   ├── legalCorpus.ts        # Seed data: statutory sections, judgments, sources
│   │   ├── casePresets.ts        # Preset case examples for demonstration
│   │   └── sampleLegalDocuments.ts  # Sample legal documents for document analysis demo
│   └── utils/
│       ├── nlpRAG.ts             # 🧠 Language detection, intent classification, NER, retrieval
│       ├── nlpRAG.test.ts        # ✅ Unit tests for NLP/RAG utilities
│       ├── ingestionPipeline.ts  # 🗃️ Persistent legal knowledge store, chunking & vector indexing
│       ├── ingestionPipeline.test.ts  # ✅ Unit tests for ingestion pipeline
│       ├── legalClassifier.ts    # 📊 Document type classifier & topic tagger
│       ├── legalClassifier.test.ts  # ✅ Unit tests for legal classifier
│       ├── caseAnalysisEngine.ts  # ⚖️ Case analysis, precedent mapping & holding extraction
│       ├── caseAnalysisEngine.test.ts  # ✅ Unit tests for case analysis engine
│       ├── documentAnalysisEngine.ts  # 📄 PDF/text document clause extraction & risk flagging
│       ├── documentAnalysisEngine.test.ts  # ✅ Unit tests for document analysis engine
│       ├── pdfOcrExtractor.ts    # 🔍 PDF text & OCR extraction utilities
│       ├── aiProvider.ts         # 🤖 Gemini & Ollama provider abstraction layer
│       ├── hfLegalService.ts     # 🤗 Hugging Face legal model service (embeddings)
│       ├── chatStore.ts          # 💬 Chat session persistence & history management
│       ├── auth.ts               # 🔐 Firebase Auth helpers & admin credential verification
│       ├── auth.test.ts          # ✅ Unit tests for auth utilities
│       ├── chatAndProvider.test.ts  # ✅ Unit tests for chat & provider integration
│       └── translations.ts       # 🌐 i18n translations (English / Telugu / Hindi)
├── firestore.rules              # Firestore security rules (strict RBAC)
├── DRAFT_firestore.rules        # Security rules draft / staging
├── security_spec.md             # Security specification & threat model
├── firebase-blueprint.json      # Firebase project configuration blueprint
├── firebase-applet-config.json  # Firebase Applet deployment configuration
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite build configuration
├── .env.example                 # Environment variable template
└── package.json                 # Node.js project manifest
```

---

## 📚 Legal Dataset Coverage

Law Bot AI ships with a curated local legal corpus and synchronizes from official government sources:

| Domain | Coverage |
|---|---|
| ⚖️ **Central Acts & Statutes** | IPC 1860, BNS 2023, CrPC 1973, BNSS 2023, Constitution of India, IT Act 2000, Registration Act 1908, and more |
| 🏛️ **Supreme Court Judgments** | English SC Judgments (2023 Dataset — 854 judgments) + core landmark precedents |
| 📜 **Constitutional Provisions** | Fundamental Rights (Part III), Directive Principles (Part IV), key Articles |
| 🔄 **Criminal Law Reform Transition** | Full IPC → BNS and CrPC → BNSS mapping with commencement date annotations (effective 1 July 2024) |
| 🚫 **Repealed / Struck-Down Provisions** | IT Act Section 66A (Shreya Singhal v. Union of India), and other struck-down sections |
| 📋 **Legal Topics Covered** | Criminal Law · Civil Procedure · Property & Registration · Constitutional Law · Cyber Law · Family Law · Contract Law · Labour Law |
| 📂 **Document Types** | Act · Rule · Judgment · Gazette Notification · Regulation · Subordinate Legislation · Tribunal Decision |
| 🌍 **Official Sources Monitored** | India Code (indiacode.nic.in) · e-Gazette (egazette.gov.in) · Supreme Court of India (sci.gov.in) |

---

## 🔐 Security & Access Control

- **Firestore Security Rules** enforce strict per-user and per-role data isolation ([`firestore.rules`](firestore.rules))
- **12 "Dirty Dozen" Payload Tests** verified — shadow field injection, identity spoofing, self-assigned admin role, timestamp forgery, PII blanket reads, orphaned subcollection writes, and cross-tenant message injection are all blocked ([`security_spec.md`](security_spec.md))
- **Prompt injection protection** — all retrieved legal evidence is wrapped in `<untrusted_legal_evidence>` tags with explicit model instructions never to treat document content as system commands
- **Input sanitization** — all user-supplied and document-extracted text is sanitized via `sanitizeUntrustedLegalText()` before LLM forwarding
- **No credential exposure** — all API keys are server-side only; never bundled into the frontend build
- **Privilege escalation prevention** — standard users cannot self-assign admin or superadmin roles; only Super Admins can promote accounts
- **Terminal state locking** — resolved feedback reports cannot be re-opened by non-admin users
- **Audit logging** — every ingestion, sync, and admin action recorded with actor email, role, timestamp, source, and outcome
- **Role hierarchy** — Citizen → Legal Admin → Super Admin with strict permission escalation checks at every API endpoint

---

## 🗺️ Roadmap

- [ ] **Vector embeddings** — integrate `@xenova/transformers` (Hugging Face JS) for true semantic similarity search
- [ ] **Streaming responses** — Gemini streaming API for real-time token-by-token answer generation
- [ ] **More State legislation** — expand coverage to High Court rules and state-level Acts across all 28 states
- [ ] **Full-text SC judgment corpus** — ingest the complete Supreme Court judgment archive beyond the 2023 dataset
- [ ] **Petition / legal notice drafter** — AI-assisted drafting of standard legal notices grounded in indexed statutes
- [ ] **Legal aid directory** — connect citizens with district legal aid services and Bar Council-registered advocates
- [ ] **Mobile app** — React Native port for Android & iOS with offline core corpus
- [ ] **Offline PWA** — Progressive Web App with pre-cached Acts and judgments for low-connectivity use
- [ ] **Adverse judgment reporter** — integrate with eCourts API for real-time case status tracking
- [ ] **REST API** — expose the RAG pipeline as a documented REST API for third-party legal tech integrations

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please ensure:
- All new utilities have corresponding `*.test.ts` files
- TypeScript strict mode passes: `npm run lint`
- Legal data sources are cited and officially verifiable
- No credentials or API keys are included in commits
- Prompt injection safety is preserved for any new RAG evidence handling

---

## ⚠️ Disclaimer

**Law Bot AI is a legal research and information tool, not a substitute for professional legal advice.**

The information provided by this application is for general informational and educational purposes only. It does not constitute legal advice and should not be relied upon as such. Always consult a qualified advocate or legal professional before acting on any legal information. The developers of Law Bot AI make no representations or warranties regarding the accuracy, completeness, or currency of legal information provided.

Statutory commencement dates, amendment histories, and repeal statuses are retrieved from indexed official sources but may not reflect the most recent gazette notifications. Always verify critical legal provisions directly at [indiacode.nic.in](https://www.indiacode.nic.in/) or [egazette.gov.in](https://egazette.gov.in/).

---

<div align="center">

Built with ❤️ for accessible justice in India

**Powered by Google Gemini AI · Ollama Local LLMs · India Code · Supreme Court Judgment Dataset · Open-Source RAG**

[🐛 Report Bug](https://github.com/praveen-grande/law-bot-ai/issues) · [💡 Request Feature](https://github.com/praveen-grande/law-bot-ai/issues) · [⭐ Star this repo](https://github.com/praveen-grande/law-bot-ai)

</div>
#   l a w - b o t - a i  
 