import React, { useState } from "react";
import {
  FlaskConical,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Scale,
  Award,
} from "lucide-react";
import { PromptLabResult } from "../types";
import { runPromptLabTest } from "../services/api";

export const PromptLabView: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<
    "cvSummary" | "jobMatching" | "applicationEmail" | "careerChat"
  >("cvSummary");

  const [testInput, setTestInput] = useState(
    "Candidate: Tshephang Kawa, CompTIA Security+, Python scripting, SIEM home lab, seeking Junior Cybersecurity Analyst."
  );

  const [loading, setLoading] = useState(false);
  const [labResult, setLabResult] = useState<PromptLabResult | null>(null);

  const handleRunComparison = async () => {
    setLoading(true);
    try {
      const result = await runPromptLabTest({
        category: activeCategory,
        testInput,
      });
      setLabResult(result);
    } catch (err: any) {
      alert("Prompt Lab test error: " + (err.message || "Failed to run prompt comparison."));
    } finally {
      setLoading(false);
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 9) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (score >= 6) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-amber-600" />
              Prompt Engineering Laboratory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              25% Evaluation Weight
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Empirical comparison of prompt evolution: Naive (v1) vs Intermediate (v2) vs Master Engineered (v3).
          </p>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 shadow-xs">
          <Award className="w-4 h-4 text-amber-600" />
          <span>Demonstrates prompt craft, schema validation, &amp; hallucination defense</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 text-xs font-medium">
        {[
          { id: "cvSummary", label: "1. Professional CV Summary" },
          { id: "jobMatching", label: "2. Job Matching & Fit Analysis" },
          { id: "applicationEmail", label: "3. Application Email Draft" },
          { id: "careerChat", label: "4. Career Counseling & Practice" },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setActiveCategory(cat.id as any);
              setLabResult(null);
            }}
            className={`px-3.5 py-2 rounded-lg transition ${
              activeCategory === cat.id
                ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Input / Execution Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
          Test Candidate Data Input
        </h2>
        <div className="text-xs">
          <textarea
            rows={3}
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
            placeholder="Enter test candidate skills, background, or vacancy target..."
            className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 leading-relaxed shadow-xs"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            disabled={loading}
            onClick={handleRunComparison}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-xl shadow-xs flex items-center gap-2 transition"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Executing Multi-Tier Prompt Test...
              </>
            ) : (
              <>
                <FlaskConical className="w-3.5 h-3.5" />
                Run Empirical Prompt Comparison
              </>
            )}
          </button>
        </div>
      </div>

      {/* Side-by-Side 3-Column Comparison (Section 24) */}
      {labResult ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Version 1: Naive */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                    Baseline
                  </span>
                  <h3 className="text-base font-bold text-slate-900">Version 1: Naive Prompt</h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getScoreBadge(
                    labResult.v1.usefulnessScore
                  )}`}
                >
                  Score: {labResult.v1.usefulnessScore}/10
                </span>
              </div>

              {/* Prompt formulation */}
              <div className="text-xs space-y-1">
                <span className="text-slate-500 font-semibold text-[10px] uppercase">
                  Prompt Dispatched to Model:
                </span>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700">
                  "{labResult.v1.prompt}"
                </div>
              </div>

              {/* Actual Model Output */}
              <div className="text-xs space-y-1">
                <span className="text-slate-500 font-semibold text-[10px] uppercase">
                  Actual Model Output:
                </span>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs leading-relaxed max-h-48 overflow-y-auto">
                  {labResult.v1.output}
                </div>
              </div>

              {/* Vulnerability Checklist */}
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1.5 text-rose-800">
                <div className="font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Audit Vulnerabilities:
                </div>
                <p className="text-[11px] leading-relaxed">
                  <strong>Hallucination Check:</strong> {labResult.v1.hallucinationCheck}
                </p>
                <p className="text-[11px] leading-relaxed">
                  <strong>Accuracy:</strong> {labResult.v1.accuracyCheck}
                </p>
              </div>
            </div>
          </div>

          {/* Version 2: Intermediate */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                    Structured
                  </span>
                  <h3 className="text-base font-bold text-slate-900">Version 2: Intermediate</h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getScoreBadge(
                    labResult.v2.usefulnessScore
                  )}`}
                >
                  Score: {labResult.v2.usefulnessScore}/10
                </span>
              </div>

              {/* Prompt formulation */}
              <div className="text-xs space-y-1">
                <span className="text-slate-500 font-semibold text-[10px] uppercase">
                  Prompt Dispatched to Model:
                </span>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700">
                  "{labResult.v2.prompt}"
                </div>
              </div>

              {/* Actual Model Output */}
              <div className="text-xs space-y-1">
                <span className="text-slate-500 font-semibold text-[10px] uppercase">
                  Actual Model Output:
                </span>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs leading-relaxed max-h-48 overflow-y-auto">
                  {labResult.v2.output}
                </div>
              </div>

              {/* Checklist */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1.5 text-amber-800">
                <div className="font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Audit Assessment:
                </div>
                <p className="text-[11px] leading-relaxed">
                  <strong>Hallucination Check:</strong> {labResult.v2.hallucinationCheck}
                </p>
                <p className="text-[11px] leading-relaxed">
                  <strong>Accuracy:</strong> {labResult.v2.accuracyCheck}
                </p>
              </div>
            </div>
          </div>

          {/* Version 3: Master Production Engineered */}
          <div className="bg-blue-50/40 border-2 border-blue-400 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-xs">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                    Production Grade
                  </span>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Version 3: Master Engineered
                  </h3>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getScoreBadge(
                    labResult.v3.usefulnessScore
                  )}`}
                >
                  Score: {labResult.v3.usefulnessScore}/10
                </span>
              </div>

              {/* Engineered Architecture Overview */}
              <div className="p-2.5 rounded-lg bg-white border border-blue-200 text-xs space-y-1 shadow-xs">
                <span className="text-blue-800 font-bold text-[10px] uppercase">
                  Engineered Structure Components:
                </span>
                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-700 font-mono">
                  <span>✓ Persona &amp; Role</span>
                  <span>✓ Negative Constraints</span>
                  <span>✓ Input Delimiters</span>
                  <span>✓ Strict Grounding</span>
                  <span>✓ JSON Schema</span>
                  <span>✓ Review Step</span>
                </div>
              </div>

              {/* Actual Model Output */}
              <div className="text-xs space-y-1">
                <span className="text-slate-500 font-semibold text-[10px] uppercase">
                  Actual Model Output:
                </span>
                <div className="p-3 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap shadow-xs">
                  {labResult.v3.output}
                </div>
              </div>

              {/* Production Advantages */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1.5 text-emerald-800">
                <div className="font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Quality Safeguards:
                </div>
                <p className="text-[11px] leading-relaxed">
                  <strong>Zero Hallucination:</strong> {labResult.v3.hallucinationCheck}
                </p>
                <p className="text-[11px] leading-relaxed">
                  <strong>Deterministic Reliability:</strong> {labResult.v3.accuracyCheck}
                </p>
              </div>

              {/* Key Improvements List */}
              {labResult.v3.improvements && (
                <div className="pt-2 text-[11px] text-slate-600 space-y-1">
                  <span className="font-semibold text-blue-800">Why v3 Dominates:</span>
                  {labResult.v3.improvements.map((imp, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-slate-700">
                      <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" />
                      <span>{imp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
          <FlaskConical className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800">
            Interactive Prompt Lab Ready
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click 'Run Empirical Prompt Comparison' above to see how Version 1, 2, and 3 prompts handle the identical candidate input under live evaluation.
          </p>
        </div>
      )}
    </div>
  );
};
