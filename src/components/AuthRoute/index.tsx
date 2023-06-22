import React from 'react';
import { Route } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { useHistory } from 'react-router-dom';

export const AuthRoute = ({ ...rest }) => {
  const history = useHistory();
  const { authUser } = useAuth();

  if (!authUser) {
    history.push('/login');
  }

  return <Route {...rest} />;
};
