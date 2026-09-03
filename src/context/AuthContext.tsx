import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProfile } from "../types";
import {
  auth,
  db,
  isFirebaseConfigured,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  handleFirestoreError,
  OperationType,
} from "../services/firebase";

interface SignUpDetails {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  location: string;
  professionalTitle: string;
}

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  signInWithGoogle: (onboardDefaults?: { location?: string; professionalTitle?: string }) => Promise<UserProfile>;
  signUpWithEmail: (details: SignUpDetails) => Promise<UserProfile>;
  signInWithEmail: (email: string, password: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USERS_KEY = "careerpilot_local_users_v1";
const ACTIVE_SESSION_KEY = "careerpilot_active_session_uid_v1";

interface StoredLocalUser {
  profile: UserProfile;
  passwordHash: string; // simple local obfuscation for local prototype
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth state
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          try {
            if (db) {
              const userDocRef = doc(db, "users", fbUser.uid);
              const userSnap = await getDoc(userDocRef);
              if (userSnap.exists()) {
                setCurrentUser(userSnap.data() as UserProfile);
              } else {
                // Parse display name
                const names = (fbUser.displayName || "").trim().split(" ");
                const firstName = names[0] || "";
                const lastName = names.slice(1).join(" ") || "";
                const newProfile: UserProfile = {
                  uid: fbUser.uid,
                  email: fbUser.email || "",
                  firstName,
                  lastName,
                  location: "South Africa",
                  professionalTitle: "Candidate",
                  createdAt: new Date().toISOString(),
                  photoURL: fbUser.photoURL || undefined,
                };
                await setDoc(userDocRef, newProfile);
                setCurrentUser(newProfile);
              }
            }
          } catch (err) {
            console.error("Failed to fetch Firebase user profile:", err);
            handleFirestoreError(err, OperationType.GET, `users/${fbUser.uid}`, auth);
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Local persistent multi-user session
      try {
        const activeUid = localStorage.getItem(ACTIVE_SESSION_KEY);
        if (activeUid) {
          const rawUsers = localStorage.getItem(LOCAL_USERS_KEY);
          if (rawUsers) {
            const users: Record<string, StoredLocalUser> = JSON.parse(rawUsers);
            if (users[activeUid]) {
              setCurrentUser(users[activeUid].profile);
            }
          }
        }
      } catch (e) {
        console.error("Error reading local auth session:", e);
      }
      setLoading(false);
    }
  }, []);

  // Continue with Google
  const signInWithGoogle = async (onboardDefaults?: { location?: string; professionalTitle?: string }): Promise<UserProfile> => {
    if (isFirebaseConfigured && auth && db) {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;
      const userDocRef = doc(db, "users", fbUser.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const profile = userSnap.data() as UserProfile;
        setCurrentUser(profile);
        return profile;
      } else {
        const names = (fbUser.displayName || "").trim().split(" ");
        const firstName = names[0] || "User";
        const lastName = names.slice(1).join(" ") || "";
        const newProfile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || "",
          firstName,
          lastName,
          location: onboardDefaults?.location || "",
          professionalTitle: onboardDefaults?.professionalTitle || "",
          createdAt: new Date().toISOString(),
          photoURL: fbUser.photoURL || undefined,
        };
        await setDoc(userDocRef, newProfile);
        setCurrentUser(newProfile);
        return newProfile;
      }
    } else {
      // Prompt / create authentic Google sign-in session
      const email = prompt("Enter your Google Account email:", "user@gmail.com");
      if (!email || !email.includes("@")) {
        throw new Error("A valid Google Account email is required.");
      }

      const defaultFirstName = email.split("@")[0].replace(/[^a-zA-Z]/g, " ") || "Google";
      const nameInput = prompt("Enter your Full Name for your Google Account:", defaultFirstName);
      const names = (nameInput || defaultFirstName).trim().split(" ");
      const firstName = names[0] || "User";
      const lastName = names.slice(1).join(" ") || "";

      const googleUid = "google_" + btoa(email.toLowerCase()).replace(/=/g, "");

      const rawUsers = localStorage.getItem(LOCAL_USERS_KEY);
      const users: Record<string, StoredLocalUser> = rawUsers ? JSON.parse(rawUsers) : {};

      let profile: UserProfile;
      if (users[googleUid]) {
        profile = users[googleUid].profile;
      } else {
        profile = {
          uid: googleUid,
          email: email.toLowerCase().trim(),
          firstName,
          lastName,
          location: onboardDefaults?.location || "",
          professionalTitle: onboardDefaults?.professionalTitle || "",
          createdAt: new Date().toISOString(),
        };
        users[googleUid] = {
          profile,
          passwordHash: "google_oauth_token",
        };
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
      }

      localStorage.setItem(ACTIVE_SESSION_KEY, googleUid);
      setCurrentUser(profile);
      return profile;
    }
  };

  // Email Sign Up
  const signUpWithEmail = async (details: SignUpDetails): Promise<UserProfile> => {
    const { email, password, firstName, lastName, location, professionalTitle } = details;

    if (!email || !email.includes("@")) {
      throw new Error("Please provide a valid email address.");
    }
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }
    if (!firstName.trim()) {
      throw new Error("First name is required.");
    }
    if (!lastName.trim()) {
      throw new Error("Last name is required.");
    }
    if (!location.trim()) {
      throw new Error("Location is required.");
    }
    if (!professionalTitle.trim()) {
      throw new Error("Professional title is required.");
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isFirebaseConfigured && auth && db) {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email: cleanEmail,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        location: location.trim(),
        professionalTitle: professionalTitle.trim(),
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "users", cred.user.uid), newProfile);
      setCurrentUser(newProfile);
      return newProfile;
    } else {
      const rawUsers = localStorage.getItem(LOCAL_USERS_KEY);
      const users: Record<string, StoredLocalUser> = rawUsers ? JSON.parse(rawUsers) : {};

      // Check if email already registered
      const existingKey = Object.keys(users).find(
        (uid) => users[uid].profile.email === cleanEmail
      );
      if (existingKey) {
        throw new Error("An account with this email already exists. Please sign in.");
      }

      const uid = "usr_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
      const newProfile: UserProfile = {
        uid,
        email: cleanEmail,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        location: location.trim(),
        professionalTitle: professionalTitle.trim(),
        createdAt: new Date().toISOString(),
      };

      users[uid] = {
        profile: newProfile,
        passwordHash: btoa(password), // stored for multi-user credential checking
      };

      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
      localStorage.setItem(ACTIVE_SESSION_KEY, uid);
      setCurrentUser(newProfile);
      return newProfile;
    }
  };

  // Email Sign In
  const signInWithEmail = async (email: string, password: string): Promise<UserProfile> => {
    if (!email || !password) {
      throw new Error("Please enter both email and password.");
    }

    const cleanEmail = email.toLowerCase().trim();

    if (isFirebaseConfigured && auth && db) {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const snap = await getDoc(doc(db, "users", cred.user.uid));
      if (snap.exists()) {
        const profile = snap.data() as UserProfile;
        setCurrentUser(profile);
        return profile;
      } else {
        const names = (cred.user.displayName || "").trim().split(" ");
        const newProfile: UserProfile = {
          uid: cred.user.uid,
          email: cleanEmail,
          firstName: names[0] || "User",
          lastName: names.slice(1).join(" ") || "",
          location: "South Africa",
          professionalTitle: "Candidate",
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, "users", cred.user.uid), newProfile);
        setCurrentUser(newProfile);
        return newProfile;
      }
    } else {
      const rawUsers = localStorage.getItem(LOCAL_USERS_KEY);
      const users: Record<string, StoredLocalUser> = rawUsers ? JSON.parse(rawUsers) : {};

      const matchedUid = Object.keys(users).find(
        (uid) => users[uid].profile.email === cleanEmail
      );

      if (!matchedUid) {
        throw new Error("No account found with this email address. Please sign up.");
      }

      const storedUser = users[matchedUid];
      if (storedUser.passwordHash !== btoa(password) && storedUser.passwordHash !== "google_oauth_token") {
        throw new Error("Incorrect password. Please try again.");
      }

      localStorage.setItem(ACTIVE_SESSION_KEY, matchedUid);
      setCurrentUser(storedUser.profile);
      return storedUser.profile;
    }
  };

  // Logout
  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    setCurrentUser(null);
  };

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updatedProfile: UserProfile = {
      ...currentUser,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      await setDoc(doc(db, "users", currentUser.uid), updatedProfile, { merge: true });
    } else {
      const rawUsers = localStorage.getItem(LOCAL_USERS_KEY);
      if (rawUsers) {
        const users: Record<string, StoredLocalUser> = JSON.parse(rawUsers);
        if (users[currentUser.uid]) {
          users[currentUser.uid].profile = updatedProfile;
          localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
        }
      }
    }

    setCurrentUser(updatedProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isFirebaseConfigured,
        signInWithGoogle,
        signUpWithEmail,
        signInWithEmail,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
