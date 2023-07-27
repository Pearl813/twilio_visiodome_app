import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

export const AuthRoute = ({ children, ...rest }: RouteProps) => {
  const { authUser, validUser, isValidating, validatingStatus } = useAuth();
  console.log('===========', validUser, isValidating);
  const isAuthReady = validUser && !isValidating && validatingStatus === 'SUCCESS';

  if (!authUser && !isAuthReady) {
    return null;
  }

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
