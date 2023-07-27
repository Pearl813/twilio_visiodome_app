import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

export const AuthRoute = ({ children, ...rest }: RouteProps) => {
  const { authUser, validUser, isValidating } = useAuth();

  const isAuthReady = validUser && !isValidating;

  if (!isAuthReady) {
    console.log('not ready', authUser, validUser, isValidating, isAuthReady);
    return null;
  }
  console.log('---------', authUser, validUser, isValidating, isAuthReady);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        authUser ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
