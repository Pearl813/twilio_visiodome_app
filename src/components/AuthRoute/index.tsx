import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import Grid from '@material-ui/core/Grid';
import { CircularProgress } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import IntroContainer from '../IntroContainer/IntroContainer';

export const AuthRoute = ({ children, ...rest }: RouteProps) => {
  const { authUser, validUser, isValidating } = useAuth();

  const isAuthReady = validUser && authUser;

  return (
    <Route
      {...rest}
      render={({ location }) =>
        !isValidating ? (
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
        ) : (
          // Loading state can be shown here, if desired
          <IntroContainer>
            <Grid container justifyContent="center" alignItems="center" direction="column" style={{ height: '100%' }}>
              <div>
                <CircularProgress variant="indeterminate" />
              </div>
              <div>
                <Typography variant="body2" style={{ fontWeight: 'bold', fontSize: '16px' }} align="center">
                  Validating Token...
                </Typography>
              </div>
            </Grid>
          </IntroContainer>
        )
      }
    />
  );
};
