"use client";

import { AuthUser } from "@/type/auth";
import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * Roles a PizzaHub account can have.
 * (Admin is never granted through public sign-up — only the backend can assign it.)
 */
export type UserRole = "customer" | "vendor" | "admin";




interface AuthContextValue {
  user: AuthUser | null;
  /** Signs the user out. The Navbar re-renders immediately. */
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const MOCK_USER: AuthUser = {
  name: "Jane Doe",
  email: "jane.doe@pizzahub.com",
  image: "",
  role: "customer",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Returns the current auth state. Must be used inside an <AuthProvider>. */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
