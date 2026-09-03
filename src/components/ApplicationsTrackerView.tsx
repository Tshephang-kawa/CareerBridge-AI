import React, { useState } from "react";
import {
  Briefcase,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Building,
  Target,
  Mail,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { ApplicationRecord, JobApplicationStatus, ActiveNavTab } from "../types";

interface ApplicationsTrackerViewProps {
  applications: ApplicationRecord[];
  setApplications: React.Dispatch<React.SetStateAction<ApplicationRecord[]>>;
  setActiveTab: (tab: ActiveNavTab) => void;
}

export const ApplicationsTrackerView: React.FC<ApplicationsTrackerViewProps> = ({
  applications,
  setApplications,
  setActiveTab,
}) => {
  // Modal / Add form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState("");
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newStatus, setNewStatus] = useState<JobApplicationStatus>("Applied");
  const [newNotes, setNewNotes] = useState("");
  const [newInterviewDate, setNewInterviewDate] = useState("");
  const [newFollowUpDate, setNewFollowUpDate] = useState("");

  const handleCreateApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newJobTitle.trim()) return;

    const newApp: ApplicationRecord = {
      id: "app-" + Date.now(),
      company: newCompany.trim(),
      jobTitle: newJobTitle.trim(),
      jobUrl: "",
      applicationDate: new Date().toISOString().split("T")[0],
      status: newStatus,
      notes: newNotes.trim(),
      interviewDate: newInterviewDate || undefined,
      followUpDate: newFollowUpDate || undefined,
    };

    setApplications((prev) => [newApp, ...prev]);
    setShowAddModal(false);
    setNewCompany("");
    setNewJobTitle("");
    setNewNotes("");
    setNewInterviewDate("");
    setNewFollowUpDate("");
  };

  const handleUpdateStatus = (id: string, status: JobApplicationStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const handleRemove = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  // Pipeline summary statistics
  const appliedCount = applications.filter((a) => a.status === "Applied").length;
  const interviewCount = applications.filter((a) => a.status === "Interview").length;
  const offerCount = applications.filter((a) => a.status === "Offer").length;
  const rejectedCount = applications.filter((a) => a.status === "Rejected").length;

  const getStatusBadge = (status: JobApplicationStatus) => {
    switch (status) {
      case "Saved":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "Considering":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "Applied":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Interview":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Offer":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-600" />
              Job Application Tracker
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Pipeline Management
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track interview dates, recruiter follow-ups, submission timelines, and offer statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1.5 transition self-start sm:self-auto shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" /> Log Application
        </button>
      </div>

      {/* Visual Pipeline Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
            Active Submissions
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{appliedCount}</div>
          <span className="text-[10px] text-slate-500">Awaiting recruiter review</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-600">
            Interviews
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{interviewCount}</div>
          <span className="text-[10px] text-slate-500">Screening &amp; Technical</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">
            Offers Extended
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{offerCount}</div>
          <span className="text-[10px] text-slate-500">Negotiation stage</span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Total Pipeline
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{applications.length}</div>
          <span className="text-[10px] text-slate-500">Tracked records</span>
        </div>
      </div>

      {/* Applications Table / Cards */}
      <div className="space-y-3">
        {applications.map((app) => (
          <div
            key={app.id}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{app.jobTitle}</h2>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                    app.status
                  )}`}
                >
                  {app.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="font-semibold text-slate-800">{app.company}</span>
                <span>•</span>
                <span>Applied: {app.applicationDate}</span>
                {app.interviewDate && (
                  <>
                    <span>•</span>
                    <span className="text-purple-600 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Interview: {app.interviewDate}
                    </span>
                  </>
                )}
                {app.followUpDate && (
                  <>
                    <span>•</span>
                    <span className="text-amber-600 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Follow up: {app.followUpDate}
                    </span>
                  </>
                )}
              </div>
              {app.notes && (
                <p className="text-xs text-slate-600 pt-1 leading-relaxed">{app.notes}</p>
              )}
            </div>

            <div className="flex items-center gap-2 self-start md:self-center shrink-0">
              {/* Change Status Dropdown */}
              <select
                value={app.status}
                onChange={(e) => handleUpdateStatus(app.id, e.target.value as any)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-xs"
              >
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
                <option value="Considering">Considering</option>
              </select>

              <button
                type="button"
                onClick={() => handleRemove(app.id)}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition"
                aria-label="Delete application record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {applications.length === 0 && (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
            <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-semibold text-slate-800">No applications tracked yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Whenever you send an email or submit an application on Adzuna, log it here to stay organized with follow-ups and interviews.
            </p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
            >
              Log Your First Application
            </button>
          </div>
        )}
      </div>

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Log Job Application
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company / Organization *</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Standard Vault Financial Tech"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  placeholder="e.g. Junior Cybersecurity Analyst"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Current Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Considering">Considering</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Interview Date (Optional)</label>
                  <input
                    type="date"
                    value={newInterviewDate}
                    onChange={(e) => setNewInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Follow-up Date (Optional)</label>
                <input
                  type="date"
                  value={newFollowUpDate}
                  onChange={(e) => setNewFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notes &amp; Recruiter Contact</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Referral name, recruiter email, expected response window..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
