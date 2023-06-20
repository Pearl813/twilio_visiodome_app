import React, { useState, useEffect } from 'react';

export interface AuthContextType {
  authUser: any;
  setAuthUser: React.Dispatch<any>;
}

const AuthContext = React.createContext<AuthContextType>({ authUser: null, setAuthUser: () => null });

interface AuthProviderProps {
  children: React.ReactNode;
}

function getInitialData(type: string) {
  let data;
  const authUser = localStorage.getItem(type);
  data = authUser ? JSON.parse(authUser) : null;
  return data;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authUser, setAuthUser] = useState(getInitialData('authUser'));

  useEffect(() => {
    try {
      localStorage.setItem('authUser', JSON.stringify(authUser));
    } catch (e) {
      console.log('localStorage/authUser/error', e);
    }
  }, [authUser]);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
