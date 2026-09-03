import React from "react";
import {
  Sparkles,
  Search,
  FileText,
  Briefcase,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  Lock,
  Layers,
  Award,
} from "lucide-react";
import { ActiveNavTab } from "../types";

interface LandingPageViewProps {
  onOpenAuth: (mode: "login" | "signup") => void;
  setActiveTab: (tab: ActiveNavTab) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onOpenAuth,
  setActiveTab,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Top Value Banner */}
      <div className="bg-linear-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-8 sm:p-12 shadow-lg mb-12 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> CareerBridge AI
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            Bridging the gap between you and your career.
          </h1>
          <p className="mt-3 text-sm text-blue-200/90 font-medium">
            Developed by Tshephang kawa
          </p>
          <p className="mt-4 text-base sm:text-lg text-blue-100/90 leading-relaxed">
            CareerBridge AI connects candidates with live South African and global opportunities on Adzuna, optimizes ATS-friendly CVs using Google Gemini, and automates high-impact application workflows.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 sm:gap-4 items-center">
            <button
              onClick={() => setActiveTab("dashboard")}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              Explore CareerBridge AI <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenAuth("login")}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition-all text-sm sm:text-base cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth("signup")}
              className="px-5 py-3 text-blue-200 hover:text-white transition-colors text-sm font-medium cursor-pointer"
            >
              Create Account
            </button>
            <button
              onClick={() => setActiveTab("find-jobs")}
              className="px-5 py-3 text-blue-200 hover:text-white transition-colors text-sm font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-4 h-4" /> Live Job Search
            </button>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-12 translate-y-12">
          <Sparkles className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Authentication & Visitor Notice Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 text-blue-700 rounded-lg shrink-0 mt-0.5 sm:mt-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-blue-950">
              Open Exploration &amp; Optional Sign In
            </h3>
            <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
              You can test the CV builder, explore live job searches, calculate AI match scores, and chat with the AI career advisor without creating an account. Sign in or create an account when you want to permanently save your CV, bookmark jobs, or track applications.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={() => onOpenAuth("login")}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => onOpenAuth("signup")}
            className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-blue-50 text-blue-900 border border-blue-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Create Account
          </button>
        </div>
      </div>

      {/* Core Platform Modules Grid */}
      <div className="mb-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Comprehensive Career Operating System
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Engineered specifically for junior tech talent and CAPACITI graduates to navigate the modern job market with verified tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Live Adzuna Job Intelligence
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Connects directly to real-time vacancies with transparent salary benchmarks, verified recruiter sources, and direct application URLs across South Africa.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("find-jobs")}
              className="mt-6 text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
            >
              Search Jobs Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                ATS CV Tailoring & Optimization
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Analyze your resume against ATS algorithms using Gemini models. Identify missing keywords, enhance impact metrics, and export professional PDF/JSON formats.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("cv-builder")}
              className="mt-6 text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
            >
              Test CV Builder Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Application & Goal Tracker
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Never lose track of an opportunity. Organize shortlisted roles, log employer communications, draft tailored cover emails, and schedule daily career goals.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("application-email")}
              className="mt-6 text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
            >
              Explore Application Email Tools <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Security & Multi-User Architecture Highlights */}
      <div className="bg-slate-100/70 border border-slate-200 rounded-2xl p-8 mb-12">
        <h3 className="text-lg font-bold text-slate-900 mb-6 text-center">
          Zero-Trust Security & Multi-User Data Isolation
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-white shadow-xs text-blue-600 shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Account Isolation</h4>
              <p className="text-xs text-slate-600 mt-1">
                Each candidate account maintains a strictly isolated space keyed by Account ID.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-white shadow-xs text-emerald-600 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">ABAC Firestore Rules</h4>
              <p className="text-xs text-slate-600 mt-1">
                Hardened security rules guarantee a user cannot access another person&apos;s CV or data.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-white shadow-xs text-purple-600 shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Clean Slate Start</h4>
              <p className="text-xs text-slate-600 mt-1">
                New accounts start with an empty, personalized profile ready for your own credentials.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-white shadow-xs text-amber-600 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Flexible Authentication</h4>
              <p className="text-xs text-slate-600 mt-1">
                Authenticate seamlessly via Google OAuth or standard email and password.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
