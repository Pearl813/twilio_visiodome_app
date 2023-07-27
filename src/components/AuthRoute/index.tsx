import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

export const AuthRoute = ({ children, ...rest }: RouteProps) => {
  const { authUser, validUser, isValidating, validatingStatus } = useAuth();

  const isAuthReady = validUser && !isValidating;
  console.log(validUser, isValidating, validatingStatus, isAuthReady);
  if (
    (!authUser && !isAuthReady && validatingStatus === 'INVALID') ||
    (authUser && !isAuthReady && validatingStatus === 'NOLOGIN')
  ) {
    return null;
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        validatingStatus === 'SUCCESS' ? (
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
