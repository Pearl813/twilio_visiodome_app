import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

export const AuthRoute = ({ children, ...rest }: RouteProps) => {
  const { validUser, isValidating } = useAuth();
  console.log('===========', validUser, isValidating);
  const isAuthReady = validUser && !isValidating;

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthReady ? (
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
