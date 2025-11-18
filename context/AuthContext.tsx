
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
  loggedIn: boolean;
  userName: string | null;
  login: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  const login = (name: string) => {
    setUserName(name);
    setLoggedIn(true);
  };

  const logout = () => {
    setUserName(null);
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ loggedIn, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
