import { ChangeEvent, FormEvent } from 'react';

import { Typography, makeStyles, TextField, Grid, Button, InputLabel, Theme } from '@material-ui/core';
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
  const { setAuthUser } = useAuth();

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  return (
    <>
      <Typography variant="h5" className={classes.gutterBottom}>
        {`Create a Room`}
      </Typography>
      <Typography variant="body1">{`Click "Start Room" to create room.`}</Typography>
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
          {/* <div className={classes.textFieldContainer}>
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
          </div> */}
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
            <Button variant="contained" type="submit" color="primary" disabled={!name}>
              Start Room
            </Button>
          </div>
        </Grid>
      </form>
    </>
  );
}
