import React, { useState } from "react";
import {
  Target,
  FileText,
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Info,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { CVData, AdzunaJob, SavedJob, JobMatchResult, ActiveNavTab } from "../types";
import { analyzeJobMatch } from "../services/api";

interface JobMatchViewProps {
  cvData: CVData;
  savedJobs: SavedJob[];
  selectedJobForMatch: AdzunaJob | null;
  setSelectedJobForMatch: (job: AdzunaJob | null) => void;
  setActiveTab: (tab: ActiveNavTab) => void;
  onUpdateJobScore?: (jobId: string, score: number) => void;
}

export const JobMatchView: React.FC<JobMatchViewProps> = ({
  cvData,
  savedJobs,
  selectedJobForMatch,
  setSelectedJobForMatch,
  setActiveTab,
  onUpdateJobScore,
}) => {
  // Input modes: "saved" (from saved/live job) or "manual" (pasted job description)
  const [matchMode, setMatchMode] = useState<"selected" | "manual">(
    selectedJobForMatch ? "selected" : "manual"
  );

  // Manual job details
  const [manualTitle, setManualTitle] = useState("");
  const [manualCompany, setManualCompany] = useState("");
  const [manualDescription, setManualDescription] = useState("");

  // Analysis result state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JobMatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  const runMatchAnalysis = async () => {
    setError(null);
    setLoading(true);

    let jobPayload = {
      title: "",
      company: "",
      location: "",
      jobType: "",
      description: "",
      isLive: false,
    };

    if (matchMode === "selected" && selectedJobForMatch) {
      jobPayload = {
        title: selectedJobForMatch.title,
        company: selectedJobForMatch.company,
        location: selectedJobForMatch.location,
        jobType: selectedJobForMatch.jobType,
        description: selectedJobForMatch.description,
        isLive: selectedJobForMatch.isLive,
      };
    } else {
      if (!manualTitle.trim() || !manualDescription.trim()) {
        setError("Please enter both a Job Title and Job Description to run the match analysis.");
        setLoading(false);
        return;
      }
      jobPayload = {
        title: manualTitle.trim(),
        company: manualCompany.trim() || "Unspecified Organization",
        location: "Provided in description",
        jobType: "Manual Job Description",
        description: manualDescription.trim(),
        isLive: false,
      };
    }

    try {
      const matchResult = await analyzeJobMatch({
        cvData,
        jobDetails: jobPayload,
      });
      setResult(matchResult);

      // If this was a saved job, update its match score in local storage state
      if (matchMode === "selected" && selectedJobForMatch && onUpdateJobScore) {
        onUpdateJobScore(selectedJobForMatch.id, matchResult.matchScore);
      }
    } catch (err: any) {
      console.error("Job match error:", err);
      setError(err.message || "Failed to analyze job match.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-emerald-700 border-emerald-200 bg-emerald-50";
    if (score >= 50) return "text-amber-700 border-amber-200 bg-amber-50";
    return "text-rose-700 border-rose-200 bg-rose-50";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Target className="w-6 h-6 text-purple-600" />
              Deterministic Job Match Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              Gemini + Weighted Scoring
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compare your CV directly against a live Adzuna vacancy or any pasted vacancy description.
          </p>
        </div>

        {/* Responsible AI match guarantee notice */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Objective matching: Protected demographic traits ignored</span>
        </div>
      </div>

      {/* Target Job Selector & Mode Toggles */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-slate-600">Target Vacancy Source:</span>
            <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setMatchMode("selected")}
                className={`px-3 py-1 rounded-md transition text-xs ${
                  matchMode === "selected"
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Saved / Live Adzuna Job
              </button>
              <button
                type="button"
                onClick={() => setMatchMode("manual")}
                className={`px-3 py-1 rounded-md transition text-xs ${
                  matchMode === "manual"
                    ? "bg-white text-slate-900 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Manual Job Description
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("find-jobs")}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
          >
            Browse Live Adzuna Jobs <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Mode A: Selected Saved/Live Job */}
        {matchMode === "selected" && (
          <div className="space-y-3">
            {selectedJobForMatch ? (
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedJobForMatch.title}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] rounded bg-blue-100 text-blue-800 font-semibold">
                      {selectedJobForMatch.isDemo ? "Demo Data" : "Live Adzuna"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {selectedJobForMatch.company} • {selectedJobForMatch.location}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedJobForMatch(null)}
                    className="text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1 bg-white border border-slate-200 rounded-md shadow-xs font-medium"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Select from your saved vacancies:
                </label>
                {savedJobs.length > 0 ? (
                  <select
                    onChange={(e) => {
                      const found = savedJobs.find((j) => j.jobId === e.target.value);
                      if (found) {
                        setSelectedJobForMatch({
                          id: found.jobId,
                          title: found.title,
                          company: found.company,
                          location: found.location,
                          salaryMin: null,
                          salaryMax: null,
                          jobType: "Full-Time",
                          contractTime: null,
                          contractType: null,
                          created: found.dateSaved,
                          description: found.descriptionSnippet || found.notes || "",
                          category: "General",
                          redirectUrl: found.url,
                          source: "Adzuna",
                          isLive: found.isLive,
                          isDemo: found.isDemo,
                        });
                      }
                    }}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                  >
                    <option value="">-- Choose a saved job --</option>
                    {savedJobs.map((j) => (
                      <option key={j.id} value={j.jobId}>
                        {j.title} — {j.company} ({j.location})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                    <span>No saved jobs yet. Find one in Live Jobs or paste a description below.</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("find-jobs")}
                      className="px-3 py-1 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-xs"
                    >
                      Find Live Jobs
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Mode B: Manual Paste */}
        {matchMode === "manual" && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Target Job Title *
                </label>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="e.g. Junior Cybersecurity Analyst"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  value={manualCompany}
                  onChange={(e) => setManualCompany(e.target.value)}
                  placeholder="e.g. Standard Vault Financial Tech"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-700 font-semibold mb-1">
                Paste Complete Job Description &amp; Requirements *
              </label>
              <textarea
                rows={5}
                value={manualDescription}
                onChange={(e) => setManualDescription(e.target.value)}
                placeholder="Paste the requirements, duties, qualifications, and stack from the employer listing..."
                className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 font-sans text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed shadow-xs"
              />
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Run Analysis Trigger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500">
            Comparing candidate profile for: <strong className="text-slate-900">{cvData.personal.fullName || "Candidate"}</strong>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={runMatchAnalysis}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Auditing Compatibility with Gemini...
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                Analyze Compatibility Score
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      {result && (
        <div className="space-y-6">
          {/* Top Score Banner & Breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Compatibility Audit Result
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {result.isLiveJob ? "Live Vacancy" : "Manual Listing"}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {result.jobTitle} at {result.company}
                </h2>
                <p className="text-xs text-slate-500">
                  Calculated using CareerBridge AI deterministic weighted matrix.
                </p>
              </div>

              {/* Big Score Gauge */}
              <div
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl border ${getScoreColor(
                  result.matchScore
                )}`}
              >
                <div className="text-center">
                  <div className="text-4xl font-extrabold tracking-tight">{result.matchScore}%</div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider mt-0.5">
                    {result.matchScore >= 75
                      ? "Strong Match"
                      : result.matchScore >= 50
                      ? "Moderate Match"
                      : "Developing Match"}
                  </div>
                </div>
              </div>
            </div>

            {/* Deterministic Scoring Formula Breakdown (Section 13) */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  Deterministic Score Breakdown
                </h3>
                <button
                  type="button"
                  onClick={() => setShowFormulaDetails(!showFormulaDetails)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  <span>{showFormulaDetails ? "Hide Formula" : "How this score works"}</span>
                  {showFormulaDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* Metric Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between text-xs text-slate-800 font-semibold mb-1">
                    <span>Skills Match</span>
                    <span>{result.scoreBreakdown.skillsScore}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${result.scoreBreakdown.skillsScore}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1.5 block">
                    Weight: {result.scoreBreakdown.skillsWeight}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between text-xs text-slate-800 font-semibold mb-1">
                    <span>Experience Alignment</span>
                    <span>{result.scoreBreakdown.experienceScore}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-sky-600 h-full rounded-full"
                      style={{ width: `${result.scoreBreakdown.experienceScore}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1.5 block">
                    Weight: {result.scoreBreakdown.experienceWeight}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between text-xs text-slate-800 font-semibold mb-1">
                    <span>Qualifications</span>
                    <span>{result.scoreBreakdown.qualificationScore}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full"
                      style={{ width: `${result.scoreBreakdown.qualificationScore}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1.5 block">
                    Weight: {result.scoreBreakdown.qualificationWeight}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between text-xs text-slate-800 font-semibold mb-1">
                    <span>Keyword Evidence</span>
                    <span>{result.scoreBreakdown.keywordEvidenceScore}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${result.scoreBreakdown.keywordEvidenceScore}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1.5 block">
                    Weight: {result.scoreBreakdown.keywordEvidenceWeight}
                  </span>
                </div>
              </div>

              {/* Explanatory Dropdown */}
              {showFormulaDetails && (
                <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2">
                  <div className="font-semibold text-blue-700">Scoring Methodology:</div>
                  <p className="text-slate-600 leading-relaxed">
                    Total Score = (Skills × 0.40) + (Experience × 0.25) + (Qualifications × 0.20) + (Keyword Evidence × 0.15).
                    Scores above 75% represent high qualification alignment. Scores between 50-74% indicate strong transferable foundation with targeted upskilling gaps.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Matched Skills vs Genuine Skill Gaps (Section 12) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Matched Skills */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Matched Skills ({result.matchedSkills.length})</span>
              </div>
              <p className="text-xs text-slate-500">
                Skills directly verified in your CV that match the job specifications:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.matchedSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
                {result.matchedSkills.length === 0 && (
                  <span className="text-xs text-slate-400 italic">No direct keyword overlap identified.</span>
                )}
              </div>
            </div>

            {/* Genuine Skill Gaps */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-rose-700 font-semibold text-sm">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Genuine Skill Gaps ({result.skillGaps.length})</span>
              </div>
              <p className="text-xs text-slate-500">
                Job requirements not explicitly evidenced in your current CV:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.skillGaps.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
                {result.skillGaps.length === 0 && (
                  <span className="text-xs text-slate-400 italic">No major skill gaps identified.</span>
                )}
              </div>
            </div>
          </div>

          {/* Qualitative Alignment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Experience Alignment Assessment
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {result.experienceMatch}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-2 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Qualification &amp; Education Assessment
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                {result.qualificationMatch}
              </p>
            </div>
          </div>

          {/* Actionable Recommendations & Warnings */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Actionable Recommendations to Improve Your Application
            </h3>
            <ul className="space-y-2 text-xs text-slate-700">
              {result.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>

            {result.warnings && result.warnings.length > 0 && (
              <div className="pt-3 border-t border-slate-100 space-y-1">
                <div className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Critical Considerations:
                </div>
                {result.warnings.map((w, idx) => (
                  <p key={idx} className="text-xs text-slate-600 pl-5">
                    • {w}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Next Steps Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-600">
              Ready to proceed with this application?
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("cv-builder")}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs transition"
              >
                Tailor CV in Builder
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("application-email")}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
              >
                Draft Application Email
              </button>
            </div>
          </div>

          {/* Mandatory Employment Disclaimer (Section 14 & 22) */}
          <div className="p-3 rounded-lg bg-white border border-slate-200 text-center text-[11px] text-slate-500 shadow-xs">
            <strong>Mandatory Notice:</strong> AI-generated match estimate — not a guarantee of employment or interview selection.
          </div>
        </div>
      )}
    </div>
  );
};
