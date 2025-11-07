import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wheels_user")) || null;
    } catch { return null; }
  });

  useEffect(() => {
    // when user changes, persist
    if (user) localStorage.setItem("wheels_user", JSON.stringify(user));
    else localStorage.removeItem("wheels_user");
  }, [user]);

  const setToken = (token, u) => {
    if (token) {
      localStorage.setItem("wheels_token", token);
      setUser(u || JSON.parse(localStorage.getItem("wheels_user")));
    } else {
      localStorage.removeItem("wheels_token");
      localStorage.removeItem("wheels_user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
