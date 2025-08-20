"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  username: string;
  role: string;
  email : string;
}

interface AuthContextType {
  user: User | null;
  email: string | null;

  isLoggedIn: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  email: null,
  logout: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get("/api/me");
        setUser(res.data.user);
        setIsLoggedIn(true);
      } catch {
        setUser(null);
        setIsLoggedIn(false);
      }
    }
    fetchUser();
  }, []);

  const logout = async () => {
    await axios.post("/api/logout");
    setUser(null);
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, logout , email: user?.username || null }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
