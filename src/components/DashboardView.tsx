import React from "react";
import {
  FileText,
  Search,
  Target,
  Mail,
  CalendarCheck,
  Bookmark,
  Briefcase,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { CVData, SavedJob, ApplicationRecord, PlannerTask, ActiveNavTab } from "../types";
import { useAuth } from "../context/AuthContext";

interface DashboardViewProps {
  cvData: CVData;
  savedJobs: SavedJob[];
  applications: ApplicationRecord[];
  tasks: PlannerTask[];
  setActiveTab: (tab: ActiveNavTab) => void;
  onStartWorkflowStep: (step: number) => void;
  onOpenAuth?: (mode: "login" | "signup") => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cvData,
  savedJobs,
  applications,
  tasks,
  setActiveTab,
  onStartWorkflowStep,
  onOpenAuth,
}) => {
  // Calculate real CV completion percentage based on actual content
  const calculateCvCompletion = (): number => {
    let score = 0;
    if (cvData.personal?.fullName && cvData.personal?.email) score += 20;
    if (cvData.summary && cvData.summary.trim().length > 20) score += 20;
    if (cvData.experience && cvData.experience.length > 0) score += 25;
    if (cvData.education && cvData.education.length > 0) score += 15;
    if (cvData.skills?.technical && cvData.skills.technical.length > 0) score += 15;
    if (cvData.certifications && cvData.certifications.length > 0) score += 5;
    return Math.min(100, score);
  };

  const cvCompletion = calculateCvCompletion();
  const savedJobsCount = savedJobs.length;
  const applicationsCount = applications.length;

  // Calculate real average match score from saved jobs that have calculated scores
  const jobsWithScore = savedJobs.filter((j) => typeof j.matchScore === "number");
  const averageMatchScore =
    jobsWithScore.length > 0
      ? Math.round(
          jobsWithScore.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) /
            jobsWithScore.length
        )
      : null;

  const tasksRemaining = tasks.filter((t) => !t.completed).length;

  const workflowSteps = [
    { num: 1, title: "Create / Upload CV", tab: "cv-builder" as ActiveNavTab, done: cvCompletion >= 60 },
    { num: 2, title: "AI Skills Extraction", tab: "cv-builder" as ActiveNavTab, done: cvData.skills?.technical?.length > 0 },
    { num: 3, title: "Target Role & Location", tab: "find-jobs" as ActiveNavTab, done: false },
    { num: 4, title: "Search Real Adzuna Jobs", tab: "find-jobs" as ActiveNavTab, done: savedJobsCount > 0 },
    { num: 5, title: "Review Live Listings", tab: "find-jobs" as ActiveNavTab, done: false },
    { num: 6, title: "Select Vacancy", tab: "job-match" as ActiveNavTab, done: savedJobsCount > 0 },
    { num: 7, title: "Calculate Match Score", tab: "job-match" as ActiveNavTab, done: jobsWithScore.length > 0 },
    { num: 8, title: "Analyze Skill Gaps", tab: "job-match" as ActiveNavTab, done: jobsWithScore.length > 0 },
    { num: 9, title: "Tailor CV Content", tab: "cv-builder" as ActiveNavTab, done: false },
    { num: 10, title: "Generate Application Email", tab: "application-email" as ActiveNavTab, done: false },
    { num: 11, title: "Save Real Job", tab: "saved-jobs" as ActiveNavTab, done: savedJobsCount > 0 },
    { num: 12, title: "Track Application Status", tab: "applications" as ActiveNavTab, done: applicationsCount > 0 },
  ];

  const { currentUser } = useAuth();
  const firstName = currentUser?.firstName?.trim();
  const welcomeText = firstName ? `Welcome, ${firstName} 👋` : "Welcome to CareerBridge AI 👋";

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Guest Visitor Notice */}
      {!currentUser && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-blue-950">
                Visitor Exploration Mode
              </p>
              <p className="text-xs text-blue-700">
                You can freely test CV building, AI job matching, live job search, and career tools. Sign in or create an account to permanently save your CV, bookmark jobs, or track applications.
              </p>
            </div>
          </div>
          {onOpenAuth && (
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                type="button"
                onClick={() => onOpenAuth("login")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 hover:bg-blue-100 transition cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth("signup")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition cursor-pointer"
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      )}

      {/* Welcome & Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {welcomeText}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            CareerBridge AI is ready to help you find real Adzuna opportunities, optimize your CV, and automate applications.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab("find-jobs")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-xs transition"
          >
            <Search className="w-4 h-4" />
            Find Live Jobs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cv-builder")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 shadow-xs transition"
          >
            <FileText className="w-4 h-4" />
            Edit CV
          </button>
        </div>
      </div>

      {/* Primary Metrics Row (Section 8: Strictly Real Stored Data Only) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* CV Completion Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">CV Completion</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-1">
            <div className="text-2xl font-bold text-slate-900">{cvCompletion}%</div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${cvCompletion}%` }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("cv-builder")}
            className="text-xs text-blue-600 hover:text-blue-700 mt-3 flex items-center gap-1 font-medium"
          >
            {cvCompletion < 100 ? "Improve CV" : "View CV"} <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Jobs Saved Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Jobs Saved</span>
            <Bookmark className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-1">
            {savedJobsCount > 0 ? (
              <div className="text-2xl font-bold text-slate-900">{savedJobsCount}</div>
            ) : (
              <div className="text-base font-semibold text-slate-400">No activity yet</div>
            )}
            <p className="text-xs text-slate-500 mt-1">Real vacancies shortlisted</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("saved-jobs")}
            className="text-xs text-sky-600 hover:text-sky-700 mt-3 flex items-center gap-1 font-medium"
          >
            View Shortlist <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Applications Tracked Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Applications</span>
            <Briefcase className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-1">
            {applicationsCount > 0 ? (
              <div className="text-2xl font-bold text-slate-900">{applicationsCount}</div>
            ) : (
              <div className="text-base font-semibold text-slate-400">No activity yet</div>
            )}
            <p className="text-xs text-slate-500 mt-1">Active submissions</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("applications")}
            className="text-xs text-emerald-600 hover:text-emerald-700 mt-3 flex items-center gap-1 font-medium"
          >
            Open Tracker <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Average Job Match Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Job Match</span>
            <Target className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-1">
            {averageMatchScore !== null ? (
              <div className="text-2xl font-bold text-slate-900">{averageMatchScore}%</div>
            ) : (
              <div className="text-base font-semibold text-slate-400">No activity yet</div>
            )}
            <p className="text-xs text-slate-500 mt-1">Across analyzed roles</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("job-match")}
            className="text-xs text-indigo-600 hover:text-indigo-700 mt-3 flex items-center gap-1 font-medium"
          >
            Analyze Match <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Tasks Remaining Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tasks Remaining</span>
            <CalendarCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-1">
            {tasks.length > 0 ? (
              <div className="text-2xl font-bold text-slate-900">{tasksRemaining}</div>
            ) : (
              <div className="text-base font-semibold text-slate-400">No activity yet</div>
            )}
            <p className="text-xs text-slate-500 mt-1">Pending application steps</p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("task-planner")}
            className="text-xs text-amber-600 hover:text-amber-700 mt-3 flex items-center gap-1 font-medium"
          >
            Open Planner <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Streamlined 12-Step CV to Live Job Workflow (Section 30) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-50 text-blue-700 border border-blue-200">
                Major Feature
              </span>
              <h2 className="text-lg font-bold text-slate-900">Streamlined 12-Step Application Workflow</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Follow this sequence from raw CV drafting to live Adzuna search, match auditing, and submitted application.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab("project-demo")}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            Demo Overview <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {workflowSteps.map((step) => (
            <div
              key={step.num}
              onClick={() => setActiveTab(step.tab)}
              className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/90 hover:border-blue-500/50 hover:bg-blue-50/40 cursor-pointer transition group relative flex flex-col justify-between shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="w-6 h-6 rounded-md bg-white border border-slate-200 group-hover:bg-blue-600 text-slate-700 group-hover:text-white font-mono text-xs font-bold flex items-center justify-center transition shadow-2xs">
                  {step.num}
                </span>
                {step.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </div>
              <div className="mt-2.5">
                <h3 className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition">
                  {step.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Access Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900">Live Adzuna Job Search</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Search genuine vacancies across South Africa with real salary ranges, company names, and direct employer apply links.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab("find-jobs")}
            className="w-full py-2 px-3 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center gap-1.5 transition shadow-2xs"
          >
            Launch Search <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900">Job Match Analyzer</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Transparent scoring algorithm (40% skills, 25% experience, 20% qualifications, 15% keywords) without arbitrary guesswork.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab("job-match")}
            className="w-full py-2 px-3 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center gap-1.5 transition shadow-2xs"
          >
            Compare CV to Job <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-900">Smart Application Email</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Generate tailored emails aligned with verified experience. Choose between Professional, Confident, Friendly, or Formal tones.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab("application-email")}
            className="w-full py-2 px-3 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center gap-1.5 transition shadow-2xs"
          >
            Draft Email <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
