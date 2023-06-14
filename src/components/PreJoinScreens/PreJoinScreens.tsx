import React, { useState, useEffect, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import GenerateRoomLinkScreen from './GenerateRoomLinkScreen/GenerateRoomLinkScreen';
import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import axios from 'axios';
import Snackbar from '../Snackbar/Snackbar';
import { Typography, Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

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

export default function PreJoinScreens() {
  const { user } = useAppState();
  const { getAudioAndVideoTracks, connect: videoConnect } = useVideoContext();
  const { getToken } = useAppState();
  const { connect: chatConnect } = useChatContext();
  const { URLRoomName, visiodomeapp } = useParams<{ URLRoomName?: string; visiodomeapp?: string }>();
  const [step, setStep] = useState(Steps.roomNameStep);
  const { userName } = useParams<{ userName?: string }>();

  const [name, setName] = useState<string>(user?.displayName || '');
  const [roomName, setRoomName] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [messageHeader, setMessageHeader] = useState('');
  const [messageType, setMessageType] = useState<any>('');
  const [isCreated, setIsCreated] = useState(false);
  const [mediaError, setMediaError] = useState<Error>();
  const [isInvalidRoom, setIsInvalidRoom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisiodome, setIsVisiodome] = useState(false);
  const [roomLinks, setRoomLinks] = useState<streamURLs>({
    presenter: '',
    customer: '',
    visiodome: '',
  });

  const history = useHistory();

  useEffect(() => {
    if (userName) {
      setName(userName);
    }
    if (URLRoomName) {
      setRoomName(URLRoomName);
    }
    if (visiodomeapp === 'visiodomeapp') {
      setIsLoading(true);
      setIsVisiodome(true);
      let name: string = 'visiodomeapp';
      let roomName: string = URLRoomName!;

      axios
        .post(`${process.env.REACT_APP_TOKEN_SERVER_URL}/checkValidRoom`, { roomName })
        .then(res => {
          if (res.data.message === 'success') {
            setIsLoading(false);
            getToken(name, roomName).then(({ token }) => {
              videoConnect(token);
              process.env.REACT_APP_DISABLE_TWILIO_CONVERSATIONS !== 'true' && chatConnect(token);
            });
          } else {
            setIsLoading(false);
            setIsInvalidRoom(true);
          }
        })
        .catch(e => console.log(e));
    }
  }, [user, URLRoomName, visiodomeapp]);

  useEffect(() => {
    if (step === Steps.deviceSelectionStep && !mediaError) {
      getAudioAndVideoTracks().catch(error => {
        console.log('Error acquiring local media:');
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, step, mediaError]);

  const handleRoomName = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // If this app is deployed as a twilio function, don't change the URL because routing isn't supported.
    // @ts-ignore

    if (!window.location.origin.includes('twil.io') && !window.STORYBOOK_ENV) {
      window.history.replaceState(null, '', window.encodeURI(`/room/${roomName}${window.location.search || ''}`));
    }
    setIsLoading(true);
    if (localStorage.getItem('token')) {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };
      axios
        .post(`${process.env.REACT_APP_TOKEN_SERVER_URL}/checkValidRoom`, { roomName })
        .then(res => {
          console.log(res.data.message);
          if (res.data.message === 'success') {
            setIsOpen(true);
            setMessageHeader('Success!');
            setMessageContent('The Room is already created.');
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
            axios
              .post(`${process.env.REACT_APP_TOKEN_SERVER_URL}/rooms/start`, { roomName }, { headers })
              .then(response => {
                if (response.status === 200) {
                  setIsOpen(true);
                  setMessageHeader('Success!');
                  setMessageContent('Created Successfully.');
                  setMessageType('info');
                  setRoomLinks({
                    ...roomLinks,
                    presenter: response.data.streamURLs.presenter,
                    customer: response.data.streamURLs.customer,
                    visiodome: response.data.streamURLs.visiodome,
                  });
                  setIsLoading(false);
                  setStep(Steps.linkGenerateStep);
                }
              })
              .catch(e => {
                console.log(e);
              });
          }
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      setIsLoading(false);
      setStep(Steps.deviceSelectionStep);
    }
  };

  const handleGenerateLink = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep(Steps.deviceSelectionStep);
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
              {isVisiodome ? `Joining Meeting... ` : ` Loading...`}
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
          <MediaErrorSnackbar error={mediaError} />
          {step === Steps.roomNameStep && (
            <RoomNameScreen
              name={name}
              roomName={roomName}
              isCreated={isCreated}
              setName={setName}
              setRoomName={setRoomName}
              setIsCreated={setIsCreated}
              handleSubmit={handleRoomName}
            />
          )}

          {step === Steps.linkGenerateStep && (
            <GenerateRoomLinkScreen
              name={name}
              roomName={roomName}
              setStep={setStep}
              roomLinks={roomLinks}
              handleSubmit={handleGenerateLink}
            />
          )}

          {step === Steps.deviceSelectionStep && (
            <DeviceSelectionScreen name={name} roomName={roomName} isCreated={isCreated} setStep={setStep} />
          )}
        </>
      )}
    </IntroContainer>
  );
}
