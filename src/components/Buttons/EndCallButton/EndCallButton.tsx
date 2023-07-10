import React from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Button } from '@material-ui/core';

import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      background: theme.brand,
      color: 'white',
      '&:hover': {
        background: '#600101',
      },
    },
  })
);

export default function EndCallButton(props: { className?: string; redirectURL: any }) {
  const classes = useStyles();
  const { room, setEndRedirectURL } = useVideoContext();

  return (
    <Button
      onClick={() => {
        room!.disconnect();
        if (props.redirectURL !== null) setEndRedirectURL(props.redirectURL);
      }}
      className={clsx(classes.button, props.className)}
      data-cy-disconnect
    >
      Disconnect
    </Button>
  );
}
