import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Filter,
  DollarSign,
  Briefcase,
  Calendar,
  ExternalLink,
  Bookmark,
  Target,
  AlertCircle,
  RefreshCw,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { AdzunaJob, ConfigStatus, ActiveNavTab, SavedJob } from "../types";
import { searchAdzunaJobs } from "../services/api";
import { FICTIONAL_DEMO_JOBS } from "../data/demoData";

interface FindJobsViewProps {
  config: ConfigStatus | null;
  demoMode: boolean;
  onSelectJobForMatch: (job: AdzunaJob) => void;
  onSaveJob: (job: AdzunaJob) => void;
  savedJobs: SavedJob[];
  setActiveTab: (tab: ActiveNavTab) => void;
}

const EXAMPLE_SEARCHES = [
  "Cybersecurity Analyst",
  "Junior Cybersecurity Analyst",
  "IT Support",
  "Software Developer",
  "Data Analyst",
  "Business Analyst",
  "AI Analyst",
  "Graduate Trainee",
  "Teacher",
  "Administrative Assistant",
];

export const FindJobsView: React.FC<FindJobsViewProps> = ({
  config,
  demoMode,
  onSelectJobForMatch,
  onSaveJob,
  savedJobs,
  setActiveTab,
}) => {
  // Search parameters
  const [what, setWhat] = useState("Cybersecurity Analyst");
  const [where, setWhere] = useState("Johannesburg");
  const [country, setCountry] = useState("za"); // Default: South Africa
  const [page, setPage] = useState(1);
  const [salaryMin, setSalaryMin] = useState<number | undefined>(undefined);
  const [fullTime, setFullTime] = useState(false);
  const [permanent, setPermanent] = useState(false);
  const [sortBy, setSortBy] = useState<"relevance" | "date" | "salary">("relevance");
  const [category, setCategory] = useState<string>("");

  // State
  const [jobs, setJobs] = useState<AdzunaJob[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ message: string; action?: string; code?: string } | null>(null);
  const [cachedNotice, setCachedNotice] = useState(false);

  // Perform the search
  const performSearch = async (pageNum: number = 1) => {
    setError(null);
    setLoading(true);

    if (demoMode) {
      // In demo mode, show the explicitly labeled fictional demo jobs
      setTimeout(() => {
        setJobs(FICTIONAL_DEMO_JOBS);
        setTotalCount(FICTIONAL_DEMO_JOBS.length);
        setPage(1);
        setLoading(false);
      }, 400);
      return;
    }

    try {
      const response = await searchAdzunaJobs({
        country,
        what: what.trim(),
        where: where.trim(),
        page: pageNum,
        salary_min: salaryMin,
        sort_by: sortBy,
        full_time: fullTime,
        permanent: permanent,
        category: category || undefined,
        results_per_page: 15,
      });

      setJobs(response.jobs);
      setTotalCount(response.totalCount);
      setPage(response.page);
      setCachedNotice(Boolean(response.cached));
    } catch (err: any) {
      console.error("Job search error:", err);
      setJobs([]);
      setTotalCount(0);
      setError({
        message: err.message || "Failed to retrieve live jobs.",
        action: err.action,
        code: err.code,
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial search on mount
  useEffect(() => {
    performSearch(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demoMode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    performSearch(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && (newPage - 1) * 15 < totalCount) {
      setPage(newPage);
      performSearch(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isJobSaved = (jobId: string) => {
    return savedJobs.some((j) => j.jobId === jobId);
  };

  const formatSalary = (min: number | null, max: number | null, currency: string = "R") => {
    if (!min && !max) return "Salary not disclosed";
    if (min && max && min !== max) {
      return `${currency}${min.toLocaleString()} – ${currency}${max.toLocaleString()} / year`;
    }
    return `${currency}${(min || max)?.toLocaleString()} / year`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Title & Attribution Notice (Section 5) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Find Real Live Jobs</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Adzuna API Integration
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Querying genuine, live job opportunities. Default market:{" "}
            <strong className="text-slate-800">South Africa (za)</strong>.
          </p>
        </div>

        {/* Adzuna Required Attribution (Section 5: Include clear attribution 'Jobs by Adzuna' with link) */}
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 shadow-xs">
          <span className="text-slate-500">Live data provided by:</span>
          <a
            href="https://www.adzuna.co.za"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Jobs by Adzuna <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Search Filter Form */}
      <form onSubmit={handleSearchSubmit} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keywords / Title Input */}
          <div className="md:col-span-5 relative">
            <label htmlFor="job-what" className="block text-xs font-semibold text-slate-700 mb-1">
              What job are you looking for?
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="job-what"
                type="text"
                value={what}
                onChange={(e) => setWhat(e.target.value)}
                placeholder="e.g. Cybersecurity Analyst, Software Developer..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
              />
            </div>
          </div>

          {/* Location Input */}
          <div className="md:col-span-4 relative">
            <label htmlFor="job-where" className="block text-xs font-semibold text-slate-700 mb-1">
              Where? (City or Region)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                id="job-where"
                type="text"
                value={where}
                onChange={(e) => setWhere(e.target.value)}
                placeholder="e.g. Johannesburg, Cape Town, Remote..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
              />
            </div>
          </div>

          {/* Country Selection (Default: South Africa) */}
          <div className="md:col-span-3">
            <label htmlFor="job-country" className="block text-xs font-semibold text-slate-700 mb-1">
              Country Market
            </label>
            <select
              id="job-country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full py-2 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 shadow-xs"
            >
              <option value="za">South Africa (za) - Default</option>
              <option value="gb">United Kingdom (gb)</option>
              <option value="us">United States (us)</option>
              <option value="ca">Canada (ca)</option>
              <option value="au">Australia (au)</option>
              <option value="de">Germany (de)</option>
              <option value="fr">France (fr)</option>
              <option value="in">India (in)</option>
              <option value="nl">Netherlands (nl)</option>
              <option value="nz">New Zealand (nz)</option>
              <option value="br">Brazil (br)</option>
              <option value="sg">Singapore (sg)</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700">
            {/* Sort Order */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-300 rounded-md px-2 py-1 text-xs text-slate-800 focus:outline-none shadow-xs"
              >
                <option value="relevance">Most Relevant</option>
                <option value="date">Date Posted (Newest)</option>
                <option value="salary">Highest Salary</option>
              </select>
            </div>

            {/* Checkboxes */}
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={fullTime}
                onChange={(e) => setFullTime(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-0 bg-white"
              />
              <span>Full-Time only</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={permanent}
                onChange={(e) => setPermanent(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-0 bg-white"
              />
              <span>Permanent only</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-2 transition"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Searching live job listings...
              </>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                Search Live Jobs
              </>
            )}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="pt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <span className="text-[11px] font-semibold text-slate-500 mr-1">Popular:</span>
          {EXAMPLE_SEARCHES.slice(0, 6).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setWhat(item);
                setPage(1);
              }}
              className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition text-[11px] border border-slate-200"
            >
              {item}
            </button>
          ))}
        </div>
      </form>

      {/* Error & Configuration Banner (Sections 6 & 34) */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 text-xs space-y-2 shadow-xs">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm text-red-900">{error.message}</p>
              {error.code === "ADZUNA_CONFIG_REQUIRED" && (
                <p className="mt-1 text-slate-700 leading-relaxed">
                  Live job search is temporarily unavailable. Please configure{" "}
                  <code className="text-amber-800 bg-amber-100 px-1 py-0.5 rounded font-mono">ADZUNA_APP_ID</code> and{" "}
                  <code className="text-amber-800 bg-amber-100 px-1 py-0.5 rounded font-mono">ADZUNA_APP_KEY</code> in Google AI Studio → Settings → Secrets.
                  Alternatively, you can test the interface with fictional Demo Mode or paste a manual job description.
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1 pl-6">
            <button
              type="button"
              onClick={() => setActiveTab("job-match")}
              className="px-3 py-1.5 rounded-md bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium shadow-xs"
            >
              Paste Manual Job Description Instead
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs animate-pulse flex items-center justify-center text-xs text-blue-700 gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            <span>Searching live job listings via Adzuna API...</span>
          </div>
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs animate-pulse space-y-3">
              <div className="h-5 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-16 bg-slate-100 rounded w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Results Header */}
      {!loading && jobs.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 px-1">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong>{jobs.length}</strong> jobs
              {totalCount > 0 && ` of ${totalCount.toLocaleString()} found`} in{" "}
              <strong className="text-slate-800 uppercase">{country}</strong>
            </span>
            {demoMode ? (
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200">
                Demo Data — Fictional
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                Live Adzuna Listings
              </span>
            )}
            {cachedNotice && <span className="text-[10px] text-slate-400">(cached)</span>}
          </div>

          <div className="text-[11px] text-slate-500">
            Page {page} • Click 'Match My CV' to audit compatibility
          </div>
        </div>
      )}

      {/* Empty State (Section 40) */}
      {!loading && !error && jobs.length === 0 && (
        <div className="text-center py-16 px-4 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No live jobs found for this search.</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try broadening your search keywords, clearing location filters, or switching market country.
          </p>
          <button
            type="button"
            onClick={() => {
              setWhat("Analyst");
              setWhere("");
              performSearch(1);
            }}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition"
          >
            Search Broader Vacancies
          </button>
        </div>
      )}

      {/* Job Cards List (Sections 4 & 29) */}
      {!loading && jobs.length > 0 && (
        <div className="space-y-4">
          {jobs.map((job) => {
            const saved = isJobSaved(job.id);
            return (
              <div
                key={job.id}
                className="bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm rounded-xl p-5 space-y-4 transition group shadow-xs"
              >
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                        {job.title}
                      </h2>
                      {job.isDemo ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-800 border border-amber-200">
                          Demo Data — Fictional
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-50 text-blue-700 border border-blue-200">
                          Live Job
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="font-semibold text-slate-700">{job.company}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      {job.category && (
                        <>
                          <span>•</span>
                          <span className="text-blue-600 font-medium">{job.category}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-2 text-xs self-start">
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                      {job.jobType}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
                      {formatSalary(job.salaryMin, job.salaryMax)}
                    </span>
                  </div>
                </div>

                {/* Description Snippet */}
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {job.description}
                </p>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Posted {new Date(job.created).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Source: {job.source}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Save Job button */}
                    <button
                      type="button"
                      onClick={() => onSaveJob(job)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition border ${
                        saved
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-xs"
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-emerald-600 text-emerald-600" : "text-slate-400"}`} />
                      {saved ? "Saved" : "Save Job"}
                    </button>

                    {/* Match My CV button */}
                    <button
                      type="button"
                      onClick={() => onSelectJobForMatch(job)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 shadow-2xs transition"
                    >
                      <Target className="w-3.5 h-3.5 text-indigo-600" />
                      Match My CV
                    </button>

                    {/* Official Apply link (actual returned Adzuna URL, never fake) */}
                    <a
                      href={job.redirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs transition"
                    >
                      View / Apply <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && jobs.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <span>
            Page <strong className="text-slate-900">{page}</strong> of{" "}
            {Math.max(1, Math.ceil(totalCount / 15))}
          </span>
          <button
            type="button"
            disabled={page * 15 >= totalCount}
            onClick={() => handlePageChange(page + 1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-xs"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
