import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Typography, makeStyles, TextField, Grid, Button, InputLabel, Theme } from '@material-ui/core';
import { useAppState } from '../../../state';
import axios from 'axios';
import Snackbar from '../../Snackbar/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';


const useStyles = makeStyles((theme: Theme) => ({
  gutterBottom: {
    marginBottom: '1em',
  },
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
  textFieldContainer: {
    width: '100%',
  },
  continueButtons: {
    display: 'flex',
    gap: '24px',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      gap: '0px',
      flexDirection: 'column-reverse',
      width: '100%',
      '& button': {
        margin: '0.5em 0',
      },
    },
  },
}));

interface RoomNameScreenProps {
  name: string;
  roomName: string;
  isCreated: boolean;
  setName: (name: string) => void;
  setRoomName: (roomName: string) => void;
  setIsCreated: (isCreated: boolean) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function RoomNameScreen({
  name,
  roomName,
  isCreated,
  setName,
  setRoomName,
  setIsCreated,
  handleSubmit,
}: RoomNameScreenProps) {
  const classes = useStyles();
  const { user } = useAppState();
  const history = useHistory();

  const [isSnackbarDismissed, setIsSnackbarDismissed] = useState(false);
  const [isInvalidRoom, setIsInvalidRoom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const hasUsername = !window.location.search.includes('customIdentity=true') && user?.displayName;

  useEffect(() => {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      axios
        .get(`${process.env.REACT_APP_STRAPI_URL}/api/users/me`, { headers })
        .then(response => {
          if (response.data) {
            if (response.data.streamURL !== null) {
              setIsCreated(true);
              setName(response.data.username);
              setRoomName(response.data.streamURL);
            } else {
              setIsCreated(false);
              setName(response.data.username);
            }
          }
        })
        .catch(e => console.log(e));
    } else {
      setIsLoading(true);
      axios
        .post(`${process.env.REACT_APP_TOKEN_SERVER_URL}/checkValidRoom`, { roomName })
        .then(res => {
          setIsLoading(false);
          if (res.data.message === 'success') {
            setIsInvalidRoom(false);
          } else {
            setIsInvalidRoom(true);
          }
        })
        .catch(e => {
          setIsInvalidRoom(true);
          console.log(e);
        });
    }
  }, [roomName]);

  return (
    <>
      {!isInvalidRoom && !isLoading ?
        <>
          <Typography variant="h5" className={classes.gutterBottom}>
            {!localStorage.getItem('token') ? 'Join' : isCreated ? 'Join' : 'Create'} a Room
            {!localStorage.getItem('token') ? ` (Room name: ${roomName})` : ''}
          </Typography>
          <Typography variant="body1">
            {!localStorage.getItem('token')
              ? 'Enter the your name.'
              : isCreated
                ? 'The Room is already created, you can join the room.'
                : "Enter your name and the name of a room you'd like to create"}
          </Typography>
          <form onSubmit={handleSubmit}>
            <div className={classes.inputContainer}>
              {!hasUsername && (
                <div className={classes.textFieldContainer}>
                  <InputLabel shrink htmlFor="input-user-name">
                    Your Name
                  </InputLabel>
                  <TextField
                    id="input-user-name"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={name}
                    disabled={localStorage.getItem('token') ? true : false}
                    onChange={handleNameChange}
                  />
                </div>
              )}
              {localStorage.getItem('token') ? (
                <div className={classes.textFieldContainer}>
                  <InputLabel shrink htmlFor="input-room-name">
                    Room Name
                  </InputLabel>
                  <TextField
                    autoCapitalize="false"
                    id="input-room-name"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={roomName}
                    disabled={isCreated === true ? true : false}
                    onChange={handleRoomNameChange}
                  />
                </div>
              ) : null}
            </div>
            <Grid container justifyContent="flex-end">
              <div className={classes.continueButtons}>
                <Button variant="outlined" color="primary" onClick={() => history.replace('/')}>
                  Cancel
                </Button>
                <Button variant="contained" type="submit" color="primary" disabled={!name || !roomName}>
                  Continue
                </Button>
              </div>
            </Grid>
          </form>
        </>
        : isLoading ? <CircularProgress variant="indeterminate" /> : <Typography variant="h6" align="center">
          This room donesn't exist!
        </Typography>
      }
    </>
  );
}
