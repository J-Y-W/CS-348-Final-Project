import { createContext, useContext, useEffect, useState } from "react";
import { api, setAuthToken, setUnauthorizedHandler } from "../lib/api.js";
import { useToast } from "./ToastContext.jsx";

const AuthContext = createContext(null);
const STORAGE_KEY = "vms_auth";

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const toast = useToast();
  const [auth, setAuth] = useState(readStored); // { token, email } | null

  useEffect(() => {
    setAuthToken(auth?.token || null);
  }, [auth]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setAuth((prev) => {
        if (prev) toast.error("Your session expired. Please sign in again.");
        return null;
      });
      localStorage.removeItem(STORAGE_KEY);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    const data = await api.auth.login(email, password);
    setAuth(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: Boolean(auth), email: auth?.email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
