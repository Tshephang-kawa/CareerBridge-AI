import React from "react";
import {
  HelpCircle,
  KeyRound,
  ExternalLink,
  Search,
  FileText,
  Target,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export const HelpView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              CareerBridge AI Documentation &amp; FAQ
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              User Guide
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Learn how to configure live job search credentials, optimize CVs, and navigate the application lifecycle.
          </p>
        </div>
      </div>

      {/* Adzuna Configuration Guide Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-amber-500" />
          How to Configure Live Adzuna Job Search
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          CareerBridge AI connects to the official Adzuna REST API to retrieve genuine live job openings across South Africa (za) and international markets. To search live listings:
        </p>

        <ol className="list-decimal list-inside text-xs text-slate-700 space-y-2 pl-2">
          <li>
            Register for a free developer account at{" "}
            <a
              href="https://developer.adzuna.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-semibold"
            >
              developer.adzuna.com <ExternalLink className="w-3 h-3 inline" />
            </a>
            .
          </li>
          <li>
            Create an application in your Adzuna dashboard to obtain your{" "}
            <code className="bg-amber-50 text-amber-800 px-1 py-0.5 rounded border border-amber-200 font-mono text-[11px]">App ID</code> and <code className="bg-amber-50 text-amber-800 px-1 py-0.5 rounded border border-amber-200 font-mono text-[11px]">App Key</code>.
          </li>
          <li>
            Open <strong>Google AI Studio → Settings → Secrets</strong> (or your container environment configuration).
          </li>
          <li>
            Add two server-side secrets:
            <ul className="list-disc list-inside pl-4 pt-2 space-y-1 font-mono text-[11px] text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 mt-1.5">
              <li>ADZUNA_APP_ID = your_application_id</li>
              <li>ADZUNA_APP_KEY = your_application_key</li>
            </ul>
          </li>
          <li>
            Restart the dev server or refresh the application. The Adzuna status indicator in the top header will turn green ("Live (ZA)").
          </li>
        </ol>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Frequently Asked Questions</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm">Does the app use fake or simulated job postings?</h3>
            <p className="text-slate-600 leading-relaxed">
              No. In normal mode, all search results are live vacancies queried directly from Adzuna's real-time API. If no jobs match your query or credentials are not yet configured, the app tells you honestly instead of creating simulated jobs. An optional Fictional Demo Mode is provided strictly for offline UI demonstration.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm">How does the Job Match score work?</h3>
            <p className="text-slate-600 leading-relaxed">
              CareerBridge AI uses a transparent, deterministic weighted formula: 40% verified technical skills, 25% experience alignment, 20% education &amp; qualifications, and 15% keyword evidence. Match scores are strictly estimates to guide your CV tailoring and never guarantee employment outcomes.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm">Can the AI fabricate work history or qualifications?</h3>
            <p className="text-slate-600 leading-relaxed">
              Strictly no. All system instructions contain rigorous negative constraints prohibiting Gemini from inventing employers, degrees, dates, or non-evidenced accomplishments. Candidates must always review AI-generated text before submitting.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm">Where is my CV data stored?</h3>
            <p className="text-slate-600 leading-relaxed">
              Your candidate profile is stored locally in your browser's local storage state. You can export a JSON backup at any time via My Profile and restore it across sessions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
