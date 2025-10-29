// context/AuthContext.tsx

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ReactNode } from "react";

// Context ka type define karein
type AuthContextType = {
  user: User | null;
  loading: boolean;
};

// Context create karein
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// Provider component banayen
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Yeh function Firebase se "sunta" rehta hai
    // Jab user login ya logout hota hai, yeh automatically trigger hota hai
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Ek custom hook banayen taake hum aasani se user data haasil kar sakein
export const useAuth = () => useContext(AuthContext);