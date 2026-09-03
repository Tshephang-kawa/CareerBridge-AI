import React, { useState } from "react";
import {
  Compass,
  Search,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  RefreshCw,
  Info,
} from "lucide-react";
import { ResearchReport } from "../types";
import { researchCareerTopic } from "../services/api";

const PRESET_TOPICS = [
  "Cybersecurity Analyst career roadmap in South Africa",
  "Cloud Engineer vs DevOps Engineer certification pathways",
  "High-demand programming languages for enterprise banking",
  "How to transition from Helpdesk IT to Security Operations (SOC)",
  "Data Analyst core competencies: SQL, Python, PowerBI",
];

export const ResearchAssistantView: React.FC = () => {
  const [topic, setTopic] = useState("Cybersecurity Analyst career roadmap in South Africa");
  const [researchType, setResearchType] = useState("role");
  const [sourceContent, setSourceContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResearch = async (searchTopic?: string) => {
    const q = searchTopic || topic;
    if (!q.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await researchCareerTopic({
        topic: q,
        researchType,
        sourceContent: sourceContent || undefined,
      });
      setReport(res);
    } catch (err: any) {
      setError(err.message || "Failed to complete career research.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Compass className="w-6 h-6 text-blue-600" />
              Career Research Assistant
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Role &amp; Industry Intelligence
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Investigate qualifications, certification roadmaps, salary expectations, and skill demands.
          </p>
        </div>

        {/* Data Provenance Badge (Section 17) */}
        <div className="p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 flex items-center gap-2 shadow-xs">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Based on career knowledge base and supplied sources</span>
        </div>
      </div>

      {/* Query Formulation Form */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-9 relative">
            <label htmlFor="research-topic" className="block text-xs font-semibold text-slate-700 mb-1">
              Research Topic or Target Career Domain
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="research-topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Junior Cloud Engineer certification path..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label htmlFor="research-focus" className="block text-xs font-semibold text-slate-700 mb-1">
              Research Focus
            </label>
            <select
              id="research-focus"
              value={researchType}
              onChange={(e) => setResearchType(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
            >
              <option value="role">Role Roadmap</option>
              <option value="certifications">Certifications</option>
              <option value="skills">Skills Demand</option>
              <option value="transition">Career Transition</option>
            </select>
          </div>
        </div>

        {/* Preset topics */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-500">
          <span className="text-[11px] font-semibold text-slate-500 mr-1">Popular Topics:</span>
          {PRESET_TOPICS.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setTopic(t);
                handleResearch(t);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-blue-600 transition text-[11px] shadow-xs"
            >
              {t}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={loading || !topic.trim()}
            onClick={() => handleResearch()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-2 transition"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Synthesizing Career Findings...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Generate Research Brief
              </>
            )}
          </button>
        </div>
      </div>

      {/* Research Output View (Section 17) */}
      {report && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                Synthesized Report
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">{report.title}</h2>
            </div>
            <span className="text-xs text-slate-500">
              Generated {new Date(report.searchedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Executive Summary
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {report.summary}
            </p>
          </div>

          {/* Key Findings & Important Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Key Findings */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                Key Findings
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {report.keyFindings.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Skills */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                Core &amp; Emerging Competencies
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {report.importantSkills.map((s, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Career Implications & Next Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Career Implications
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">{report.careerImplications}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Recommended Next Steps
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {report.recommendedNextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Questions to Investigate */}
          {report.questionsToInvestigate && report.questionsToInvestigate.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                Open Questions for Your Own Due Diligence
              </h3>
              <ul className="space-y-1 text-xs text-slate-600">
                {report.questionsToInvestigate.map((q, idx) => (
                  <li key={idx}>• {q}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer Provenance Note */}
          <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 text-center">
            {report.dataProvenance}
          </div>
        </div>
      )}
    </div>
  );
};
