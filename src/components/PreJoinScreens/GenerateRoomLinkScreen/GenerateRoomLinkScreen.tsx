import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import {
  Typography,
  makeStyles,
  TextField,
  Grid,
  Button,
  InputLabel,
  Theme,
  Snackbar,
  InputAdornment,
  IconButton,
  Divider,
} from '@material-ui/core';
import CopyIcon from '../../../icons/CopyIcon';
import { useAppState } from '../../../state';
import { Steps } from '../PreJoinScreens';
import axios from 'axios';

const useStyles = makeStyles((theme: Theme) => ({
  gutterBottom: {
    marginBottom: '1em',
  },
  inputContainer: {
    margin: '1.5em 0 1em',
    '& div:not(:last-child)': {
      marginRight: '1em',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '1.5em 0 1em',
    },
  },
  textFieldContainer: {
    marginBottom: '1.5em',
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

interface GenerateRoomLinkScreenProps {
  name: string;
  roomName: string;
  setStep: (step: Steps) => void;
  roomLinks: {
    presenter: string;
    customer: string;
    visiodome: string;
  };
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  endRoom: () => void;
}

export default function GenerateRoomLinkScreen({
  name,
  roomName,
  setStep,
  roomLinks,
  handleSubmit,
  endRoom,
}: GenerateRoomLinkScreenProps) {
  const classes = useStyles();
  const { user } = useAppState();
  const [open, setOpen] = useState(false);

  const hasUsername = !window.location.search.includes('customIdentity=true') && user?.displayName;

  const handleCopyClick = (link: any) => {
    setOpen(true);
    navigator.clipboard.writeText(link);
  };

  return (
    <>
      <Typography variant="h5" className={classes.gutterBottom}>
        Room link generated
      </Typography>
      <Typography variant="body1">
        {'Copy the created room link and share it with anyone you want to invite.'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <div className={classes.inputContainer}>
          <div className={classes.textFieldContainer}>
            <InputLabel shrink htmlFor="presenter-link">
              Presenter Link
            </InputLabel>
            <TextField
              id="presenter-link"
              variant="outlined"
              fullWidth
              size="small"
              value={roomLinks?.presenter}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="copy presenter link"
                      onClick={() => handleCopyClick(roomLinks?.presenter)}
                      edge="end"
                    >
                      <CopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className={classes.textFieldContainer}>
            <InputLabel shrink htmlFor="customer-link">
              Customer Link
            </InputLabel>
            <TextField
              id="customer-link"
              variant="outlined"
              fullWidth
              size="small"
              value={roomLinks?.customer}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="copy customer link"
                      onClick={() => handleCopyClick(roomLinks?.customer)}
                      edge="end"
                    >
                      <CopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className={classes.textFieldContainer}>
            <InputLabel shrink htmlFor="visiodome link">
              Visiodome App Link
            </InputLabel>
            <TextField
              id="visiodome link"
              variant="outlined"
              fullWidth
              size="small"
              value={roomLinks?.visiodome}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="copy visiodome link"
                      onClick={() => handleCopyClick(roomLinks?.visiodome)}
                      edge="end"
                    >
                      <CopyIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <Snackbar
            open={open}
            onClose={() => setOpen(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            autoHideDuration={2000}
            message="Copied to clipboard"
          />
          <Divider />
        </div>
        <Grid container justifyContent="flex-end">
          <div className={classes.continueButtons}>
            <Button variant="outlined" color="primary" onClick={endRoom}>
              End Room
            </Button>
            <Button variant="contained" type="submit" color="primary" disabled={!name || !roomName}>
              Continue
            </Button>
          </div>
        </Grid>
      </form>
    </>
  );
}
