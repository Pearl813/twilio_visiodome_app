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

export default function EndCallButton(props: { className?: string; isVisiodome: boolean }) {
  const classes = useStyles();
  const { room } = useVideoContext();
  const history = useHistory();

  const pageRedirect = () => {
    if (props.isVisiodome === true) history.replace('/');
  };

  return (
    <Button
      onClick={() => {
        room!.disconnect();
        pageRedirect();
      }}
      className={clsx(classes.button, props.className)}
      data-cy-disconnect
    >
      Disconnect
    </Button>
  );
}
