"use client";

import { createContext, useContext, useState, useCallback } from "react";

// TODO: Move mock users to database when backend is ready
// FIXME: Password should be hashed before storing (security issue)

const AuthContext = createContext();

// Mock user storage (in real app, this would be a database)
const mockUsers = [
  { username: "admin", email: "admin@inventory.com", password: "admin123" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback((username, password) => {
    const foundUser = mockUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      setUser({
        id: crypto.randomUUID(),
        username: foundUser.username,
        email: foundUser.email,
      });
      return true;
    }
    return false;
  }, []);

  const register = useCallback((username, email, password) => {
    // Check if username already exists
    const exists = mockUsers.some((u) => u.username === username);
    if (exists) return false;

    // Add new user
    mockUsers.push({ username, email, password });

    // Auto login after registration
    setUser({
      id: crypto.randomUUID(),
      username,
      email,
    });
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
