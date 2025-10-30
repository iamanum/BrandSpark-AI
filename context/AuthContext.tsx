"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, Auth } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { ReactNode } from "react";

// Context ka type define karein
type AuthContextType = {
  user: User | null;
  loading: boolean;
  authInstance: Auth | null; 
};

// Context create karein aur usko type dein
const AuthContext = createContext<AuthContextType>({
  user: null, 
  loading: true, // Initial value
  authInstance: null,
});

// Provider component banayen
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authInstance = auth; 
  
  const [user, setUser] = useState<User | null>(null);
  // 🚨 FINAL FIX 1: Loading state ko lazily initialize karein.
  // Agar authInstance null hai (build time par), toh loading ko seedha false set kar dein.
  // Agar authInstance mojood hai, toh loading ko true rakhein (listener ka intezar karein).
  const [loading, setLoading] = useState(!!authInstance); 
  
  useEffect(() => {
    // Agar auth instance hi null hai, toh hum listener set nahi kar sakte.
    // Loading state is already set to false by useState in this case.
    if (!authInstance) {
      return; 
    }
    
    // Agar authInstance mojood hai, toh Firebase listener shuru karein
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setUser(user);
      // Loading state ko false sirf yahan set karte hain, jab Firebase se pehla response aa jaye.
      setLoading(false); 
    });

    // Cleanup function
    return () => unsubscribe();
    
  // 🚨 Dependency array sirf authInstance par depend karta hai.
  }, [authInstance]);

  return (
    <AuthContext.Provider value={{ user, loading, authInstance }}>
      {children}
    </AuthContext.Provider>
  );
};

// Ek custom hook banayen taake hum aasani se user data haasil kar sakein
export const useAuth = () => useContext(AuthContext);
