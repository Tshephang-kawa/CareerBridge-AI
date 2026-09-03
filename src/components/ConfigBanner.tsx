import React, { useState } from "react";
import { AlertCircle, KeyRound, ExternalLink, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { ConfigStatus } from "../types";

interface ConfigBannerProps {
  config: ConfigStatus | null;
  onOpenDemo: () => void;
}

export const ConfigBanner: React.FC<ConfigBannerProps> = ({ config, onOpenDemo }) => {
  const [expanded, setExpanded] = useState(false);

  // If both are fully configured, show nothing or a subtle ready state
  if (config?.geminiConfigured && config?.adzunaConfigured) {
    return null;
  }

  const needsGemini = !config?.geminiConfigured;
  const needsAdzuna = !config?.adzunaConfigured;

  return (
    <div className="bg-blue-50/80 border-b border-blue-200/80 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 border border-blue-200 shrink-0 mt-0.5 sm:mt-0 shadow-xs">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-slate-900">
                  {needsAdzuna && needsGemini
                    ? "Live API Credentials Setup Required"
                    : needsAdzuna
                    ? "Adzuna Job Search Credentials Needed"
                    : "Gemini AI Key Setup"}
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800 border border-amber-200">
                  Setup Instructions
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {needsAdzuna
                  ? "Live job queries require your Adzuna App ID & Key. Manual job description matching and fictional Demo Mode are available right now."
                  : "Gemini AI will run automatically once the key is attached in Secrets."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={onOpenDemo}
              className="px-2.5 py-1 text-xs font-medium rounded-md bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 shadow-xs transition"
            >
              Enable Demo Mode
            </button>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 transition font-medium"
            >
              <span>{expanded ? "Hide Details" : "How to Add Secrets"}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expanded Instructions Panel */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-blue-200/60 text-xs text-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs space-y-2">
              <h4 className="font-semibold text-blue-800 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-center leading-4 text-[10px] font-bold">
                  1
                </span>
                Adzuna Live Job Search Credentials
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Add these server-side secrets in <strong>Google AI Studio → Settings → Secrets</strong>:
              </p>
              <ul className="space-y-1 font-mono text-[11px] bg-slate-50 p-2 rounded border border-slate-200">
                <li className="flex items-center justify-between">
                  <span className="text-blue-700 font-semibold">ADZUNA_APP_ID</span>
                  <span className="text-slate-500 text-[10px]">Your Adzuna Application ID</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-blue-700 font-semibold">ADZUNA_APP_KEY</span>
                  <span className="text-slate-500 text-[10px]">Your Adzuna Application Key</span>
                </li>
              </ul>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-600">
                <span>Free registration at:</span>
                <a
                  href="https://developer.adzuna.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-semibold"
                >
                  developer.adzuna.com <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs space-y-2">
              <h4 className="font-semibold text-blue-800 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-center leading-4 text-[10px] font-bold">
                  2
                </span>
                Google Gemini API
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Google AI Studio automatically configures <code className="text-emerald-700 font-mono font-semibold">GEMINI_API_KEY</code> for full-stack applications.
              </p>
              <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center gap-2 text-[11px]">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    config?.geminiConfigured ? "text-emerald-600" : "text-amber-600"
                  }`}
                />
                <span>
                  Gemini Status:{" "}
                  <strong>{config?.geminiConfigured ? "Active & Ready" : "Checking injection..."}</strong>
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                *The application never exposes your private keys to the client browser.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
