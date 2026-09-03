import React, { useState } from "react";
import {
  UserCheck,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  LogOut,
  Edit2,
  Save,
} from "lucide-react";
import { CVData } from "../types";
import { SAMPLE_CV } from "../data/demoData";
import { useAuth } from "../context/AuthContext";

interface MyProfileViewProps {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
  onLogout?: () => void;
}

export const MyProfileView: React.FC<MyProfileViewProps> = ({
  cvData,
  setCvData,
  onLogout,
}) => {
  const { currentUser, updateProfile, logout } = useAuth();

  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [firstName, setFirstName] = useState(currentUser?.firstName || "");
  const [lastName, setLastName] = useState(currentUser?.lastName || "");
  const [location, setLocation] = useState(currentUser?.location || "");
  const [professionalTitle, setProfessionalTitle] = useState(
    currentUser?.professionalTitle || ""
  );
  const [saving, setSaving] = useState(false);

  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(cvData, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `TK_CareerPilot_CV_${
        cvData.personal.fullName.replace(/\s+/g, "_") || "Export"
      }.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.personal && parsed.skills) {
            setCvData(parsed);
            alert("CV Profile successfully imported from backup file!");
          } else {
            alert("Invalid CV format JSON file.");
          }
        } catch {
          alert("Could not parse the JSON file.");
        }
      };
    }
  };

  const handleLoadSample = () => {
    if (
      confirm(
        "Load sample graduate CV template? This will replace your current draft."
      )
    ) {
      setCvData({
        ...SAMPLE_CV,
        personal: {
          ...SAMPLE_CV.personal,
          fullName: currentUser
            ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
            : SAMPLE_CV.personal.fullName,
          email: currentUser?.email || SAMPLE_CV.personal.email,
          location: currentUser?.location || SAMPLE_CV.personal.location,
        },
      });
    }
  };

  const handleReset = () => {
    if (confirm("Reset all CV details to an empty blank state?")) {
      setCvData({
        personal: {
          fullName: currentUser
            ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
            : "",
          email: currentUser?.email || "",
          phone: "",
          location: currentUser?.location || "",
          linkedin: "",
          portfolio: "",
          github: "",
        },
        summary: "",
        education: [],
        experience: [],
        skills: { technical: [], soft: [] },
        certifications: [],
        projects: [],
        languages: [],
      });
    }
  };

  const handleSaveAccountProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({
        firstName,
        lastName,
        location,
        professionalTitle,
      });
      // Also update personal name in CV if set
      setCvData((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          fullName: `${firstName} ${lastName}`.trim(),
          location,
        },
      }));
      setIsEditingAccount(false);
    } catch (e: any) {
      alert("Failed to update profile: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-blue-600" />
              Candidate Profile &amp; Data Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Isolated Account
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your authenticated account identity, data privacy, and CV backup archives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSample}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 flex items-center gap-1.5 transition shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Load Sample CV Template
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 flex items-center gap-1 transition shadow-xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Blank
          </button>
        </div>
      </div>

      {/* Authenticated Account Security & Identity Card */}
      {currentUser && (
        <div className="bg-linear-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg text-white shadow-sm">
                {currentUser.firstName?.[0] || "U"}
                {currentUser.lastName?.[0] || ""}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">
                    {currentUser.firstName} {currentUser.lastName}
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Owner
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  {currentUser.professionalTitle || "Candidate"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!isEditingAccount) {
                    setFirstName(currentUser.firstName);
                    setLastName(currentUser.lastName);
                    setLocation(currentUser.location);
                    setProfessionalTitle(currentUser.professionalTitle);
                  }
                  setIsEditingAccount(!isEditingAccount);
                }}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                {isEditingAccount ? "Cancel Edit" : "Edit Account Info"}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onLogout) onLogout();
                  else logout();
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-medium border border-rose-400/30 transition flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log Out
              </button>
            </div>
          </div>

          {isEditingAccount ? (
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Professional Title</label>
                <input
                  type="text"
                  value={professionalTitle}
                  onChange={(e) => setProfessionalTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveAccountProfile}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Mail className="w-3.5 h-3.5" /> Email
                </div>
                <div className="text-white font-medium truncate">{currentUser.email}</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <MapPin className="w-3.5 h-3.5" /> Location
                </div>
                <div className="text-white font-medium truncate">
                  {currentUser.location || "Not specified"}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Briefcase className="w-3.5 h-3.5" /> Title
                </div>
                <div className="text-white font-medium truncate">
                  {currentUser.professionalTitle || "Candidate"}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                  <Lock className="w-3.5 h-3.5 text-amber-400" /> Account ID (UID)
                </div>
                <div className="text-amber-300 font-mono text-[11px] truncate" title={currentUser.uid}>
                  {currentUser.uid}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">
              {cvData.personal.fullName || "Candidate Name Not Set"}
            </h2>
            <p className="text-xs text-slate-500">
              {cvData.personal.email} • {cvData.personal.phone || "No phone"} •{" "}
              {cvData.personal.location || "Location unassigned"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportJson}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Export JSON Backup
            </button>

            <label className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 flex items-center gap-1.5 cursor-pointer shadow-xs transition">
              <Upload className="w-3.5 h-3.5" /> Import JSON
              <input
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <span className="text-slate-500 font-semibold uppercase text-[10px]">Work Experience</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{cvData.experience.length} Roles</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <span className="text-slate-500 font-semibold uppercase text-[10px]">Education Entries</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{cvData.education.length} Qualifications</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <span className="text-slate-500 font-semibold uppercase text-[10px]">Technical Skills</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{cvData.skills.technical.length} Skills</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
            <span className="text-slate-500 font-semibold uppercase text-[10px]">Certifications</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{cvData.certifications.length} Verified</div>
          </div>
        </div>

        {/* Summary Snippet */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Current Professional Summary
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {cvData.summary || "No professional summary generated yet. Go to CV Builder to compose one."}
          </p>
        </div>
      </div>
    </div>
  );
};
