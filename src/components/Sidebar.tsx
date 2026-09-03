import React from "react";
import {
  LayoutDashboard,
  Search,
  FileText,
  Target,
  Mail,
  Bot,
  Compass,
  CalendarCheck,
  Bookmark,
  Briefcase,
  UserCheck,
  ShieldAlert,
  FlaskConical,
  HelpCircle,
  Presentation,
  Home,
  Lock,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { ActiveNavTab } from "../types";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  savedJobsCount: number;
  applicationsCount: number;
  tasksCount: number;
  isMobileOpen: boolean;
  closeMobileMenu: () => void;
  onOpenAuth: (mode: "login" | "signup", protectedTabName?: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  savedJobsCount,
  applicationsCount,
  tasksCount,
  isMobileOpen,
  closeMobileMenu,
  onOpenAuth,
}) => {
  const { currentUser, logout } = useAuth();

  // Protected tabs that strictly require login for persistent personal data
  const protectedTabs: ActiveNavTab[] = [
    "saved-jobs",
    "applications",
    "my-profile",
  ];

  const navSections = [
    {
      title: "Public Hub",
      items: [
        { id: "landing" as ActiveNavTab, label: "Overview & Features", icon: Home, isProtected: false },
        { id: "find-jobs" as ActiveNavTab, label: "Find Jobs", icon: Search, badge: "Live Adzuna", isProtected: false },
      ],
    },
    {
      title: "Core Tools (Explore & Test)",
      items: [
        { id: "dashboard" as ActiveNavTab, label: "Dashboard", icon: LayoutDashboard, isProtected: false },
        { id: "cv-builder" as ActiveNavTab, label: "CV Builder", icon: FileText, isProtected: false },
        { id: "job-match" as ActiveNavTab, label: "Job Match", icon: Target, isProtected: false },
        { id: "application-email" as ActiveNavTab, label: "Application Email", icon: Mail, isProtected: false },
      ],
    },
    {
      title: "AI & Planning",
      items: [
        { id: "career-ai" as ActiveNavTab, label: "Career AI Chat", icon: Bot, isProtected: false },
        { id: "research-assistant" as ActiveNavTab, label: "Research Assistant", icon: Compass, isProtected: false },
        {
          id: "task-planner" as ActiveNavTab,
          label: "Task Planner",
          icon: CalendarCheck,
          counter: tasksCount > 0 ? tasksCount : undefined,
          isProtected: false,
        },
      ],
    },
    {
      title: "Personal Saved Data (Sign In)",
      items: [
        {
          id: "saved-jobs" as ActiveNavTab,
          label: "Saved Jobs",
          icon: Bookmark,
          counter: savedJobsCount > 0 ? savedJobsCount : undefined,
          isProtected: true,
        },
        {
          id: "applications" as ActiveNavTab,
          label: "Applications",
          icon: Briefcase,
          counter: applicationsCount > 0 ? applicationsCount : undefined,
          isProtected: true,
        },
        { id: "my-profile" as ActiveNavTab, label: "My Profile", icon: UserCheck, isProtected: true },
      ],
    },
    {
      title: "Evaluation & System",
      items: [
        { id: "prompt-lab" as ActiveNavTab, label: "Prompt Lab", icon: FlaskConical, badge: "25% Rubric", isProtected: false },
        { id: "responsible-ai" as ActiveNavTab, label: "Responsible AI", icon: ShieldAlert, isProtected: false },
        { id: "project-demo" as ActiveNavTab, label: "Project Demo", icon: Presentation, isProtected: false },
        { id: "help" as ActiveNavTab, label: "Help & Docs", icon: HelpCircle, isProtected: false },
      ],
    },
  ];

  const handleSelect = (tab: ActiveNavTab, label: string, isProtected: boolean) => {
    if (isProtected && !currentUser) {
      onOpenAuth("login", label);
      closeMobileMenu();
      return;
    }
    setActiveTab(tab);
    closeMobileMenu();
  };

  const handleLogoutClick = async () => {
    await logout();
    setActiveTab("landing");
    closeMobileMenu();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-16 z-30 inset-y-0 left-0 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } h-[calc(100vh-4rem)] overflow-y-auto shadow-xs md:shadow-none`}
      >
        <div className="p-4 space-y-5 flex-1">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {section.title}
              </h3>
              <div className="space-y-0.5 pt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const isLocked = item.isProtected && !currentUser;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelect(item.id, item.label, item.isProtected)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer group ${
                        isActive
                          ? "bg-blue-50 text-blue-700 border border-blue-200/80 shadow-xs font-semibold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isLocked && (
                          <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600" />
                        )}

                        {item.counter !== undefined && (
                          <span
                            className={`px-1.5 py-0.5 text-xs font-semibold rounded-full ${
                              isActive
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {item.counter}
                          </span>
                        )}

                        {item.badge && !item.counter && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              isActive
                                ? "bg-blue-100 text-blue-800"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Account / Session Block in Sidebar */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70">
          {currentUser ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-white border border-slate-200">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {currentUser.firstName?.[0] || "U"}
                  {currentUser.lastName?.[0] || ""}
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {currentUser.firstName} {currentUser.lastName}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {currentUser.professionalTitle || currentUser.email}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogoutClick}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-700 hover:bg-rose-50 border border-rose-200 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log Out
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => onOpenAuth("login")}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => onOpenAuth("signup")}
                className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Create Free Account
              </button>
            </div>
          )}

          {/* Developer credit & Adzuna attribution */}
          <div className="mt-3 pt-2 border-t border-slate-200/60 space-y-1.5 text-[11px] text-slate-400">
            <div className="flex items-center justify-between text-slate-500 font-medium">
              <span>CareerBridge AI</span>
              <span className="text-[10px] text-slate-400">v1.2</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Developed by Tshephang kawa
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <span>Powered by</span>
              <a
                href="https://www.adzuna.co.za"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-semibold text-[11px]"
              >
                Adzuna API
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
