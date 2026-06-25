

import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../services/api";
import { USER_ROLES } from "../utils/constants";

const AuthContext = createContext();

// Create a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);

  // const API_BASE_URL = 'http://localhost:8000';
   

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedTokens = localStorage.getItem("tokens");
        
        if (storedUser && storedTokens) {
          const parsedUser = JSON.parse(storedUser);
          const parsedTokens = JSON.parse(storedTokens);
          
          if (parsedUser && parsedUser.role && Object.values(USER_ROLES).includes(parsedUser.role)) {
            setUser(parsedUser);
            setTokens(parsedTokens);
          } else {
            console.warn('Invalid user role in stored user:', parsedUser?.role);
            localStorage.removeItem("user");
            localStorage.removeItem("tokens");
          }
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem("user");
        localStorage.removeItem("tokens");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (username, password) => {
  try {
    const { data } = await API.post("/auth/login/", {
      username,
      password,
    });

    if (!data.user) {
      return {
        error: "Invalid server response.",
      };
    }

    if (
      !data.user.role ||
      !Object.values(USER_ROLES).includes(data.user.role)
    ) {
      return {
        error: "Invalid user role.",
      };
    }

    const authTokens = {
      access: data.access,
      refresh: data.refresh,
    };

    setUser(data.user);
    setTokens(authTokens);

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("tokens", JSON.stringify(authTokens));

    return {
      user: data.user,
    };
  } catch (error) {
    console.error(error);

    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
    setUser(null);
    setTokens(null);

    return {
      error:
        error.response?.data?.detail ||
        error.response?.data?.error ||
        "Login failed",
    };
  }
};




  const register = async (userData) => {
  try {
    const { data } = await API.post("/auth/register/", userData);

    const authTokens = {
      access: data.access,
      refresh: data.refresh,
    };

    setUser(data.user);
    setTokens(authTokens);

    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("tokens", JSON.stringify(authTokens));

    return {
      user: data.user,
    };
  } catch (error) {
    console.error(error);

    return {
      error:
        error.response?.data?.detail ||
        error.response?.data?.error ||
        "Registration failed",
    };
  }
};





  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem("user");
    localStorage.removeItem("tokens");
  };

  const value = {
    user,
    tokens,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;