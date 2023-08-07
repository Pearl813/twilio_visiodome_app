import React, { useState, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import IntroContainer from '../IntroContainer/IntroContainer';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import GenerateRoomLinkScreen from './GenerateRoomLinkScreen/GenerateRoomLinkScreen';
import Snackbar from '../Snackbar/Snackbar';

import { Typography, Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useAuth } from '../AuthProvider';
import { RESULT_CODE_SUCCESS } from '../../constants';

export enum Steps {
  roomNameStep,
  linkGenerateStep,
  deviceSelectionStep,
}

interface streamURLs {
  presenter: string;
  customer: string;
  visiodome: string;
}

export default function RoomCreateScreen() {
  const { authUser } = useAuth();

  const [step, setStep] = useState(Steps.roomNameStep);

  const [name, setName] = useState<string>(authUser?.username || '');
  const isCreated = name ? true : false;
  const [isOpen, setIsOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [messageHeader, setMessageHeader] = useState('');
  const [messageType, setMessageType] = useState<any>('');
  const [isLoading, setIsLoading] = useState(false);
  const [roomLinks, setRoomLinks] = useState<streamURLs>({
    presenter: '',
    customer: '',
    visiodome: '',
  });

  const history = useHistory();

  const handleRoomName = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    if (authUser.token) {
      const headers = {
        Authorization: `Bearer ${authUser.token}`,
      };
      axios
        .post(`/room/start`, { headers })
        .then(res => {
          if (res.status === 200) {
            // If this app is deployed as a twilio function, don't change the URL because routing isn't supported.
            // @ts-ignore
            if (!window.location.origin.includes('twil.io') && !window.STORYBOOK_ENV) {
              window.history.replaceState(
                null,
                '',
                window.encodeURI(`/rooms/${res.data.roomName}${window.location.search || ''}`)
              );
            }
            setIsOpen(true);
            setMessageHeader('Success!');
            setMessageContent(
              res.data.code === RESULT_CODE_SUCCESS ? 'Room is created successfully!' : 'Room is Already Created!'
            );
            setMessageType('info');
            setRoomLinks({
              ...roomLinks,
              presenter: res.data.streamURLs.presenter,
              customer: res.data.streamURLs.customer,
              visiodome: res.data.streamURLs.visiodome,
            });
            setIsLoading(false);
            setStep(Steps.linkGenerateStep);
          } else {
            setIsLoading(false);
            history.push('/rooms');
          }
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      setIsLoading(false);
      history.push('/rooms');
    }
  };

  const handleGenerateLink = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    window.location.href = `${roomLinks.presenter}`;
  };

  const endRoom = () => {
    setIsLoading(true);
    if (authUser.token) {
      const headers = {
        Authorization: `Bearer ${authUser.token}`,
      };
      axios
        .post(`/room/end`, {}, { headers })
        .then(response => {
          if (response.data.code === RESULT_CODE_SUCCESS || response.data.code === -1) {
            setIsOpen(true);
            setMessageHeader('Success!');
            setMessageContent('Room Closed Successfully.');
            setMessageType('info');
            setIsLoading(false);
            setStep(Steps.roomNameStep);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  };

  const isSnackbarOpen = isOpen;

  return (
    <IntroContainer>
      {isLoading ? (
        <Grid container justifyContent="center" alignItems="center" direction="column" style={{ height: '100%' }}>
          <div>
            <CircularProgress variant="indeterminate" />
          </div>
          <div>
            <Typography variant="body2" style={{ fontWeight: 'bold', fontSize: '16px' }} align="center">
              {` Loading...`}
            </Typography>
          </div>
        </Grid>
      ) : (
        <>
          <Snackbar
            headline={messageHeader}
            message={messageContent}
            variant={messageType}
            open={isSnackbarOpen}
            handleClose={() => {
              setIsOpen(false);
            }}
          />
          {step === Steps.roomNameStep && (
            <RoomNameScreen name={name} isCreated={isCreated} setName={setName} handleSubmit={handleRoomName} />
          )}
          {step === Steps.linkGenerateStep && (
            <GenerateRoomLinkScreen
              name={name}
              roomLinks={roomLinks}
              handleSubmit={handleGenerateLink}
              endRoom={endRoom}
            />
          )}
        </>
      )}
    </IntroContainer>
  );
}
