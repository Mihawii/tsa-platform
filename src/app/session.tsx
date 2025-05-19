"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  email: string;
  name: string;
}

interface SessionContextType {
  user: User | null;
  logout: () => void;
}

const SessionContext = createContext<SessionContextType>({ user: null, logout: () => {} });

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("tsa_user");
      if (stored) setUser(JSON.parse(stored));
    }
  }, []);

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("tsa_user");
      setUser(null);
      window.location.href = "/login";
    }
  };

  return (
    <SessionContext.Provider value={{ user, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem("tsa_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    }
  }, []);

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("tsa_user");
      window.location.href = "/login";
    }
  };

  return { user, logout };
} 