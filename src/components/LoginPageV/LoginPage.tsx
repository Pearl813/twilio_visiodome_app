import React, { ChangeEvent, useState, FormEvent, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { useAuth } from '../AuthProvider';
import Snackbar from '../Snackbar/Snackbar';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { InputLabel, Theme, CircularProgress } from '@material-ui/core';
import IntroContainer from '../IntroContainer/IntroContainer';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';
import { RESULT_CODE_SUCCESS } from '../../constants';

const useStyles = makeStyles((theme: Theme) => ({
  inputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '1.5em 0 3.5em',
    '& div:not(:last-child)': {
      marginRight: '1em',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '1.5em 0 2em',
    },
  },
  gutterBottom: {
    marginBottom: '1em',
  },
  submitButton: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

export default function LoginPage() {
  const classes = useStyles();
  const history = useHistory();
  const emailRef = useRef<null | string>(null);
  const passwordRef = useRef<null | string>(null);
  const [isSnackbarDismissed, setIsSnackbarDismissed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { authUser, setAuthUser } = useAuth();

  useEffect(() => {
    if (authUser) {
      setIsLoading(true);
      history.replace('/rooms');
    } else {
      history.replace('/login');
    }
  }, []);

  const login = () => {
    setIsSnackbarDismissed(false);
    setIsLoading(true);
    const emailFormData = emailRef.current;
    const passwordFormData = passwordRef.current;
    axios
      .post(`${process.env.REACT_APP_TOKEN_SERVER_URL}/user/login`, { emailFormData, passwordFormData })
      .then(response => {
        // Handle success.
        if (response.data.code === RESULT_CODE_SUCCESS) {
          setIsOpen(false);
          setAuthUser(response.data.payload);
          history.replace(`/rooms`);
          setIsLoading(false);
        } else {
          setIsOpen(true);
          setMessageContent('Permission Error.');
        }
        setIsLoading(false);
      })
      .catch(error => {
        // Handle error.
        setIsOpen(true);
        setIsLoading(false);
        setMessageContent('Email or password is incorrect.');
      });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login();
  };

  const isSnackbarOpen = !isSnackbarDismissed && isOpen;

  return (
    <IntroContainer>
      <Snackbar
        headline="Warning!"
        message={messageContent}
        variant="warning"
        open={isSnackbarOpen}
        handleClose={() => setIsSnackbarDismissed(true)}
      />
      {isLoading ? (
        <Grid container justifyContent="center" alignItems="center" direction="column" style={{ height: '100%' }}>
          <div>
            <CircularProgress variant="indeterminate" />
          </div>
          <div>
            <Typography variant="body2" style={{ fontWeight: 'bold', fontSize: '16px' }} align="center">
              Sign in...
            </Typography>
          </div>
        </Grid>
      ) : (
        <>
          <Typography variant="h5" className={classes.gutterBottom}>
            Sign in
          </Typography>
          <Typography variant="body1">{'Enter your email and password.'}</Typography>
          <form onSubmit={handleSubmit}>
            <div className={classes.inputContainer}>
              <div>
                <InputLabel shrink htmlFor="input-email">
                  Your Email
                </InputLabel>
                <TextField
                  id="input-email"
                  type="email"
                  variant="outlined"
                  fullWidth
                  size="small"
                  inputRef={emailRef}
                  value={emailRef.current}
                  onChange={e => (emailRef.current = e.target.value)}
                />
              </div>
              <div>
                <InputLabel shrink htmlFor="input-password">
                  Password
                </InputLabel>
                <TextField
                  type="password"
                  autoCapitalize="false"
                  id="input-password"
                  variant="outlined"
                  fullWidth
                  size="small"
                  inputRef={passwordRef}
                  value={passwordRef.current}
                  onChange={e => {
                    passwordRef.current = e.target.value;
                    console.log(passwordRef.current);
                  }}
                />
              </div>
            </div>
            <Grid container justifyContent="flex-end">
              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={!emailRef.current || !passwordRef.current}
                className={classes.submitButton}
              >
                Sign in {!emailRef.current || !passwordRef.current}
              </Button>
            </Grid>
          </form>
        </>
      )}
    </IntroContainer>
  );
}
