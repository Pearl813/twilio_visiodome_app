import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Typography, makeStyles, TextField, Grid, Button, InputLabel, Theme } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useAppState } from '../../../state';
import Snackbar from '../../Snackbar/Snackbar';
import { useAuth } from '../../AuthProvider';

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
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function RoomNameScreen({
  name,
  roomName,
  isCreated,
  setName,
  setRoomName,
  handleSubmit,
}: RoomNameScreenProps) {
  const classes = useStyles();
  const history = useHistory();
  const { authUser, setAuthUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  return (
    <>
      {!isLoading ? (
        <>
          <Typography variant="h5" className={classes.gutterBottom}>
            {`Create a Room`}
          </Typography>
          <Typography variant="body1">{`Room name is "${roomName}".  Click "Start Room" to create room.`}</Typography>
          <form onSubmit={handleSubmit}>
            <div className={classes.inputContainer}>
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
                  disabled={isCreated === true ? true : false}
                  onChange={handleNameChange}
                />
              </div>
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
            </div>
            <Grid container justifyContent="flex-end">
              <div className={classes.continueButtons}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setAuthUser(null);
                  }}
                >
                  Sign Out
                </Button>
                <Button variant="contained" type="submit" color="primary" disabled={!name || !roomName}>
                  Start Room
                </Button>
              </div>
            </Grid>
          </form>
        </>
      ) : (
        <Grid container justifyContent="center" alignItems="center" direction="column" style={{ height: '100%' }}>
          <div>
            <CircularProgress variant="indeterminate" />
          </div>
          <div>
            <Typography variant="body2" style={{ fontWeight: 'bold', fontSize: '16px' }} align="center">
              Loading...
            </Typography>
          </div>
        </Grid>
      )}
    </>
  );
}
