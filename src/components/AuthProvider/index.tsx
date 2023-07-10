import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RESULT_CODE_SUCCESS } from '../../constants';

export interface AuthContextType {
  authUser: any;
  setAuthUser: React.Dispatch<any>;
  validUser: boolean;
  setValidUser: React.Dispatch<React.SetStateAction<boolean>>;
  isValidating: boolean;
  setIsValidating: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = React.createContext<AuthContextType>({
  authUser: null,
  setAuthUser: () => null,
  validUser: false,
  setValidUser: () => null,
  isValidating: false,
  setIsValidating: () => null,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

function getInitialData(type: string) {
  let data;
  const authUser = localStorage.getItem(type);
  data = authUser ? JSON.parse(authUser) : null;
  return data;
}

async function validateToken(token: string) {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const res = await axios.get(`/user/token/validate`, { headers });

  if (res.data.code === RESULT_CODE_SUCCESS) {
    return RESULT_CODE_SUCCESS;
  } else {
    return -1;
  }
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authUser, setAuthUser] = useState(getInitialData('authUser'));
  const [validUser, setValidUser] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('authUser', JSON.stringify(authUser));
      setIsValidating(true);
      if (authUser) {
        validateToken(authUser)
          .then((result: number) => {
            if (result === RESULT_CODE_SUCCESS) {
              setValidUser(true);
              setIsValidating(false);
            } else {
              setValidUser(false);
              setIsValidating(false);
            }
          })
          .catch(() => {
            setValidUser(false);
            setIsValidating(false);
          });
      } else {
        setValidUser(false);
      }
    } catch (e) {
      console.log('localStorage/authUser/error', e);
    }
  }, [authUser]);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        validUser,
        setValidUser,
        isValidating,
        setIsValidating,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
