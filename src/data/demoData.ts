import { AdzunaJob, CVData, ApplicationRecord, SavedJob } from "../types";

export const DEMO_NOTICE = "Demo Data — Fictional";

export const SAMPLE_CV: CVData = {
  personal: {
    fullName: "Tshephang Kawa",
    email: "tshephang.kawa@capaciti-alumni.co.za",
    phone: "+27 82 555 0192",
    location: "Johannesburg, Gauteng, South Africa",
    linkedin: "https://linkedin.com/in/tshephang-kawa",
    portfolio: "https://github.com/tshephang-kawa",
    github: "https://github.com/tshephang-kawa",
  },
  summary:
    "Proactive Junior Cybersecurity & Cloud Support Technician with practical background in network security auditing, Linux server administration, and Python automation. Certified in CompTIA Security+ and currently completing CAPACITI professional development.",
  education: [
    {
      id: "edu-1",
      institution: "University of Johannesburg",
      qualification: "Diploma in Information Technology",
      field: "Network Architecture & Systems Administration",
      startDate: "2021",
      endDate: "2023",
      description: "Graduated with distinction in Network Forensics and Database Systems.",
    },
  ],
  experience: [
    {
      id: "exp-1",
      employer: "Apex Digital Solutions (Internship)",
      position: "IT Support & Security Intern",
      startDate: "Jan 2024",
      endDate: "Nov 2024",
      responsibilities:
        "Managed endpoint monitoring across 120 client machines, configured firewall rules, responded to Tier-1 helpdesk tickets, and conducted routine vulnerability scans.",
      achievements:
        "Automated weekly patch status reports using Python scripts, saving 4 hours of manual audit time each Friday.",
    },
  ],
  skills: {
    technical: [
      "Python",
      "Linux (Ubuntu/Debian)",
      "Network Security",
      "Firewall Configuration",
      "Vulnerability Scanning",
      "Wireshark",
      "Git",
      "Active Directory",
      "Bash Scripting",
    ],
    soft: [
      "Critical Thinking",
      "Incident Response Communication",
      "Technical Documentation",
      "Team Collaboration",
      "Customer Support",
    ],
  },
  certifications: [
    {
      id: "cert-1",
      name: "CompTIA Security+ (SY0-701)",
      issuer: "CompTIA",
      date: "2024",
    },
    {
      id: "cert-2",
      name: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "2024",
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "Home Lab SIEM & Log Aggregation",
      description:
        "Configured an open-source Wazuh SIEM cluster on VirtualBox to monitor Ubuntu and Windows server logs for brute-force SSH anomalies.",
      link: "https://github.com/tshephang-kawa/siem-lab",
    },
  ],
  languages: ["English (Fluent)", "isiZulu (Native)"],
};

export const FICTIONAL_DEMO_JOBS: AdzunaJob[] = [
  {
    id: "demo-job-1",
    title: "Junior Cybersecurity Analyst",
    company: "Standard Vault Financial Tech (Demo)",
    location: "Sandton, Johannesburg, Gauteng",
    salaryMin: 320000,
    salaryMax: 420000,
    salaryPredicted: false,
    jobType: "Full-Time (Permanent)",
    contractTime: "full_time",
    contractType: "permanent",
    created: "2026-08-28T09:00:00Z",
    description:
      "We are seeking an energetic Junior Cybersecurity Analyst to join our Security Operations Center (SOC). Responsibilities include triaging SIEM security alerts, assisting in vulnerability assessments, monitoring firewall telemetry, and supporting compliance audits. Requirements: Diploma or Degree in IT/Security, familiarity with Wireshark/Linux, CompTIA Security+ preferred. Passion for threat intelligence is essential.",
    category: "IT & Cybersecurity",
    categoryTag: "it-jobs",
    redirectUrl: "https://www.adzuna.co.za",
    source: "Adzuna (Fictional Demo)",
    isLive: false,
    isDemo: true,
  },
  {
    id: "demo-job-2",
    title: "Junior IT Support Specialist",
    company: "CloudBridge Technologies (Demo)",
    location: "Cape Town, Western Cape",
    salaryMin: 220000,
    salaryMax: 290000,
    salaryPredicted: false,
    jobType: "Full-Time",
    contractTime: "full_time",
    contractType: "permanent",
    created: "2026-08-30T11:30:00Z",
    description:
      "Entry-level IT Support role providing front-line hardware and software support, managing Active Directory accounts, troubleshooting network connectivity, and documenting knowledge base solutions. Candidate should possess great communication skills, familiarity with Windows 11/Linux, and foundational networking.",
    category: "IT Support",
    categoryTag: "it-jobs",
    redirectUrl: "https://www.adzuna.co.za",
    source: "Adzuna (Fictional Demo)",
    isLive: false,
    isDemo: true,
  },
  {
    id: "demo-job-3",
    title: "Associate Python / Data Analyst",
    company: "AfriData Analytics Group (Demo)",
    location: "Pretoria, Gauteng",
    salaryMin: 280000,
    salaryMax: 360000,
    salaryPredicted: true,
    jobType: "Permanent",
    contractTime: "full_time",
    contractType: "permanent",
    created: "2026-09-01T14:15:00Z",
    description:
      "Seeking a graduate or junior analyst with Python scripting experience (Pandas, NumPy) and SQL knowledge to automate ETL pipelines and build dashboard visualizations. Mentorship provided. Requirements: Degree/Diploma in STEM field or equivalent bootcamp credential.",
    category: "Data & Analytics",
    categoryTag: "it-jobs",
    redirectUrl: "https://www.adzuna.co.za",
    source: "Adzuna (Fictional Demo)",
    isLive: false,
    isDemo: true,
  },
];

export const FICTIONAL_DEMO_APPLICATIONS: ApplicationRecord[] = [
  {
    id: "app-demo-1",
    company: "Standard Vault Financial Tech (Demo)",
    jobTitle: "Junior Cybersecurity Analyst",
    jobUrl: "https://www.adzuna.co.za",
    applicationDate: "2026-08-31",
    status: "Interview",
    notes: "First round technical interview scheduled for Thursday at 10:00 AM SAST.",
    matchScore: 84,
    emailGenerated: true,
    interviewDate: "2026-09-08",
    followUpDate: "2026-09-10",
  },
];

export const FICTIONAL_DEMO_SAVED_JOBS: SavedJob[] = [
  {
    id: "saved-demo-1",
    jobId: "demo-job-1",
    title: "Junior Cybersecurity Analyst",
    company: "Standard Vault Financial Tech (Demo)",
    location: "Sandton, Johannesburg, Gauteng",
    url: "https://www.adzuna.co.za",
    dateSaved: "2026-08-29",
    matchScore: 84,
    notes: "Great match for my CompTIA Security+ and Python skills.",
    status: "Interview",
    isLive: false,
    isDemo: true,
    descriptionSnippet: "Responsibilities include triaging SIEM alerts, vulnerability assessments...",
  },
];
