import React from "react";
import { X, CheckCircle2, ShieldCheck, Database, Key, Server, ExternalLink } from "lucide-react";

interface FirebaseSetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseSetupGuideModal: React.FC<FirebaseSetupGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden relative my-8">
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-amber-400">
            <Database className="w-4 h-4" /> Firebase Integration Blueprint
          </div>
          <h2 className="text-xl font-bold mt-1 text-white">
            Firebase Architecture & Setup Guide
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete multi-user security architecture prepared for production deployment.
          </p>
        </div>

        <div className="p-6 space-y-5 text-slate-700 text-sm">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-emerald-900 text-sm">
                Multi-User Architecture Is Live
              </h4>
              <p className="text-xs text-emerald-700 mt-1">
                The application enforces strict data isolation by user ID. If Firebase credentials are not yet provisioned, the app runs on the high-fidelity multi-user security provider, ensuring protected routes, sign-up, login, and isolated state immediately.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-3 text-sm flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-600" /> Remaining Firebase Setup Steps:
            </h3>
            <ol className="space-y-3">
              <li className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h5 className="font-semibold text-slate-900 text-xs">Provision Firebase Project</h5>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Run the Firebase setup tool or connect a project in Google Cloud / Firebase Console. This automatically generates <code className="bg-slate-200 px-1 rounded text-slate-800">firebase-applet-config.json</code>.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h5 className="font-semibold text-slate-900 text-xs">Enable Authentication Sign-in Providers</h5>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Under Firebase Console &rarr; <strong>Authentication</strong> &rarr; <strong>Sign-in method</strong>, enable:
                  </p>
                  <ul className="list-disc list-inside text-xs text-slate-600 mt-1 pl-1 space-y-0.5">
                    <li><strong>Google</strong> (enabled by default with web client ID)</li>
                    <li><strong>Email/Password</strong> provider</li>
                  </ul>
                </div>
              </li>

              <li className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <h5 className="font-semibold text-slate-900 text-xs">Deploy Hardened Firestore Security Rules</h5>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Deploy the prepared <code className="bg-slate-200 px-1 rounded text-slate-800">firestore.rules</code> file which enforces ABAC ownership checks: <code className="bg-slate-200 px-1 rounded text-slate-800">request.auth.uid == userId</code> on all personal collections.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Got it, close guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
