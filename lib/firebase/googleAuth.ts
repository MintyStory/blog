import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db, isFirebaseConfigured } from "./client";

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin: boolean;
}

export async function signInWithGoogle(): Promise<void> {
  if (!auth || !db) throw new Error("Firebase가 설정되지 않았습니다 (.env.local 확인).");

  const result = await signInWithPopup(auth, new GoogleAuthProvider());
  const userRef = doc(db, "users", result.user.uid);
  const existing = await getDoc(userRef);

  if (!existing.exists()) {
    // isAdmin은 최초 생성 시에만 false로 세팅 — 이후 로그인 시 덮어쓰지 않는다.
    await setDoc(userRef, {
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
      isAdmin: false,
      createdAt: serverTimestamp(),
    });
  }
}

export async function signOutOfGoogle(): Promise<void> {
  if (!auth) return;
  await firebaseSignOut(auth);
}

export { isFirebaseConfigured };
