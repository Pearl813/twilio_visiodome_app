import React, { useState } from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import axios from 'axios';

import { Button } from '@material-ui/core';
import Snackbar from '../../Snackbar/Snackbar';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

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

interface FinishRoomButtonProps {
  className?: string;
}

export default function FinishRoomButton({ className }: FinishRoomButtonProps) {
  const classes = useStyles();

  const completeRoom = async () => {
    if (localStorage.getItem('token')) {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };

      axios.get(`${process.env.REACT_APP_TOKEN_SERVER_URL}/rooms/end`, { headers }).then(res => {
        console.log(res);
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
