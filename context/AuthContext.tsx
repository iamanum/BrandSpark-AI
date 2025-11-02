"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ReactNode } from "react";

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false); // ✅ Prevent updates before mount

  useEffect(() => {
    setMounted(true); // ✅ Mark mounted when component is ready

    if (!auth) {
      setLoading(false);
      return;
    }

    // ✅ Safe Firebase listener
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (mounted) {
        setUser(firebaseUser);
        setLoading(false);
      }
    });

    // ✅ Cleanup properly when unmounted
    return () => {
      setMounted(false);
      unsubscribe();
    };
  }, [mounted]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
