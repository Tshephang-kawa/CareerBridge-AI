import React, { useState, useEffect, useCallback } from "react";
import {
  ConfigStatus,
  ActiveNavTab,
  CVData,
  SavedJob,
  ApplicationRecord,
  PlannerTask,
  AdzunaJob,
} from "./types";
import { fetchConfigStatus } from "./services/api";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Sub-components
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ConfigBanner } from "./components/ConfigBanner";
import { LandingPageView } from "./components/LandingPageView";
import { AuthModal } from "./components/AuthModal";
import { FirebaseSetupGuideModal } from "./components/FirebaseSetupGuideModal";
import { DashboardView } from "./components/DashboardView";
import { FindJobsView } from "./components/FindJobsView";
import { CvBuilderView } from "./components/CvBuilderView";
import { JobMatchView } from "./components/JobMatchView";
import { ApplicationEmailView } from "./components/ApplicationEmailView";
import { CareerAiChatView } from "./components/CareerAiChatView";
import { ResearchAssistantView } from "./components/ResearchAssistantView";
import { TaskPlannerView } from "./components/TaskPlannerView";
import { SavedJobsView } from "./components/SavedJobsView";
import { ApplicationsTrackerView } from "./components/ApplicationsTrackerView";
import { MyProfileView } from "./components/MyProfileView";
import { ResponsibleAiView } from "./components/ResponsibleAiView";
import { PromptLabView } from "./components/PromptLabView";
import { ProjectDemoView } from "./components/ProjectDemoView";
import { HelpView } from "./components/HelpView";

const RESPONSIBLE_AI_KEY = "careerpilot_responsible_ai_v1";
const DEMO_MODE_KEY = "careerpilot_demo_mode_v1";

// Only persistent personal storage tabs strictly require login
const PROTECTED_TABS: ActiveNavTab[] = [
  "saved-jobs",
  "applications",
  "my-profile",
];

const TAB_FRIENDLY_NAMES: Record<string, string> = {
  dashboard: "Personal Dashboard",
  "cv-builder": "CV Builder & Optimizer",
  "job-match": "AI Job Match & Scoring",
  "application-email": "Tailored Application Email Generator",
  "career-ai": "Personal Career AI Chat",
  "research-assistant": "Company Research Assistant",
  "task-planner": "Personal Task Planner",
  "saved-jobs": "Your Saved Jobs",
  applications: "Your Applications Tracker",
  "my-profile": "Candidate Profile & Account Settings",
};

function createInitialEmptyCV(
  firstName: string,
  lastName: string,
  email: string,
  location: string
): CVData {
  return {
    personal: {
      fullName: `${firstName} ${lastName}`.trim(),
      email: email || "",
      phone: "",
      location: location || "",
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
  };
}

function MainAppContent() {
  const { currentUser, loading: authLoading } = useAuth();

  const [config, setConfig] = useState<ConfigStatus | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveNavTab>("landing");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMode, setDemoMode] = useState<boolean>(() => {
    return localStorage.getItem(DEMO_MODE_KEY) === "true";
  });

  // Selected job for matching workflow
  const [selectedJobForMatch, setSelectedJobForMatch] = useState<AdzunaJob | null>(null);

  // Auth Modals State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");
  const [redirectReason, setRedirectReason] = useState<string | null>(null);
  const [firebaseGuideOpen, setFirebaseGuideOpen] = useState(false);

  // Responsible AI Agreement
  const [responsibleAiAgreed, setResponsibleAiAgreed] = useState<boolean>(() => {
    return localStorage.getItem(RESPONSIBLE_AI_KEY) === "true";
  });

  // Isolated User Data State
  const [cvData, setCvData] = useState<CVData>(() =>
    createInitialEmptyCV("", "", "", "")
  );
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [tasks, setTasks] = useState<PlannerTask[]>([]);

  // Track if user data has loaded for current session
  const [userDataLoaded, setUserDataLoaded] = useState(false);

  // Load / switch user data whenever currentUser changes
  useEffect(() => {
    if (!currentUser) {
      // Clear all private user data from memory on logout
      setCvData(createInitialEmptyCV("", "", "", ""));
      setSavedJobs([]);
      setApplications([]);
      setTasks([]);
      setUserDataLoaded(false);

      // If user was on a protected tab, redirect to landing
      if (PROTECTED_TABS.includes(activeTab)) {
        setActiveTab("landing");
      }
      return;
    }

    // Load data isolated strictly by current user's UID
    const uid = currentUser.uid;
    const userCvKey = `careerpilot_user_${uid}_cv_v1`;
    const userJobsKey = `careerpilot_user_${uid}_saved_jobs_v1`;
    const userAppsKey = `careerpilot_user_${uid}_applications_v1`;
    const userTasksKey = `careerpilot_user_${uid}_tasks_v1`;

    try {
      const storedCv = localStorage.getItem(userCvKey);
      if (storedCv) {
        setCvData(JSON.parse(storedCv));
      } else {
        // New user starts with an empty profile populated with their registration information
        const emptyCv = createInitialEmptyCV(
          currentUser.firstName,
          currentUser.lastName,
          currentUser.email,
          currentUser.location
        );
        setCvData(emptyCv);
        localStorage.setItem(userCvKey, JSON.stringify(emptyCv));
      }

      const storedJobs = localStorage.getItem(userJobsKey);
      if (storedJobs) {
        setSavedJobs(JSON.parse(storedJobs));
      } else {
        setSavedJobs([]);
      }

      const storedApps = localStorage.getItem(userAppsKey);
      if (storedApps) {
        setApplications(JSON.parse(storedApps));
      } else {
        setApplications([]);
      }

      const storedTasks = localStorage.getItem(userTasksKey);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks([]);
      }

      setUserDataLoaded(true);
    } catch (e) {
      console.error("Error loading isolated user data:", e);
    }
  }, [currentUser]);

  // Save isolated user data whenever state updates
  useEffect(() => {
    if (!currentUser || !userDataLoaded) return;
    const uid = currentUser.uid;
    localStorage.setItem(`careerpilot_user_${uid}_cv_v1`, JSON.stringify(cvData));
  }, [cvData, currentUser, userDataLoaded]);

  useEffect(() => {
    if (!currentUser || !userDataLoaded) return;
    const uid = currentUser.uid;
    localStorage.setItem(`careerpilot_user_${uid}_saved_jobs_v1`, JSON.stringify(savedJobs));
  }, [savedJobs, currentUser, userDataLoaded]);

  useEffect(() => {
    if (!currentUser || !userDataLoaded) return;
    const uid = currentUser.uid;
    localStorage.setItem(`careerpilot_user_${uid}_applications_v1`, JSON.stringify(applications));
  }, [applications, currentUser, userDataLoaded]);

  useEffect(() => {
    if (!currentUser || !userDataLoaded) return;
    const uid = currentUser.uid;
    localStorage.setItem(`careerpilot_user_${uid}_tasks_v1`, JSON.stringify(tasks));
  }, [tasks, currentUser, userDataLoaded]);

  // System settings
  useEffect(() => {
    localStorage.setItem(RESPONSIBLE_AI_KEY, String(responsibleAiAgreed));
  }, [responsibleAiAgreed]);

  useEffect(() => {
    localStorage.setItem(DEMO_MODE_KEY, String(demoMode));
  }, [demoMode]);

  // Fetch server config status on mount
  useEffect(() => {
    fetchConfigStatus()
      .then((cfg) => {
        setConfig(cfg);
      })
      .catch((err) => {
        console.error("Failed to load server config status:", err);
      });
  }, []);

  // Protected navigation interceptor
  const handleNavigate = useCallback(
    (targetTab: ActiveNavTab) => {
      if (PROTECTED_TABS.includes(targetTab) && !currentUser) {
        setRedirectReason(
          `Please sign in or create an account to access ${
            TAB_FRIENDLY_NAMES[targetTab] || "this personal feature"
          }.`
        );
        setAuthModalMode("login");
        setAuthModalOpen(true);
        return;
      }
      setActiveTab(targetTab);
    },
    [currentUser]
  );

  const handleOpenAuth = (mode: "login" | "signup", protectedName?: string) => {
    setAuthModalMode(mode);
    if (protectedName) {
      setRedirectReason(`Please sign in or create an account to access ${protectedName}.`);
    } else {
      setRedirectReason(null);
    }
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    setRedirectReason(null);
    // Requirement 4: After successful authentication, redirect user to Dashboard
    setActiveTab("dashboard");
  };

  const handleSaveJob = (job: AdzunaJob) => {
    if (!currentUser) {
      handleOpenAuth("login", "saving jobs to your personal shortlist");
      return;
    }

    if (savedJobs.some((j) => j.jobId === job.id)) {
      alert("This job is already saved in your shortlist!");
      return;
    }

    const newSaved: SavedJob = {
      id: "saved-" + Date.now(),
      jobId: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      url: job.redirectUrl,
      dateSaved: new Date().toISOString().split("T")[0],
      notes: "Saved from live search",
      status: "Saved",
      isLive: job.isLive,
      isDemo: job.isDemo,
      descriptionSnippet: job.description.slice(0, 200) + "...",
    };

    setSavedJobs((prev) => [newSaved, ...prev]);
    alert(`Saved "${job.title}" to your shortlist!`);
  };

  const handleSelectJobForMatch = (job: AdzunaJob) => {
    setSelectedJobForMatch(job);
    handleNavigate("job-match");
  };

  const handleAddApplication = (newApp: ApplicationRecord) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  const handleUpdateJobScore = (jobId: string, score: number) => {
    setSavedJobs((prev) =>
      prev.map((j) => (j.jobId === jobId ? { ...j, matchScore: score } : j))
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        config={config}
        demoMode={demoMode}
        onToggleDemoMode={() => setDemoMode(!demoMode)}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        setActiveTab={handleNavigate}
        activeTab={activeTab}
        responsibleAiAgreed={responsibleAiAgreed}
        onOpenAuth={(mode) => handleOpenAuth(mode)}
        onOpenFirebaseGuide={() => setFirebaseGuideOpen(true)}
      />

      {/* Configuration Status Banner */}
      <ConfigBanner
        config={config}
        onOpenDemo={() => setDemoMode(true)}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleNavigate}
          savedJobsCount={savedJobs.length}
          applicationsCount={applications.length}
          tasksCount={tasks.filter((t) => !t.completed).length}
          isMobileOpen={mobileMenuOpen}
          closeMobileMenu={() => setMobileMenuOpen(false)}
          onOpenAuth={(mode, protectedTabName) => handleOpenAuth(mode, protectedTabName)}
        />

        {/* Dynamic Center View Container */}
        <main className="flex-1 overflow-y-auto pb-16">
          {activeTab === "landing" && (
            <LandingPageView
              onOpenAuth={(mode) => handleOpenAuth(mode)}
              setActiveTab={handleNavigate}
            />
          )}

          {activeTab === "dashboard" && (
            <DashboardView
              cvData={cvData}
              savedJobs={savedJobs}
              applications={applications}
              tasks={tasks}
              setActiveTab={handleNavigate}
              onOpenAuth={(mode) => handleOpenAuth(mode)}
              onStartWorkflowStep={(stepNum) => {
                if (stepNum === 1 || stepNum === 2 || stepNum === 9) handleNavigate("cv-builder");
                else if (stepNum === 3 || stepNum === 4 || stepNum === 5) handleNavigate("find-jobs");
                else if (stepNum === 6 || stepNum === 7 || stepNum === 8) handleNavigate("job-match");
                else if (stepNum === 10) handleNavigate("application-email");
                else if (stepNum === 11) handleNavigate("saved-jobs");
                else if (stepNum === 12) handleNavigate("applications");
              }}
            />
          )}

          {activeTab === "find-jobs" && (
            <FindJobsView
              config={config}
              demoMode={demoMode}
              onSelectJobForMatch={handleSelectJobForMatch}
              onSaveJob={handleSaveJob}
              savedJobs={savedJobs}
              setActiveTab={handleNavigate}
            />
          )}

          {activeTab === "cv-builder" && (
            <CvBuilderView
              cvData={cvData}
              setCvData={setCvData}
              demoMode={demoMode}
              onOpenAuth={(mode) => handleOpenAuth(mode)}
            />
          )}

          {activeTab === "job-match" && (
            <JobMatchView
              cvData={cvData}
              savedJobs={savedJobs}
              selectedJobForMatch={selectedJobForMatch}
              setSelectedJobForMatch={setSelectedJobForMatch}
              setActiveTab={handleNavigate}
              onUpdateJobScore={handleUpdateJobScore}
            />
          )}

          {activeTab === "application-email" && (
            <ApplicationEmailView
              cvData={cvData}
              savedJobs={savedJobs}
              onAddApplication={handleAddApplication}
              setActiveTab={handleNavigate}
            />
          )}

          {activeTab === "career-ai" && (
            <CareerAiChatView cvData={cvData} />
          )}

          {activeTab === "research-assistant" && (
            <ResearchAssistantView />
          )}

          {activeTab === "task-planner" && (
            <TaskPlannerView
              tasks={tasks}
              setTasks={setTasks}
            />
          )}

          {activeTab === "saved-jobs" && currentUser && (
            <SavedJobsView
              savedJobs={savedJobs}
              setSavedJobs={setSavedJobs}
              onSelectJobForMatch={handleSelectJobForMatch}
              setActiveTab={handleNavigate}
            />
          )}

          {activeTab === "applications" && currentUser && (
            <ApplicationsTrackerView
              applications={applications}
              setApplications={setApplications}
              setActiveTab={handleNavigate}
            />
          )}

          {activeTab === "my-profile" && currentUser && (
            <MyProfileView
              cvData={cvData}
              setCvData={setCvData}
              onLogout={() => {
                setActiveTab("landing");
              }}
            />
          )}

          {activeTab === "responsible-ai" && (
            <ResponsibleAiView
              responsibleAiAgreed={responsibleAiAgreed}
              setResponsibleAiAgreed={setResponsibleAiAgreed}
            />
          )}

          {activeTab === "prompt-lab" && (
            <PromptLabView />
          )}

          {activeTab === "project-demo" && (
            <ProjectDemoView
              setActiveTab={handleNavigate}
              onToggleDemoMode={() => setDemoMode(!demoMode)}
              demoMode={demoMode}
            />
          )}

          {activeTab === "help" && (
            <HelpView />
          )}
        </main>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => {
          setAuthModalOpen(false);
          setRedirectReason(null);
        }}
        onSuccess={handleAuthSuccess}
        redirectReason={redirectReason}
      />

      {/* Firebase Setup Guide Modal */}
      <FirebaseSetupGuideModal
        isOpen={firebaseGuideOpen}
        onClose={() => setFirebaseGuideOpen(false)}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;
