import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import { Typography, makeStyles, TextField, Grid, Button, InputLabel, Theme } from '@material-ui/core';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import { RESULT_CODE_SUCCESS } from '../../../constants';

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
  setName: (name: string) => void;
  setRoomName: (roomName: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export default function RoomNameScreen({ name, roomName, setName, setRoomName, handleSubmit }: RoomNameScreenProps) {
  const classes = useStyles();

  const [isInvalidRoom, setIsInvalidRoom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  useEffect(() => {
    if (roomName) {
      setIsLoading(true);
      axios
        .post(`/room/validate`, { roomName })
        .then(res => {
          if (res.data.code === RESULT_CODE_SUCCESS) {
            setIsInvalidRoom(false);
          } else {
            setIsInvalidRoom(true);
          }
          setIsLoading(false);
        })
        .catch(e => {
          setIsInvalidRoom(true);
          setIsLoading(false);
          console.log(e);
        });
    }
  }, [roomName]);

  return (
    <>
      {!isInvalidRoom && !isLoading ? (
        <>
          <Typography variant="h5" className={classes.gutterBottom}>
            {`Join a Room (Room name: ${roomName})`}
          </Typography>
          <Typography variant="body1">Enter the your name.</Typography>
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
                  onChange={handleNameChange}
                />
              </div>
            </div>
            <Grid container justifyContent="flex-end">
              <div className={classes.continueButtons}>
                <Button variant="contained" type="submit" color="primary" disabled={!name || !roomName}>
                  Join
                </Button>
              </div>
            </Grid>
          </form>
        </>
      ) : isLoading ? (
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
      ) : (
        <Grid container justifyContent="center" alignItems="center" direction="column" style={{ height: '100%' }}>
          <div>
            <Typography variant="h6" align="center">
              This room doesn't exist!
            </Typography>
          </div>
        </Grid>
      )}
    </>
  );
}
