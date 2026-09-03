import React, { useState } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  Download,
  Check,
  RefreshCw,
  Target,
  FileCheck,
  Wand2,
} from "lucide-react";
import {
  CVData,
  EducationItem,
  ExperienceItem,
  CertificationItem,
  ProjectItem,
} from "../types";
import { cvAssist, extractCvFromFile } from "../services/api";

interface CvBuilderViewProps {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
  demoMode: boolean;
}

export const CvBuilderView: React.FC<CvBuilderViewProps> = ({
  cvData,
  setCvData,
  demoMode,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    "personal" | "summary" | "experience" | "education" | "skills" | "certifications" | "projects" | "upload"
  >("personal");

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResultModal, setAiResultModal] = useState<{ title: string; content: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // File Upload State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Helper updaters
  const updatePersonal = (field: keyof CVData["personal"], val: string) => {
    setCvData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: val },
    }));
  };

  const updateSummary = (val: string) => {
    setCvData((prev) => ({ ...prev, summary: val }));
  };

  // Education array management
  const addEducation = () => {
    const newItem: EducationItem = {
      id: "edu-" + Date.now(),
      institution: "",
      qualification: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    setCvData((prev) => ({ ...prev, education: [...prev.education, newItem] }));
  };

  const updateEducation = (id: string, field: keyof EducationItem, val: string) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.map((item) => (item.id === id ? { ...item, [field]: val } : item)),
    }));
  };

  const removeEducation = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id),
    }));
  };

  // Experience array management
  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: "exp-" + Date.now(),
      employer: "",
      position: "",
      startDate: "",
      endDate: "",
      responsibilities: "",
      achievements: "",
    };
    setCvData((prev) => ({ ...prev, experience: [...prev.experience, newItem] }));
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, val: string) => {
    setCvData((prev) => ({
      ...prev,
      experience: prev.experience.map((item) => (item.id === id ? { ...item, [field]: val } : item)),
    }));
  };

  const removeExperience = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      experience: prev.experience.filter((item) => item.id !== id),
    }));
  };

  // Certifications
  const addCertification = () => {
    const newItem: CertificationItem = {
      id: "cert-" + Date.now(),
      name: "",
      issuer: "",
      date: "",
    };
    setCvData((prev) => ({ ...prev, certifications: [...prev.certifications, newItem] }));
  };

  const updateCertification = (id: string, field: keyof CertificationItem, val: string) => {
    setCvData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((item) => (item.id === id ? { ...item, [field]: val } : item)),
    }));
  };

  const removeCertification = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((item) => item.id !== id),
    }));
  };

  // Projects
  const addProject = () => {
    const newItem: ProjectItem = {
      id: "proj-" + Date.now(),
      title: "",
      description: "",
      link: "",
    };
    setCvData((prev) => ({ ...prev, projects: [...prev.projects, newItem] }));
  };

  const updateProject = (id: string, field: keyof ProjectItem, val: string) => {
    setCvData((prev) => ({
      ...prev,
      projects: prev.projects.map((item) => (item.id === id ? { ...item, [field]: val } : item)),
    }));
  };

  const removeProject = (id: string) => {
    setCvData((prev) => ({
      ...prev,
      projects: prev.projects.filter((item) => item.id !== id),
    }));
  };

  // Skills handlers
  const handleSkillsChange = (type: "technical" | "soft", val: string) => {
    const skillsList = val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setCvData((prev) => ({
      ...prev,
      skills: { ...prev.skills, [type]: skillsList },
    }));
  };

  // AI Assistance Actions
  const handleAiAction = async (action: "generate-summary" | "suggest-skills" | "ats-readability") => {
    setAiLoading(true);
    try {
      const response = await cvAssist({
        action,
        cvData,
      });

      let title = "AI Assistant Result";
      if (action === "generate-summary") title = "ATS Professional Summary Suggestion";
      if (action === "suggest-skills") title = "Evidence-Based Skill Suggestions";
      if (action === "ats-readability") title = "ATS Readability Audit & Checklist";

      setAiResultModal({ title, content: response.result });
    } catch (err: any) {
      alert("AI Assistant error: " + (err.message || "Failed to generate AI advice."));
    } finally {
      setAiLoading(false);
    }
  };

  // Experience rewrite action
  const handleRewriteExperience = async (exp: ExperienceItem) => {
    setAiLoading(true);
    try {
      const response = await cvAssist({
        action: "rewrite-experience",
        cvData,
        experienceText: `${exp.position} at ${exp.employer}. Responsibilities: ${exp.responsibilities}. Achievements: ${exp.achievements}`,
      });
      setAiResultModal({
        title: `STAR Achievement Bullets for ${exp.position || "Experience"}`,
        content: response.result,
      });
    } catch (err: any) {
      alert("AI Assistant error: " + (err.message || "Failed to rewrite experience."));
    } finally {
      setAiLoading(false);
    }
  };

  // Handle File Upload
  const handleFileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploadLoading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const textContent = (event.target?.result as string) || "";
        if (!textContent.trim()) {
          setUploadError("We couldn't read text from this file. Please upload a plain text / document file or paste your CV text.");
          setUploadLoading(false);
          return;
        }

        try {
          const res = await extractCvFromFile(textContent, uploadFile.name);
          if (res.parsedCv) {
            setCvData((prev) => ({
              ...prev,
              personal: { ...prev.personal, ...(res.parsedCv.personal || {}) },
              summary: res.parsedCv.summary || prev.summary,
              education: (res.parsedCv.education as any) || prev.education,
              experience: (res.parsedCv.experience as any) || prev.experience,
              skills: {
                technical: res.parsedCv.skills?.technical || prev.skills.technical,
                soft: res.parsedCv.skills?.soft || prev.skills.soft,
              },
              certifications: (res.parsedCv.certifications as any) || prev.certifications,
              projects: (res.parsedCv.projects as any) || prev.projects,
              languages: res.parsedCv.languages || prev.languages,
            }));
            setUploadSuccess(true);
            setActiveSubTab("personal");
          }
        } catch (err: any) {
          setUploadError("We couldn't parse this file. Please upload another file or fill your details manually.");
        } finally {
          setUploadLoading(false);
        }
      };
      reader.readAsText(uploadFile);
    } catch {
      setUploadError("We couldn't read this file. Please upload another file or paste your CV text.");
      setUploadLoading(false);
    }
  };

  // Export CV to Text
  const exportAsText = () => {
    const lines = [
      cvData.personal.fullName.toUpperCase(),
      `${cvData.personal.email} | ${cvData.personal.phone} | ${cvData.personal.location}`,
      cvData.personal.linkedin ? `LinkedIn: ${cvData.personal.linkedin}` : "",
      cvData.personal.github ? `GitHub: ${cvData.personal.github}` : "",
      "",
      "PROFESSIONAL SUMMARY",
      "--------------------",
      cvData.summary,
      "",
      "WORK EXPERIENCE",
      "---------------",
      ...cvData.experience.map(
        (e) =>
          `${e.position} | ${e.employer} (${e.startDate} - ${e.endDate})\nResponsibilities:\n${e.responsibilities}\nAchievements:\n${e.achievements}\n`
      ),
      "",
      "EDUCATION",
      "---------",
      ...cvData.education.map(
        (ed) => `${ed.qualification} in ${ed.field}\n${ed.institution} (${ed.startDate} - ${ed.endDate})\n${ed.description}\n`
      ),
      "",
      "TECHNICAL SKILLS",
      "----------------",
      cvData.skills.technical.join(", "),
      "",
      "SOFT SKILLS",
      "-----------",
      cvData.skills.soft.join(", "),
      "",
      "CERTIFICATIONS",
      "--------------",
      ...cvData.certifications.map((c) => `${c.name} - ${c.issuer} (${c.date})`),
    ];

    const text = lines.filter((l) => l !== undefined).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title & AI Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            ATS-Friendly CV Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Build and optimize your curriculum vitae with truthful AI assistance. No fabricated credentials.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* AI Assistance Buttons (Section 10) */}
          <button
            type="button"
            disabled={aiLoading}
            onClick={() => handleAiAction("generate-summary")}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            AI Summary
          </button>

          <button
            type="button"
            disabled={aiLoading}
            onClick={() => handleAiAction("suggest-skills")}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <Wand2 className="w-3.5 h-3.5 text-blue-600" />
            Suggest Skills
          </button>

          <button
            type="button"
            disabled={aiLoading}
            onClick={() => handleAiAction("ats-readability")}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <FileCheck className="w-3.5 h-3.5 text-purple-600" />
            ATS Audit
          </button>

          <button
            type="button"
            onClick={exportAsText}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs flex items-center gap-1.5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            {copied ? "Copied!" : "Copy Formatted CV"}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-2 text-xs font-medium">
        {[
          { id: "personal", label: "Personal Info" },
          { id: "summary", label: "Professional Summary" },
          { id: "experience", label: `Experience (${cvData.experience.length})` },
          { id: "education", label: `Education (${cvData.education.length})` },
          { id: "skills", label: "Skills (Tech & Soft)" },
          { id: "certifications", label: `Certifications (${cvData.certifications.length})` },
          { id: "projects", label: `Projects (${cvData.projects.length})` },
          { id: "upload", label: "Upload CV Document" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeSubTab === tab.id
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Sub-Tab 1: Personal Info */}
      {activeSubTab === "personal" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Contact &amp; Identity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label htmlFor="cv-fullname" className="block text-slate-700 font-medium mb-1">Full Name *</label>
              <input
                id="cv-fullname"
                type="text"
                value={cvData.personal.fullName}
                onChange={(e) => updatePersonal("fullName", e.target.value)}
                placeholder="e.g. Tshephang Kawa"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
              />
            </div>

            <div>
              <label htmlFor="cv-email" className="block text-slate-700 font-medium mb-1">Email Address *</label>
              <input
                id="cv-email"
                type="email"
                value={cvData.personal.email}
                onChange={(e) => updatePersonal("email", e.target.value)}
                placeholder="e.g. tshephang@example.co.za"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
              />
            </div>

            <div>
              <label htmlFor="cv-phone" className="block text-slate-700 font-medium mb-1">Phone Number</label>
              <input
                id="cv-phone"
                type="text"
                value={cvData.personal.phone}
                onChange={(e) => updatePersonal("phone", e.target.value)}
                placeholder="e.g. +27 82 123 4567"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
              />
            </div>

            <div>
              <label htmlFor="cv-location" className="block text-slate-700 font-medium mb-1">Location / City</label>
              <input
                id="cv-location"
                type="text"
                value={cvData.personal.location}
                onChange={(e) => updatePersonal("location", e.target.value)}
                placeholder="e.g. Johannesburg, South Africa"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
              />
            </div>

            <div>
              <label htmlFor="cv-linkedin" className="block text-slate-700 font-medium mb-1">LinkedIn Profile</label>
              <input
                id="cv-linkedin"
                type="text"
                value={cvData.personal.linkedin}
                onChange={(e) => updatePersonal("linkedin", e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
              />
            </div>

            <div>
              <label htmlFor="cv-github" className="block text-slate-700 font-medium mb-1">GitHub / Portfolio</label>
              <input
                id="cv-github"
                type="text"
                value={cvData.personal.github}
                onChange={(e) => updatePersonal("github", e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Professional Summary */}
      {activeSubTab === "summary" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Professional Summary</h2>
            <button
              type="button"
              disabled={aiLoading}
              onClick={() => handleAiAction("generate-summary")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate with Gemini
            </button>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            A concise 3-4 sentence statement synthesizing your career focus, top competencies, and verifiable strengths.
          </p>
          <textarea
            rows={5}
            value={cvData.summary}
            onChange={(e) => updateSummary(e.target.value)}
            placeholder="e.g. Proactive Junior Cybersecurity Analyst with hands-on background in SIEM log monitoring..."
            className="w-full p-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed shadow-xs"
          />
        </div>
      )}

      {/* Sub-Tab 3: Work Experience */}
      {activeSubTab === "experience" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Work Experience</h2>
            <button
              type="button"
              onClick={addExperience}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1 transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Experience Entry
            </button>
          </div>

          {cvData.experience.length === 0 && (
            <div className="text-center py-10 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 shadow-xs">
              No work experience entries yet. Click 'Add Experience Entry' to add your internships, jobs, or volunteer roles.
            </div>
          )}

          {cvData.experience.map((exp, index) => (
            <div key={exp.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Position #{index + 1}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={aiLoading}
                    onClick={() => handleRewriteExperience(exp)}
                    className="text-xs font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1"
                    title="Transform responsibilities into STAR bullet points"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Rewrite (STAR)
                  </button>
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    aria-label={`Remove position ${index + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Job Title / Role</label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                    placeholder="e.g. IT Support Intern"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Company / Employer</label>
                  <input
                    type="text"
                    value={exp.employer}
                    onChange={(e) => updateExperience(exp.id, "employer", e.target.value)}
                    placeholder="e.g. Apex Digital Solutions"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Start Date</label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                    placeholder="e.g. Jan 2024"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">End Date</label>
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                    placeholder="e.g. Nov 2024 or Present"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Core Responsibilities</label>
                  <textarea
                    rows={3}
                    value={exp.responsibilities}
                    onChange={(e) => updateExperience(exp.id, "responsibilities", e.target.value)}
                    placeholder="Describe daily duties, tools managed, protocols followed..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Key Achievements &amp; Outcomes</label>
                  <textarea
                    rows={3}
                    value={exp.achievements}
                    onChange={(e) => updateExperience(exp.id, "achievements", e.target.value)}
                    placeholder="e.g. Automated patch reporting script, saving 4 hours per week..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-Tab 4: Education */}
      {activeSubTab === "education" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Education &amp; Qualifications</h2>
            <button
              type="button"
              onClick={addEducation}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1 transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Education Entry
            </button>
          </div>

          {cvData.education.map((edu, index) => (
            <div key={edu.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                  Qualification #{index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeEducation(edu.id)}
                  className="text-slate-400 hover:text-red-600 p-1"
                  aria-label={`Remove qualification ${index + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Qualification / Degree</label>
                  <input
                    type="text"
                    value={edu.qualification}
                    onChange={(e) => updateEducation(edu.id, "qualification", e.target.value)}
                    placeholder="e.g. Diploma in IT / BSc"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                    placeholder="e.g. Network & Systems Architecture"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Institution</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                    placeholder="e.g. University of Johannesburg"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Years Attended</label>
                  <input
                    type="text"
                    value={`${edu.startDate} - ${edu.endDate}`}
                    onChange={(e) => {
                      const parts = e.target.value.split("-");
                      updateEducation(edu.id, "startDate", parts[0]?.trim() || "");
                      updateEducation(edu.id, "endDate", parts[1]?.trim() || "");
                    }}
                    placeholder="e.g. 2021 - 2023"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block text-slate-700 font-medium mb-1">Description / Honors</label>
                <input
                  type="text"
                  value={edu.description}
                  onChange={(e) => updateEducation(edu.id, "description", e.target.value)}
                  placeholder="e.g. Graduated with distinction in Network Forensics..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-Tab 5: Skills */}
      {activeSubTab === "skills" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Technical Skills</h2>
              <span className="text-[11px] text-slate-500">Comma-separated</span>
            </div>
            <textarea
              rows={3}
              value={cvData.skills.technical.join(", ")}
              onChange={(e) => handleSkillsChange("technical", e.target.value)}
              placeholder="e.g. Python, Linux, Network Security, Wireshark, Git, SQL..."
              className="w-full p-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {cvData.skills.technical.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Soft Skills</h2>
              <span className="text-[11px] text-slate-500">Comma-separated</span>
            </div>
            <textarea
              rows={2}
              value={cvData.skills.soft.join(", ")}
              onChange={(e) => handleSkillsChange("soft", e.target.value)}
              placeholder="e.g. Problem Solving, Incident Communication, Teamwork..."
              className="w-full p-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {cvData.skills.soft.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-purple-50 border border-purple-200 text-purple-700 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 6: Certifications */}
      {activeSubTab === "certifications" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Certifications</h2>
            <button
              type="button"
              onClick={addCertification}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1 transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Certification
            </button>
          </div>

          {cvData.certifications.map((cert) => (
            <div key={cert.id} className="bg-white border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs items-center shadow-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Certification Name</label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                  placeholder="e.g. CompTIA Security+ (SY0-701)"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Issuer / Organization</label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                  placeholder="e.g. CompTIA / AWS / Cisco"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="block text-slate-700 font-medium mb-1">Year / Date</label>
                  <input
                    type="text"
                    value={cert.date}
                    onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                    placeholder="e.g. 2024"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCertification(cert.id)}
                  className="text-slate-400 hover:text-red-600 p-2 mt-5"
                  aria-label="Remove certification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-Tab 7: Projects */}
      {activeSubTab === "projects" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Projects &amp; Portfolio</h2>
            <button
              type="button"
              onClick={addProject}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1 transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Project
            </button>
          </div>

          {cvData.projects.map((proj) => (
            <div key={proj.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 text-xs shadow-xs">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={proj.title}
                  onChange={(e) => updateProject(proj.id, "title", e.target.value)}
                  placeholder="Project Title (e.g. Home Lab SIEM)"
                  className="font-semibold text-slate-900 bg-transparent border-b border-slate-300 pb-1 focus:outline-none focus:border-blue-600 w-2/3"
                />
                <button
                  type="button"
                  onClick={() => removeProject(proj.id)}
                  className="text-slate-400 hover:text-red-600 p-1"
                  aria-label="Remove project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <textarea
                rows={2}
                value={proj.description}
                onChange={(e) => updateProject(proj.id, "description", e.target.value)}
                placeholder="Description of technologies used, problems solved, and outcomes..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
              />
              <input
                type="text"
                value={proj.link}
                onChange={(e) => updateProject(proj.id, "link", e.target.value)}
                placeholder="Project repository or demo URL (e.g. https://github.com/...)"
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
              />
            </div>
          ))}
        </div>
      )}

      {/* Sub-Tab 8: Upload CV Document (Section 27) */}
      {activeSubTab === "upload" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Upload Existing CV</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload your existing CV document (.txt, text format) to automatically extract contact info, experience, and skills into your structured profile.
              </p>
            </div>
          </div>

          <form onSubmit={handleFileSubmit} className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/20 rounded-xl p-8 text-center transition">
              <input
                type="file"
                id="cv-file"
                accept=".txt,.pdf,.docx,.doc"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setUploadFile(e.target.files[0]);
                    setUploadError(null);
                  }
                }}
                className="hidden"
              />
              <label htmlFor="cv-file" className="cursor-pointer block space-y-2">
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-sm font-medium text-slate-800">
                  {uploadFile ? uploadFile.name : "Click to select or drag and drop your CV file"}
                </div>
                <p className="text-xs text-slate-500">Supported formats: .txt, document exports</p>
              </label>
            </div>

            {uploadError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>CV successfully extracted and loaded into form fields!</span>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="submit"
                disabled={!uploadFile || uploadLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition shadow-xs"
              >
                {uploadLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Reading your CV...
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5" />
                    Extract &amp; Parse Document
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AI Assistance Modal */}
      {aiResultModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                {aiResultModal.title}
              </h3>
              <button
                type="button"
                onClick={() => setAiResultModal(null)}
                className="text-slate-400 hover:text-slate-700 text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 text-xs text-slate-800 leading-relaxed space-y-3 font-sans whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-200">
              {aiResultModal.content}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">
                AI-generated suggestion — review before applying.
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(aiResultModal.content);
                    alert("Copied to clipboard!");
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 shadow-xs flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" /> Copy Text
                </button>
                <button
                  type="button"
                  onClick={() => setAiResultModal(null)}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
