import React, { createContext, useState, useCallback, useEffect } from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
      const userData = localStorage.getItem("userData");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);

  const register = useCallback(async (username, email, password, confirmPassword) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
        confirmPassword,
      });

      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(user));

      setUser(user);
      setIsAuthenticated(true);
      toast.success("Registration successful!");
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(user));

      setUser(user);
      setIsAuthenticated(true);
      toast.success("Login successful!");
      return true;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
