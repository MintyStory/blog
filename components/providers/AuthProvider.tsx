"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase/client";

interface AuthContextValue {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  firebaseReady: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAdmin: false,
  loading: false,
  firebaseReady: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [docIsAdmin, setDocIsAdmin] = useState(false);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const isAdmin = Boolean(user) && docIsAdmin;

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;

    const unsubscribeAuth = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user || !db) return;
    const unsubscribeDoc = onSnapshot(doc(db, "users", user.uid), (snap) => {
      setDocIsAdmin(Boolean(snap.data()?.isAdmin));
    });
    return () => unsubscribeDoc();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, isAdmin, loading, firebaseReady: isFirebaseConfigured }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
