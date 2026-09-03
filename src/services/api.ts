import {
  AdzunaJob,
  CVData,
  ConfigStatus,
  JobMatchResult,
  ApplicationEmail,
  ResearchReport,
  ApplicationPlan,
  PromptLabResult,
} from "../types";

export class ApiError extends Error {
  code?: string;
  action?: string;
  status?: number;

  constructor(message: string, code?: string, action?: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.action = action;
    this.status = status;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  let data: any = {};
  try {
    data = await res.json();
  } catch {
    data = { message: res.statusText || "Unexpected server response" };
  }

  if (!res.ok) {
    throw new ApiError(
      data.message || "An error occurred while processing the request.",
      data.error,
      data.action,
      res.status
    );
  }

  return data as T;
}

export async function fetchConfigStatus(): Promise<ConfigStatus> {
  const res = await fetch("/api/config-status");
  return handleResponse<ConfigStatus>(res);
}

export async function searchAdzunaJobs(params: {
  country?: string;
  what?: string;
  where?: string;
  page?: number;
  salary_min?: number;
  sort_by?: string;
  full_time?: boolean;
  permanent?: boolean;
  category?: string;
  results_per_page?: number;
}): Promise<{
  jobs: AdzunaJob[];
  totalCount: number;
  page: number;
  resultsPerPage: number;
  country: string;
  attribution: { text: string; url: string };
  cached?: boolean;
}> {
  const query = new URLSearchParams();
  if (params.country) query.set("country", params.country);
  if (params.what) query.set("what", params.what);
  if (params.where) query.set("where", params.where);
  if (params.page) query.set("page", params.page.toString());
  if (params.salary_min) query.set("salary_min", params.salary_min.toString());
  if (params.sort_by) query.set("sort_by", params.sort_by);
  if (params.full_time) query.set("full_time", "1");
  if (params.permanent) query.set("permanent", "1");
  if (params.category) query.set("category", params.category);
  if (params.results_per_page) query.set("results_per_page", params.results_per_page.toString());

  const res = await fetch(`/api/jobs/search?${query.toString()}`);
  return handleResponse(res);
}

export async function cvAssist(payload: {
  action: "generate-summary" | "rewrite-experience" | "suggest-skills" | "ats-readability" | "tailor-cv";
  cvData: CVData;
  targetJob?: { title: string; company?: string; description?: string };
  experienceText?: string;
  responsibilitiesText?: string;
}): Promise<{ result: string; action: string }> {
  const res = await fetch("/api/ai/cv-assist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function analyzeJobMatch(payload: {
  cvData: CVData;
  jobDetails: {
    title: string;
    company: string;
    location?: string;
    jobType?: string;
    description: string;
    isLive?: boolean;
  };
}): Promise<JobMatchResult> {
  const res = await fetch("/api/ai/job-match", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function generateApplicationEmail(payload: {
  jobTitle: string;
  company: string;
  recipient?: string;
  candidateName: string;
  relevantExperience?: string;
  relevantSkills?: string;
  jobDescription?: string;
  tone?: string;
}): Promise<ApplicationEmail> {
  const res = await fetch("/api/ai/generate-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function sendChatMessage(payload: {
  message: string;
  history?: { role: "user" | "model"; content: string }[];
  cvContext?: CVData | null;
}): Promise<{ reply: string }> {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function researchCareerTopic(payload: {
  topic: string;
  sourceContent?: string;
  researchType?: string;
}): Promise<ResearchReport> {
  const res = await fetch("/api/ai/research", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function generateTaskPlan(payload: {
  careerGoal: string;
  targetJob: string;
  deadline?: string;
  availableHours?: number;
  currentProgress?: string;
}): Promise<ApplicationPlan> {
  const res = await fetch("/api/ai/task-planner", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function runPromptLabTest(payload: {
  category: "cvSummary" | "jobMatching" | "applicationEmail" | "careerChat";
  testInput: string;
}): Promise<PromptLabResult> {
  const res = await fetch("/api/ai/prompt-lab", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function extractCvFromFile(fileText: string, fileName: string): Promise<{ success: boolean; parsedCv: Partial<CVData>; fileName: string }> {
  const res = await fetch("/api/cv/extract-text", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileText, fileName }),
  });
  return handleResponse(res);
}
