import React, { useState } from "react";
import {
  Sparkles,
  Briefcase,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  Menu,
  X,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Database,
  ChevronDown,
} from "lucide-react";
import { ConfigStatus, ActiveNavTab } from "../types";
import { useAuth } from "../context/AuthContext";

interface HeaderProps {
  config: ConfigStatus | null;
  demoMode: boolean;
  onToggleDemoMode: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  setActiveTab: (tab: ActiveNavTab) => void;
  activeTab: ActiveNavTab;
  responsibleAiAgreed: boolean;
  onOpenAuth: (mode: "login" | "signup") => void;
  onOpenFirebaseGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  demoMode,
  onToggleDemoMode,
  mobileMenuOpen,
  onToggleMobileMenu,
  setActiveTab,
  activeTab,
  responsibleAiAgreed,
  onOpenAuth,
  onOpenFirebaseGuide,
}) => {
  const { currentUser, logout, isFirebaseConfigured } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    setActiveTab("landing");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Branding */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            onClick={onToggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(currentUser ? "dashboard" : "landing")}
            className="flex items-center gap-2.5 text-left group transition cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition">
                  TK's Career Pilot AI
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  Multi-User Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                AI Career &amp; Job Application Assistant
              </p>
            </div>
          </button>
        </div>

        {/* Status Badges & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Gemini Status Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 border border-slate-200">
            <div
              className={`w-2 h-2 rounded-full ${
                config?.geminiConfigured ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span className="text-slate-600">Gemini:</span>
            <span className={config?.geminiConfigured ? "text-emerald-700 font-medium" : "text-amber-700 font-semibold"}>
              {config?.geminiConfigured ? "Live" : "Needed"}
            </span>
          </div>

          {/* Adzuna Status Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 border border-slate-200">
            <div
              className={`w-2 h-2 rounded-full ${
                config?.adzunaConfigured ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span className="text-slate-600">Adzuna:</span>
            <span className={config?.adzunaConfigured ? "text-emerald-700 font-medium" : "text-amber-700 font-semibold"}>
              {config?.adzunaConfigured ? "Live (ZA)" : "Demo"}
            </span>
          </div>

          {/* Firebase Guide Button */}
          <button
            type="button"
            onClick={onOpenFirebaseGuide}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
            title="Inspect Firebase Setup & Architecture"
          >
            <Database className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Firebase</span> Steps
          </button>

          {/* Presentation Demo Mode Toggle Button */}
          <button
            type="button"
            onClick={onToggleDemoMode}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition border cursor-pointer ${
              demoMode
                ? "bg-amber-50 text-amber-900 border-amber-300 shadow-xs"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 shadow-xs"
            }`}
            title="Toggle presentation demo mode"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span>Demo Mode</span>
          </button>

          {/* User Account State */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {currentUser.firstName?.[0] || "U"}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.firstName}
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    {currentUser.professionalTitle || "Candidate"}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      ID: {currentUser.uid}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setActiveTab("my-profile");
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    My Profile
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setActiveTab("dashboard");
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-slate-400" />
                    Dashboard
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenAuth("login")}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth("signup")}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs cursor-pointer flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Create</span> Account
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Presentation Demo Banner */}
      {demoMode && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-1 text-center text-xs text-amber-900 font-medium flex items-center justify-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>
            <strong>Demo Mode Active:</strong> Displaying presentation fixtures.
          </span>
        </div>
      )}
    </header>
  );
};
