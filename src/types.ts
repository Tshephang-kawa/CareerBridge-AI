export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  github: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  qualification: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ExperienceItem {
  id: string;
  employer: string;
  position: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
  achievements: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  link: string;
}

export interface CVData {
  personal: PersonalInfo;
  summary: string;
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: {
    technical: string[];
    soft: string[];
  };
  certifications: CertificationItem[];
  projects: ProjectItem[];
  languages: string[];
}

export interface AdzunaJob {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryPredicted?: boolean;
  jobType: string;
  contractTime: string | null;
  contractType: string | null;
  created: string;
  description: string;
  category: string;
  categoryTag?: string;
  redirectUrl: string;
  source: string;
  isLive: boolean;
  isDemo?: boolean;
}

export interface JobSearchQuery {
  country: string;
  what: string;
  where: string;
  page: number;
  salaryMin?: number;
  sortBy: "relevance" | "date" | "salary";
  fullTime?: boolean;
  permanent?: boolean;
  category?: string;
  resultsPerPage: number;
}

export type JobApplicationStatus =
  | "Saved"
  | "Considering"
  | "Applied"
  | "Interview"
  | "Rejected"
  | "Offer";

export interface SavedJob {
  id: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  url: string;
  dateSaved: string;
  matchScore?: number;
  notes: string;
  status: JobApplicationStatus;
  isLive: boolean;
  isDemo?: boolean;
  descriptionSnippet?: string;
}

export interface ApplicationRecord {
  id: string;
  company: string;
  jobTitle: string;
  jobUrl: string;
  applicationDate: string;
  status: JobApplicationStatus;
  notes: string;
  matchScore?: number;
  emailGenerated?: boolean;
  interviewDate?: string;
  followUpDate?: string;
}

export interface ScoreBreakdown {
  skillsScore: number;
  skillsWeight: string;
  experienceScore: number;
  experienceWeight: string;
  qualificationScore: number;
  qualificationWeight: string;
  keywordEvidenceScore: number;
  keywordEvidenceWeight: string;
}

export interface JobMatchResult {
  matchScore: number;
  scoreBreakdown: ScoreBreakdown;
  matchedSkills: string[];
  skillGaps: string[];
  qualificationMatch: string;
  experienceMatch: string;
  evidence: string[];
  recommendations: string[];
  warnings: string[];
  methodology: string;
  disclaimer: string;
  isLiveJob: boolean;
  jobTitle: string;
  company: string;
  analyzedAt: string;
}

export interface ApplicationEmail {
  subject: string;
  greeting: string;
  opening: string;
  relevantQualifications: string;
  relevantExperience: string;
  interestInRole: string;
  closing: string;
  signOff: string;
  fullDraft: string;
  tone: string;
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  isError?: boolean;
  canRetry?: boolean;
  retryText?: string;
}

export interface ResearchReport {
  title: string;
  summary: string;
  keyFindings: string[];
  importantSkills: string[];
  careerImplications: string;
  recommendedNextSteps: string[];
  questionsToInvestigate: string[];
  dataProvenance: string;
  searchedAt: string;
}

export interface PlannerTask {
  id: string;
  title: string;
  dayOrPhase: string;
  durationMinutes: number;
  priority: "High" | "Medium" | "Low";
  category: "CV" | "Search" | "Application" | "Interview" | "Skills";
  description: string;
  completed: boolean;
  dueDate?: string;
}

export interface ApplicationPlan {
  overview: string;
  tasks: PlannerTask[];
}

export interface PromptLabResult {
  category: string;
  v1: {
    prompt: string;
    output: string;
    level: string;
    accuracyCheck: string;
    hallucinationCheck: string;
    usefulnessScore: number;
    description: string;
  };
  v2: {
    prompt: string;
    output: string;
    level: string;
    accuracyCheck: string;
    hallucinationCheck: string;
    usefulnessScore: number;
    description: string;
  };
  v3: {
    prompt: string;
    output: string;
    level: string;
    accuracyCheck: string;
    hallucinationCheck: string;
    usefulnessScore: number;
    description: string;
    improvements: string[];
  };
}

export interface ConfigStatus {
  geminiConfigured: boolean;
  adzunaConfigured: boolean;
  adzunaDetails: {
    hasAppId: boolean;
    hasAppKey: boolean;
  };
  defaultCountry: string;
  supportedCountries: { code: string; name: string; currency: string }[];
}

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  location: string;
  professionalTitle: string;
  createdAt: string;
  updatedAt?: string;
  photoURL?: string;
}

export type ActiveNavTab =
  | "landing"
  | "auth"
  | "dashboard"
  | "find-jobs"
  | "cv-builder"
  | "job-match"
  | "application-email"
  | "career-ai"
  | "research-assistant"
  | "task-planner"
  | "saved-jobs"
  | "applications"
  | "my-profile"
  | "responsible-ai"
  | "prompt-lab"
  | "help"
  | "project-demo";
