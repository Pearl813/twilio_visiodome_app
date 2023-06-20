import { Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import EndCallButton from '../Buttons/EndCallButton/EndCallButton';
import FinishRoomButton from '../Buttons/FinishRoomButton/FinishRoomButton';
import Menu from '../MenuBar/Menu/Menu';
import axios from 'axios';
import { useAuth } from '../AuthProvider';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    background: 'white',
    paddingLeft: '1em',
    display: 'none',
    height: `${theme.mobileTopBarHeight}px`,
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    },
  },
  endCallButton: {
    height: '28px',
    fontSize: '0.85rem',
    padding: '0 0.6em',
  },
  finishCallButton: {
    height: '28px',
    fontSize: '0.85rem',
    padding: '0 0.6em',
  },
  settingsButton: {
    [theme.breakpoints.down('sm')]: {
      height: '28px',
      minWidth: '28px',
      border: '1px solid rgb(136, 140, 142)',
      padding: 0,
      margin: '0 1em',
    },
  },
}));

export default function MobileTopMenuBar() {
  const classes = useStyles();
  const { room } = useVideoContext();
  const { authUser } = useAuth();
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isVisiodome, setIsVisiodome] = useState(false);

  useEffect(() => {
    if (room?.localParticipant.identity === 'visiodomeapp') setIsVisiodome(true);

    axios
      .post(`${process.env.REACT_APP_TOKEN_SERVER_URL}/users/validate-presenter`, {
        username: room?.localParticipant.identity,
      })
      .then(response => {
        if (response.data.message === 'success') {
          if (authUser && response.data.roomName === room?.name) {
            setIsOrganizer(true);
          }
        } else {
          setIsOrganizer(false);
        }
      })
      .catch(e => console.log(e));
  }, []);

  return (
    <Grid container alignItems="center" justifyContent="space-between" className={classes.container}>
      <Typography variant="subtitle1">{room!.name}</Typography>
      <div>
        <EndCallButton className={classes.endCallButton} isVisiodome={isVisiodome} />
        {isOrganizer ? <FinishRoomButton className={classes.finishCallButton} /> : ''}
        <Menu buttonClassName={classes.settingsButton} />
      </div>
    </Grid>
  );
}
