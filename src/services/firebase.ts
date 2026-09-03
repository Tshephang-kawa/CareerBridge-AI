/// <reference types="vite/client" />
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import {
  getFirestore,
  Firestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  getDocFromServer,
} from "firebase/firestore";

// Error handling specification from Firebase Integration Skill
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
  authInstance?: Auth | null
) {
  const currentAuth = authInstance || auth;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentAuth?.currentUser?.uid,
      email: currentAuth?.currentUser?.email,
      emailVerified: currentAuth?.currentUser?.emailVerified,
      isAnonymous: currentAuth?.currentUser?.isAnonymous,
      tenantId: currentAuth?.currentUser?.tenantId,
      providerInfo:
        currentAuth?.currentUser?.providerData?.map((p) => ({
          providerId: p.providerId,
          email: p.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Safely look up firebase-applet-config.json using Vite's glob without runtime build failures
const configFiles = import.meta.glob("/firebase-applet-config.json", {
  eager: true,
}) as Record<string, { default?: Record<string, any> } | Record<string, any>>;

let loadedConfig: Record<string, any> | null = null;
const configEntry = configFiles["/firebase-applet-config.json"];
if (configEntry) {
  loadedConfig = (configEntry.default || configEntry) as Record<string, any>;
}

export const isFirebaseConfigured = Boolean(
  loadedConfig && loadedConfig.projectId && loadedConfig.apiKey
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured && loadedConfig) {
  try {
    app = getApps().length === 0 ? initializeApp(loadedConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app, loadedConfig.firestoreDatabaseId);

    // Validate connection to Firestore as mandated by skill
    getDocFromServer(doc(db, "test", "connection")).catch((err) => {
      if (err instanceof Error && err.message.includes("the client is offline")) {
        console.warn("Firebase client offline warning: please verify network or Firestore settings.");
      }
    });
  } catch (err) {
    console.warn("Firebase initialization skipped or encountered error:", err);
  }
}

export {
  app,
  auth,
  db,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
};
export type { FirebaseUser };
