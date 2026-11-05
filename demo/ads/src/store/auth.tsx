import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { User } from "@/services/auth/types";

interface AuthContextValue {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

const readStoredUser = (): User | undefined => {
  const raw = localStorage.getItem("user");
  return raw ? (JSON.parse(raw) as User) : undefined;
};

// Redirects based on auth state (recovered from the build): signed-in users at "/" go to
// the app, signed-out users anywhere go to login.
const useAuthRedirect = (user: User | undefined) => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (user) {
      if (location.pathname === "/") navigate("/main/advetising");
    } else {
      navigate("/");
    }
  }, [user, navigate, location.pathname]);
};

// Auth provider (recovered from the build): user profile lives in localStorage.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | undefined>(readStoredUser);
  useAuthRedirect(user);

  const setUser = (next: User | undefined) => {
    setUserState(next);
    if (next) localStorage.setItem("user", JSON.stringify(next));
    else localStorage.removeItem("user");
  };

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
