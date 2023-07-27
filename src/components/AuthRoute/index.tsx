import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

export const AuthRoute = ({ children, ...rest }: RouteProps) => {
  const { authUser, validUser, isValidating } = useAuth();

  const isAuthReady = validUser || isValidating;

  console.log('---------', authUser, validUser, isValidating, isAuthReady);
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
