import React from "react";
import {
  Bookmark,
  ExternalLink,
  Target,
  Trash2,
  Calendar,
  Building,
  MapPin,
  Clock,
  Sparkles,
  Search,
} from "lucide-react";
import { SavedJob, JobApplicationStatus, ActiveNavTab, AdzunaJob } from "../types";

interface SavedJobsViewProps {
  savedJobs: SavedJob[];
  setSavedJobs: React.Dispatch<React.SetStateAction<SavedJob[]>>;
  onSelectJobForMatch: (job: AdzunaJob) => void;
  setActiveTab: (tab: ActiveNavTab) => void;
}

export const SavedJobsView: React.FC<SavedJobsViewProps> = ({
  savedJobs,
  setSavedJobs,
  onSelectJobForMatch,
  setActiveTab,
}) => {
  const handleStatusChange = (id: string, newStatus: JobApplicationStatus) => {
    setSavedJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: newStatus } : j))
    );
  };

  const handleNotesChange = (id: string, newNotes: string) => {
    setSavedJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, notes: newNotes } : j))
    );
  };

  const handleRemove = (id: string) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const handleTriggerMatch = (saved: SavedJob) => {
    const jobObj: AdzunaJob = {
      id: saved.jobId,
      title: saved.title,
      company: saved.company,
      location: saved.location,
      salaryMin: null,
      salaryMax: null,
      jobType: "Full-Time",
      contractTime: null,
      contractType: null,
      created: saved.dateSaved,
      description: saved.descriptionSnippet || saved.notes || "",
      category: "Saved",
      redirectUrl: saved.url,
      source: "Adzuna",
      isLive: saved.isLive,
      isDemo: saved.isDemo,
    };

    onSelectJobForMatch(jobObj);
    setActiveTab("job-match");
  };

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
              <Bookmark className="w-6 h-6 text-blue-600" />
              Saved Jobs Shortlist
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {savedJobs.length} Vacancies
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track opportunities you are targeting with real Adzuna application links, notes, and match scores.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveTab("find-jobs")}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1.5 transition self-start sm:self-auto shadow-xs"
        >
          <Search className="w-3.5 h-3.5" /> Find More Live Jobs
        </button>
      </div>

      {/* Saved Jobs List */}
      <div className="space-y-4">
        {savedJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 space-y-4 transition shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">{job.title}</h2>
                  {job.isDemo ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-800 border border-amber-200">
                      Demo Data — Fictional
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Live Listing
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="font-semibold text-slate-800">{job.company}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span>Saved on {job.dateSaved}</span>
                </div>
              </div>

              {/* Status Selector & Score Gauge */}
              <div className="flex items-center gap-3">
                {typeof job.matchScore === "number" && (
                  <div className="px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" />
                    {job.matchScore}% Match
                  </div>
                )}

                <select
                  value={job.status}
                  onChange={(e) => handleStatusChange(job.id, e.target.value as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${getStatusBadge(
                    job.status
                  )} bg-white focus:outline-none shadow-xs`}
                >
                  <option value="Saved">Saved</option>
                  <option value="Considering">Considering</option>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* Notes Input Field */}
            <div className="text-xs">
              <label className="block text-slate-700 mb-1 font-medium">Personal Notes</label>
              <input
                type="text"
                value={job.notes}
                onChange={(e) => handleNotesChange(job.id, e.target.value)}
                placeholder="Add reminders, referral contacts, or thoughts on this vacancy..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleRemove(job.id)}
                className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove from Shortlist
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTriggerMatch(job)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1 shadow-xs transition"
                >
                  <Target className="w-3.5 h-3.5" /> Match My CV
                </button>

                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 shadow-xs transition"
                >
                  View on Adzuna <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}

        {savedJobs.length === 0 && (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
            <Bookmark className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-semibold text-slate-800">No jobs saved in your shortlist yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Search real live vacancies on Adzuna and click 'Save Job' to organize your target opportunities.
            </p>
            <button
              type="button"
              onClick={() => setActiveTab("find-jobs")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
            >
              Explore Live Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
