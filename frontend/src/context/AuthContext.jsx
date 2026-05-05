import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios, {
  setOnUnauthorized,
  clearOnUnauthorized,
} from "../api/axiosClient";

const AuthContext = createContext(null);

const TOKEN_KEY = "token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;
  const isAdmin = !!user && !!user.roles && user.roles.includes("admin");

  const persistToken = (token) => {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      // ignore storage errors
    }
  };

  const login = useCallback(async (credentials) => {
    try {
      const res = await axios.post("/auth/login", credentials);
      const data = res && res.data ? res.data : res;
      const token = data.token || data.accessToken;
      const userData = data.user || data;
      if (token) persistToken(token);
      setUser(userData || null);
      return { success: true, data: userData };
    } catch (err) {
      const message = err && err.message ? err.message : "Login failed";
      return { success: false, error: message };
    }
  }, []);

  const signup = useCallback(async (payload) => {
    try {
      const res = await axios.post("/auth/signup", payload);
      // Optionally auto-login if API returns token
      const data = res && res.data ? res.data : res;
      const token = data.token || data.accessToken;
      const userData = data.user || null;
      if (token) persistToken(token);
      if (userData) setUser(userData);
      return { success: true, data };
    } catch (err) {
      const message = err && err.message ? err.message : "Signup failed";
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    persistToken(null);
    setUser(null);
    try {
      // optional: inform backend
      axios.post("/auth/logout").catch(() => {});
    } catch (e) {
      // ignore
    }
    // redirect handled by callers if needed
  }, []);

  const restoreSession = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setUser(null);
        setLoading(false);
        return { success: false };
      }

      // axios instance automatically sends token from localStorage via interceptor
      const res = await axios.get("/auth/me");
      const data = res && res.data ? res.data : res;
      setUser(data || null);
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      setUser(null);
      setLoading(false);
      return {
        success: false,
        error: err && err.message ? err.message : "Session restore failed",
      };
    }
  }, []);

  useEffect(() => {
    // Initialize: try to restore session
    restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    // Register a global unauthorized handler so the app state is cleared
    setOnUnauthorized(() => {
      try {
        persistToken(null);
      } catch (e) {}
      setUser(null);
      try {
        // minimal redirect on 401 to ensure user lands on login
        window.location.href = "/login";
      } catch (e) {}
    });
    return () => clearOnUnauthorized();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    signup,
    logout,
    restoreSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export default AuthContext;
