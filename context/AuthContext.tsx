"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Yeh Auth | null import karega
import { ReactNode } from "react";

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

// 1. Context ko type zaroor dein
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Default loading TRUE hai

  useEffect(() => {
    const authInstance = auth; // Instance lein

    if (authInstance) {
      // 2. Agar Firebase load ho gaya hai, toh ASYNC listener lagayen
      const unsubscribe = onAuthStateChanged(authInstance, (user) => {
        setUser(user);
        setLoading(false); // Yeh ASYNC hai (Theek hai)
      });
      
      return () => unsubscribe();

    } else {
      // 3. 🚨 15-YEAR EXPERT FIX:
      // Agar Firebase load nahi hua (Build time/Error)
      // Hum state ko synchronously update nahi karenge.
      // Hum isay microtask (Promise) mein daal denge taake React render cycle crash na ho.
      Promise.resolve().then(() => {
        setLoading(false);
      });
    }
  }, []); // Dependency array khaali rakhein taake yeh sirf ek baar chale

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

