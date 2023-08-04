import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import { Button } from '@material-ui/core';
import { useAuth } from '../../AuthProvider';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginLeft: '10px',
      background: theme.brand,
      color: 'white',
      '&:hover': {
        background: '#600101',
      },
    },
  })
);

interface EndRoomButtonProps {
  className?: string;
}

export default function EndRoomButton({ className }: EndRoomButtonProps) {
  const classes = useStyles();
  const { authUser } = useAuth();
  const history = useHistory();

  const completeRoom = async () => {
    if (localStorage.getItem('token') || authUser.token) {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token') ?? authUser.token}`,
      };

      axios.get(`/room/end`, { headers }).then(res => {
        history.replace('/rooms');
      });
    }
  };

  return (
    <>
      <Button onClick={completeRoom} className={clsx(classes.button, className)} data-cy-disconnect>
        End
      </Button>
    </>
  );
}
