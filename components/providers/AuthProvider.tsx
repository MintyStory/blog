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
  const [authLoading, setAuthLoading] = useState(isFirebaseConfigured);
  const [docIsAdmin, setDocIsAdmin] = useState(false);
  // 로그인된 사용자의 isAdmin 문서를 아직 못 받아온 상태.
  const [adminDocLoaded, setAdminDocLoaded] = useState(true);

  const isAdmin = Boolean(user) && docIsAdmin;
  const loading = authLoading || (Boolean(user) && !adminDocLoaded);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) return;

    let unsubscribeDoc: (() => void) | undefined;

    // setUser와 setAdminDocLoaded(false)를 같은 콜백(같은 렌더 배치) 안에서 같이 호출해야
    // "user는 있는데 아직 관리자 여부는 모른다"는 중간 상태가 한 틱이라도 새지 않는다.
    // 두 상태를 별도 effect(키: user)로 나누면, user가 바뀐 렌더 시점에 adminDocLoaded가
    // 아직 이전 값(true)이라 loading=false로 잘못 계산되는 순간이 생긴다.
    const unsubscribeAuth = onAuthStateChanged(auth, (nextUser) => {
      unsubscribeDoc?.();
      setUser(nextUser);
      setAuthLoading(false);

      if (nextUser && db) {
        setAdminDocLoaded(false);
        unsubscribeDoc = onSnapshot(doc(db, "users", nextUser.uid), (snap) => {
          setDocIsAdmin(Boolean(snap.data()?.isAdmin));
          setAdminDocLoaded(true);
        });
      } else {
        setDocIsAdmin(false);
        setAdminDocLoaded(true);
      }
    });

    return () => {
      unsubscribeDoc?.();
      unsubscribeAuth();
    };
  }, []);

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
