import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

export const AuthRoute = ({ children, ...rest }: RouteProps) => {
  const { authUser, validUser, isValidating } = useAuth();

  const isAuthReady = validUser || isValidating;

  if (!authUser && !isAuthReady) {
    return null;
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        authUser && isAuthReady ? (
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
