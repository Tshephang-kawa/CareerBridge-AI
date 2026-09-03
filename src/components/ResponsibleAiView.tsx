import React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  Lock,
  Scale,
  FileCheck,
  Sparkles,
} from "lucide-react";

interface ResponsibleAiViewProps {
  responsibleAiAgreed: boolean;
  setResponsibleAiAgreed: (agreed: boolean) => void;
}

export const ResponsibleAiView: React.FC<ResponsibleAiViewProps> = ({
  responsibleAiAgreed,
  setResponsibleAiAgreed,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-emerald-600" />
              Responsible AI &amp; Ethical Governance
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              10% Evaluation Rubric
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Our framework for hallucination mitigation, demographic fairness, and mandatory human-in-the-loop validation.
          </p>
        </div>

        {/* Verification Status Badge */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium shadow-xs ${
            responsibleAiAgreed
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-amber-50 border-amber-200 text-amber-800"
          }`}
        >
          {responsibleAiAgreed ? (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Ethical Standards Acknowledged</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Acknowledgment Pending</span>
            </>
          )}
        </div>
      </div>

      {/* Interactive Human Review Acknowledgment Card (Section 22) */}
      <div className="bg-blue-50/60 border border-blue-200 rounded-2xl p-6 space-y-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 border border-blue-200 shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">
              Mandatory Human-in-the-Loop Acknowledgment
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              In accordance with ethical AI deployment standards, CareerBridge AI requires all candidates to actively inspect and verify every generated summary, STAR achievement bullet, and email draft before submitting to prospective employers.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-blue-200/60">
          <label className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 cursor-pointer transition shadow-xs">
            <input
              type="checkbox"
              checked={responsibleAiAgreed}
              onChange={(e) => setResponsibleAiAgreed(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white"
            />
            <span className="text-xs font-semibold text-slate-900">
              I commit to reviewing all AI-generated text for accuracy, truthfulness, and personal verification before application submission.
            </span>
          </label>
        </div>
      </div>

      {/* 5 Core Pillars of Responsible AI (Section 22) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Pillar 1: AI Limitations & Hallucinations */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">1. Hallucination Mitigation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Large Language Models can hallucinate skills, metrics, and non-existent credentials. CareerBridge AI enforces negative constraints and system instructions forbidding the fabrication of employers, dates, or degrees.
          </p>
        </div>

        {/* Pillar 2: Bias Mitigation & Demographic Fairness */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">2. Bias &amp; Demographic Fairness</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Matching algorithms strictly evaluate technical skills, verified certifications, and career alignment. No matching decisions are influenced by age, race, gender, nationality, or other protected characteristics.
          </p>
        </div>

        {/* Pillar 3: Privacy & Data Security */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">3. Privacy &amp; Credential Protection</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Adzuna and Gemini API keys reside exclusively in secure server-side memory. Candidate CV data remains stored in local browser state and is never sold, harvested, or transmitted to unauthorized third parties.
          </p>
        </div>

        {/* Pillar 4: Non-Binding Employment Advice */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">4. Objective Match Estimation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Job match percentages are mathematical heuristic approximations (40% skills, 25% exp, 20% qual, 15% keywords). They are explicitly labeled as guidance estimates and never guarantee employment or interview offers.
          </p>
        </div>

        {/* Pillar 5: Inclusive Career Progression */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">5. Inclusive Career Changers</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our prompting prompts reward transferable competencies, bootcamps, and entry-level foundations (such as CAPACITI graduates) rather than penalizing non-traditional career paths.
          </p>
        </div>

        {/* Pillar 6: Transparent Scoring Formula */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">6. Transparent Auditing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every match score displays an open breakdown of sub-scores so candidates understand precisely why a score was awarded, which skills matched, and which skill gaps require genuine upskilling.
          </p>
        </div>
      </div>
    </div>
  );
};
