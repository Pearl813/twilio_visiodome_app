import React, { useState, useEffect, FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import GenerateRoomLinkScreen from './GenerateRoomLinkScreen/GenerateRoomLinkScreen';
import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import axios from 'axios';
import Snackbar from '../Snackbar/Snackbar';
import { Typography, Grid, Button } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import { PRESENTER_LINK_NAME, VISIODOMEAPP_LINK_NAME } from '../../constants';

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
  const { getAudioAndVideoTracks } = useVideoContext();

  const { userName, URLRoomName, visiodomeapp } = useParams<{
    userName?: string;
    URLRoomName?: string;
    visiodomeapp?: string;
  }>();
  const [step, setStep] = useState(Steps.roomNameStep);

  const [name, setName] = useState<string>(user?.displayName || '');
  const [roomName, setRoomName] = useState<string>('');

  const [mediaError, setMediaError] = useState<Error>();
  const [isOpen, setIsOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [messageHeader, setMessageHeader] = useState('');
  const [messageType, setMessageType] = useState<any>('');
  const [isCreated, setIsCreated] = useState(false);
  const [isInvalidRoom, setIsInvalidRoom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisiodome, setIsVisiodome] = useState(false);
  const [isPresenter, setIsPresenter] = useState(false);
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
    if (visiodomeapp === PRESENTER_LINK_NAME) {
      setIsLoading(true);
      let urlString: string = window.location.href;
      // Create a URL object
      const url = new URL(urlString);

      if (window.location.search.includes('token')) {
        let token: string = url.searchParams.get('token')!;

        const headers = {
          Authorization: `Bearer ${token}`,
        };
        axios
          .get(`${process.env.REACT_APP_TOKEN_SERVER_URL}/user/validate-user`, { headers })
          .then(res => {
            if (res.data.message === 'success') {
              localStorage.setItem('token', token);
              setIsLoading(false);
              setName(res.data.username);
              setRoomName(res.data.roomName);
              setIsPresenter(true);
              setStep(Steps.deviceSelectionStep);
            } else {
              setIsLoading(false);
              setIsInvalidRoom(false);
            }
          })
          .catch((e: any) => {
            setIsLoading(false);
            setIsInvalidRoom(false);
          });
      } else {
        setIsLoading(false);
        setIsInvalidRoom(true);
      }
    }
    if (visiodomeapp === VISIODOMEAPP_LINK_NAME) {
      setIsLoading(true);
      setIsVisiodome(true);
      let name: string = VISIODOMEAPP_LINK_NAME;
      let roomName: string = URLRoomName!;

      axios
        .post(`${process.env.REACT_APP_TOKEN_SERVER_URL}/room/validate`, { roomName })
        .then(res => {
          if (res.data.message === 'success') {
            setName(name);
            setRoomName(roomName);
            setStep(Steps.deviceSelectionStep);
            setIsLoading(false);
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

  useEffect(() => {
    if (localStorage.getItem('token') && step === Steps.linkGenerateStep) {
      setIsLoading(true);
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };
      axios
        .post(`${process.env.REACT_APP_TOKEN_SERVER_URL}/room/get-links`, { roomName }, { headers })
        .then(res => {
          if (res.data.message === 'success') {
            setIsInvalidRoom(false);
            setRoomLinks({
              ...roomLinks,
              presenter: res.data.streamURLs.presenter,
              customer: res.data.streamURLs.customer,
              visiodome: res.data.streamURLs.visiodome,
            });
            setIsLoading(false);
          } else {
            setIsInvalidRoom(true);
            setIsLoading(false);
          }
        })
        .catch(e => {
          setIsInvalidRoom(true);
          setIsLoading(false);
          console.log(e);
        });
    }
  }, [step]);

  const handleRoomName = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // If this app is deployed as a twilio function, don't change the URL because routing isn't supported.
    // @ts-ignore
    if (!window.location.origin.includes('twil.io') && !window.STORYBOOK_ENV) {
      window.history.replaceState(null, '', window.encodeURI(`/room/${roomName}${window.location.search || ''}`));
    }
    setIsLoading(true);
    axios
      .post(`${process.env.REACT_APP_TOKEN_SERVER_URL}/room/validate`, { roomName })
      .then(res => {
        if (res.data.message === 'success') {
          setIsLoading(false);
          setStep(Steps.deviceSelectionStep);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const handleGenerateLink = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep(Steps.deviceSelectionStep);
  };

  const endRoom = () => {
    setIsLoading(true);
    if (localStorage.getItem('token')) {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      };
      axios
        .post(`${process.env.REACT_APP_TOKEN_SERVER_URL}/room/end`, {}, { headers })
        .then(response => {
          if (response.data.message === 'completed') {
            setIsOpen(true);
            setMessageHeader('Success!');
            setMessageContent('Room Closed Successfully.');
            setMessageType('info');
            setIsLoading(false);
            history.replace('/rooms');
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
              {isVisiodome ? `Joining Meeting...` : `Loading...`}
            </Typography>
          </div>
        </Grid>
      ) : isInvalidRoom ? (
        <Grid container justifyContent="center" alignItems="center" direction="column" style={{ height: '100%' }}>
          <div>
            <Typography variant="h6" style={{ fontWeight: 'bold', fontSize: '16px' }} align="center">
              {isInvalidRoom && !isPresenter
                ? `This room doesn't exist!`
                : `The Room is expired because there is nobody in the room for 2minutes.`}
            </Typography>
          </div>
          {isInvalidRoom && !isPresenter ? (
            <></>
          ) : (
            <Button
              variant="contained"
              type="submit"
              color="primary"
              style={{ marginTop: '8px' }}
              onClick={() => {
                history.replace(`/rooms`);
              }}
            >
              Start again.
            </Button>
          )}
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
              endRoom={endRoom}
            />
          )}
          {step === Steps.deviceSelectionStep && (
            <DeviceSelectionScreen
              name={name}
              roomName={roomName}
              isCreated={isCreated}
              isPresenter={isPresenter}
              setStep={setStep}
            />
          )}
        </>
      )}
    </IntroContainer>
  );
}
