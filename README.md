# 🏥 MediTrace AI

> **Your Personal Health Intelligence — Powered by Google Gemini AI**

MediTrace AI is a bilingual (English & Tamil) AI-powered healthcare assistant that helps patients with **no medical background** understand their lab reports, track their daily wellness, and get smart health guidance — all in one place.

---

## 🌟 Overview

Medical reports are confusing. Full of numbers, abbreviations, and jargon that most people cannot understand without a medical degree. MediTrace AI bridges that gap.

Simply paste or upload your lab report, and MediTrace AI will:
- Translate complex medical values into **plain, simple language**
- Tell you **what each test result means** for your day-to-day health
- Highlight which values are **normal vs. abnormal**
- Give you a clear, colour-coded **health risk level**
- Tell you exactly **what to do next** — whether to see a doctor or not
- Let you **chat with an AI health assistant** about your symptoms
- Track your **daily vitals and wellness** from a dashboard

No medical knowledge required. Designed for everyone.

---

## ✨ Features

### 📋 AI Report Analyzer
- Paste or upload any lab report (PDF, image, or plain text)
- AI reads and explains every test result in simple words
- Shows the **normal range** for each value
- Color-coded cards: 🟢 Normal · 🔴 Needs Attention
- Three result tabs: **Overview**, **Test Results**, **What To Do**
- Risk level displayed as: 🟢 Low · 🟡 Medium · 🔴 High

### 💬 AI Symptom Checker (MediBot)
- Real-time chat with an AI health assistant
- Describe symptoms in everyday words
- Bilingual responses in English and Tamil
- Remembers conversation context for follow-up questions
- Always advises seeing a real doctor for serious concerns

### 📊 Wellness Dashboard
- Daily vitals tracker: Heart Rate, Water Intake, Sleep Hours, Energy Level
- Wellness quote of the day
- Health tips and reminders

### 🌐 Bilingual Support
- Full English and Tamil language support across all features
- Switch languages instantly from the header

### 🎨 Premium UI/UX
- Glassmorphism design with smooth animations
- Animated particle background
- Responsive layout for all screen sizes
- Custom scrollbars, gradient accents, hover effects

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI component framework |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Fast build tool and dev server |
| **Framer Motion** | Smooth animations and transitions |
| **Lucide React** | Icon library |
| **CSS Variables** | Design system and theming |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Server runtime |
| **Express.js** | REST API framework |
| **Google Generative AI SDK** | Gemini AI integration |
| **dotenv** | Environment variable management |
| **CORS** | Cross-origin request handling |

### AI
| Technology | Purpose |
|---|---|
| **Google Gemini 2.5 Flash** | Medical report analysis and chat |
| **Custom Prompt Engineering** | Patient-friendly, plain-language responses |
| **Exponential Backoff Retry** | Reliable API call handling |

### File Processing
| Technology | Purpose |
|---|---|
| **pdfjs-dist** | PDF text extraction |
| **Tesseract.js** | OCR for image-based reports |

---

## 🗂️ Project Structure

```
MediTrace/
├── src/
│   ├── components/
│   │   ├── AnalysisResult.tsx   — Analysis display with 3 tabs
│   │   ├── Header.tsx           — App header with language switcher
│   │   ├── LandingPage.tsx      — Welcome landing page
│   │   ├── ReportInput.tsx      — Report paste / upload input
│   │   ├── SymptomChecker.tsx   — AI chat component (MediBot)
│   │   ├── DashboardCards.tsx   — Vitals dashboard cards
│   │   ├── WellnessHub.tsx      — Wellness tips and quotes
│   │   └── ParticleBackground.tsx — Animated background
│   ├── App.tsx                  — Main app with routing logic
│   ├── index.css                — Global styles and design system
│   └── main.tsx                 — React entry point
├── server/
│   ├── index.js                 — Express API server
│   └── .env                     — API keys and config (not committed)
├── public/                      — Static assets
└── index.html                   — HTML entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- A free Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Setup Instructions

**1. Clone the repository**

    git clone https://github.com/Piriyadharshinilk/MediTrace.git
    cd MediTrace

**2. Install frontend dependencies**

    npm install

**3. Install backend dependencies**

    cd server
    npm install

**4. Configure your API key**

Create a file called `.env` inside the `server/` folder with the following content:

    GEMINI_API_KEY=your_api_key_here
    PORT=3001
    GEMINI_MODEL=gemini-2.5-flash

**5. Start the backend server**

    cd server
    node index.js

**6. Start the frontend (in a new terminal)**

    npm run dev

**7. Open in your browser**

    http://localhost:5173

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check — shows active model |
| POST | `/api/analyze` | Analyze a medical report text |
| POST | `/api/chat` | Send a message to MediBot |

---

## 🔒 Privacy & Disclaimer

- No user data is stored or logged on any server
- All analysis is performed in real-time and not retained
- MediTrace AI is an **informational tool only** — not a substitute for professional medical advice
- Always consult a qualified doctor for any medical decisions

---

## 🧑‍💻 Developer

**Piriyadharshini L K**
Student | AI & Healthcare Enthusiast

- GitHub: [@Piriyadharshinilk](https://github.com/Piriyadharshinilk)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

> *"The greatest wealth is health."* — MediTrace AI
