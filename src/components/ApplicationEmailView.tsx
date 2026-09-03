import React, { useState } from "react";
import {
  Mail,
  Copy,
  Check,
  Download,
  RefreshCw,
  Sparkles,
  Bookmark,
  Briefcase,
  Sliders,
  AlertCircle,
  FileText,
} from "lucide-react";
import { CVData, SavedJob, ApplicationEmail, ApplicationRecord, ActiveNavTab } from "../types";
import { generateApplicationEmail } from "../services/api";

interface ApplicationEmailViewProps {
  cvData: CVData;
  savedJobs: SavedJob[];
  onAddApplication: (app: ApplicationRecord) => void;
  setActiveTab: (tab: ActiveNavTab) => void;
}

export const ApplicationEmailView: React.FC<ApplicationEmailViewProps> = ({
  cvData,
  savedJobs,
  onAddApplication,
  setActiveTab,
}) => {
  // Input fields
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [jobTitle, setJobTitle] = useState("Junior Cybersecurity Analyst");
  const [company, setCompany] = useState("Standard Vault Financial Tech");
  const [recipient, setRecipient] = useState("Hiring Manager");
  const [tone, setTone] = useState("Professional");
  const [customJobDesc, setCustomJobDesc] = useState("");

  // Email generation state
  const [loading, setLoading] = useState(false);
  const [emailData, setEmailData] = useState<ApplicationEmail | null>(null);
  const [editableFullDraft, setEditableFullDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const [savedToTracker, setSavedToTracker] = useState(false);

  // When selecting a saved job
  const handleJobSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedJobId(id);
    const job = savedJobs.find((j) => j.jobId === id);
    if (job) {
      setJobTitle(job.title);
      setCompany(job.company);
      setCustomJobDesc(job.descriptionSnippet || job.notes || "");
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setSavedToTracker(false);
    try {
      const skillsStr = cvData.skills.technical.slice(0, 8).join(", ");
      const expStr = cvData.experience
        .map((e) => `${e.position} at ${e.employer}: ${e.responsibilities} (${e.achievements})`)
        .join("; ");

      const result = await generateApplicationEmail({
        jobTitle,
        company,
        recipient,
        candidateName: cvData.personal.fullName || "Candidate",
        relevantExperience: expStr,
        relevantSkills: skillsStr,
        jobDescription: customJobDesc,
        tone,
      });

      setEmailData(result);
      setEditableFullDraft(result.fullDraft);
    } catch (err: any) {
      alert("Email generation failed: " + (err.message || "Unknown error."));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableFullDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([editableFullDraft], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Application_Email_${company.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveToTracker = () => {
    const newRecord: ApplicationRecord = {
      id: "app-" + Date.now(),
      company,
      jobTitle,
      jobUrl: "",
      applicationDate: new Date().toISOString().split("T")[0],
      status: "Applied",
      notes: `Generated tailored application email with ${tone} tone.`,
      emailGenerated: true,
      followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    };

    onAddApplication(newRecord);
    setSavedToTracker(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Mail className="w-6 h-6 text-blue-600" />
              Tailored Application Email Generator
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Section 15 Specification
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Craft a personalized, professional application cover email mapped directly to your genuine CV.
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>AI-generated draft — review before sending</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">
            Application Parameters
          </h2>

          {/* Quick Select Saved Job */}
          {savedJobs.length > 0 && (
            <div className="text-xs">
              <label className="block text-slate-700 font-medium mb-1">Select from Shortlisted Jobs</label>
              <select
                value={selectedJobId}
                onChange={handleJobSelect}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
              >
                <option value="">-- Or enter role details below --</option>
                {savedJobs.map((j) => (
                  <option key={j.id} value={j.jobId}>
                    {j.title} at {j.company}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="text-xs space-y-3">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Target Job Title *</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Junior Cybersecurity Analyst"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Hiring Company *</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Standard Vault Financial Tech"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Recipient Name / Title</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. Hiring Manager / Ms. Ndlovu"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
              />
            </div>

            {/* Tone Selector (Section 15: Professional, Confident, Friendly, Concise, Formal) */}
            <div>
              <label className="block text-slate-700 font-medium mb-1">Communication Tone</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {["Professional", "Confident", "Friendly", "Concise", "Formal"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`py-1.5 px-2 text-xs rounded-lg transition font-medium ${
                      tone === t
                        ? "bg-blue-600 text-white font-semibold shadow-xs"
                        : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Job Description Snippet (Optional)</label>
              <textarea
                rows={4}
                value={customJobDesc}
                onChange={(e) => setCustomJobDesc(e.target.value)}
                placeholder="Paste key duties or requirements to help the AI highlight your exact relevant experience..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
              />
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={handleGenerate}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Composing with Gemini...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Generate Tailored Email
              </>
            )}
          </button>
        </div>

        {/* Email Preview & Editing Column */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Email Draft &amp; Editor
              </h2>

              {emailData && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs flex items-center gap-1 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadTxt}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs flex items-center gap-1 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Download .txt
                  </button>
                </div>
              )}
            </div>

            {emailData ? (
              <div className="space-y-3">
                {/* Subject field */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <span className="text-slate-500 font-semibold mr-2">Subject:</span>
                  <span className="text-slate-900 font-medium">{emailData.subject}</span>
                </div>

                {/* Editable full draft */}
                <textarea
                  rows={14}
                  value={editableFullDraft}
                  onChange={(e) => setEditableFullDraft(e.target.value)}
                  className="w-full p-4 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed shadow-xs"
                />
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50/50 border border-slate-200 rounded-xl space-y-2">
                <Mail className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="text-sm font-semibold text-slate-700">No email generated yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Select a vacancy on the left and click 'Generate Tailored Email' to create a customized submission draft.
                </p>
              </div>
            )}
          </div>

          {/* Action Bar Footer */}
          {emailData && (
            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 italic">
                {emailData.disclaimer}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                </button>

                <button
                  type="button"
                  onClick={handleSaveToTracker}
                  disabled={savedToTracker}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs ${
                    savedToTracker
                      ? "bg-emerald-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  {savedToTracker ? "Saved to Applications!" : "Save to Application Tracker"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
